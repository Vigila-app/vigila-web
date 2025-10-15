import { jsonErrorResponse } from "@/server/api.utils.server";
import { initAdmin } from "@/server/supabaseAdmin";
import { AppConstants, ResponseCodesConstants } from "@/src/constants";
import { AccessLevelsEnum, RolesEnum } from "@/src/enums/roles.enums";
import { Routes } from "@/src/routes";
import { AuthService } from "@/src/services";
import { UserSignupType, UserType } from "@/src/types/user.types";
import { isReleased } from "@/src/utils/envs.utils";
import { NextRequest, NextResponse } from "next/server";

const genericError = (error: any = undefined) =>
  jsonErrorResponse(500, {
    code: ResponseCodesConstants.USER_SIGNUP_ERROR.code,
    success: false,
    error,
  });

export async function POST(req: NextRequest) {
  // return requestHandler(req);
  try {
    const body: UserSignupType = await req.json();
    console.log(`API POST user/signup`, { ...body, password: "******" });

    const { authToken, user: authUser } = AuthService.getAuthHeaders(
      req.headers
    );

    if (authUser || authToken) {
      return NextResponse.json(
        {
          code: ResponseCodesConstants.USER_SIGNUP_FORBIDDEN.code,
          success: false,
        },
        { status: 403 }
      );
    }

    const {
      email,
      password,
      name,
      surname,
      terms,
      role = RolesEnum.CONSUMER,
      level = AccessLevelsEnum.BASE,
    } = body;
    if (
      !(email && password && name && surname && terms) ||
      (role !== RolesEnum.CONSUMER && role !== RolesEnum.VIGIL)
    ) {
      return NextResponse.json(
        {
          code: ResponseCodesConstants.USER_SIGNUP_BAD_REQUEST.code,
          success: false,
        },
        { status: 400 }
      );
    }

    const _admin = initAdmin();

    if (!_admin) {
      return NextResponse.json(
        {
          code: ResponseCodesConstants.USER_SIGNUP_SERVICE_UNAVAILABLE.code,
          success: false,
        },
        { status: 503 }
      );
    }

    const { data, error } = await _admin.auth.admin.createUser({
      email,
      password,
      email_confirm: !isReleased,
      user_metadata: {
        name,
        surname,
        displayName: `${name} ${surname}`,
        terms,
        role,
        level,
        status:
          role === RolesEnum.CONSUMER
            ? "active"
            : role === RolesEnum.VIGIL
              ? "pending"
              : undefined,
      },
    });

    if (error) {
      return genericError(error);
    }

    if (data?.user?.id) {
      const { data: userData, error: error_db } = await _admin
        .from(
          role === RolesEnum.CONSUMER
            ? "consumers"
            : role === RolesEnum.VIGIL
              ? "vigils"
              : ""
        )
        .insert({
          id: data.user.id,
          displayName: `${name} ${surname}`,
          status:
            role === RolesEnum.CONSUMER
              ? "active"
              : role === RolesEnum.VIGIL
                ? "pending"
                : undefined,
        })
        .select()
        .maybeSingle();

      if (error_db) {
        return genericError(error_db);
      }

      const { data: user, error } = await _admin.auth.admin.updateUserById(
        data?.user?.id,
        {
          user_metadata: {
            user_id: userData?.id,
          },
        }
      );

      if (error) {
        return genericError(error);
      }

      if (isReleased) {
        const { error: email_error } = await _admin.auth.resend({
          type: "signup",
          email,
          options: {
            emailRedirectTo: `${AppConstants.hostUrl}${Routes.login.url}`,
          },
        });
        if (email_error) {
          console.error("Error sending signup email", email_error);
        }
      }

      return NextResponse.json(
        {
          code: ResponseCodesConstants.USER_SIGNUP_SUCCESS.code,
          data: user,
          success: true,
        },
        { status: 200 }
      );
    } else {
      return genericError();
    }
  } catch (error) {
    return genericError(error);
  }
}
