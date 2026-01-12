import { initAdmin } from "@/server/supabaseAdmin";
import { ResponseCodesConstants } from "@/src/constants";
import {
  AccessLevelsEnum,
  RolesEnum,
  UserStatusEnum,
} from "@/src/enums/roles.enums";
import { jsonErrorResponse } from "@/server/api.utils.server";
import { NextRequest, NextResponse } from "next/server";

import { mergeGoogleAndFormData } from "@/src/utils/common.utils";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log(`API POST auth/complete-google`, body);

    // NOTA: Non chiediamo più name/surname al frontend, li calcoliamo da Google
    const { role, terms } = body;

    // ------------------------------------------------------------------
    // 1. SICUREZZA: IDENTIFICAZIONE UTENTE TRAMITE TOKEN (USING ADMIN CLIENT)
    // ------------------------------------------------------------------
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return jsonErrorResponse(401, {
        success: false,
        code: "Missing Authorization Header",
      });
    }

    const accessToken = authHeader.replace(/^Bearer\s+/i, "").trim();

    const _admin = initAdmin();
    if (!_admin) {
      return NextResponse.json(
        { code: "SERVICE_UNAVAILABLE", success: false },
        { status: 503 }
      );
    }

    const {
      data: { user },
      error: userError,
    } = await _admin.auth.getUser(accessToken);

    if (userError || !user) {
      return jsonErrorResponse(401, {
        success: false,
        code: "Unauthorized / Invalid Token",
      });
    }

    const userId = user.id;
    const googleRawMeta = user.user_metadata || {};

    // ------------------------------------------------------------------
    // 2. VALIDAZIONE INPUT
    // ------------------------------------------------------------------
    if (!terms) {
      return NextResponse.json(
        {
          code: "BAD_REQUEST",
          success: false,
          error: "Terms must be accepted",
        },
        { status: 400 }
      );
    }

    if (role !== RolesEnum.CONSUMER && role !== RolesEnum.VIGIL) {
      return NextResponse.json(
        { code: "BAD_REQUEST", success: false, error: "Invalid Role" },
        { status: 400 }
      );
    }

    // ------------------------------------------------------------------
    // 3. PREPARAZIONE DATI (FUSIONE)
    // ------------------------------------------------------------------
    // Qui usiamo la utility per creare un oggetto identico a quello del Sign-up diretto
    const cleanMetadata = mergeGoogleAndFormData(googleRawMeta, {
      role,
      terms,
      userId,
    });

    
    // ------------------------------------------------------------------
    // 4. UPDATE AUTH METADATA (auth.users)
    // ------------------------------------------------------------------
    const { error: authError } = await _admin.auth.admin.updateUserById(
      userId,
      {
        user_metadata: cleanMetadata,
      }
    );

    if (authError) {
      console.error("Error updating auth metadata:", authError);
      return jsonErrorResponse(500, {
        success: false,
        code: authError.message,
      });
    }

    // ------------------------------------------------------------------
    // 5. UPDATE DB PUBBLICO (consumers / vigils)
    // ------------------------------------------------------------------

    // Replicato dal tuo codice user/signup: inseriamo solo id, displayName, status.
    const { error: dbError } = await _admin
      .from(
        role === RolesEnum.CONSUMER
          ? "consumers"
          : role === RolesEnum.VIGIL
            ? "vigils"
            : ""
      )
      .upsert({
        id: userId,
        displayName: cleanMetadata.displayName,
        status: UserStatusEnum.PENDING,
      });

    if (dbError) {
      console.error("Error updating public table:", dbError);
      // Nota: idealmente qui servirebbe un rollback, ma per ora va bene così
      return jsonErrorResponse(500, { success: false, code: dbError.message });
    }

    return NextResponse.json(
      {
        code: ResponseCodesConstants.USER_SIGNUP_SUCCESS?.code || "SUCCESS",
        success: true,
        message: "Google profile completed successfully",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("API Error:", error);
    return jsonErrorResponse(500, { success: false, code: error.message });
  }
}
