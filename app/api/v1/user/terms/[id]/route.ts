import { NextResponse } from "next/server";
import {
  jsonErrorResponse,
  authenticateUser,
  getAdminClient,
} from "@/server/api.utils.server";
import { ResponseCodesConstants } from "@/src/constants";
import { deepMerge } from "@/src/utils/common.utils";

export async function PUT(req: Request, context: { params: { id: string } }) {
  try {
    const { id: userId } = await context?.params;

    const { data: updatedTerms } = await req.json();
    console.log(`API PUT user/terms/${userId}`, updatedTerms);

    if (!userId || !updatedTerms) {
      return jsonErrorResponse(400, {
        code: ResponseCodesConstants.USER_TERMS_BAD_REQUEST.code,
        success: false,
      });
    }

    const userObject = await authenticateUser(req);
    if (!userObject?.id || userId !== userObject?.id)
      return jsonErrorResponse(403, {
        code: ResponseCodesConstants.USER_TERMS_FORBIDDEN.code,
        success: false,
      });

    const _admin = getAdminClient();

    const { error: authError } = await _admin.auth.admin.updateUserById(
      userId,
      {
        user_metadata: {
          ...userObject.user_metadata,
          terms: deepMerge(userObject.user_metadata?.terms || {}, updatedTerms),
        },
      }
    );
    if (authError) throw authError;

    return NextResponse.json(
      {
        code: ResponseCodesConstants.USER_TERMS_SUCCESS.code,
        data: updatedTerms,
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    return jsonErrorResponse(500, {
      code: ResponseCodesConstants.USER_TERMS_ERROR.code,
      success: false,
      error,
    });
  }
}
