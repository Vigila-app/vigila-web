import {
  authenticateUser,
  getAdminClient,
  jsonErrorResponse,
} from "@/server/api.utils.server";
import { ResponseCodesConstants } from "@/src/constants";
import { RolesEnum } from "@/src/enums/roles.enums";
import {
  isValidTimeRange,
  isValidAvailabilityRuleDateRange,
  calculateDurationMinutes,
  slotsOverlap,
  dateRangesOverlap,
} from "@/src/utils/calendar.utils";
import { NextRequest, NextResponse } from "next/server";

/**
 * PUT /api/vigil/availability-rules/[ruleId]
 *
 * Updates an availability rule (only if it belongs to the authenticated vigil)
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ ruleId: string }> },
) {
  try {
    const { ruleId } = await params;
    const body = await req.json();

    // Authenticate user
    const userObject = await authenticateUser(req);
    if (!userObject?.id) {
      return jsonErrorResponse(401, {
        code: ResponseCodesConstants.AVAILABILITY_RULES_UPDATE_UNAUTHORIZED
          .code,
        success: false,
        message: "Unauthorized",
      } as any);
    }

    // Verify user is a vigil
    if (userObject.user_metadata?.role !== RolesEnum.VIGIL) {
      return jsonErrorResponse(403, {
        code: ResponseCodesConstants.AVAILABILITY_RULES_UPDATE_FORBIDDEN.code,
        success: false,
        message: "Only vigils can update availability rules",
      } as any);
    }

    if (!ruleId) {
      return jsonErrorResponse(400, {
        code: ResponseCodesConstants.AVAILABILITY_RULES_UPDATE_BAD_REQUEST.code,
        success: false,
        message: "Rule ID is required",
      } as any);
    }

    // Validate body (basic)
    const { start_time, end_time, valid_from, valid_to } = body;
    if (!start_time || !end_time) {
      return jsonErrorResponse(400, {
        code: ResponseCodesConstants.AVAILABILITY_RULES_UPDATE_BAD_REQUEST.code,
        success: false,
        message: "start_time and end_time are required",
      } as any);
    }

    // Validate time range (same as POST)
    const timeRangeValidation = isValidTimeRange(start_time, end_time);
    if (!timeRangeValidation.valid) {
      return jsonErrorResponse(400, {
        code: ResponseCodesConstants.AVAILABILITY_RULES_UPDATE_BAD_REQUEST.code,
        success: false,
        message: timeRangeValidation.error,
      } as any);
    }

    // Validate minimum duration (>= 1 hour)
    const durationMinutes = calculateDurationMinutes(start_time, end_time);
    if (durationMinutes < 60) {
      return jsonErrorResponse(400, {
        code: ResponseCodesConstants.AVAILABILITY_RULES_UPDATE_BAD_REQUEST.code,
        success: false,
        message: "Minimum duration must be at least 1 hour (60 minutes)",
      } as any);
    }

    // Validate date range
    const dateRangeValidation = isValidAvailabilityRuleDateRange(
      valid_from,
      valid_to,
    );
    if (!dateRangeValidation.valid) {
      return jsonErrorResponse(400, {
        code: ResponseCodesConstants.AVAILABILITY_RULES_UPDATE_BAD_REQUEST.code,
        success: false,
        message: dateRangeValidation.error,
      } as any);
    }

    const _admin = getAdminClient();

    // Ensure the rule exists and belongs to this vigil
    const { data: existingRule, error: fetchRuleError } = await _admin
      .from("vigil_availability_rules")
      .select("*")
      .eq("id", ruleId)
      .eq("vigil_id", userObject.id)
      .single();
    if (fetchRuleError) throw fetchRuleError;
    if (!existingRule) {
      return jsonErrorResponse(404, {
        code: ResponseCodesConstants.AVAILABILITY_RULES_UPDATE_NOT_FOUND.code,
        success: false,
        message: "Availability rule not found",
      } as any);
    }

    // Check for overlapping time slots on the same weekday (exclude current rule)
    const { data: otherRules, error: fetchError } = await _admin
      .from("vigil_availability_rules")
      .select("*")
      .eq("vigil_id", userObject.id)
      .eq("weekday", existingRule.weekday)
      .neq("id", ruleId);

    if (fetchError) throw fetchError;

    if (otherRules && otherRules.length > 0) {
      const hasOverlap = otherRules.some((rule: any) => {
        const timeOverlap = slotsOverlap(
          start_time,
          end_time,
          rule.start_time,
          rule.end_time,
        );
        const dateOverlap = dateRangesOverlap(
          valid_from,
          valid_to,
          rule.valid_from,
          rule.valid_to,
        );
        return timeOverlap && dateOverlap;
      });

      if (hasOverlap) {
        return jsonErrorResponse(400, {
          code: ResponseCodesConstants.AVAILABILITY_RULES_UPDATE_BAD_REQUEST
            .code,
          success: false,
          message: `Time slot overlaps with an existing availability rule for ${["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][existingRule.weekday]}`,
        } as any);
      }
    }

    // Update the rule (RLS ensures only owner can update)
    const { error } = await _admin
      .from("vigil_availability_rules")
      .update({
        start_time,
        end_time,
        valid_from,
        valid_to,
      })
      .eq("id", ruleId)
      .eq("vigil_id", userObject.id); // Double-check ownership

    if (error) throw error;

    return NextResponse.json(
      {
        code: ResponseCodesConstants.AVAILABILITY_RULES_UPDATE_SUCCESS.code,
        success: true,
        message: "Availability rule updated successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Update availability rule error:", error);
    return jsonErrorResponse(500, {
      code: ResponseCodesConstants.AVAILABILITY_RULES_UPDATE_ERROR.code,
      success: false,
      error,
    } as any);
  }
}

/**
 * DELETE /api/vigil/availability-rules/[ruleId]
 *
 * Deletes an availability rule (only if it belongs to the authenticated vigil)
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ ruleId: string }> },
) {
  try {
    const { ruleId } = await params;

    // Authenticate user
    const userObject = await authenticateUser(req);
    if (!userObject?.id) {
      return jsonErrorResponse(401, {
        code: ResponseCodesConstants.AVAILABILITY_RULES_DELETE_UNAUTHORIZED
          .code,
        success: false,
        message: "Unauthorized",
      } as any);
    }

    // Verify user is a vigil
    if (userObject.user_metadata?.role !== RolesEnum.VIGIL) {
      return jsonErrorResponse(403, {
        code: ResponseCodesConstants.AVAILABILITY_RULES_DELETE_FORBIDDEN.code,
        success: false,
        message: "Only vigils can delete availability rules",
      } as any);
    }

    if (!ruleId) {
      return jsonErrorResponse(400, {
        code: ResponseCodesConstants.AVAILABILITY_RULES_DELETE_BAD_REQUEST.code,
        success: false,
        message: "Rule ID is required",
      } as any);
    }

    const _admin = getAdminClient();

    // Delete the rule (RLS ensures only owner can delete)
    const { error } = await _admin
      .from("vigil_availability_rules")
      .delete()
      .eq("id", ruleId)
      .eq("vigil_id", userObject.id); // Double-check ownership

    if (error) throw error;

    return NextResponse.json(
      {
        code: ResponseCodesConstants.AVAILABILITY_RULES_DELETE_SUCCESS.code,
        success: true,
        message: "Availability rule deleted successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Delete availability rule error:", error);
    return jsonErrorResponse(500, {
      code: ResponseCodesConstants.AVAILABILITY_RULES_DELETE_ERROR.code,
      success: false,
      error,
    } as any);
  }
}
