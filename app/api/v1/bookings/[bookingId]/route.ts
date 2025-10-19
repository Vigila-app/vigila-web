import { NextResponse } from "next/server";
import {
  jsonErrorResponse,
  authenticateUser,
  getAdminClient,
  verifyPaymentWithStripe,
  getUserByIdAdmin,
} from "@/server/api.utils.server";
import { ResponseCodesConstants } from "@/src/constants";
import { deepMerge } from "@/src/utils/common.utils";
import { dateDiff, getPostgresTimestamp } from "@/src/utils/date.utils";
import { BookingI } from "@/src/types/booking.types";
import { RolesEnum } from "@/src/enums/roles.enums";
import {
  BookingStatusEnum,
  PaymentStatusEnum,
} from "@/src/enums/booking.enums";
import { BookingUtilsServer } from "@/server/utils/booking.utils.server";
import { User } from "@supabase/supabase-js";

const verifyBookingAccess = async (
  bookingId: string,
  userId: string,
  userRole: string
) => {
  const _admin = getAdminClient();
  const { data, error } = await _admin
    .from("bookings")
    .select("*")
    .eq("id", bookingId)
    .single();

  if (error)
    throw jsonErrorResponse(500, {
      code: ResponseCodesConstants.BOOKINGS_DETAILS_ERROR.code,
      success: false,
      error,
    });

  if (!data)
    throw jsonErrorResponse(404, {
      code: ResponseCodesConstants.BOOKINGS_DETAILS_NOT_FOUND.code,
      success: false,
    });

  // Check access based on role
  if (userRole === RolesEnum.CONSUMER && data.consumer_id !== userId) {
    throw jsonErrorResponse(403, {
      code: ResponseCodesConstants.BOOKINGS_DETAILS_FORBIDDEN.code,
      success: false,
    });
  }

  if (userRole === RolesEnum.VIGIL && data.vigil_id !== userId) {
    throw jsonErrorResponse(403, {
      code: ResponseCodesConstants.BOOKINGS_DETAILS_FORBIDDEN.code,
      success: false,
    });
  }

  return data;
};

export async function DELETE(
  req: Request,
  context: { params: Promise<{ bookingId: string }> }
) {
  try {
    const { bookingId } = await context?.params;
    console.log(`API DELETE bookings/${bookingId}`);

    if (!bookingId) {
      return jsonErrorResponse(400, {
        code: ResponseCodesConstants.BOOKINGS_DETAILS_BAD_REQUEST.code,
        success: false,
      });
    }

    const userObject = await authenticateUser(req);
    if (
      !userObject?.id ||
      userObject.user_metadata?.role !== RolesEnum.CONSUMER
    )
      return jsonErrorResponse(401, {
        code: ResponseCodesConstants.BOOKINGS_DETAILS_UNAUTHORIZED.code,
        success: false,
      });

    await verifyBookingAccess(
      bookingId,
      userObject.id,
      userObject.user_metadata?.role
    );
    const _admin = getAdminClient();

    const { error } = await _admin
      .from("bookings")
      .delete()
      .eq("id", bookingId);

    if (error) throw error;

    return NextResponse.json(
      {
        code: ResponseCodesConstants.BOOKINGS_DETAILS_SUCCESS.code,
        data: bookingId,
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    return jsonErrorResponse(500, {
      code: ResponseCodesConstants.BOOKINGS_DETAILS_ERROR.code,
      success: false,
      error,
    });
  }
}

export async function GET(
  req: Request,
  context: { params: Promise<{ bookingId: string }> }
) {
  try {
    const { bookingId } = await context?.params;
    console.log(`API GET bookings/${bookingId}`);

    // TODO fix params with async

    if (!bookingId) {
      return jsonErrorResponse(400, {
        code: ResponseCodesConstants.BOOKINGS_DETAILS_BAD_REQUEST.code,
        success: false,
      });
    }

    const userObject = await authenticateUser(req);
    if (!userObject?.id)
      return jsonErrorResponse(403, {
        code: ResponseCodesConstants.BOOKINGS_DETAILS_FORBIDDEN.code,
        success: false,
      });

    await verifyBookingAccess(
      bookingId,
      userObject.id,
      userObject.user_metadata?.role
    );

    const _admin = getAdminClient();
    const { data: booking, error } = await _admin
      .from("bookings")
      .select(
        `
        *,
        consumer:consumers(*),
        vigil:vigils(*),
        service:services(*)
      `
      )
      .eq("id", bookingId)
      .single<BookingI>();

    if (error || !booking) throw error;

    return NextResponse.json(
      {
        code: ResponseCodesConstants.BOOKINGS_DETAILS_SUCCESS.code,
        data: booking,
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    return jsonErrorResponse(500, {
      code: ResponseCodesConstants.BOOKINGS_DETAILS_ERROR.code,
      success: false,
      error,
    });
  }
}

export async function PUT(
  req: Request,
  context: { params: Promise<{ bookingId: string }> }
) {
  try {
    const updatedBooking = await req.json();
    const { bookingId } = await context?.params;
    console.log(`API PUT bookings/${bookingId}`, updatedBooking);

    if (!bookingId) {
      return jsonErrorResponse(400, {
        code: ResponseCodesConstants.BOOKINGS_DETAILS_BAD_REQUEST.code,
        success: false,
      });
    }

    const userObject = await authenticateUser(req);
    if (!userObject?.id)
      return jsonErrorResponse(401, {
        code: ResponseCodesConstants.BOOKINGS_DETAILS_UNAUTHORIZED.code,
        success: false,
      });

    if (!updatedBooking?.id || updatedBooking?.id !== bookingId) {
      return jsonErrorResponse(400, {
        code: ResponseCodesConstants.BOOKINGS_DETAILS_BAD_REQUEST.code,
        success: false,
      });
    }

    const booking = (await verifyBookingAccess(
      bookingId,
      userObject.id,
      userObject.user_metadata?.role
    )) as BookingI;

    const _admin = getAdminClient();

    // Verifica specifica del pagamento se si sta tentando di aggiornare lo stato del pagamento
    const isPaymentStatusUpdate =
      updatedBooking.payment_status === PaymentStatusEnum.PAID;
    const isStatusUpdate =
      updatedBooking.status && updatedBooking.status !== booking.status;
    const requiresPaymentVerification =
      isPaymentStatusUpdate ||
      (isStatusUpdate && updatedBooking.status === BookingStatusEnum.CONFIRMED);

    if (requiresPaymentVerification && updatedBooking.payment_id) {
      try {
        console.log(
          `Verifying payment for booking ${bookingId} with payment ID ${updatedBooking.payment_id}`
        );

        await verifyPaymentWithStripe(
          updatedBooking.payment_id,
          userObject.id,
          bookingId
        );

        console.log(`Payment verification successful for booking ${bookingId}`);
      } catch (paymentError) {
        console.error(
          `Payment verification failed for booking ${bookingId}:`,
          paymentError
        );
        return jsonErrorResponse(400, {
          code: ResponseCodesConstants.BOOKINGS_UPDATE_BAD_REQUEST.code,
          success: false,
          error: `Payment verification failed: ${
            paymentError instanceof Error
              ? paymentError.message
              : "Unknown error"
          }`,
        });
      }
    }

    // Only allow certain fields to be updated based on user role
    let allowedUpdates = {};
    if (userObject.user_metadata?.role === RolesEnum.CONSUMER) {
      // Consumers can only update certain fields and only if booking is pending
      if (booking.status === BookingStatusEnum.PENDING) {
        allowedUpdates = {
          service_date: updatedBooking.service_date,
          duration_hours: updatedBooking.duration_hours,
          notes: updatedBooking.notes,
          status: updatedBooking.status,
        };
      }
      if (
        booking.status === BookingStatusEnum.CONFIRMED &&
        dateDiff(booking.endDate, new Date()) > 24
      ) {
        allowedUpdates = {
          service_date: updatedBooking.service_date,
          duration_hours: updatedBooking.duration_hours,
          notes: updatedBooking.notes,
          status: updatedBooking.status,
        };
      }

      // Consumers can also update payment-related fields after payment completion
      if (isPaymentStatusUpdate && updatedBooking.payment_id) {
        allowedUpdates = {
          ...allowedUpdates,
          payment_id: updatedBooking.payment_id,
          payment_status: updatedBooking.payment_status,
          status: updatedBooking.status || BookingStatusEnum.CONFIRMED,
        };
      }
    } else if (userObject.user_metadata?.role === RolesEnum.VIGIL) {
      // Vigils can update status and notes
      allowedUpdates = {
        status: updatedBooking.status,
        notes: updatedBooking.notes,
      };
    }

    const { data, error } = await _admin
      .from("bookings")
      .update({
        ...deepMerge(booking, allowedUpdates),
        updated_at: getPostgresTimestamp(),
      })
      .eq("id", updatedBooking.id)
      .select(
        `
        *,
        consumer:consumers(*),
        vigil:vigils(*),
        service:services(*)
      `
      )
      .single<BookingI>();

    if (error || !data) throw error;

    // Invia email di aggiornamento stato se lo stato è cambiato
    if (isStatusUpdate && updatedBooking.status !== booking.status) {
      try {
        const consumer = await getUserByIdAdmin(data.consumer_id);
        const vigil = await getUserByIdAdmin(data.vigil_id);

        if (consumer?.email) {
          await BookingUtilsServer.sendConsumerBookingStatusUpdateNotification(
            {
              ...data,
              service: data.service || updatedBooking.service,
              vigil: data.vigil || updatedBooking.vigil,
              consumer: data.consumer || updatedBooking.consumer,
            },
            consumer
          );
        }
        if (vigil?.email) {
          // TODO notification for vigil
          // await BookingUtilsServer.sendVigilBookingStatusUpdateNotification(
          //   {
          //     ...data,
          //     service: data.service || updatedBooking.service,
          //     vigil: data.vigil || updatedBooking.vigil,
          //     consumer: data.consumer || updatedBooking.consumer,
          //   },
          //   vigil
          // );
        }
      } catch (emailError) {
        // Log dell'errore ma non interrompe l'aggiornamento della prenotazione
        console.error("Errore invio email di aggiornamento stato:", emailError);
      }
    }

    return NextResponse.json(
      {
        code: ResponseCodesConstants.BOOKINGS_DETAILS_SUCCESS.code,
        data,
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    return jsonErrorResponse(500, {
      code: ResponseCodesConstants.BOOKINGS_DETAILS_ERROR.code,
      success: false,
      error,
    });
  }
}
