import { NextRequest, NextResponse } from "next/server";
import {
  authenticateUser,
  getAdminClient,
  jsonErrorResponse,
} from "@/server/api.utils.server";
import { ResponseCodesConstants } from "@/src/constants";
import { RolesEnum } from "@/src/enums/roles.enums";
import { MatchingRequestI, MatchedVigilI } from "@/src/types/matching.types";
import {
  VigilAvailabilityRuleI,
  VigilUnavailabilityI,
} from "@/src/types/calendar.types";

/**
 * Parse a time string "HH:MM" or an integer hour to a numeric hour (0-23).
 * Handles both DB storage formats (SMALLINT integer or TIME-like string).
 */
function parseTimeToHour(time: string | number): number {
  if (typeof time === "number") return time;
  return parseInt(time.split(":")[0], 10);
}

/**
 * Get all dates (as "YYYY-MM-DD" strings) within [startDate, endDate] that fall
 * on the specified weekday (0=Sunday, ..., 6=Saturday).
 * Uses UTC arithmetic to avoid timezone/DST shifts.
 */
function getDatesForWeekday(
  startDate: Date,
  endDate: Date,
  weekday: number
): string[] {
  const dates: string[] = [];
  const current = new Date(startDate);

  // Advance to the first occurrence of the requested weekday (UTC-based)
  const daysUntilWeekday = (weekday - current.getUTCDay() + 7) % 7;
  current.setUTCDate(current.getUTCDate() + daysUntilWeekday);

  while (current <= endDate) {
    const year = current.getUTCFullYear();
    const month = String(current.getUTCMonth() + 1).padStart(2, "0");
    const day = String(current.getUTCDate()).padStart(2, "0");
    dates.push(`${year}-${month}-${day}`);
    current.setUTCDate(current.getUTCDate() + 7);
  }

  return dates;
}

/**
 * Check whether a vigil availability rule covers a specific slot.
 * A rule covers a slot when:
 * - rule weekday matches the requested weekday
 * - rule start_time <= requested start hour
 * - rule end_time >= requested end hour
 * - rule is valid on the given date (valid_from <= date <= valid_to or valid_to is null)
 */
function ruleCoversSlot(
  rule: VigilAvailabilityRuleI,
  weekday: number,
  startHour: number,
  endHour: number,
  date: string
): boolean {
  if (rule.weekday !== weekday) return false;
  const ruleStart = parseTimeToHour(rule.start_time);
  const ruleEnd = parseTimeToHour(rule.end_time);
  if (ruleStart > startHour) return false;
  if (ruleEnd < endHour) return false;
  if (rule.valid_from > date) return false;
  if (rule.valid_to && rule.valid_to < date) return false;
  return true;
}

/**
 * Check whether a vigil unavailability overlaps with a requested time slot on a given date.
 * Times are compared in UTC. Handles endHour === 24 (midnight of the next day).
 */
function unavailabilityBlocksSlot(
  unav: VigilUnavailabilityI,
  date: string,
  startHour: number,
  endHour: number
): boolean {
  const slotStart = new Date(
    `${date}T${String(startHour).padStart(2, "0")}:00:00Z`
  );
  // endHour can be 24 (end of day) – represent as midnight of the next day
  let slotEnd: Date;
  if (endHour >= 24) {
    slotEnd = new Date(slotStart);
    slotEnd.setUTCDate(slotEnd.getUTCDate() + 1);
    slotEnd.setUTCHours(0, 0, 0, 0);
  } else {
    slotEnd = new Date(
      `${date}T${String(endHour).padStart(2, "0")}:00:00Z`
    );
  }
  const unavStart = new Date(unav.start_at);
  const unavEnd = new Date(unav.end_at);
  return unavStart < slotEnd && unavEnd > slotStart;
}

/**
 * Map a raw vigil DB row to the public MatchedVigilI DTO, excluding PII fields.
 */
function buildMatchedVigil(
  vigil: any,
  compatibleSlots: number,
  totalSlots: number,
  averageRating = 0,
  reviewCount = 0
): MatchedVigilI {
  return {
    id: vigil.id,
    displayName: vigil.displayName,
    gender: vigil.gender,
    status: vigil.status,
    cap: vigil.cap,
    compatibleSlots,
    totalSlots,
    averageRating,
    reviewCount,
  };
}

/**
 * POST /api/v1/matching
 *
 * Multi-phase Vigil matching algorithm.
 *
 * Phase 1: Filter vigils by required services, CAP, and gender preference.
 * Phase 2: Check availability against the requested schedule; count compatible slots.
 * Phase 3 (when > 5 candidates remain): Rank by review quality (count + average).
 *
 * Early exits:
 * - No vigils after Phase 1 → empty list
 * - Perfect match found in Phase 2 → return that vigil immediately
 * - No vigils with compatible slots → empty list
 * - 5 or fewer vigils with compatible slots → return sorted list (skip Phase 3)
 */
export async function POST(req: NextRequest) {
  try {
    console.log("API POST matching");

    // ──────────────────────────────────────────────────
    // Auth: only Consumers can use this endpoint
    // ──────────────────────────────────────────────────
    const userObject = await authenticateUser(req);
    if (!userObject?.id) {
      return jsonErrorResponse(401, {
        code: ResponseCodesConstants.MATCHING_UNAUTHORIZED.code,
        success: false,
      });
    }
    if (userObject.user_metadata?.role !== RolesEnum.CONSUMER) {
      return jsonErrorResponse(403, {
        code: ResponseCodesConstants.MATCHING_FORBIDDEN.code,
        success: false,
      });
    }

    // ──────────────────────────────────────────────────
    // Parse & validate request body
    // ──────────────────────────────────────────────────
    const body: MatchingRequestI = await req.json();
    const { selectedDays, schedule, dates, address } = body;

    if (
      !selectedDays ||
      !Array.isArray(selectedDays) ||
      selectedDays.length === 0 ||
      !schedule ||
      !dates?.startDate ||
      !dates?.endDate ||
      !address?.postcode
    ) {
      return jsonErrorResponse(400, {
        code: ResponseCodesConstants.MATCHING_BAD_REQUEST.code,
        success: false,
      });
    }

    // Parse as UTC to avoid timezone/DST shifts
    const startDate = new Date(`${dates.startDate}T00:00:00Z`);
    const endDate = new Date(`${dates.endDate}T00:00:00Z`);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return jsonErrorResponse(400, {
        code: ResponseCodesConstants.MATCHING_BAD_REQUEST.code,
        success: false,
      });
    }

    if (endDate < startDate) {
      return jsonErrorResponse(400, {
        code: ResponseCodesConstants.MATCHING_BAD_REQUEST.code,
        success: false,
      });
    }

    // Enforce maximum 90-day range to prevent CPU-bound Phase 2 loops
    const daysDiff = Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (daysDiff > 90) {
      return jsonErrorResponse(400, {
        code: ResponseCodesConstants.MATCHING_BAD_REQUEST.code,
        success: false,
      });
    }

    // Validate that every selected day has a complete and valid schedule entry
    for (const day of selectedDays) {
      const entry = schedule[String(day)];
      if (!entry?.start || !entry?.end || !entry?.service) {
        return jsonErrorResponse(400, {
          code: ResponseCodesConstants.MATCHING_BAD_REQUEST.code,
          success: false,
        });
      }
      const startHour = parseTimeToHour(entry.start);
      const endHour = parseTimeToHour(entry.end);
      if (isNaN(startHour) || isNaN(endHour) || startHour >= endHour) {
        return jsonErrorResponse(400, {
          code: ResponseCodesConstants.MATCHING_BAD_REQUEST.code,
          success: false,
        });
      }
    }

    const postcode = address.postcode;
    const _admin = getAdminClient();

    // ══════════════════════════════════════════════════
    // PHASE 1 – Basic filtering
    // ══════════════════════════════════════════════════

    // 1a. Fetch the consumer's preferences (gender preference lives in consumers_data)
    const { data: consumerData, error: consumerError } = await _admin
      .from("consumers_data")
      .select("*")
      .eq("consumer_id", userObject.id)
      .maybeSingle();

    if (consumerError) {
      throw new Error(
        `Failed to fetch consumer preferences: ${consumerError.message}`
      );
    }

    const genderPreference: string | null =
      // "gender-preference" uses kebab-case as stored in the DB column name
      consumerData?.["gender-preference"] ?? null;

    const shouldFilterByGender =
      !!genderPreference &&
      genderPreference !== "no_preference" &&
      genderPreference !== "none";

    // 1b. Query active vigils in the requested CAP first – this is the most selective
    // filter (few vigils operate in any given postcode), so we apply it before the
    // service filter to minimise work and enable an early exit.
    // First attempt: include gender preference when set.
    let vigils: any[] = [];

    if (shouldFilterByGender) {
      const { data: vigilsWithGender } = await _admin
        .from("vigils")
        .select("*")
        .eq("status", "active")
        .contains("cap", [postcode])
        .eq("gender", genderPreference)
        .limit(20);

      vigils = vigilsWithGender || [];
    }

    // 1c. If fewer than 10 results, supplement without gender filter and merge up to 20
    if (vigils.length < 10) {
      const existingIds = new Set(vigils.map((v: any) => v.id));
      const remaining = 20 - vigils.length;

      // Exclude vigils already fetched in the gender-filtered pass (if any)
      const { data: additionalVigils } =
        existingIds.size > 0
          ? await _admin
              .from("vigils")
              .select("*")
              .eq("status", "active")
              .contains("cap", [postcode])
              .not("id", "in", `(${Array.from(existingIds).join(",")})`)
              .limit(remaining)
          : await _admin
              .from("vigils")
              .select("*")
              .eq("status", "active")
              .contains("cap", [postcode])
              .limit(remaining);

      vigils = [...vigils, ...(additionalVigils || [])];
    }

    // 1d. Early exit: no active vigils in this CAP at all (saves the service queries)
    if (vigils.length === 0) {
      return NextResponse.json(
        {
          code: ResponseCodesConstants.MATCHING_SUCCESS.code,
          data: [],
          success: true,
          message: "No vigils found for this search",
        },
        { status: 200 }
      );
    }

    // 1e. Collect unique service types required across all scheduled days
    const serviceTypes = Array.from(
      new Set(
        selectedDays
          .map((day: number) => schedule[String(day)]?.service)
          .filter(Boolean)
      )
    ) as string[];

    if (serviceTypes.length === 0) {
      return jsonErrorResponse(400, {
        code: ResponseCodesConstants.MATCHING_BAD_REQUEST.code,
        success: false,
      });
    }

    // 1f. From the CAP-filtered candidates, keep only those that offer EACH required
    // service type (active services only). Scoping to the candidate IDs avoids a
    // full-table scan on `services`.
    const candidateVigilIds = vigils.map((v: any) => v.id);

    const vigilIdSetsByType = await Promise.all(
      serviceTypes.map(async (type: string) => {
        const { data } = await _admin
          .from("services")
          .select("vigil_id")
          .eq("type", type)
          .eq("active", true)
          .in("vigil_id", candidateVigilIds);
        return new Set<string>((data || []).map((s: any) => s.vigil_id));
      })
    );

    // Intersect: keep only vigil IDs that offer ALL required types
    const eligibleVigilIdSet = vigilIdSetsByType.reduce(
      (acc, set) =>
        new Set<string>(Array.from(acc).filter((id) => set.has(id))),
      vigilIdSetsByType[0]
    );

    if (!eligibleVigilIdSet || eligibleVigilIdSet.size === 0) {
      return NextResponse.json(
        {
          code: ResponseCodesConstants.MATCHING_SUCCESS.code,
          data: [],
          success: true,
          message: "No vigils found offering all required services",
        },
        { status: 200 }
      );
    }

    // 1g. Narrow the vigils array to only those that passed the service filter
    // (preserves the CAP/gender ordering from step 1b/1c)
    vigils = vigils.filter((v: any) => eligibleVigilIdSet.has(v.id));

    // ══════════════════════════════════════════════════
    // PHASE 2 – Availability matching
    // ══════════════════════════════════════════════════

    const vigilIds = vigils.map((v: any) => v.id);

    // Pre-compute all occurrence dates per requested weekday inside the date range
    const slotsByWeekday = new Map<
      number,
      { dates: string[]; startHour: number; endHour: number; service: string }
    >();

    for (const day of selectedDays) {
      const entry = schedule[String(day)];
      if (!entry) continue;
      const startHour = parseTimeToHour(entry.start);
      const endHour = parseTimeToHour(entry.end);
      const occurrenceDates = getDatesForWeekday(startDate, endDate, day);
      slotsByWeekday.set(day, {
        dates: occurrenceDates,
        startHour,
        endHour,
        service: entry.service,
      });
    }

    // Total number of requested slot-occurrences
    let totalSlots = 0;
    slotsByWeekday.forEach((slotInfo) => {
      totalSlots += slotInfo.dates.length;
    });

    // Batch-fetch availability rules for all candidate vigils (filtered to date range)
    const { data: allRules, error: rulesError } = await _admin
      .from("vigil_availability_rules")
      .select("*")
      .in("vigil_id", vigilIds)
      .lte("valid_from", dates.endDate)
      .or(`valid_to.is.null,valid_to.gte.${dates.startDate}`);

    if (rulesError) {
      throw new Error(
        `Failed to fetch vigil availability rules: ${rulesError.message}`
      );
    }

    // Batch-fetch unavailabilities for all candidate vigils (overlapping the date range)
    const { data: allUnavailabilities, error: unavError } = await _admin
      .from("vigil_unavailabilities")
      .select("*")
      .in("vigil_id", vigilIds)
      .lte("start_at", `${dates.endDate}T23:59:59Z`)
      .gte("end_at", `${dates.startDate}T00:00:00Z`);

    if (unavError) {
      throw new Error(
        `Failed to fetch vigil unavailabilities: ${unavError.message}`
      );
    }

    // Index rules and unavailabilities by vigil ID for O(1) lookup
    const rulesByVigilId = new Map<string, VigilAvailabilityRuleI[]>();
    const unavByVigilId = new Map<string, VigilUnavailabilityI[]>();

    for (const rule of (allRules || []) as VigilAvailabilityRuleI[]) {
      if (!rulesByVigilId.has(rule.vigil_id)) {
        rulesByVigilId.set(rule.vigil_id, []);
      }
      rulesByVigilId.get(rule.vigil_id)!.push(rule);
    }

    for (const unav of (allUnavailabilities || []) as VigilUnavailabilityI[]) {
      if (!unavByVigilId.has(unav.vigil_id)) {
        unavByVigilId.set(unav.vigil_id, []);
      }
      unavByVigilId.get(unav.vigil_id)!.push(unav);
    }

    // Count compatible slots per vigil; detect perfect matches early
    const vigilScores: Array<{ vigil: any; compatibleSlots: number }> = [];
    let perfectMatch: any = null;

    for (const vigil of vigils) {
      const rules = rulesByVigilId.get(vigil.id) || [];
      const unavs = unavByVigilId.get(vigil.id) || [];
      let compatibleSlots = 0;

      const slotEntries = Array.from(slotsByWeekday.entries());
      for (const [weekday, slotInfo] of slotEntries) {
        const { dates: occurrenceDates, startHour, endHour } = slotInfo;

        for (const date of occurrenceDates) {
          const hasCompatibleRule = rules.some((rule) =>
            ruleCoversSlot(rule, weekday, startHour, endHour, date)
          );
          if (!hasCompatibleRule) continue;

          const isBlocked = unavs.some((unav) =>
            unavailabilityBlocksSlot(unav, date, startHour, endHour)
          );
          if (!isBlocked) {
            compatibleSlots++;
          }
        }

        // Early exit from weekday loop if all slots are already covered
        if (compatibleSlots === totalSlots) break;
      }

      if (compatibleSlots > 0) {
        vigilScores.push({ vigil, compatibleSlots });

        if (compatibleSlots === totalSlots) {
          perfectMatch = vigil;
          break; // Stop processing remaining vigils – perfect match found
        }
      }
    }

    // Early exit: no vigil has any compatible slots
    if (vigilScores.length === 0) {
      return NextResponse.json(
        {
          code: ResponseCodesConstants.MATCHING_SUCCESS.code,
          data: [],
          success: true,
          message: "No vigils available for the requested schedule",
        },
        { status: 200 }
      );
    }

    // Early exit: perfect match
    if (perfectMatch) {
      return NextResponse.json(
        {
          code: ResponseCodesConstants.MATCHING_SUCCESS.code,
          data: [buildMatchedVigil(perfectMatch, totalSlots, totalSlots)],
          success: true,
          perfectMatch: true,
        },
        { status: 200 }
      );
    }

    // Sort candidates by compatible slots (descending)
    vigilScores.sort((a, b) => b.compatibleSlots - a.compatibleSlots);

    // Early exit: 5 or fewer candidates – return sorted list without quality ranking
    if (vigilScores.length <= 5) {
      const results: MatchedVigilI[] = vigilScores.map((s) =>
        buildMatchedVigil(s.vigil, s.compatibleSlots, totalSlots)
      );
      return NextResponse.json(
        {
          code: ResponseCodesConstants.MATCHING_SUCCESS.code,
          data: results,
          success: true,
        },
        { status: 200 }
      );
    }

    // ══════════════════════════════════════════════════
    // PHASE 3 – Quality ranking (reviews)
    // ══════════════════════════════════════════════════

    const topVigilIds = vigilScores.map((s) => s.vigil.id);

    const { data: reviews } = await _admin
      .from("reviews")
      .select("vigil_id, rating")
      .in("vigil_id", topVigilIds)
      .eq("visible", true);

    // Aggregate review statistics per vigil
    const reviewStatsByVigilId = new Map<
      string,
      { count: number; total: number }
    >();
    for (const review of reviews || []) {
      if (!reviewStatsByVigilId.has(review.vigil_id)) {
        reviewStatsByVigilId.set(review.vigil_id, { count: 0, total: 0 });
      }
      const stats = reviewStatsByVigilId.get(review.vigil_id)!;
      stats.count++;
      stats.total += review.rating;
    }

    // Build final ranked list: sort by (compatibleSlots DESC, reviewCount DESC, avgRating DESC)
    const rankedResults: MatchedVigilI[] = vigilScores
      .map((s) => {
        const reviewStats = reviewStatsByVigilId.get(s.vigil.id);
        const reviewCount = reviewStats?.count ?? 0;
        const averageRating =
          reviewCount > 0 ? reviewStats!.total / reviewCount : 0;
        return buildMatchedVigil(
          s.vigil,
          s.compatibleSlots,
          totalSlots,
          averageRating,
          reviewCount
        );
      })
      .sort((a, b) => {
        if (b.compatibleSlots !== a.compatibleSlots)
          return b.compatibleSlots - a.compatibleSlots;
        if (b.reviewCount !== a.reviewCount)
          return b.reviewCount - a.reviewCount;
        return b.averageRating - a.averageRating;
      })
      .slice(0, 5);

    return NextResponse.json(
      {
        code: ResponseCodesConstants.MATCHING_SUCCESS.code,
        data: rankedResults,
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Matching API error:", error);
    return jsonErrorResponse(500, {
      code: ResponseCodesConstants.MATCHING_ERROR.code,
      success: false,
      error,
    });
  }
}
