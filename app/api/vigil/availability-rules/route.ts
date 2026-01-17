import {
  authenticateUser,
  getAdminClient,
  jsonErrorResponse,
} from "@/server/api.utils.server";
import { ResponseCodesConstants } from "@/src/constants";
import { RolesEnum } from "@/src/enums/roles.enums";
import {
  VigilAvailabilityRuleI,
  VigilAvailabilityRuleFormI,
} from "@/src/types/calendar.types";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/vigil/availability-rules
 * 
 * Returns all availability rules for the authenticated vigil
 */
export async function GET(req: NextRequest) {
  try {
    // Authenticate user
    const userObject = await authenticateUser(req);
    if (!userObject?.id) {
      return jsonErrorResponse(401, {
        code: ResponseCodesConstants.BOOKINGS_CREATE_UNAUTHORIZED.code,
        success: false,
        message: "Unauthorized",
      } as any);
    }

    // Verify user is a vigil
    if (userObject.user_metadata?.role !== RolesEnum.VIGIL) {
      return jsonErrorResponse(403, {
        code: ResponseCodesConstants.BOOKINGS_CREATE_UNAUTHORIZED.code,
        success: false,
        message: "Only vigils can access this endpoint",
      } as any);
    }

    const _admin = getAdminClient();

    // Get all availability rules for this vigil
    const { data: rules, error } = await _admin
      .from("vigil_availability_rules")
      .select("*")
      .eq("vigil_id", userObject.id)
      .order("weekday", { ascending: true })
      .order("start_hour", { ascending: true });

    if (error) throw error;

    return NextResponse.json(
      {
        code: "AVAILABILITY_RULES_LIST_SUCCESS",
        data: rules || [],
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get availability rules error:", error);
    return jsonErrorResponse(500, {
      code: "AVAILABILITY_RULES_LIST_ERROR",
      success: false,
      error,
    } as any);
  }
}

/**
 * POST /api/vigil/availability-rules
 * 
 * Creates a new availability rule for the authenticated vigil
 */
export async function POST(req: NextRequest) {
  try {
    // Authenticate user
    const userObject = await authenticateUser(req);
    if (!userObject?.id) {
      return jsonErrorResponse(401, {
        code: ResponseCodesConstants.BOOKINGS_CREATE_UNAUTHORIZED.code,
        success: false,
        message: "Unauthorized",
      } as any);
    }

    // Verify user is a vigil
    if (userObject.user_metadata?.role !== RolesEnum.VIGIL) {
      return jsonErrorResponse(403, {
        code: ResponseCodesConstants.BOOKINGS_CREATE_UNAUTHORIZED.code,
        success: false,
        message: "Only vigils can create availability rules",
      } as any);
    }

    const body: VigilAvailabilityRuleFormI = await req.json();

    // Validate required fields
    if (
      body.weekday === undefined ||
      body.start_hour === undefined ||
      body.end_hour === undefined ||
      !body.valid_from
    ) {
      return jsonErrorResponse(400, {
        code: "AVAILABILITY_RULES_CREATE_BAD_REQUEST",
        success: false,
        message:
          "Missing required fields: weekday, start_hour, end_hour, valid_from",
      } as any);
    }

    // Validate weekday range
    if (body.weekday < 0 || body.weekday > 6) {
      return jsonErrorResponse(400, {
        code: "AVAILABILITY_RULES_CREATE_BAD_REQUEST",
        success: false,
        message: "Weekday must be between 0 (Sunday) and 6 (Saturday)",
      } as any);
    }

    // Validate hour range
    if (
      body.start_hour < 0 ||
      body.start_hour > 23 ||
      body.end_hour < 1 ||
      body.end_hour > 24
    ) {
      return jsonErrorResponse(400, {
        code: "AVAILABILITY_RULES_CREATE_BAD_REQUEST",
        success: false,
        message: "start_hour must be 0-23, end_hour must be 1-24",
      } as any);
    }

    // Validate hour range logic
    if (body.end_hour <= body.start_hour) {
      return jsonErrorResponse(400, {
        code: "AVAILABILITY_RULES_CREATE_BAD_REQUEST",
        success: false,
        message: "end_hour must be greater than start_hour",
      } as any);
    }

    const _admin = getAdminClient();

    // Create the rule (vigil_id is set from authenticated user)
    const newRule = {
      vigil_id: userObject.id, // Always use authenticated user's ID
      weekday: body.weekday,
      start_hour: body.start_hour,
      end_hour: body.end_hour,
      valid_from: body.valid_from,
      valid_to: body.valid_to || null,
    };

    const { data: rule, error } = await _admin
      .from("vigil_availability_rules")
      .insert(newRule)
      .select()
      .single<VigilAvailabilityRuleI>();

    if (error || !rule) throw error;

    return NextResponse.json(
      {
        code: "AVAILABILITY_RULES_CREATE_SUCCESS",
        data: rule,
        success: true,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create availability rule error:", error);
    return jsonErrorResponse(500, {
      code: "AVAILABILITY_RULES_CREATE_ERROR",
      success: false,
      error,
    } as any);
  }
}
