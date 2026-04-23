import { NextRequest, NextResponse } from "next/server";
import {
  authenticateUser,
  getAdminClient,
  jsonErrorResponse,
} from "@/server/api.utils.server";
import { EmailService } from "@/server/email.service";
import { RolesEnum } from "@/src/enums/roles.enums";
import { ResponseCodesConstants, AppConstants } from "@/src/constants";
import { Routes } from "@/src/routes";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ candidatoId: string }> }
) {
  try {
    const { candidatoId } = await context.params;
    console.log(`API POST admin/vigil-candidati/${candidatoId}/invite`);

    const userObject = await authenticateUser(req);
    if (!userObject?.id || userObject.user_metadata?.role !== RolesEnum.ADMIN) {
      return jsonErrorResponse(403, {
        code: ResponseCodesConstants.VIGIL_CANDIDATI_INVITE_FORBIDDEN.code,
        success: false,
      });
    }

    if (!candidatoId) {
      return jsonErrorResponse(400, {
        code: ResponseCodesConstants.VIGIL_CANDIDATI_INVITE_BAD_REQUEST.code,
        success: false,
      });
    }

    const _admin = getAdminClient();

    const { data: candidato, error: fetchError } = await _admin
      .from("vigil_candidati")
      .select("*")
      .eq("id", candidatoId)
      .maybeSingle();

    if (fetchError) throw fetchError;

    if (!candidato) {
      return jsonErrorResponse(404, {
        code: ResponseCodesConstants.VIGIL_CANDIDATI_INVITE_NOT_FOUND.code,
        success: false,
      });
    }

    // Generate a magic link via Supabase for the candidate's email
    const { data: linkData, error: linkError } =
      await _admin.auth.admin.generateLink({
        type: "magiclink",
        email: candidato.email,
        options: {
          redirectTo: `${AppConstants.hostUrl}${Routes.vigilActivate.url}`,
        },
      });

    if (linkError) throw linkError;

    // The Supabase admin generateLink response includes `properties.action_link`
    // for the actual magic link URL. We use type-safe optional chaining here.
    const linkProperties = (linkData as { properties?: { action_link?: string } } | null)?.properties;
    const activationLink = linkProperties?.action_link ?? "";

    if (!activationLink) {
      return jsonErrorResponse(500, {
        code: ResponseCodesConstants.VIGIL_CANDIDATI_INVITE_ERROR.code,
        success: false,
        error: "Failed to generate activation link",
      });
    }

    // Send invitation email
    await EmailService.sendVigilInvitationEmail({
      to: candidato.email,
      subject: "Sei stato/a selezionato/a come Vigil 🧡",
      nome: candidato.nome,
      cognome: candidato.cognome,
      activationLink,
    });

    // Update candidate status to "invited"
    const { error: updateError } = await _admin
      .from("vigil_candidati")
      .update({ status: "invited", invited_at: new Date().toISOString() })
      .eq("id", candidatoId);

    if (updateError) throw updateError;

    return NextResponse.json({
      code: ResponseCodesConstants.VIGIL_CANDIDATI_INVITE_SUCCESS.code,
      success: true,
    });
  } catch (error) {
    console.error("Admin vigil-candidati invite error:", error);
    return jsonErrorResponse(500, {
      code: ResponseCodesConstants.VIGIL_CANDIDATI_INVITE_ERROR.code,
      success: false,
      error,
    });
  }
}
