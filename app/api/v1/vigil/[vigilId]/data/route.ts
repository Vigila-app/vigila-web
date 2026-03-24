import { NextResponse } from "next/server";
import {
  jsonErrorResponse,
  authenticateUser,
  getAdminClient,
} from "@/server/api.utils.server";
import { ResponseCodesConstants } from "@/src/constants";

export async function GET(
  req: Request,
  context: { params: Promise<{ vigilId: string }> },
) {
  try {
    const { vigilId } = await context?.params;
    console.log(`API GET vigil/${vigilId}/data`);

    if (!vigilId) {
      return jsonErrorResponse(400, {
        code: ResponseCodesConstants.VIGIL_DATA_BAD_REQUEST.code,
        success: false,
      });
    }

    const userObject = await authenticateUser(req);
    if (!userObject?.id)
      return jsonErrorResponse(403, {
        code: ResponseCodesConstants.VIGIL_DATA_FORBIDDEN.code,
        success: false,
      });

    const _admin = getAdminClient();
    const { data, error } = await _admin
      .from("vigils_data")
      .select()
      .eq("vigil_id", vigilId)
      .maybeSingle();

    if (data) {
      return NextResponse.json(
        {
          code: ResponseCodesConstants.VIGIL_DATA_SUCCESS.code,
          data,
          success: true,
        },
        { status: 200 },
      );
    } else if (error) {
      return NextResponse.json(
        {
          code: ResponseCodesConstants.VIGIL_DATA_ERROR.code,
          success: false,
          error,
          show: true,
        },
        { status: 500 },
      );
    } else {
      return NextResponse.json(
        {
          code: ResponseCodesConstants.VIGIL_DATA_NOT_FOUND.code,
          success: false,
        },
        { status: 404 },
      );
    }
  } catch (error) {
    return jsonErrorResponse(500, {
      code: ResponseCodesConstants.VIGIL_DATA_ERROR.code,
      success: false,
      error,
    });
  }
}
