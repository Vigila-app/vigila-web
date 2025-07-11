import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import {
  authenticateUser,
  getAdminClient,
  jsonErrorResponse,
} from "@/server/api.utils.server";
import { ResponseCodesConstants } from "@/src/constants";
import { RolesEnum } from "@/src/enums/roles.enums";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-04-10",
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { bookingId, amount, currency = "eur" } = body;

    console.log(`API POST payment/create-payment-intent`, { bookingId, amount, currency });

    // Verifica autenticazione utente
    const userObject = await authenticateUser(req);
    if (!userObject?.id || userObject.user_metadata?.role !== RolesEnum.CONSUMER) {
      return jsonErrorResponse(401, {
        code: ResponseCodesConstants.PAYMENT_INTENT_UNAUTHORIZED.code,
        success: false,
      });
    }

    if (!bookingId || !amount || amount <= 0) {
      return jsonErrorResponse(400, {
        code: ResponseCodesConstants.PAYMENT_INTENT_BAD_REQUEST.code,
        success: false,
      });
    }

    const _admin = getAdminClient();

    // Verifica che la prenotazione appartenga all'utente
    const { data: booking, error: bookingError } = await _admin
      .from("bookings")
      .select("*")
      .eq("id", bookingId)
      .eq("consumer_id", userObject.id)
      .single();

    if (bookingError || !booking) {
      return jsonErrorResponse(404, {
        code: ResponseCodesConstants.PAYMENT_INTENT_NOT_FOUND.code,
        success: false,
      });
    }

    // Verifica che la prenotazione non sia già stata pagata
    if (booking.payment_status === "paid") {
      return jsonErrorResponse(400, {
        code: ResponseCodesConstants.PAYMENT_INTENT_ALREADY_PAID.code,
        success: false,
      });
    }

    // Crea il Payment Intent con Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount), // amount dovrebbe già essere in centesimi
      currency: currency.toLowerCase(),
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        bookingId,
        userId: userObject.id,
      },
      description: `Pagamento per prenotazione ${bookingId}`,
    });

    // Aggiorna la prenotazione con l'ID del Payment Intent
    await _admin
      .from("bookings")
      .update({
        payment_id: paymentIntent.id,
        updated_at: new Date().toISOString(),
      })
      .eq("id", bookingId);

    return NextResponse.json(
      {
        code: ResponseCodesConstants.PAYMENT_INTENT_SUCCESS.code,
        clientSecret: paymentIntent.client_secret,
        success: true,
      },
      { status: 200 }
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
