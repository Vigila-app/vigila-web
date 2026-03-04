import {
  authenticateUser,
  getAdminClient,
  getPagination,
  jsonErrorResponse,
} from "@/server/api.utils.server";
import { ResponseCodesConstants } from "@/src/constants";
import { RolesEnum } from "@/src/enums/roles.enums";
import { ServiceCatalogTypeEnum } from "@/src/enums/services.enums";
import { NextRequest, NextResponse } from "next/server";
import altcha from "altcha-lib";

export type NoticeBoardI = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message?: string;
  postal_code: string;
  city?: string;
  service_type: string;
  status: "active" | "proposed" | "closed";
  vigil_id?: string;
  created_at: Date;
  updated_at?: Date;
};

const VALID_SERVICE_TYPES = Object.values(ServiceCatalogTypeEnum) as string[];

// POST /api/v1/notice-board - Public: create a new notice (protected by Altcha)
// GET  /api/v1/notice-board - Authenticated VIGILs: list active notices in their covered zones

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

    // Fetch VIGIL's covered postal codes from their profile
    const { data: vigilProfile } = await _admin
      .from("vigils")
      .select("cap")
      .eq("id", userObject.id)
      .maybeSingle();

    const vigilCaps: string[] = Array.isArray(vigilProfile?.cap)
      ? vigilProfile.cap
      : [];

    let db_query = _admin
      .from("notice_board")
      .select("*", { count: "exact" })
      .eq("status", "active")
      .order("created_at", { ascending: false });

    // Filter notices to only those in the VIGIL's covered zones
    if (vigilCaps.length > 0) {
      db_query = db_query.in("postal_code", vigilCaps);
    }

    const { data, error, count } = await db_query.range(from, to);

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
      email: string;
      phone?: string;
      message?: string;
      postal_code: string;
      city?: string;
      service_type: string;
    } = await req.json();

    console.log(`API POST notice-board`, {
      postal_code: body.postal_code,
      city: body.city,
      service_type: body.service_type,
    });

    if (!body?.captcha) {
      return jsonErrorResponse(400, {
        code: ResponseCodesConstants.NOTICE_BOARD_BAD_REQUEST.code,
        success: false,
        message: "Captcha mancante",
      });
    }

    if (!body?.name || !body?.email || !body?.postal_code) {
      return jsonErrorResponse(400, {
        code: ResponseCodesConstants.NOTICE_BOARD_BAD_REQUEST.code,
        success: false,
        message: "Nome, email e CAP sono obbligatori",
      });
    }

    if (!body?.service_type || !VALID_SERVICE_TYPES.includes(body.service_type)) {
      return jsonErrorResponse(400, {
        code: ResponseCodesConstants.NOTICE_BOARD_BAD_REQUEST.code,
        success: false,
        message: "Tipo di servizio non valido",
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
        email: body.email,
        phone: body.phone || null,
        message: body.message || null,
        postal_code: body.postal_code,
        city: body.city || null,
        service_type: body.service_type,
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
