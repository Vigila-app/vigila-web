import { NextResponse } from "next/server";
import {
  jsonErrorResponse,
  authenticateUser,
  getAdminClient,
} from "@/server/api.utils.server";
import { ResponseCodesConstants } from "@/src/constants";
import { RolesEnum } from "@/src/enums/roles.enums";

export async function GET(
  req: Request,
  context: { params: Promise<{ consumerId: string }> }
) {
  try {
    const { consumerId } = await context?.params;
    console.log(`API GET consumer/${consumerId}`);

    if (!consumerId) {
      return jsonErrorResponse(400, {
        code: ResponseCodesConstants.CONSUMER_DETAILS_BAD_REQUEST.code,
        success: false,
      });
    }

    const userObject = await authenticateUser(req);
    if (
      !userObject?.id ||
      userObject.user_metadata?.role?.toUpperCase() !== RolesEnum.VIGIL
    )
      return jsonErrorResponse(403, {
        code: ResponseCodesConstants.CONSUMER_DETAILS_FORBIDDEN.code,
        success: false,
      });

    const _admin = getAdminClient();
    const { data, error } = await _admin
      .from("consumers")
      .select()
      .eq("id", consumerId)
      .maybeSingle();

    if (data) {
      return NextResponse.json(
        {
          code: ResponseCodesConstants.CONSUMER_DETAILS_SUCCESS.code,
          data,
          success: true,
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          code: ResponseCodesConstants.CONSUMER_DETAILS_ERROR.code,
          success: false,
          error,
          show: true,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    return jsonErrorResponse(500, {
      code: ResponseCodesConstants.CONSUMER_DETAILS_ERROR.code,
      success: false,
      error,
    });
  }
}
