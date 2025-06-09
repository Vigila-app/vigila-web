import { initAdmin } from "@/server/supabaseAdmin";
import { AppConstants, ResponseCodesConstants } from "@/src/constants";
import { AuthService } from "@/src/services";
import { NextResponse } from "next/server";

const requestHandler = async (req: Request) => {
  const { method } = req;

  console.log(`API ${method} user/signup`);

  const { authToken, user } = AuthService.getAuthHeaders(req.headers);

  if (user || authToken) {
    return NextResponse.json(
      {
        code: ResponseCodesConstants.USER_SIGNUP_FORBIDDEN.code,
        success: false,
      },
      { status: 403 }
    );
  }

  switch (method) {
    case "POST": {
      const genericError = (error: any = undefined) =>
        NextResponse.json(
          {
            code: ResponseCodesConstants.USER_SIGNUP_ERROR.code,
            error,
            success: false,
          },
          { status: 500 }
        );

      try {
        const { email, password, name, surname, terms } = await req.json();
        if (!(email && password && name && surname && terms)) {
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

          // TODO review this part
          email_confirm: true,

          user_metadata: {
            name,
            surname,
            displayName: `${name} ${surname}`,
            terms,
            role: AppConstants.defaultUserRole,
            level: AppConstants.defaultUserLevel,
          },
        });

        if (error) {
          return genericError(error);
        }

        if (data?.user?.id) {
          const { data: host, error: error_db } = await _admin
            .from("hosts")
            .insert({
              user_id: data.user.id,
              id: data.user.id,
              status: "active",
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
                host_id: host?.id,
              },
            }
          );

          if (error) {
            return genericError(error);
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
      break;
    }
    default: {
      return NextResponse.json(
        {
          code: ResponseCodesConstants.USER_SIGNUP_METHOD_NOT_ALLOWED.code,
          success: false,
        },
        { status: 405 }
      );
      break;
    }
  }
};

export async function POST(req: Request) {
  return requestHandler(req);
}
