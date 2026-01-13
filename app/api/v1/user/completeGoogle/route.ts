import { initAdmin } from "@/server/supabaseAdmin";
import { ResponseCodesConstants } from "@/src/constants";
import { RolesEnum, UserStatusEnum } from "@/src/enums/roles.enums";
import { authenticateUser, getAdminClient, jsonErrorResponse } from "@/server/api.utils.server";
import { NextRequest, NextResponse } from "next/server";

import { mergeGoogleAndFormData } from "@/src/utils/common.utils";
import { AuthService } from "@/src/services";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log(`API POST auth/complete-google`, body);

    const userObject = await authenticateUser(req);
    if (!userObject?.id)
      return jsonErrorResponse(401, {
        code: ResponseCodesConstants.USER_SIGNUP_UNAUTHORIZED.code,
        success: false,
      });

    const _admin = getAdminClient();

    const { role, terms } = body;

    const userId = userObject.id;
    const googleRawMeta = userObject.user_metadata || {};

    if (!terms) {
      return NextResponse.json(
        {
        code: ResponseCodesConstants.USER_SIGNUP_BAD_REQUEST.code,
          success: false,
          error: "Terms must be accepted",
        },
        { status: 400 }
      );
    }

    if ((role !== RolesEnum.CONSUMER && role !== RolesEnum.VIGIL) || userObject.user_metadata?.role) {
      return NextResponse.json(
        { code: ResponseCodesConstants.USER_SIGNUP_BAD_REQUEST.code, success: false, error: "Invalid Role" },
        { status: 400 }
      );
    }

    const cleanMetadata = mergeGoogleAndFormData(googleRawMeta, {
      role,
      terms,
      userId,
    });

    const { error: authError } = await _admin.auth.admin.updateUserById(
      userId,
      {
        user_metadata: cleanMetadata,
      }
    );

    if (authError) {
      console.error("Error updating auth metadata:", authError);
      return jsonErrorResponse(500, {
        success: false,
        code: authError.message,
      });
    }

    const { error: dbError } = await _admin
      .from(
        role === RolesEnum.CONSUMER
          ? "consumers"
          : role === RolesEnum.VIGIL
            ? "vigils"
            : ""
      )
      .upsert({
        id: userId,
        displayName: cleanMetadata.displayName,
        status: UserStatusEnum.PENDING,
      });

    if (dbError) {
      console.error("Error updating public table:", dbError);

      return jsonErrorResponse(500, { success: false, code: dbError.message });
    }

    return NextResponse.json(
      {
        code: ResponseCodesConstants.USER_SIGNUP_SUCCESS?.code || "SUCCESS",
        success: true,
        message: "Google profile completed successfully",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("API Error:", error);
    return jsonErrorResponse(500, { success: false, code: error.message });
  }
}
