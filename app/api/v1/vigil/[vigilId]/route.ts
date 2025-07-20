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
  context: { params: { vigilId: string } }
) {
  try {
    const { vigilId } = await context?.params;
    console.log(`API GET vigil/${vigilId}`);

    if (!vigilId) {
      return jsonErrorResponse(400, {
        code: ResponseCodesConstants.VIGIL_DETAILS_BAD_REQUEST.code,
        success: false,
      });
    }

    const userObject = await authenticateUser(req);
    if (
      !userObject?.id ||
      userObject.user_metadata?.role?.toUpperCase() == RolesEnum.CONSUMER
    )
      return jsonErrorResponse(403, {
        code: ResponseCodesConstants.VIGIL_DETAILS_FORBIDDEN.code,
        success: false,
      });

    const _admin = getAdminClient();
    const { data, error } = await _admin
      .from("vigils")
      .select()
      .eq("id", vigilId)
      .maybeSingle();

    if (data) {
      return NextResponse.json(
        {
          code: ResponseCodesConstants.VIGIL_DETAILS_SUCCESS.code,
          data,
          success: true,
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          code: ResponseCodesConstants.VIGIL_DETAILS_ERROR.code,
          success: false,
          error,
          show: true,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    return jsonErrorResponse(500, {
      code: ResponseCodesConstants.VIGIL_DETAILS_ERROR.code,
      success: false,
      error,
    });
  }
}
