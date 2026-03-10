import {
  authenticateUser,
  getAdminClient,
  jsonErrorResponse,
} from "@/server/api.utils.server";
import { ResponseCodesConstants } from "@/src/constants";
import { RolesEnum } from "@/src/enums/roles.enums";
import { NextRequest, NextResponse } from "next/server";

/**
 * DELETE /api/vigil/unavailabilities/[id]
 *
 * Deletes an unavailability (only if it belongs to the authenticated vigil)
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
        code: ResponseCodesConstants.UNAVAILABILITY_DELETE_FORBIDDEN.code,
        success: false,
        message: "Unauthorized",
      } as any);
    }

    // Verify user is a vigil
    if (userObject.user_metadata?.role !== RolesEnum.VIGIL) {
      return jsonErrorResponse(403, {
        code: ResponseCodesConstants.UNAVAILABILITY_DELETE_FORBIDDEN.code,
        success: false,
        message: "Only vigils can delete unavailabilities",
      } as any);
    }

    if (!ruleId) {
      return jsonErrorResponse(400, {
        code: ResponseCodesConstants.UNAVAILABILITY_DELETE_BAD_REQUEST.code,
        success: false,
        message: "Unavailability ID is required",
      } as any);
    }

    const _admin = getAdminClient();

    // Delete the unavailability (ensure ownership via vigil_id filter)
    const { error } = await _admin
      .from("vigil_unavailabilities")
      .delete()
      .eq("id", ruleId)
      .eq("vigil_id", userObject.id); // Prevent unauthorized deletions

    if (error) throw error;

    return NextResponse.json(
      {
        code: ResponseCodesConstants.UNAVAILABILITY_DELETE_SUCCESS.code,
        success: true,
        message: "Unavailability deleted successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Delete unavailability error:", error);
    return jsonErrorResponse(500, {
      code: ResponseCodesConstants.UNAVAILABILITY_DELETE_ERROR.code,
      success: false,
      error,
    } as any);
  }
}
