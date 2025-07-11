import { NextRequest, NextResponse } from "next/server";
import {
  authenticateUser,
  getAdminClient,
  jsonErrorResponse,
} from "@/server/api.utils.server";
import { ResponseCodesConstants } from "@/src/constants";
import { RolesEnum } from "@/src/enums/roles.enums";
import { BookingStatusEnum, PaymentStatusEnum } from "@/src/enums/booking.enums";

export async function PUT(
  req: NextRequest,
  context: { params: { bookingId: string } }
) {
  try {
    const { bookingId } = await context.params;
    const body = await req.json();
    const { payment_id, payment_status, status } = body;

    console.log(`API PUT bookings/${bookingId}/payment`, body);

    // Verifica autenticazione utente
    const userObject = await authenticateUser(req);
    if (!userObject?.id || userObject.user_metadata?.role !== RolesEnum.CONSUMER) {
      return jsonErrorResponse(401, {
        code: ResponseCodesConstants.BOOKINGS_UPDATE_UNAUTHORIZED.code,
        success: false,
      });
    }

    if (!bookingId) {
      return jsonErrorResponse(400, {
        code: ResponseCodesConstants.BOOKINGS_UPDATE_BAD_REQUEST.code,
        success: false,
      });
    }

    const _admin = getAdminClient();

    // Verifica che la prenotazione appartenga all'utente
    const { data: existingBooking, error: fetchError } = await _admin
      .from("bookings")
      .select("*")
      .eq("id", bookingId)
      .eq("consumer_id", userObject.id)
      .single();

    if (fetchError || !existingBooking) {
      return jsonErrorResponse(404, {
        code: ResponseCodesConstants.BOOKINGS_UPDATE_NOT_FOUND.code,
        success: false,
      });
    }

    // Prepara i dati di aggiornamento
    const updateData: any = {
      updated_at: new Date().toISOString(),
    };

    if (payment_id) {
      updateData.payment_id = payment_id;
    }

    if (payment_status && Object.values(PaymentStatusEnum).includes(payment_status)) {
      updateData.payment_status = payment_status;
    }

    if (status && Object.values(BookingStatusEnum).includes(status)) {
      updateData.status = status;
    }

    // Aggiorna la prenotazione
    const { data: updatedBooking, error: updateError } = await _admin
      .from("bookings")
      .update(updateData)
      .eq("id", bookingId)
      .select()
      .single();

    if (updateError) {
      throw updateError;
    }

    return NextResponse.json(
      {
        code: ResponseCodesConstants.BOOKINGS_UPDATE_SUCCESS.code,
        data: updatedBooking,
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating booking payment:", error);
    return jsonErrorResponse(500, {
      code: ResponseCodesConstants.BOOKINGS_UPDATE_ERROR.code,
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
