import {
  authenticateUser,
  getAdminClient,
  jsonErrorResponse,
} from "@/server/api.utils.server";
import { ResponseCodesConstants } from "@/src/constants";
import { RolesEnum } from "@/src/enums/roles.enums";
import { ServiceCatalogTypeEnum } from "@/src/enums/services.enums";
import { AppConstants } from "@/src/constants";
import { Routes } from "@/src/routes";
import { EmailService } from "@/server/email.service";
import { NextRequest, NextResponse } from "next/server";

const SERVICE_TYPE_LABELS: Record<string, string> = {
  [ServiceCatalogTypeEnum.COMPANIONSHIP]: "Compagnia e conversazione",
  [ServiceCatalogTypeEnum.LIGHT_ASSISTANCE]: "Assistenza leggera",
  [ServiceCatalogTypeEnum.MEDICAL_ASSISTANCE]: "Assistenza medica",
  [ServiceCatalogTypeEnum.HOUSE_KEEPING]: "Lavori domestici",
  [ServiceCatalogTypeEnum.TRANSPORTATION]: "Accompagnamento in auto",
  [ServiceCatalogTypeEnum.SPECIALIZED_CARE]: "Cura specializzata",
};

/**
 * POST /api/v1/notice-board/[noticeId]/propose
 *
 * Called by a VIGIL to propose themselves for a notice board request.
 * - Marks the notice as "proposed" and records the vigil_id
 * - Sends an email to the notice creator inviting them to register
 *   and complete the booking via the platform
 */
export async function POST(
  req: NextRequest,
  context: { params: Promise<{ noticeId: string }> }
) {
  try {
    const { noticeId } = await context.params;

    if (!noticeId) {
      return jsonErrorResponse(400, {
        code: ResponseCodesConstants.NOTICE_BOARD_BAD_REQUEST.code,
        success: false,
      });
    }

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

    const _admin = getAdminClient();

    // Fetch the notice
    const { data: notice, error: noticeError } = await _admin
      .from("notice_board")
      .select("*")
      .eq("id", noticeId)
      .eq("status", "active")
      .maybeSingle();

    if (noticeError || !notice) {
      return jsonErrorResponse(404, {
        code: ResponseCodesConstants.NOTICE_BOARD_BAD_REQUEST.code,
        success: false,
        message: "Annuncio non trovato o non più disponibile",
      });
    }

    // Fetch the VIGIL's profile for the email
    const { data: vigilProfile } = await _admin
      .from("vigils")
      .select("displayName, name, surname")
      .eq("id", userObject.id)
      .maybeSingle();

    const vigilName =
      vigilProfile?.displayName ||
      [vigilProfile?.name, vigilProfile?.surname].filter(Boolean).join(" ") ||
      "Un Vigil";

    // Mark notice as proposed and record which VIGIL proposed
    const { error: updateError } = await _admin
      .from("notice_board")
      .update({ status: "proposed", vigil_id: userObject.id })
      .eq("id", noticeId);

    if (updateError) throw updateError;

    const serviceLabel =
      SERVICE_TYPE_LABELS[notice.service_type] || notice.service_type;
    const zone = notice.city || notice.postal_code;
    const redirectUserTo = encodeURIComponent(Routes.homeConsumer.url);
    const registrationUrl = `${AppConstants.hostUrl}/auth/registration/consumer?redirectUserTo=${redirectUserTo}`;
    const loginUrl = `${AppConstants.hostUrl}/auth/login?redirectUserTo=${redirectUserTo}`;

    // Send email notification to the notice creator using the dedicated template
    try {
      await EmailService.sendNoticeBoardProposalEmail({
        to: notice.email,
        recipientName: notice.name,
        vigilName,
        serviceLabel,
        zone,
        registrationUrl,
        loginUrl,
      });
    } catch (emailError) {
      // Log but don't fail the request if email sending fails
      console.error("Failed to send proposal notification email:", emailError);
    }

    return NextResponse.json(
      {
        code: ResponseCodesConstants.NOTICE_BOARD_SUCCESS.code,
        success: true,
        message: "Proposta inviata con successo",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in POST notice-board/propose", error);
    return jsonErrorResponse(500, {
      code: ResponseCodesConstants.NOTICE_BOARD_ERROR.code,
      success: false,
    });
  }
}
