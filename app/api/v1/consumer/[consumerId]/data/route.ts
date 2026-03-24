import { NextResponse } from "next/server";
import {
  jsonErrorResponse,
  authenticateUser,
  getAdminClient,
} from "@/server/api.utils.server";
import { ResponseCodesConstants } from "@/src/constants";

export async function GET(
  req: Request,
  context: { params: Promise<{ consumerId: string }> },
) {
  try {
    const { consumerId } = await context?.params;
    console.log(`API GET consumer/${consumerId}/data`);

    if (!consumerId) {
      return jsonErrorResponse(400, {
        code: ResponseCodesConstants.CONSUMER_DATA_BAD_REQUEST.code,
        success: false,
      });
    }

    const userObject = await authenticateUser(req);
    if (!userObject?.id)
      return jsonErrorResponse(403, {
        code: ResponseCodesConstants.CONSUMER_DATA_FORBIDDEN.code,
        success: false,
      });

    // Enforce ownership: users can only access their own consumer data
    if (userObject.id !== consumerId) {
      return jsonErrorResponse(403, {
        code: ResponseCodesConstants.CONSUMER_DATA_FORBIDDEN.code,
        success: false,
      });
    }
    const _admin = getAdminClient();
    const { data, error } = await _admin
      .from("consumers_data")
      .select()
      .eq("consumer_id", consumerId)
      .maybeSingle();

    if (data) {
      return NextResponse.json(
        {
          code: ResponseCodesConstants.CONSUMER_DATA_SUCCESS.code,
          data,
          success: true,
        },
        { status: 200 },
      );
    } else if (error) {
      return NextResponse.json(
        {
          code: ResponseCodesConstants.CONSUMER_DATA_ERROR.code,
          success: false,
          error,
          show: true,
        },
        { status: 500 },
      );
    } else {
      return NextResponse.json(
        {
          code: ResponseCodesConstants.CONSUMER_DATA_NOT_FOUND.code,
          success: false,
        },
        { status: 404 },
      );
    }
  } catch (error) {
    return jsonErrorResponse(500, {
      code: ResponseCodesConstants.CONSUMER_DATA_ERROR.code,
      success: false,
      error,
    });
  }
}
