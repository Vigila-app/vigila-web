import { jsonErrorResponse } from "@/server/api.utils.server";
import { ResponseCodesConstants } from "@/src/constants";
import { NextResponse } from "next/server";
import altcha from "altcha-lib";

export async function POST(req: Request) {
  try {
    const body: { captcha: string } = await req.json();
    console.log(`API POST altcha/validate`, !!body.captcha);

    if (!body?.captcha) {
      return jsonErrorResponse(400, {
        code: ResponseCodesConstants.ALTCHA_VALIDATE_BAD_REQUEST.code,
        success: false,
      });
    }

    // Validate captcha
    const ok = await altcha.verifySolution(
      body.captcha,
      process.env.ALTCHA_HMAC_KEY as string
    );

    // If captcha is false, return failed challenge
    if (!ok)
      return jsonErrorResponse(401, {
        code: ResponseCodesConstants.ALTCHA_VALIDATE_ERROR.code,
        message: "Captcha challenge failed",
        success: false,
      });

    return NextResponse.json(
      {
        code: ResponseCodesConstants.ALTCHA_VALIDATE_SUCCESS.code,
        data: "Captcha completed",
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    return jsonErrorResponse(500, {
      code: ResponseCodesConstants.ALTCHA_VALIDATE_ERROR.code,
      success: false,
      error,
    });
  }
}
