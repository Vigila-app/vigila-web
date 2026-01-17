import {
  authenticateUser,
  getAdminClient,
  jsonErrorResponse,
} from "@/server/api.utils.server";
import { ResponseCodesConstants } from "@/src/constants";
import { RolesEnum } from "@/src/enums/roles.enums";
import { NextRequest, NextResponse } from "next/server";

/**
 * DELETE /api/vigil/availability-rules/[ruleId]
 * 
 * Deletes an availability rule (only if it belongs to the authenticated vigil)
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ ruleId: string }> }
) {
  try {
    const { ruleId } = await params;

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
        message: "Only vigils can delete availability rules",
      } as any);
    }

    if (!ruleId) {
      return jsonErrorResponse(400, {
        code: "AVAILABILITY_RULES_DELETE_BAD_REQUEST",
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
        code: "AVAILABILITY_RULES_DELETE_SUCCESS",
        success: true,
        message: "Availability rule deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete availability rule error:", error);
    return jsonErrorResponse(500, {
      code: "AVAILABILITY_RULES_DELETE_ERROR",
      success: false,
      error,
    } as any);
  }
}
