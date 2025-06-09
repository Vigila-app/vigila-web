import { NextResponse } from "next/server";

import { AuthService } from "@/src/services";
import { ResponseCodesConstants } from "@/src/constants";
import { SupabaseConstants } from "@/src/constants/supabase.constants";
import { initAdmin, validateAuth } from "@/server/supabaseAdmin";
import { User } from "@supabase/supabase-js";
import { RolesEnum } from "@/src/enums/roles.enums";

const unauthorizedError = () =>
  NextResponse.json(
    {
      code: ResponseCodesConstants.USER_DETAILS_UNAUTHORIZED.code,
      success: false,
    },
    { status: 401 }
  );

const requestHandler = async (
  req: Request,
  context: { params: { id: string } }
) => {
  const genericError = (
    error: any = undefined,
    code = ResponseCodesConstants.USER_DETAILS_ERROR.code,
    show = true
  ) =>
    NextResponse.json(
      {
        code,
        success: false,
        show,
        error,
      },
      { status: 500 }
    );
  try {
    const { method } = req;
    const {
      params: { id },
    } = context;

    console.log(`API ${method} user/${id}`);

    const { authToken, user } = AuthService.getAuthHeaders(req.headers);

    if (!authToken || !user || !id || id !== user) {
      return unauthorizedError();
    }

    const userObject = (await validateAuth(user, authToken)) as User;

    if (
      userObject.user_metadata.role !== RolesEnum.HOST &&
      userObject.user_metadata.role !== RolesEnum.MERCHANT &&
      userObject.user_metadata.role !== RolesEnum.ADMIN
    ) {
      return NextResponse.json(
        {
          code: ResponseCodesConstants.USER_DETAILS_FORBIDDEN.code,
          success: false,
        },
        { status: 403 }
      );
    }

    switch (method) {
      case "GET": {
        try {
          const response = await fetch(
            `${SupabaseConstants.authDomain}/auth/v1/user`,
            {
              method: "GET",
              headers: {
                Apikey: SupabaseConstants.apiKey,
                Authorization: `Bearer ${authToken}`,
              },
            }
          );
          const data = await response.json();
          if (data) {
            return NextResponse.json(
              {
                code: ResponseCodesConstants.USER_DETAILS_SUCCESS.code,
                data,
                success: true,
              },
              { status: 200 }
            );
          } else {
            return NextResponse.json(
              {
                code: ResponseCodesConstants.USER_DETAILS_ERROR.code,
                success: false,
                show: true,
              },
              { status: 500 }
            );
          }
        } catch (error) {
          return NextResponse.json(
            {
              code: ResponseCodesConstants.USER_DETAILS_ERROR.code,
              success: false,
              show: true,
            },
            { status: 500 }
          );
        }
        break;
      }
      case "PUT": {
        try {
          const body = await req.json();
          if (!body || !body?.data) {
            return NextResponse.json(
              {
                code: ResponseCodesConstants.USER_DETAILS_BAD_REQUEST.code,
                success: false,
              },
              { status: 400 }
            );
          }

          if (
            body.data?.displayName ||
            (body.data?.name && body.data?.surname)
          ) {
            body.data.displayName =
              body.data?.displayName ||
              `${body.data?.name} ${body.data?.surname}`;
          }

          await fetch(`${SupabaseConstants.authDomain}/auth/v1/user`, {
            method: "PUT",
            headers: {
              Apikey: SupabaseConstants.apiKey,
              Authorization: `Bearer ${authToken}`,
            },
            body: JSON.stringify(body),
          });

          return NextResponse.json(
            {
              code: ResponseCodesConstants.USER_DETAILS_SUCCESS.code,
              success: true,
            },
            { status: 200 }
          );
        } catch (error) {
          return NextResponse.json(
            {
              code: ResponseCodesConstants.USER_DETAILS_ERROR.code,
              success: false,
              error,
            },
            { status: 500 }
          );
        }
        break;
      }
      case "DELETE": {
        try {
          // TODO use admin supabase to delete user
          const admin = initAdmin();

          if (admin) {
          }

          return NextResponse.json(
            {
              code: ResponseCodesConstants.USER_DELETE_ERROR.code,
              success: false,
            },
            { status: 500 }
          );
        } catch (error) {
          return NextResponse.json(
            {
              code: ResponseCodesConstants.USER_DELETE_ERROR.code,
              success: false,
            },
            { status: 500 }
          );
        }
        break;
      }
      default: {
        return NextResponse.json(
          {
            code: ResponseCodesConstants.USER_DETAILS_METHOD_NOT_ALLOWED.code,
            success: false,
          },
          { status: 405 }
        );
        break;
      }
    }
  } catch (error) {
    return genericError(error);
  }
};

export async function GET(req: Request, context: { params: { id: string } }) {
  return requestHandler(req, context);
}

export async function PUT(req: Request, context: { params: { id: string } }) {
  return requestHandler(req, context);
}

export async function DELETE(
  req: Request,
  context: { params: { id: string } }
) {
  return requestHandler(req, context);
}
