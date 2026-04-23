import { NextRequest, NextResponse } from "next/server";
import {
  authenticateUser,
  getAdminClient,
  jsonErrorResponse,
} from "@/server/api.utils.server";
import { RolesEnum } from "@/src/enums/roles.enums";
import { ResponseCodesConstants } from "@/src/constants";

export async function GET(req: NextRequest) {
  try {
    console.log(`API GET admin/vigil-candidati`);

    const userObject = await authenticateUser(req);
    if (!userObject?.id || userObject.user_metadata?.role !== RolesEnum.ADMIN) {
      return jsonErrorResponse(403, {
        code: ResponseCodesConstants.VIGIL_CANDIDATI_LIST_FORBIDDEN.code,
        success: false,
      });
    }

    const _admin = getAdminClient();

    const { data, error, count } = await _admin
      .from("vigil_candidati")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json({
      code: ResponseCodesConstants.VIGIL_CANDIDATI_LIST_SUCCESS.code,
      data: data || [],
      count,
      success: true,
    });
  } catch (error) {
    console.error("Admin vigil-candidati GET error:", error);
    return jsonErrorResponse(500, {
      code: ResponseCodesConstants.VIGIL_CANDIDATI_LIST_ERROR.code,
      success: false,
      error,
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    console.log(`API POST admin/vigil-candidati`);

    const userObject = await authenticateUser(req);
    if (!userObject?.id || userObject.user_metadata?.role !== RolesEnum.ADMIN) {
      return jsonErrorResponse(403, {
        code: ResponseCodesConstants.VIGIL_CANDIDATI_CREATE_FORBIDDEN.code,
        success: false,
      });
    }

    const body = await req.json();

    // Support both single candidate and batch import
    const candidati = Array.isArray(body) ? body : [body];

    if (!candidati.length) {
      return jsonErrorResponse(400, {
        code: ResponseCodesConstants.VIGIL_CANDIDATI_CREATE_BAD_REQUEST.code,
        success: false,
      });
    }

    for (const c of candidati) {
      if (!c.nome || !c.cognome || !c.email) {
        return jsonErrorResponse(400, {
          code: ResponseCodesConstants.VIGIL_CANDIDATI_CREATE_BAD_REQUEST.code,
          success: false,
          error: `Missing required fields (nome, cognome, email) for entry: ${JSON.stringify(c)}`,
        });
      }
    }

    const _admin = getAdminClient();
    const now = new Date().toISOString();

    const insertData = candidati.map((c) => ({
      nome: c.nome,
      cognome: c.cognome,
      email: c.email,
      telefono: c.telefono ?? null,
      citta: c.citta ?? null,
      cap: c.cap ?? null,
      note: c.note ?? null,
      status: "pending",
      created_at: now,
    }));

    const { data, error } = await _admin
      .from("vigil_candidati")
      .upsert(insertData, { onConflict: "email", ignoreDuplicates: false })
      .select();

    if (error) {
      throw error;
    }

    return NextResponse.json({
      code: ResponseCodesConstants.VIGIL_CANDIDATI_CREATE_SUCCESS.code,
      data,
      imported: data?.length ?? 0,
      success: true,
    });
  } catch (error) {
    console.error("Admin vigil-candidati POST error:", error);
    return jsonErrorResponse(500, {
      code: ResponseCodesConstants.VIGIL_CANDIDATI_CREATE_ERROR.code,
      success: false,
      error,
    });
  }
}
