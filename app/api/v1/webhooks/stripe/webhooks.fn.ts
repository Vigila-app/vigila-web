import { getAdminClient, jsonErrorResponse } from "@/server/api.utils.server";
import { ResponseCodesConstants } from "@/src/constants";
import {
  TRANSACTION_STATUS,
  TRANSACTION_TYPE,
} from "@/src/types/transactions.types";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export const handleTopUp = async (paymentIntent: Stripe.PaymentIntent) => {
  const { user_id, wallet_id, transaction_type, credit_amount } =
    paymentIntent.metadata;
  // Validate required metadata
  if (!user_id || !wallet_id) {
    console.error(
      "Missing required metadata in PaymentIntent:",
      paymentIntent.metadata
    );
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
    .eq("stripe_payment_id", paymentIntent.id)
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
    console.log(
      `Duplicate event detected for payment ${paymentIntent.id}, ignoring`
    );
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
      stripe_payment_id: paymentIntent.id,
      user_id: user_id,
      amount: amountToCredit,
      currency: currency,
      status: TRANSACTION_STATUS.COMPLETED,
      type: transaction_type as TRANSACTION_TYPE,
      description:
        paymentIntent.description || "Ricarica wallet",
      created_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (transactionError) {
    console.error("Error creating transaction:", transactionError);

    // Check if this is a unique constraint violation (race condition)
    if (transactionError.code === "23505") {
      console.log(
        `Race condition: transaction already exists for ${paymentIntent.id}`
      );
      return NextResponse.json(
        {
          code: ResponseCodesConstants.WALLET_WEBHOOK_DUPLICATE.code,
          success: true,
          message:
            "Duplicate event: transaction already processed (race condition)",
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
  const { error: walletError } = await _admin.rpc("update_wallet_balance", {
    wallet_id: wallet_id,
    amount: amountToCredit,
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
      console.error(
        "CRITICAL: Failed to rollback transaction after wallet update failure. Manual reconciliation required.",
        {
          transactionId: transaction.id,
          paymentIntentId: paymentIntent.id,
          wallet_id,
          amount: amountToCredit,
          rollbackError,
        }
      );
    }

    return jsonErrorResponse(500, {
      code: ResponseCodesConstants.PAYMENT_WEBHOOK_ERROR.code,
      success: false,
      message: "Failed to update wallet balance",
    });
  }

  console.log(
    `Successfully processed top-up: ${amountToCredit} ${currency} for wallet ${wallet_id}`
  );

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
};
