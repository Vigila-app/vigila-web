import {
  authenticateUser,
  getAdminClient,
  jsonErrorResponse,
} from "@/server/api.utils.server";
import { ResponseCodesConstants } from "@/src/constants";
import { RolesEnum } from "@/src/enums/roles.enums";
import { AppConstants } from "@/src/constants";
import { Routes } from "@/src/routes";
import { EmailService } from "@/server/email.service";
import {
  BookingStatusEnum,
  PaymentStatusEnum,
} from "@/src/enums/booking.enums";
import { replaceDynamicUrl } from "@/src/utils/common.utils";
import { ServicesService } from "@/src/services/services.service";
import { NextRequest, NextResponse } from "next/server";

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

    // Look up label and catalog metadata from the central ServiceCatalog
    const catalogItem = ServicesService.getServicesByType(notice.service_type);
    const serviceLabel = catalogItem?.name || notice.service_type;
    const zone = notice.city || notice.postal_code;

    // Create a PENDING booking for the VIGIL's matching service
    let bookingId: string | null = null;
    if (catalogItem) {
      const { data: vigilService } = await _admin
        .from("services")
        .select("id, unit_price")
        .eq("vigil_id", userObject.id)
        .eq("active", true)
        .filter("info->>catalog_id", "eq", String(catalogItem.id))
        .maybeSingle();

      if (vigilService) {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() + 1);
        const quantity = catalogItem.minimum_duration_hours || 1;
        const endDate = new Date(
          startDate.getTime() + quantity * 3600 * 1000
        );
        const { data: newBooking } = await _admin
          .from("bookings")
          .insert({
            vigil_id: userObject.id,
            service_id: vigilService.id,
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
            quantity,
            price: (vigilService.unit_price + catalogItem.fee) * quantity,
            fee: catalogItem.fee * quantity,
            status: BookingStatusEnum.PENDING_NOTICE_PROPOSAL,
            payment_status: PaymentStatusEnum.PENDING,
            note: `notice_board:${noticeId}`,
          })
          .select("id")
          .maybeSingle();
        if (newBooking?.id) bookingId = newBooking.id;
      }
    }

    // Build redirect URL pointing to the pending booking (or consumer home as fallback)
    const redirectPath = bookingId
      ? replaceDynamicUrl(Routes.bookingDetails.url, ":bookingId", bookingId)
      : Routes.homeConsumer.url;
    const redirectUserTo = encodeURIComponent(redirectPath);
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
