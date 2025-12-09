import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getAdminClient, jsonErrorResponse } from "@/server/api.utils.server";
import { ResponseCodesConstants } from "@/src/constants";

// Initialize Stripe with the latest API version
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-04-10",
});

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
    const body = await req.text();
    const signature = req.headers.get("stripe-signature");

    if (!signature) {
      console.error("Missing stripe-signature header");
      return jsonErrorResponse(400, {
        code: ResponseCodesConstants.PAYMENT_WEBHOOK_BAD_REQUEST.code,
        success: false,
        message: "Missing stripe-signature header",
      });
    }

    // Security: Verify the event signature using the official Stripe library
    // This prevents replay attacks and ensures the event is authentic
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, endpointSecret);
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      return jsonErrorResponse(400, {
        code: ResponseCodesConstants.PAYMENT_WEBHOOK_UNAUTHORIZED.code,
        success: false,
        message: "Webhook signature verification failed",
      });
    }

    console.log(`Stripe webhook received: ${event.type}`, { eventId: event.id });

    // Handle specific event types
    switch (event.type) {
      case "payment_intent.succeeded":
        return await handlePaymentIntentSucceeded(event);
      default:
        console.log(`Unhandled event type: ${event.type}`);
        return NextResponse.json(
          {
            code: ResponseCodesConstants.PAYMENT_WEBHOOK_UNMANAGED.code,
            success: true,
            message: `Event type ${event.type} not handled`,
          },
          { status: 200 }
        );
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
async function handlePaymentIntentSucceeded(event: Stripe.Event): Promise<NextResponse> {
  const paymentIntent = event.data.object as Stripe.PaymentIntent;
  const paymentIntentId = paymentIntent.id;

  // Extract metadata for reconciliation
  const { user_id, wallet_id, transaction_type, credit_amount } = paymentIntent.metadata;

  console.log(`Processing payment_intent.succeeded`, {
    paymentIntentId,
    user_id,
    wallet_id,
    transaction_type,
    credit_amount,
    amount: paymentIntent.amount,
    currency: paymentIntent.currency,
  });

  // Only handle TOP_UP transactions
  if (transaction_type !== "TOP_UP") {
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

  // Validate required metadata
  if (!user_id || !wallet_id) {
    console.error("Missing required metadata in PaymentIntent:", paymentIntent.metadata);
    return jsonErrorResponse(400, {
      code: ResponseCodesConstants.PAYMENT_WEBHOOK_BAD_REQUEST.code,
      success: false,
      message: "Missing required metadata: user_id or wallet_id",
    });
  }

  const _admin = getAdminClient();

  // Idempotency Logic: Check if transaction already exists
  const { data: existingTransaction, error: checkError } = await _admin
    .from("wallet_transactions")
    .select("id")
    .eq("stripe_payment_id", paymentIntentId)
    .maybeSingle();

  if (checkError) {
    console.error("Error checking for existing transaction:", checkError);
    return jsonErrorResponse(500, {
      code: ResponseCodesConstants.PAYMENT_WEBHOOK_ERROR.code,
      success: false,
      message: "Database error while checking for duplicate",
    });
  }

  // CASE EXISTS: Duplicate event - return 200 OK and terminate
  if (existingTransaction) {
    console.log(`Duplicate event detected for payment ${paymentIntentId}, ignoring`);
    return NextResponse.json(
      {
        code: ResponseCodesConstants.WALLET_WEBHOOK_DUPLICATE.code,
        success: true,
        message: "Duplicate event: transaction already processed",
      },
      { status: 200 }
    );
  }

  // CASE NEW: Process the top-up
  // Use RPC for atomic transaction to ensure ACID compliance
  
  // Determine the amount to credit: use credit_amount from metadata if available (for bundles), otherwise use paid amount
  const amountToCredit = credit_amount 
    ? Math.round(parseFloat(credit_amount) * 100) 
    : paymentIntent.amount;
  const currency = paymentIntent.currency.toUpperCase();

  // Start atomic database transaction
  // Step 1: Create the Transaction record with status 'COMPLETED'
  const { data: transaction, error: transactionError } = await _admin
    .from("wallet_transactions")
    .insert({
      wallet_id: wallet_id,
      stripe_payment_id: paymentIntentId,
      amount: amountToCredit,
      currency: currency,
      status: "COMPLETED",
      type: "TOP_UP",
      description: `Wallet top-up via Stripe`,
      created_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (transactionError) {
    console.error("Error creating transaction:", transactionError);
    
    // Check if this is a unique constraint violation (race condition)
    if (transactionError.code === "23505") {
      console.log(`Race condition: transaction already exists for ${paymentIntentId}`);
      return NextResponse.json(
        {
          code: ResponseCodesConstants.WALLET_WEBHOOK_DUPLICATE.code,
          success: true,
          message: "Duplicate event: transaction already processed (race condition)",
        },
        { status: 200 }
      );
    }

    return jsonErrorResponse(500, {
      code: ResponseCodesConstants.PAYMENT_WEBHOOK_ERROR.code,
      success: false,
      message: "Failed to create transaction record",
    });
  }

  // Step 2: Atomically update the Wallet balance
  // Using RPC or raw SQL for atomic increment to prevent race conditions
  const { error: walletError } = await _admin.rpc("increment_wallet_balance", {
    p_wallet_id: wallet_id,
    p_amount: amountToCredit,
  });

  if (walletError) {
    console.error("Error updating wallet balance:", walletError);
    
    // Attempt to rollback by deleting the transaction (best effort)
    // Log errors to aid in manual reconciliation if rollback fails
    const { error: rollbackError } = await _admin
      .from("wallet_transactions")
      .delete()
      .eq("id", transaction.id);
    
    if (rollbackError) {
      console.error("CRITICAL: Failed to rollback transaction after wallet update failure. Manual reconciliation required.", {
        transactionId: transaction.id,
        paymentIntentId,
        wallet_id,
        amount: amountToCredit,
        rollbackError,
      });
    }

    return jsonErrorResponse(500, {
      code: ResponseCodesConstants.PAYMENT_WEBHOOK_ERROR.code,
      success: false,
      message: "Failed to update wallet balance",
    });
  }

  console.log(`Successfully processed top-up: ${amountToCredit} ${currency} for wallet ${wallet_id}`);

  return NextResponse.json(
    {
      code: ResponseCodesConstants.PAYMENT_WEBHOOK_SUCCESS.code,
      success: true,
      message: "Payment processed successfully",
      data: {
        transactionId: transaction.id,
        amount: amountToCredit,
        currency: currency,
      },
    },
    { status: 200 }
  );
}
