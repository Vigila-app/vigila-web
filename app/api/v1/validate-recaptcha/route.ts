import { NextResponse } from "next/server";
import { ApiService } from "@/src/services/api.service";
import { FirebaseConstants } from "@/src/constants/supabase.constants";
import { ResponseCodesConstants } from "@/src/constants";

const requestHandler = async (req: Request) => {
  const { method } = req;

  console.log(`API ${method} validate-recaptcha`);

  switch (method) {
    case "POST": {
      try {
        const body = await req.json();
        if (!body) {
          return NextResponse.json(
            {
              code: ResponseCodesConstants.RECAPTCHA_VALIDATE_BAD_REQUEST.code,
              success: false,
            },
            { status: 400 }
          );
        }
        const response = await ApiService.post(
          `https://recaptchaenterprise.googleapis.com/v1/projects/${FirebaseConstants.appCheckProjectId}/assessments?key=${FirebaseConstants.appCheckApiKey}`,
          body
        );

        return NextResponse.json(
          {
            code: ResponseCodesConstants.RECAPTCHA_VALIDATE_SUCCESS.code,
            data: response,
            success: true,
          },
          { status: 200 }
        );
      } catch (error) {
        return NextResponse.json(
          {
            code: ResponseCodesConstants.RECAPTCHA_VALIDATE_ERROR.code,
            success: false,
            error,
          },
          { status: 500 }
        );
      }
      break;
    }
    default: {
      return NextResponse.json(
        {
          code: ResponseCodesConstants.RECAPTCHA_VALIDATE_METHOD_NOT_ALLOWED
            .code,
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
