import { jsonErrorResponse } from "@/server/api.utils.server";
import { ResponseCodesConstants } from "@/src/constants";
import { NextResponse } from "next/server";
import altcha from "altcha-lib";

export async function GET() {
  try {
    console.log(`API GET altcha/challange`);

    const challenge = await altcha.createChallenge({
      hmacKey: process.env.ALTCHA_HMAC_KEY as string,
      maxNumber: 100000,
    });

    return NextResponse.json(challenge, { status: 200 });
  } catch (error) {
    return jsonErrorResponse(500, {
      code: ResponseCodesConstants.ALTCHA_CHALLANGE_ERROR.code,
      success: false,
      error,
      message: process.env.ALTCHA_HMAC_KEY || "unreadable_key",
    });
  }
}
