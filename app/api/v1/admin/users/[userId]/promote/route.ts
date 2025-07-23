import { NextRequest, NextResponse } from "next/server";
import {
  authenticateUser,
  getAdminClient,
  jsonErrorResponse,
} from "@/server/api.utils.server";
import { RolesEnum } from "@/src/enums/roles.enums";
import { deepMerge } from "@/src/utils/common.utils";

export async function PUT(
  req: NextRequest,
  context: { params: { userId: string } }
) {
  try {
    const { userId } = await context.params;
    const { data: body } = await req.json();
    console.log(`API PUT admin/users/${userId}/promote`, body);

    // Verifica che la richiesta arrivi solo da localhost
    const forwarded = req.headers.get("x-forwarded-for");
    const realIp = req.headers.get("x-real-ip");
    const host = req.headers.get("host");

    const isLocalhost =
      host?.includes("localhost") ||
      host?.includes("127.0.0.1") ||
      realIp === "127.0.0.1" ||
      realIp === "::1" ||
      forwarded?.includes("127.0.0.1") ||
      forwarded?.includes("::1") ||
      process.env.NODE_ENV === "development"; // Permetti in sviluppo

    if (!isLocalhost) {
      return jsonErrorResponse(403, {
        code: "ADMIN_PROMOTE_FORBIDDEN_EXTERNAL",
        success: false,
        message: "Questa API è accessibile solo da localhost",
      });
    }

    if (!userId) {
      return jsonErrorResponse(400, {
        code: "ADMIN_PROMOTE_BAD_REQUEST",
        success: false,
        message: "User ID richiesto",
      });
    }

    // Verifica autenticazione dell'utente che fa la richiesta
    const requestingUser = await authenticateUser(req);
    // if (!requestingUser?.id || requestingUser.user_metadata?.role !== RolesEnum.ADMIN) {
    //   return jsonErrorResponse(403, {
    //     code: "ADMIN_PROMOTE_UNAUTHORIZED",
    //     success: false,
    //     message: "Solo gli admin possono promuovere altri utenti"
    //   });
    // }

    const _admin = getAdminClient();

    // Verifica che l'utente target esista
    const { data: existingUser, error: userError } =
      await _admin.auth.admin.getUserById(userId);

    if (userError || !existingUser.user) {
      return jsonErrorResponse(404, {
        code: "ADMIN_PROMOTE_USER_NOT_FOUND",
        success: false,
        message: "Utente non trovato",
      });
    }

    // Verifica se l'utente è già admin
    if (existingUser.user.user_metadata?.role === RolesEnum.ADMIN) {
      return jsonErrorResponse(500, {
        code: "ADMIN_PROMOTE_ALREADY_ADMIN",
        success: false,
        message: "L'utente è già un amministratore",
      });
    }

    // Aggiorna l'utente per renderlo admin
    const { error: updateError } = await _admin.auth.admin.updateUserById(
      userId,
      {
        user_metadata: {
          ...deepMerge(existingUser.user.user_metadata, body),
          role: RolesEnum.ADMIN,
          promotedAt: new Date().toISOString(),
          promotedBy: requestingUser?.id || "unknown",
        },
      }
    );

    if (updateError) {
      throw updateError;
    }

    // Log dell'operazione per audit
    console.log(
      `User ${userId} promoted to ADMIN by ${
        requestingUser?.id
      } at ${new Date().toISOString()}`
    );

    return NextResponse.json({
      code: "ADMIN_PROMOTE_SUCCESS",
      success: true,
      message: "Utente promosso ad amministratore con successo",
      data: {
        userId: userId,
        previousRole: existingUser.user.user_metadata?.role || "UNKNOWN",
        newRole: RolesEnum.ADMIN,
        promotedBy: requestingUser?.id,
        promotedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Admin promote user error:", error);
    return jsonErrorResponse(500, {
      code: "ADMIN_PROMOTE_ERROR",
      success: false,
      error: error instanceof Error ? error.message : String(error),
      message: "Errore durante la promozione dell'utente",
    });
  }
}
