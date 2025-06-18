import { NextResponse } from "next/server";
import { ResponseCodesConstants } from "@/src/constants";


export async function GET() {
  try {
  
    return NextResponse.json(
      {
        // code: ResponseCodesConstants.DEFAULT_SUCCESS.code,
        data: { message: "API di prova funzionante!" },
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        // code: ResponseCodesConstants.DEFAULT_ERROR.code,
        success: false,
        message: "Si è verificato un errore",
      },
      { status: 500 }
    );
  }
}