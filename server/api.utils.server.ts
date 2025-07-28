import { NextResponse } from "next/server";
import { initAdmin, validateAuth } from "@/server/supabaseAdmin";
import { ResponseCodesConstants } from "@/src/constants";
import { AuthService } from "@/src/services";
import { User } from "@supabase/supabase-js";
import { ErrorI } from "@/src/types/error.types";
import { NextURL } from "next/dist/server/web/next-url";
import Stripe from "stripe";

// Inizializzazione Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-04-10",
});

export type StripePaymentVerificationResult = {
  verified: true;
  amount: number;
  currency: string;
  status: string;
  bookingId?: string;
  userId?: string;
  created: number;
  id: string;
  succeeded: boolean;
};

/**
 * Verifica lo stato di un payment intent con Stripe
 * @param paymentId - ID del payment intent da verificare
 * @param userId - ID dell'utente che deve possedere il payment intent
 * @param bookingId - (Opzionale) ID della prenotazione associata per verifica aggiuntiva
 * @returns Risultato della verifica con dettagli del pagamento
 */
export const verifyPaymentWithStripe = async (
  paymentId: string,
  userId?: string,
  bookingId?: string
): Promise<StripePaymentVerificationResult> => {
  try {
    // Verifica lo stato del payment intent con Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentId);

    if (!paymentIntent) {
      throw new Error("Payment intent not found");
    }

    // Verifica che il payment intent appartenga all'utente autenticato
    if (userId && paymentIntent.metadata?.userId !== userId) {
      throw new Error("Payment intent does not belong to the authenticated user");
    }

    // Verifica opzionale del booking ID se fornito
    if (bookingId && paymentIntent.metadata?.bookingId !== bookingId) {
      throw new Error("Payment intent booking ID mismatch");
    }

    // Verifica che il pagamento sia stato completato con successo (solo per aggiornamenti)
    if (bookingId && paymentIntent.status !== "succeeded") {
      throw new Error(`Payment not completed. Status: ${paymentIntent.status}`);
    }

    return {
      verified: true,
      id: paymentIntent.id,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      status: paymentIntent.status,
      bookingId: paymentIntent.metadata?.bookingId,
      userId: paymentIntent.metadata?.userId,
      created: paymentIntent.created,
      succeeded: paymentIntent.status === "succeeded",
    };
  } catch (error) {
    console.error("Stripe payment verification failed:", error);
    
    // Invia l'errore a Sentry con contesto server-side
    try {
      const { SentryUtils } = await import("@/src/utils/sentry.utils");
      SentryUtils.captureError(error as Error, {
        operation: "verifyStripePayment",
        paymentId,
        bookingId,
        userId,
        timestamp: new Date().toISOString(),
      });
    } catch (sentryError) {
      console.error("Failed to send error to Sentry:", sentryError);
    }
    
    throw error;
  }
};

export const jsonErrorResponse = (status: number = 500, response: ErrorI) =>
  NextResponse.json(response, { status });

export const authenticateUser = async (req: Request) => {
  const { authToken, user } = AuthService.getAuthHeaders(req.headers);
  if (!user || !authToken) return null;
  return (await validateAuth(user, authToken)) as User;
};

export const getAdminClient = () => {
  const _admin = initAdmin();
  if (!_admin)
    throw jsonErrorResponse(503, {
      code: ResponseCodesConstants.CUSTOMERS_DETAILS_SERVICE_UNAVAILABLE.code,
      success: false,
    });
  return _admin;
};

export const getPagination = (
  nextUrl: NextURL,
  pageSize?: number,
  limit = 25
): { from: number; to: number; page: number; itemPerPage: number } => {
  const page = parseInt(nextUrl?.searchParams?.get("page") || "") || 1;
  const itemPerPage = Math.min(
    pageSize || parseInt(nextUrl?.searchParams?.get("pageSize") || "") || 10,
    limit
  );

  return {
    from: Math.max(0, itemPerPage * page - itemPerPage),
    to: Math.max(0, itemPerPage * page - 1),
    page,
    itemPerPage,
  };
};

export const getQueryParams = (url: string, blacklist: string[] = []) => {
  const params = new URL(url).searchParams;
  const queryObject = Object.fromEntries(params.entries());

  blacklist.forEach((key) => delete queryObject[key]);

  return queryObject;
};
