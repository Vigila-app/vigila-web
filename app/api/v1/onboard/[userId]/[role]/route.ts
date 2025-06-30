import {
  jsonErrorResponse,
  authenticateUser,
  getAdminClient,
} from "@/server/api.utils.server";
import { ResponseCodesConstants } from "@/src/constants";
import { RolesEnum } from "@/src/enums/roles.enums";

import { getPostgresTimestamp } from "@/src/utils/date.utils";
import { NextRequest, NextResponse } from "next/server";

const verifyUserAccess = async (userId: string, role: RolesEnum) => {
  if (
    !userId ||
    (role?.toUpperCase() !== RolesEnum.CONSUMER &&
      role?.toUpperCase() !== RolesEnum.VIGIL)
  ) {
    throw jsonErrorResponse(400, {
      code: ResponseCodesConstants.USER_DETAILS_BAD_REQUEST.code,
      success: false,
    });
  }
  const _admin = getAdminClient();
  const { data, error } = await _admin
    .from(
      role.toUpperCase() === RolesEnum.CONSUMER
        ? "consumers"
        : role.toUpperCase() === RolesEnum.VIGIL
        ? "vigils"
        : ""
    )
    .select()
    .eq("id", userId)
    .maybeSingle();
  if (error)
    throw jsonErrorResponse(500, {
      code: ResponseCodesConstants.USER_DETAILS_ERROR.code,
      success: false,
      error,
    });
  if (!data || data.id !== userId)
    throw jsonErrorResponse(403, {
      code: ResponseCodesConstants.USER_DETAILS_FORBIDDEN.code,
      success: false,
    });
  return data;
};
export async function GET() {
  console.log("ok get");
  return NextResponse.json({ message: "ok get" });
}

export async function POST(
  req: Request,
  context: { params: { userId: string; role: RolesEnum } }
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

    const userIn = await authenticateUser(req);
    const userRole = userIn?.user_metadata?.role?.toUpperCase();

    if (
      !userIn?.id ||
      userIn.id !== userId ||
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
        updated_at: getPostgresTimestamp(),
        id: userIn.id,
      })
      .eq("id", userId)
      .select()
      .maybeSingle();

    if (error || !data)
      throw error || new Error("No data returned from update");

    return NextResponse.json({
      code: ResponseCodesConstants.USER_DETAILS_SUCCESS.code,
      data,
      success: true,
    });
  } catch (error) {console.error(error)
    return jsonErrorResponse(500, {
      
      code: ResponseCodesConstants.USER_DETAILS_ERROR.code,
      success: false,
      error: error instanceof Error ? error.message : String(error),
    });
  }
}
//
