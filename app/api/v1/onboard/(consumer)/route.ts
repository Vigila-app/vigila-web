import { RolesEnum } from "@/src/enums/roles.enums";
import { OnBoardType } from "@/src/types/onBoard.types";
import { NextResponse, NextRequest } from "next/server";
import { ResponseCodesConstants } from "@/src/constants";
import { initAdmin } from "@/server/supabaseAdmin";

export async function POST(req: NextRequest) {
  try {
    const body: OnBoardType = await req.json();
    console.log("API POST onboard", { ...body });
    const { birthdate, city, CAP } = body;
    if (!birthdate || !city || !CAP) {
      return NextResponse.json(
        {
          code: ResponseCodesConstants.USER_DETAILS_BAD_REQUEST.code,
          success: false,
        },
        { status: 400 }
      );
    }
    //region DB
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
    const {
      data: { user },
      error: authError,
    } = await _admin.auth.getUser(
      req.headers.get("authorization")?.replace("Bearer ", "") || ""
    );

    if (authError || !user) {
      return NextResponse.json(
        {
          code: ResponseCodesConstants.USER_DETAILS_UNAUTHORIZED.code,
          success: false,
        },
        { status: 401 }
      );
    }

    const userId = user.id;
    const role = user.user_metadata?.role;

    const table =
      role === "consumer" ? "consumers" : role === "vigil" ? "vigils" : null;
    if (!table) {
      return NextResponse.json(
        {
          code: ResponseCodesConstants.USER_DETAILS_BAD_REQUEST.code,
          success: false,
          message: "Invalid user role",
        },
        { status: 400 }
      );
    }

    const { error: updateError } = await _admin
      .from(table)
      .update({ birthdate, city, CAP })
      .eq("id", userId);

    if (updateError) {
      return NextResponse.json(
        {
          code: ResponseCodesConstants.USER_DETAILS_ERROR.code,
          success: false,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        code: ResponseCodesConstants.USER_DETAILS_SUCCESS.code,
        success: true,
        message: "User onboarding details updated successfully",
      },
      { status: 200 }
    );
    //end region DB
  } catch (error) {
    console.error("Error in onboard POST", error);
    return NextResponse.json(
      {
        code: ResponseCodesConstants.USER_DETAILS_ERROR.code,
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}
