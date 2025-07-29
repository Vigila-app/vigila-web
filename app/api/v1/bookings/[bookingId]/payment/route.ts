import { NextRequest, NextResponse } from "next/server";
import {
  authenticateUser,
  getAdminClient,
  jsonErrorResponse,
  verifyPaymentWithStripe,
} from "@/server/api.utils.server";
import { ResponseCodesConstants } from "@/src/constants";
import { RolesEnum } from "@/src/enums/roles.enums";
import { BookingStatusEnum, PaymentStatusEnum } from "@/src/enums/booking.enums";
import { BookingUtilsServer } from "@/server/utils/booking.utils.server";

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ bookingId: string }> }
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

    // Verifica del pagamento con Stripe se si sta aggiornando lo stato di pagamento a "paid"
    if (payment_id && payment_status === PaymentStatusEnum.PAID) {
      try {
        console.log(`Verifying payment for booking ${bookingId} with payment ID ${payment_id}`);
        
        await verifyPaymentWithStripe(
          payment_id,
          userObject.id,
          bookingId
        );

        console.log(`Payment verification successful for booking ${bookingId}`);
      } catch (paymentError) {
        console.error(`Payment verification failed for booking ${bookingId}:`, paymentError);
        return jsonErrorResponse(400, {
          code: ResponseCodesConstants.BOOKINGS_UPDATE_BAD_REQUEST.code,
          success: false,
          error: `Payment verification failed: ${paymentError instanceof Error ? paymentError.message : 'Unknown error'}`,
        });
      }
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

        // Invia email di aggiornamento stato se lo stato è cambiato
        if (updatedBooking.status !== existingBooking.status) {
          try {
           const consumer = {
            ...userObject,
            email: userObject.email,
            first_name:
              userObject.user_metadata?.name || userObject.user_metadata?.firstName,
            last_name:
              userObject.user_metadata?.surname ||
              userObject.user_metadata?.lastName,
          };
    
            if (consumer?.email) {
              await BookingUtilsServer.sendConsumerBookingStatusUpdateNotification(
                updatedBooking,
                consumer
              );

              // TODO notification for vigil
              // await BookingUtilsServer.sendVigilBookingStatusUpdateNotification(
              //   updatedBooking,
              //   vigil
              // );
            }
          } catch (emailError) {
            // Log dell'errore ma non interrompe l'aggiornamento della prenotazione
            console.error('Errore invio email di aggiornamento stato:', emailError);
          }
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
