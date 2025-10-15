import {
  jsonErrorResponse,
  authenticateUser,
  getAdminClient,
} from "@/server/api.utils.server";
import { ResponseCodesConstants } from "@/src/constants";
import { RolesEnum, UserStatusEnum } from "@/src/enums/roles.enums";
import { deepMerge } from "@/src/utils/common.utils";
import { getPostgresTimestamp } from "@/src/utils/date.utils";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  context: { params: Promise<{ userId: string; role: RolesEnum }> }
) {
  try {
    const { userId, role } = await context?.params;
    const onBoardUser = await req.json();

    if (!userId || !role || !onBoardUser) {
      return jsonErrorResponse(400, {
        code: ResponseCodesConstants.USER_DETAILS_BAD_REQUEST.code,
        success: false,
      });
    }

    const originalUser = await authenticateUser(req);
    const userRole = originalUser?.user_metadata?.role?.toUpperCase();
    const userStatus = originalUser?.user_metadata?.status;

    if (
      !originalUser?.id ||
      originalUser.id !== userId ||
      ![RolesEnum.CONSUMER, RolesEnum.VIGIL].includes(userRole)
    ) {
      return jsonErrorResponse(403, {
        code: ResponseCodesConstants.USER_DETAILS_FORBIDDEN.code,
        success: false,
      });
    }

    const table =
      role.toUpperCase() === RolesEnum.CONSUMER ? "consumers" : "vigils";

    const _admin = getAdminClient();

    const { data, error } = await _admin
      .from(table)
      .update({
        ...onBoardUser,
        status: UserStatusEnum.ACTIVE,
        updated_at: getPostgresTimestamp(),
        id: originalUser.id,
      })
      .eq("id", userId)
      .select()
      .maybeSingle();

    if (error || !data)
      throw error || new Error("No data returned from update");

    if (userStatus === UserStatusEnum.PENDING) {
      const { error: authError } = await _admin.auth.admin.updateUserById(
        userId,
        {
          user_metadata: deepMerge(originalUser.user_metadata, {
            status: UserStatusEnum.ACTIVE,
          }),
        }
      );
      if (authError) throw authError;
    }

    return NextResponse.json({
      code: ResponseCodesConstants.USER_DETAILS_SUCCESS.code,
      data,
      success: true,
    });
  } catch (error) {
    console.error(error);
    return jsonErrorResponse(500, {
      code: ResponseCodesConstants.USER_DETAILS_ERROR.code,
      success: false,
      error: error instanceof Error ? error.message : String(error),
    });
  }
}
