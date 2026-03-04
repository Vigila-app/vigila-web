import {
  authenticateUser,
  getAdminClient,
  getPagination,
  jsonErrorResponse,
} from "@/server/api.utils.server";
import { ResponseCodesConstants } from "@/src/constants";
import { RolesEnum } from "@/src/enums/roles.enums";
import { NextRequest, NextResponse } from "next/server";
import altcha from "altcha-lib";

export type NoticeBoardI = {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  message: string;
  postal_code: string;
  city?: string;
  service_type?: string;
  status: "active" | "closed";
  created_at: Date;
  updated_at?: Date;
};

// POST /api/v1/notice-board - Public: create a new notice (protected by Altcha)
// GET  /api/v1/notice-board - Authenticated VIGILs: list active notices

export async function GET(req: NextRequest) {
  try {
    const userObject = await authenticateUser(req);
    if (
      !userObject?.id ||
      userObject.user_metadata?.role !== RolesEnum.VIGIL
    ) {
      return jsonErrorResponse(401, {
        code: ResponseCodesConstants.NOTICE_BOARD_UNAUTHORIZED.code,
        success: false,
      });
    }

    const { nextUrl } = req;
    const pagination = getPagination(nextUrl);
    const { from, to, page, itemPerPage } = pagination;

    const _admin = getAdminClient();

    const { data, error, count } = await _admin
      .from("notice_board")
      .select("*", { count: "exact" })
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) throw error;

    return NextResponse.json(
      {
        code: ResponseCodesConstants.NOTICE_BOARD_SUCCESS.code,
        success: true,
        data: data || [],
        pagination: {
          page,
          pages: Math.ceil((count || 0) / itemPerPage),
          itemPerPage,
          count,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in GET notice-board", error);
    return jsonErrorResponse(500, {
      code: ResponseCodesConstants.NOTICE_BOARD_ERROR.code,
      success: false,
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body: {
      captcha: string;
      name: string;
      email?: string;
      phone?: string;
      message: string;
      postal_code: string;
      city?: string;
      service_type?: string;
    } = await req.json();

    console.log(`API POST notice-board`, {
      postal_code: body.postal_code,
      city: body.city,
    });

    if (!body?.captcha) {
      return jsonErrorResponse(400, {
        code: ResponseCodesConstants.NOTICE_BOARD_BAD_REQUEST.code,
        success: false,
        message: "Captcha mancante",
      });
    }

    if (!body?.name || !body?.postal_code || !body?.message) {
      return jsonErrorResponse(400, {
        code: ResponseCodesConstants.NOTICE_BOARD_BAD_REQUEST.code,
        success: false,
        message: "Nome, CAP e messaggio sono obbligatori",
      });
    }

    // Validate altcha captcha
    const ok = await altcha.verifySolution(
      body.captcha,
      process.env.ALTCHA_HMAC_KEY as string
    );

    if (!ok) {
      return jsonErrorResponse(401, {
        code: ResponseCodesConstants.NOTICE_BOARD_BAD_REQUEST.code,
        success: false,
        message: "Captcha non valido",
      });
    }

    const _admin = getAdminClient();

    const { data, error } = await _admin
      .from("notice_board")
      .insert({
        name: body.name,
        email: body.email || null,
        phone: body.phone || null,
        message: body.message,
        postal_code: body.postal_code,
        city: body.city || null,
        service_type: body.service_type || null,
        status: "active",
      })
      .select()
      .maybeSingle();

    if (error) throw error;

    return NextResponse.json(
      {
        code: ResponseCodesConstants.NOTICE_BOARD_SUCCESS.code,
        success: true,
        data,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in POST notice-board", error);
    return jsonErrorResponse(500, {
      code: ResponseCodesConstants.NOTICE_BOARD_ERROR.code,
      success: false,
    });
  }
}
