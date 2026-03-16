import { getAdminClient, getUserByIdAdmin, jsonErrorResponse } from "@/server/api.utils.server"
import { ResponseCodesConstants } from "@/src/constants"
import {
  TRANSACTION_STATUS,
  TRANSACTION_TYPE,
} from "@/src/types/transactions.types"
import {
  BookingStatusEnum,
  PaymentStatusEnum,
} from "@/src/enums/booking.enums"
import { BookingUtilsServer } from "@/server/utils/booking.utils.server"
import { NextResponse } from "next/server"
import Stripe from "stripe"

export const handleTopUp = async (paymentIntent: Stripe.PaymentIntent) => {
  const { user_id, wallet_id, transaction_type, credit_amount } =
    paymentIntent.metadata
  // Validate required metadata
  if (!user_id || !wallet_id) {
    console.error(
      "Missing required metadata in PaymentIntent:",
      paymentIntent.metadata
    )
    return jsonErrorResponse(400, {
      code: ResponseCodesConstants.PAYMENT_WEBHOOK_BAD_REQUEST.code,
      success: false,
      message: "Missing required metadata: user_id or wallet_id",
    })
  }

  const _admin = getAdminClient()

  // Idempotency Logic: Check if transaction already exists
  const { data: existingTransaction, error: checkError } = await _admin
    .from("wallet_transactions")
    .select("id")
    .eq("stripe_payment_id", paymentIntent.id)
    .maybeSingle()

  if (checkError) {
    console.error("Error checking for existing transaction:", checkError)
    return jsonErrorResponse(500, {
      code: ResponseCodesConstants.PAYMENT_WEBHOOK_ERROR.code,
      success: false,
      message: "Database error while checking for duplicate",
    })
  }

  // CASE EXISTS: Duplicate event - return 200 OK and terminate
  if (existingTransaction) {
    console.log(
      `Duplicate event detected for payment ${paymentIntent.id}, ignoring`
    )
    return NextResponse.json(
      {
        code: ResponseCodesConstants.WALLET_WEBHOOK_DUPLICATE.code,
        success: true,
        message: "Duplicate event: transaction already processed",
      },
      { status: 200 }
    )
  }

  // CASE NEW: Process the top-up
  // Use RPC for atomic transaction to ensure ACID compliance

  // Determine the amount to credit: use credit_amount from metadata if available (for bundles), otherwise use paid amount
  const amountToCredit = credit_amount
    ? Math.round(parseFloat(credit_amount) * 100)
    : paymentIntent.amount
  const currency = paymentIntent.currency.toUpperCase()

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
    .single()

  if (transactionError) {
    console.error("Error creating transaction:", transactionError)

    // Check if this is a unique constraint violation (race condition)
    if (transactionError.code === "23505") {
      console.log(
        `Race condition: transaction already exists for ${paymentIntent.id}`
      )
      return NextResponse.json(
        {
          code: ResponseCodesConstants.WALLET_WEBHOOK_DUPLICATE.code,
          success: true,
          message:
            "Duplicate event: transaction already processed (race condition)",
        },
        { status: 200 }
      )
    }

    return jsonErrorResponse(500, {
      code: ResponseCodesConstants.PAYMENT_WEBHOOK_ERROR.code,
      success: false,
      message: "Failed to create transaction record",
    })
  }

  // Step 2: Atomically update the Wallet balance
  // Using RPC or raw SQL for atomic increment to prevent race conditions
  const { error: walletError } = await _admin.rpc("update_wallet_balance", {
    wallet_id: wallet_id,
    amount: amountToCredit,
  })

  if (walletError) {
    console.error("Error updating wallet balance:", walletError)

    // Attempt to rollback by deleting the transaction (best effort)
    // Log errors to aid in manual reconciliation if rollback fails
    const { error: rollbackError } = await _admin
      .from("wallet_transactions")
      .delete()
      .eq("id", transaction.id)

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
      )
    }

    return jsonErrorResponse(500, {
      code: ResponseCodesConstants.PAYMENT_WEBHOOK_ERROR.code,
      success: false,
      message: "Failed to update wallet balance",
    })
  }

  console.log(
    `Successfully processed top-up: ${amountToCredit} ${currency} for wallet ${wallet_id}`
  )

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
  )
}

/**
 * Handles the payment_intent.succeeded event for booking payments.
 *
 * Implements idempotency to prevent double-processing:
 * - Checks if booking already has payment_status = PAID for this payment_id
 * - If already paid, returns 200 OK immediately (duplicate event)
 * - If new, updates booking to PAID + CONFIRMED atomically
 * - Sends email notifications to consumer and vigil
 */
export const handleBookingPayment = async (paymentIntent: Stripe.PaymentIntent) => {
  const { bookingId, user_id } = paymentIntent.metadata

  // Validate required metadata
  if (!bookingId || !user_id) {
    console.error(
      "Missing required metadata in PaymentIntent for booking payment:",
      paymentIntent.metadata
    )
    return jsonErrorResponse(400, {
      code: ResponseCodesConstants.PAYMENT_WEBHOOK_BAD_REQUEST.code,
      success: false,
      message: "Missing required metadata: bookingId or user_id",
    })
  }

  const _admin = getAdminClient()

  // Idempotency: Check if booking is already marked as paid with this payment_id
  const { data: existingBooking, error: checkError } = await _admin
    .from("bookings")
    .select(`
      *,
      consumer:consumers(*),
      vigil:vigils(*),
      service:services(*)
    `)
    .eq("id", bookingId)
    .single()

  if (checkError || !existingBooking) {
    console.error("Booking not found for payment webhook:", { bookingId, checkError })
    return jsonErrorResponse(404, {
      code: ResponseCodesConstants.PAYMENT_WEBHOOK_METHOD_NOT_FOUND.code,
      success: false,
      message: `Booking ${bookingId} not found`,
    })
  }

  // Idempotency: If already paid with this payment_id, return 200 OK
  if (
    existingBooking.payment_status === PaymentStatusEnum.PAID &&
    existingBooking.payment_id === paymentIntent.id
  ) {
    console.log(`Duplicate event: booking ${bookingId} already paid with payment ${paymentIntent.id}`)
    return NextResponse.json(
      {
        code: ResponseCodesConstants.PAYMENT_WEBHOOK_SUCCESS.code,
        success: true,
        message: "Duplicate event: booking payment already processed",
      },
      { status: 200 }
    )
  }

  // Verify the booking belongs to the user from metadata
  if (existingBooking.consumer_id !== user_id) {
    console.error("Booking consumer_id mismatch:", {
      bookingId,
      expected: user_id,
      actual: existingBooking.consumer_id,
    })
    return jsonErrorResponse(400, {
      code: ResponseCodesConstants.PAYMENT_WEBHOOK_BAD_REQUEST.code,
      success: false,
      message: "Booking does not belong to the user in payment metadata",
    })
  }

  // Update booking: payment_status → PAID, status → CONFIRMED (if currently PENDING)
  const updateData: Record<string, unknown> = {
    payment_id: paymentIntent.id,
    payment_status: PaymentStatusEnum.PAID,
    updated_at: new Date().toISOString(),
  }

  if (existingBooking.status === BookingStatusEnum.PENDING) {
    updateData.status = BookingStatusEnum.CONFIRMED
  }

  const { data: updatedBooking, error: updateError } = await _admin
    .from("bookings")
    .update(updateData)
    .eq("id", bookingId)
    .select()
    .single()

  if (updateError) {
    console.error("Error updating booking payment status:", updateError)
    return jsonErrorResponse(500, {
      code: ResponseCodesConstants.PAYMENT_WEBHOOK_ERROR.code,
      success: false,
      message: "Failed to update booking payment status",
    })
  }

  console.log(`Successfully processed booking payment: booking ${bookingId} marked as PAID`)

  // Send email notifications (best effort — don't fail the webhook)
  try {
    const consumer = await getUserByIdAdmin(user_id)
    if (consumer?.email) {
      await BookingUtilsServer.sendConsumerBookingStatusUpdateNotification(
        {
          ...updatedBooking,
          service: existingBooking.service,
          vigil: existingBooking.vigil,
          consumer: existingBooking.consumer,
        },
        consumer
      )
    }

    if (existingBooking.vigil_id) {
      const vigil = await getUserByIdAdmin(existingBooking.vigil_id)
      if (vigil?.email) {
        await BookingUtilsServer.sendVigilBookingStatusUpdateNotification(
          {
            ...updatedBooking,
            service: existingBooking.service,
            vigil: existingBooking.vigil,
            consumer: existingBooking.consumer,
          },
          vigil
        )
      }
    }
  } catch (emailError) {
    console.error("Error sending booking payment email notifications:", emailError)
  }

  return NextResponse.json(
    {
      code: ResponseCodesConstants.PAYMENT_WEBHOOK_SUCCESS.code,
      success: true,
      message: "Booking payment processed successfully",
      data: {
        bookingId,
        paymentId: paymentIntent.id,
        status: updatedBooking.status,
        paymentStatus: updatedBooking.payment_status,
      },
    },
    { status: 200 }
  )
}
