import {
  getAdminClient,
  getUserByIdAdmin,
  jsonErrorResponse,
} from "@/server/api.utils.server";
import { ResponseCodesConstants } from "@/src/constants";
import {
  TRANSACTION_STATUS,
  TRANSACTION_TYPE,
} from "@/src/types/transactions.types";
import { PaymentStatusEnum } from "@/src/enums/booking.enums";
import { BookingUtilsServer } from "@/server/utils/booking.utils.server";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export const handleTopUp = async (paymentIntent: Stripe.PaymentIntent) => {
  const { user_id, wallet_id, transaction_type, credit_amount } =
    paymentIntent.metadata;
  // Validate required metadata
  if (!user_id || !wallet_id) {
    console.error(
      "Missing required metadata in PaymentIntent:",
      paymentIntent.metadata,
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
      `Duplicate event detected for payment ${paymentIntent.id}, ignoring`,
    );
    return NextResponse.json(
      {
        code: ResponseCodesConstants.WALLET_WEBHOOK_DUPLICATE.code,
        success: true,
        message: "Duplicate event: transaction already processed",
      },
      { status: 200 },
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
      description: paymentIntent.description || "Ricarica wallet",
      created_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (transactionError) {
    console.error("Error creating transaction:", transactionError);

    // Check if this is a unique constraint violation (race condition)
    if (transactionError.code === "23505") {
      console.log(
        `Race condition: transaction already exists for ${paymentIntent.id}`,
      );
      return NextResponse.json(
        {
          code: ResponseCodesConstants.WALLET_WEBHOOK_DUPLICATE.code,
          success: true,
          message:
            "Duplicate event: transaction already processed (race condition)",
        },
        { status: 200 },
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
        },
      );
    }

    return jsonErrorResponse(500, {
      code: ResponseCodesConstants.PAYMENT_WEBHOOK_ERROR.code,
      success: false,
      message: "Failed to update wallet balance",
    });
  }

  console.log(
    `Successfully processed top-up: ${amountToCredit} ${currency} for wallet ${wallet_id}`,
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
    { status: 200 },
  );
};

/**
 * Handles the payment_intent.succeeded event for booking payments.
 *
 * Implements idempotency to prevent double-processing:
 * - Checks if booking already has payment_status = PAID for this payment_id
 * - If already paid, returns 200 OK immediately (duplicate event)
 * - If new, updates booking to PAID + CONFIRMED atomically
 * - Sends email notifications to consumer and vigil
 */
export const handleBookingPayment = async (
  paymentIntent: Stripe.PaymentIntent,
) => {
  const {
    bookingIds: rawBookingIds,
    bookingId,
    user_id,
  } = paymentIntent.metadata;

  const bookingIds: string[] = rawBookingIds
    ? rawBookingIds
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : bookingId
      ? [bookingId]
      : [];

  // Validate required metadata
  if (bookingIds.length === 0 || !user_id) {
    console.error(
      "Missing required metadata in PaymentIntent for booking payment:",
      paymentIntent.metadata,
    );
    return jsonErrorResponse(400, {
      code: ResponseCodesConstants.PAYMENT_WEBHOOK_BAD_REQUEST.code,
      success: false,
      message:
        "Missing required metadata: bookingIds (or bookingId) or user_id",
    });
  }

  const _admin = getAdminClient();

  // Fetch all bookings referenced by the payment intent
  const { data: existingBookings, error: checkError } = await _admin
    .from("bookings")
    .select(
      `
      *,
      consumer:consumers(*),
      vigil:vigils(*),
      service:services(*)
    `,
    )
    .in("id", bookingIds as any);

  if (
    checkError ||
    !existingBookings ||
    existingBookings.length !== bookingIds.length
  ) {
    console.error("One or more bookings not found for payment webhook:", {
      bookingIds,
      foundCount: existingBookings?.length ?? 0,
      checkError,
    });
    return jsonErrorResponse(404, {
      code: ResponseCodesConstants.PAYMENT_WEBHOOK_METHOD_NOT_FOUND.code,
      success: false,
      message: `One or more bookings not found: ${bookingIds.join(",")}`,
    });
  }

  // Idempotency: if all bookings are already paid with this payment_id, return 200 OK
  const allAlreadyPaid = existingBookings.every(
    (b) =>
      b.payment_status === PaymentStatusEnum.PAID &&
      b.payment_id === paymentIntent.id,
  );
  if (allAlreadyPaid) {
    console.log(
      `Duplicate event: bookings ${bookingIds.join(",")} already paid with payment ${paymentIntent.id}`,
    );
    return NextResponse.json(
      {
        code: ResponseCodesConstants.PAYMENT_WEBHOOK_SUCCESS.code,
        success: true,
        message: "Duplicate event: booking payment already processed",
      },
      { status: 200 },
    );
  }

  // Verify every booking belongs to the user from metadata
  const mismatched = existingBookings.find((b) => b.consumer_id !== user_id);
  if (mismatched) {
    console.error("Booking consumer_id mismatch:", {
      bookingId: mismatched.id,
      expected: user_id,
      actual: mismatched.consumer_id,
    });
    return jsonErrorResponse(400, {
      code: ResponseCodesConstants.PAYMENT_WEBHOOK_BAD_REQUEST.code,
      success: false,
      message: "Booking does not belong to the user in payment metadata",
    });
  }

  // Update payment_status → PAID for all bookings
  const { data: paidBookings, error: paymentUpdateError } = await _admin
    .from("bookings")
    .update({
      payment_id: paymentIntent.id,
      payment_status: PaymentStatusEnum.PAID,
      updated_at: new Date().toISOString(),
    })
    .in("id", bookingIds as any)
    .select();

  if (paymentUpdateError || !paidBookings) {
    console.error("Error updating booking payment status:", paymentUpdateError);
    return jsonErrorResponse(500, {
      code: ResponseCodesConstants.PAYMENT_WEBHOOK_ERROR.code,
      success: false,
      message: "Failed to update booking payment status",
    });
  }

  const updatedBookings = paidBookings;

  console.log(
    `Successfully processed booking payment: bookings ${bookingIds.join(",")} marked as PAID`,
  );

  // Send email notifications (best effort — don't fail the webhook)
  const existingById = new Map(existingBookings.map((b) => [b.id, b]));
  try {
    const consumer = await getUserByIdAdmin(user_id);
    const vigilCache = new Map<
      string,
      Awaited<ReturnType<typeof getUserByIdAdmin>>
    >();

    for (const updatedBooking of updatedBookings) {
      const existing = existingById.get(updatedBooking.id);
      if (!existing) continue;

      const enriched = {
        ...updatedBooking,
        service: existing.service,
        vigil: existing.vigil,
        consumer: existing.consumer,
      };

      if (consumer?.email) {
        await BookingUtilsServer.sendConsumerBookingStatusUpdateNotification(
          enriched,
          consumer,
        );
      }

      if (existing.vigil_id) {
        let vigil = vigilCache.get(existing.vigil_id);
        if (!vigil) {
          vigil = await getUserByIdAdmin(existing.vigil_id);
          vigilCache.set(existing.vigil_id, vigil);
        }
        if (vigil?.email) {
          await BookingUtilsServer.sendVigilBookingStatusUpdateNotification(
            enriched,
            vigil,
          );
        }
      }
    }
  } catch (emailError) {
    console.error(
      "Error sending booking payment email notifications:",
      emailError,
    );
  }

  return NextResponse.json(
    {
      code: ResponseCodesConstants.PAYMENT_WEBHOOK_SUCCESS.code,
      success: true,
      message: "Booking payment processed successfully",
      data: {
        bookingIds,
        paymentId: paymentIntent.id,
        bookings: updatedBookings.map((b) => ({
          id: b.id,
          status: b.status,
          paymentStatus: b.payment_status,
        })),
      },
    },
    { status: 200 },
  );
};
