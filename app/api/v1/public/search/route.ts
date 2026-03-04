import { getAdminClient, jsonErrorResponse } from "@/server/api.utils.server";
import { ResponseCodesConstants } from "@/src/constants";
import { NextRequest, NextResponse } from "next/server";
import altcha from "altcha-lib";

export async function POST(req: NextRequest) {
  try {
    const body: {
      captcha: string;
      postalCode: string;
      city?: string;
      lat?: number;
      lon?: number;
    } = await req.json();

    console.log(`API POST public/search`, {
      postalCode: body.postalCode,
      city: body.city,
    });

    if (!body?.captcha) {
      return jsonErrorResponse(400, {
        code: ResponseCodesConstants.PUBLIC_SEARCH_BAD_REQUEST.code,
        success: false,
        message: "Captcha mancante",
      });
    }

    if (!body?.postalCode && !body?.city) {
      return jsonErrorResponse(400, {
        code: ResponseCodesConstants.PUBLIC_SEARCH_BAD_REQUEST.code,
        success: false,
        message: "Inserisci un CAP o una città",
      });
    }

    // Validate altcha captcha
    const ok = await altcha.verifySolution(
      body.captcha,
      process.env.ALTCHA_HMAC_KEY as string
    );

    if (!ok) {
      return jsonErrorResponse(401, {
        code: ResponseCodesConstants.PUBLIC_SEARCH_BAD_REQUEST.code,
        success: false,
        message: "Captcha non valido",
      });
    }

    const _admin = getAdminClient();

    // Track search analytics
    const analyticsPayload: Record<string, unknown> = {
      postal_code: body.postalCode || null,
      city: body.city || null,
      lat: body.lat || null,
      lon: body.lon || null,
    };
    await _admin.from("search_analytics").insert(analyticsPayload);

    // Search for active services matching the postal code
    let db_query = _admin
      .from("services")
      .select(
        `
        id,
        name,
        vigil_id,
        postalCode,
        active,
        vigil:vigils(status)
      `
      )
      .eq("active", true);

    if (body.postalCode) {
      db_query = db_query.contains("postalCode", [body.postalCode]);
    }

    const { data: services, error } = await db_query;

    if (error) throw error;

    // Filter by active vigil status
    const activeServices = (services || []).filter(
      (s: any) => s.vigil?.status === "active"
    );

    // Extract unique service names
    const uniqueServiceNames = Array.from(
      new Set(activeServices.map((s: any) => s.name as string))
    );

    return NextResponse.json(
      {
        code: ResponseCodesConstants.PUBLIC_SEARCH_SUCCESS.code,
        success: true,
        data: {
          found: uniqueServiceNames.length > 0,
          services: uniqueServiceNames,
          postalCode: body.postalCode,
          city: body.city,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in public/search", error);
    return jsonErrorResponse(500, {
      code: ResponseCodesConstants.PUBLIC_SEARCH_ERROR.code,
      success: false,
    });
  }
}
