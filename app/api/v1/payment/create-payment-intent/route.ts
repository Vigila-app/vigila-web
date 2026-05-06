import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import {
  authenticateUser,
  getAdminClient,
  jsonErrorResponse,
} from "@/server/api.utils.server";
import { ResponseCodesConstants } from "@/src/constants";
import { RolesEnum } from "@/src/enums/roles.enums";
import { PaymentStatusEnum } from "@/src/enums/booking.enums";
import { TRANSACTION_TYPE } from "@/src/types/transactions.types";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-04-10",
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      bookingId,
      bookingIds: rawBookingIds,
      amount,
      currency = "eur",
    } = body;
    const bookingIds: string[] = Array.isArray(rawBookingIds)
      ? rawBookingIds
      : bookingId
        ? [bookingId]
        : [];

    console.log(`API POST payment/create-payment-intent`, {
      bookingId,
      bookingIds,
      amount,
      currency,
      body,
    });

    // Verifica autenticazione utente
    const userObject = await authenticateUser(req);
    if (
      !userObject?.id ||
      userObject.user_metadata?.role !== RolesEnum.CONSUMER
    ) {
      return jsonErrorResponse(401, {
        code: ResponseCodesConstants.PAYMENT_INTENT_UNAUTHORIZED.code,
        success: false,
      });
    }

    if (!bookingIds.length || !amount || amount <= 0) {
      return jsonErrorResponse(400, {
        code: ResponseCodesConstants.PAYMENT_INTENT_BAD_REQUEST.code,
        success: false,
      });
    }

    const _admin = getAdminClient();

    // Fetch only bookings that belong to the authenticated user.
    // Filtering by consumer_id at the DB level means a booking that exists
    const { data: bookings, error: bookingsError } = await _admin
      .from("bookings")
      .select("*")
      .in("id", bookingIds as any)
      .eq("consumer_id", userObject.id);

    if (bookingsError || !bookings || bookings.length !== bookingIds.length) {
      return jsonErrorResponse(404, {
        code: ResponseCodesConstants.PAYMENT_INTENT_NOT_FOUND.code,
        success: false,
      });
    }

    for (const b of bookings) {
      if (b.payment_status === PaymentStatusEnum.PAID) {
        return jsonErrorResponse(400, {
          code: ResponseCodesConstants.PAYMENT_INTENT_ALREADY_PAID.code,
          success: false,
        });
      }
    }

    // Crea il Payment Intent con Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount), // amount dovrebbe già essere in centesimi
      currency: currency.toLowerCase(),
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        bookingIds: bookingIds.join(","),
        user_id: userObject.id,
        transaction_type: TRANSACTION_TYPE.BOOKING_PAYMENT,
      },
      description: `Pagamento per prenotazioni ${bookingIds.join(",")}`,
    });

    // Debug: log created PaymentIntent id and key info so we can trace it in Stripe dashboard
    try {
      console.log("Created Stripe PaymentIntent:", {
        id: paymentIntent.id,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        metadata: paymentIntent.metadata,
      });
    } catch (e) {
      console.warn("Unable to log paymentIntent details", e);
    }

    // Aggiorna le prenotazioni con l'ID del Payment Intent e setta payment_status=PENDING
    await _admin
      .from("bookings")
      .update({
        payment_id: paymentIntent.id,
        payment_status: PaymentStatusEnum.PENDING,
        updated_at: new Date().toISOString(),
      })
      .in("id", bookingIds as any);

    return NextResponse.json(
      {
        code: ResponseCodesConstants.PAYMENT_INTENT_SUCCESS.code,
        clientSecret: paymentIntent.client_secret,
        success: true,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error creating payment intent:", error);
    return jsonErrorResponse(500, {
      code: ResponseCodesConstants.PAYMENT_INTENT_ERROR.code,
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
