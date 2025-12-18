import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { jsonErrorResponse } from "@/server/api.utils.server";
import { ResponseCodesConstants } from "@/src/constants";
import { TRANSACTION_TYPE } from "@/src/types/transactions.types";
import { handleTopUp } from "./webhooks.fn";

// Initialize Stripe with the latest API version
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// Stripe webhook endpoint secret for signature verification
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

/**
 * POST /api/v1/webhooks/stripe
 *
 * Handles Stripe webhook events for wallet top-ups.
 *
 * Security considerations:
 * - Verifies webhook signature to prevent replay attacks and ensure authenticity
 * - Implements idempotency to prevent double-spending
 * - Uses database transactions for ACID compliance
 * - Never stores raw card numbers
 */
export async function POST(req: NextRequest) {
  try {
    // Get the raw body for signature verification
    const body = await req.text()
    const signature = req.headers.get("stripe-signature")

    if (!signature) {
      console.error("Missing stripe-signature header")
      return jsonErrorResponse(400, {
        code: ResponseCodesConstants.PAYMENT_WEBHOOK_BAD_REQUEST.code,
        success: false,
        message: "Missing stripe-signature header",
      })
    }

    // Security: Verify the event signature using the official Stripe library
    // This prevents replay attacks and ensures the event is authentic
    let event: Stripe.Event
    try {
      event = stripe.webhooks.constructEvent(body, signature, endpointSecret)
    } catch (err) {
      console.error("Webhook signature verification failed:", err)
      return jsonErrorResponse(400, {
        code: ResponseCodesConstants.PAYMENT_WEBHOOK_UNAUTHORIZED.code,
        success: false,
        message: "Webhook signature verification failed",
      })
    }

    console.log(`Stripe webhook received: ${event.type}`, {
      eventId: event.id,
    })

    // Handle specific event types
    switch (event.type) {
      case "payment_intent.succeeded":
        return await handlePaymentIntentSucceeded(event)
      default:
        console.log(`Unhandled event type: ${event.type}`)
        return NextResponse.json(
          {
            code: ResponseCodesConstants.PAYMENT_WEBHOOK_UNMANAGED.code,
            success: true,
            message: `Event type ${event.type} not handled`,
          },
          { status: 200 }
        )
    }
  } catch (error) {
    console.error("Error processing Stripe webhook:", error);
    return jsonErrorResponse(500, {
      code: ResponseCodesConstants.PAYMENT_WEBHOOK_ERROR.code,
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

/**
 * Handles the payment_intent.succeeded event for wallet top-ups.
 *
 * Implements idempotency to prevent double-spending:
 * - Checks if a transaction with this Stripe payment ID already exists
 * - If exists, returns 200 OK immediately (duplicate event)
 * - If new, creates transaction and updates wallet balance atomically
 */
async function handlePaymentIntentSucceeded(
  event: Stripe.Event
): Promise<NextResponse> {
  const paymentIntent = event.data.object as Stripe.PaymentIntent;
  const paymentIntentId = paymentIntent.id;

  // Extract metadata for reconciliation
  const { user_id, wallet_id, transaction_type, credit_amount } =
    paymentIntent.metadata;

  console.log(`Processing payment_intent.succeeded`, {
    paymentIntentId,
    user_id,
    wallet_id,
    transaction_type,
    credit_amount,
    amount: paymentIntent.amount,
    currency: paymentIntent.currency,
  });

  switch (transaction_type) {
    case TRANSACTION_TYPE.TOP_UP:
      return handleTopUp(paymentIntent)
  
    default:
    console.log(`Ignoring non-TOP_UP transaction: ${transaction_type}`);
    return NextResponse.json(
      {
        code: ResponseCodesConstants.PAYMENT_WEBHOOK_SUCCESS.code,
        success: true,
        message: "Event ignored: not a TOP_UP transaction",
      },
      { status: 200 }
    );
  }
}
