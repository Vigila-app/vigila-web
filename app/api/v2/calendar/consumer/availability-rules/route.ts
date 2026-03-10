import {
  authenticateUser,
  getAdminClient,
  jsonErrorResponse,
} from "@/server/api.utils.server"
import { ResponseCodesConstants } from "@/src/constants"
import { RolesEnum } from "@/src/enums/roles.enums"
import {
  VigilAvailabilityRuleI,
  VigilAvailabilityRuleFormI,
} from "@/src/types/calendar.types"
import {
  isValidTimeRange,
  isValidAvailabilityRuleDateRange,
  calculateDurationMinutes,
  slotsOverlap,
  dateRangesOverlap,
} from "@/src/utils/calendar.utils"
import { NextRequest, NextResponse } from "next/server"

/**
 * GET /api/vigil/availability-rules
 *
 * Returns all availability rules for the authenticated vigil
 */
export async function GET(req: NextRequest) {
  try {
    // Authenticate user
    const userObject = await authenticateUser(req)
    if (!userObject?.id) {
      return jsonErrorResponse(401, {
        code: ResponseCodesConstants.AVAILABILITY_RULES_LIST_UNAUTHORIZED.code,
        success: false,
        message: "Unauthorized",
      } as any)
    }

    // Verify user is a vigil
    if (userObject.user_metadata?.role !== RolesEnum.CONSUMER) {
      return jsonErrorResponse(403, {
        code: ResponseCodesConstants.AVAILABILITY_RULES_LIST_FORBIDDEN.code,
        success: false,
        message: "Only consumers can access this endpoint",
      } as any)
    }

    const _admin = getAdminClient()

    // Get all availability rules for this vigil
    const { data: rules, error } = await _admin
      .from("consumer_availability_rules")
      .select("*")
      .eq("consumer_id", userObject.id)
      .order("weekday", { ascending: true })
      .order("start_time", { ascending: true })

    if (error) throw error

    return NextResponse.json(
      {
        code: ResponseCodesConstants.AVAILABILITY_RULES_LIST_SUCCESS.code,
        data: rules || [],
        success: true,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Get availability rules error:", error)
    return jsonErrorResponse(500, {
      code: ResponseCodesConstants.AVAILABILITY_RULES_LIST_ERROR.code,
      success: false,
      error,
    } as any)
  }
}

/**
 * POST /api/consumer/availability-rules
 *
 * Creates a new availability rule for the authenticated consumer
 */
export async function POST(req: NextRequest) {
  try {
    // Authenticate user
    const userObject = await authenticateUser(req)
    if (!userObject?.id) {
      return jsonErrorResponse(401, {
        code: ResponseCodesConstants.AVAILABILITY_RULES_CREATE_UNAUTHORIZED
          .code,
        success: false,
        message: "Unauthorized",
      } as any)
    }

    // Verify user is a vigil
    if (userObject.user_metadata?.role !== RolesEnum.CONSUMER) {
      return jsonErrorResponse(403, {
        code: ResponseCodesConstants.AVAILABILITY_RULES_CREATE_FORBIDDEN.code,
        success: false,
        message: "Only consumers can create availability rules",
      } as any)
    }

    const body = await req.json()

    // Accept either a single rule or an array of rules
    const incoming: VigilAvailabilityRuleFormI[] = Array.isArray(body)
      ? body
      : [body]

    if (incoming.length === 0) {
      return jsonErrorResponse(400, {
        code: ResponseCodesConstants.AVAILABILITY_RULES_CREATE_BAD_REQUEST.code,
        success: false,
        message: "No availability rules provided",
      } as any)
    }

    // Validate each incoming rule
    for (let i = 0; i < incoming.length; i++) {
      const r = incoming[i]
      if (
        r.weekday === undefined ||
        r.start_time === undefined ||
        r.end_time === undefined ||
        !r.valid_from
      ) {
        return jsonErrorResponse(400, {
          code: ResponseCodesConstants.AVAILABILITY_RULES_CREATE_BAD_REQUEST.code,
          success: false,
          message: `Missing required fields in rule at index ${i}: weekday, start_time, end_time, valid_from`,
        } as any)
      }
      if (r.weekday < 0 || r.weekday > 6) {
        return jsonErrorResponse(400, {
          code: ResponseCodesConstants.AVAILABILITY_RULES_CREATE_BAD_REQUEST.code,
          success: false,
          message: `Weekday must be between 0 and 6 in rule at index ${i}`,
        } as any)
      }
      const timeRangeValidation = isValidTimeRange(r.start_time, r.end_time)
      if (!timeRangeValidation.valid) {
        return jsonErrorResponse(400, {
          code: ResponseCodesConstants.AVAILABILITY_RULES_CREATE_BAD_REQUEST.code,
          success: false,
          message: `Invalid time range in rule at index ${i}: ${timeRangeValidation.error}`,
        } as any)
      }
      const durationMinutes = calculateDurationMinutes(r.start_time, r.end_time)
      if (durationMinutes < 60) {
        return jsonErrorResponse(400, {
          code: ResponseCodesConstants.AVAILABILITY_RULES_MIN_DURATION_ERROR.code,
          success: false,
          message: `Minimum duration must be at least 1 hour in rule at index ${i}`,
        } as any)
      }
      const dateRangeValidation = isValidAvailabilityRuleDateRange(
        r.valid_from,
        r.valid_to,
      )
      if (!dateRangeValidation.valid) {
        return jsonErrorResponse(400, {
          code: ResponseCodesConstants.AVAILABILITY_RULES_CREATE_BAD_REQUEST.code,
          success: false,
          message: `Invalid date range in rule at index ${i}: ${dateRangeValidation.error}`,
        } as any)
      }
    }

    const _admin = getAdminClient()

    // Fetch existing rules for this consumer once
    const { data: existingRules, error: fetchError } = await _admin
      .from("consumer_availability_rules")
      .select("*")
      .eq("consumer_id", userObject.id)

    if (fetchError) throw fetchError

    // Check incoming rules for overlap with existing rules and between themselves
    for (let i = 0; i < incoming.length; i++) {
      const r = incoming[i]
      // Check against existing
      if (existingRules && existingRules.length > 0) {
        const hasOverlap = existingRules.some((rule: any) => {
          if (rule.weekday !== r.weekday) return false
          const timeOverlap = slotsOverlap(
            r.start_time,
            r.end_time,
            rule.start_time,
            rule.end_time,
          )
          const dateOverlap = dateRangesOverlap(
            r.valid_from,
            r.valid_to,
            rule.valid_from,
            rule.valid_to,
          )
          return timeOverlap && dateOverlap
        })
        if (hasOverlap) {
          return jsonErrorResponse(409, {
            code: ResponseCodesConstants.AVAILABILITY_RULES_OVERLAP_ERROR.code,
            success: false,
            message: `Time slot overlaps with an existing availability rule for ${["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][r.weekday]} (incoming index ${i})`,
          } as any)
        }
      }
      // Check against other incoming rules
      for (let j = 0; j < incoming.length; j++) {
        if (i === j) continue
        const r2 = incoming[j]
        if (r.weekday !== r2.weekday) continue
        const timeOverlap = slotsOverlap(
          r.start_time,
          r.end_time,
          r2.start_time,
          r2.end_time,
        )
        const dateOverlap = dateRangesOverlap(
          r.valid_from,
          r.valid_to,
          r2.valid_from,
          r2.valid_to,
        )
        if (timeOverlap && dateOverlap) {
          return jsonErrorResponse(409, {
            code: ResponseCodesConstants.AVAILABILITY_RULES_OVERLAP_ERROR.code,
            success: false,
            message: `Incoming rules at index ${i} and ${j} overlap for weekday ${r.weekday}`,
          } as any)
        }
      }
    }

    // Build new rules to insert with consumer_id
    const newRules = incoming.map((r) => ({
      consumer_id: userObject.id,
      weekday: r.weekday,
      start_time: r.start_time,
      end_time: r.end_time,
      valid_from: r.valid_from,
      valid_to: r.valid_to || null,
    }))

    const { data: inserted, error } = await _admin
      .from("consumer_availability_rules")
      .insert(newRules)
      .select()

    if (error) throw error

    return NextResponse.json(
      {
        code: ResponseCodesConstants.AVAILABILITY_RULES_CREATE_SUCCESS.code,
        data: inserted || [],
        success: true,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Create availability rule error:", error)
    return jsonErrorResponse(500, {
      code: ResponseCodesConstants.AVAILABILITY_RULES_CREATE_ERROR.code,
      success: false,
      error,
    } as any)
  }
}
