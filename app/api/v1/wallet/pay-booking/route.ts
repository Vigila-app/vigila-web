import { NextRequest, NextResponse } from "next/server";
import {
  authenticateUser,
  getAdminClient,
  getUserByIdAdmin,
  jsonErrorResponse,
} from "@/server/api.utils.server";
import { ResponseCodesConstants } from "@/src/constants";
import { PaymentStatusEnum } from "@/src/enums/booking.enums";
import {
  EXPENSE_TYPE,
  TRANSACTION_STATUS,
} from "@/src/types/transactions.types";
import { BookingUtils } from "@/src/utils/booking.utils";
import { BookingUtilsServer } from "@/server/utils/booking.utils.server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { bookingId } = body;

    if (!bookingId) {
      return jsonErrorResponse(400, {
        code: ResponseCodesConstants.GENERIC_ERROR.code,
        success: false,
        message: "Booking ID is required",
      });
    }

    // 1. Authenticate user
    const userObject = await authenticateUser(req);
    if (!userObject?.id) {
      return jsonErrorResponse(401, {
        code: ResponseCodesConstants.UNAUTHORIZED.code,
        success: false,
      });
    }

    const supabase = getAdminClient();

    // 2. Get Booking Details
    const { data: booking, error: bookingError } = await supabase
      .from("bookings")
      .select("id, price, status, payment_status, consumer_id")
      .eq("id", bookingId)
      .single();

    if (bookingError || !booking) {
      return jsonErrorResponse(404, {
        code: ResponseCodesConstants.GENERIC_ERROR.code,
        success: false,
        message: "Booking not found",
      });
    }

    // Security: Ensure booking belongs to user

    const { data: consumer } = await supabase
      .from("consumers")
      .select("id")
      .eq("id", userObject.id)
      .single();

    if (!consumer || consumer.id !== booking.consumer_id) {
      return jsonErrorResponse(403, {
        code: ResponseCodesConstants.FORBIDDEN.code,
        success: false,
        message: "You are not authorized to pay for this booking",
      });
    }

    if (booking.payment_status === PaymentStatusEnum.PAID) {
      return jsonErrorResponse(400, {
        code: ResponseCodesConstants.GENERIC_ERROR.code,
        success: false,
        message: "Booking is already paid",
      });
    }

    const priceCents = Math.round(booking.price * 100);

    // 3. Get Wallet
    const { data: wallet, error: walletError } = await supabase
      .from("wallets")
      .select("id, balance_cents")
      .eq("user_id", consumer.id)
      .single();

    if (walletError || !wallet) {
      return jsonErrorResponse(404, {
        code: ResponseCodesConstants.GENERIC_ERROR.code,
        success: false,
        message: "Wallet not found",
      });
    }

    // 4. Check Balance
    if (wallet.balance_cents < priceCents) {
      return jsonErrorResponse(400, {
        code: ResponseCodesConstants.GENERIC_ERROR.code,
        success: false,
        message: "Insufficient wallet balance",
      });
    }

    // 5. Process Payment (Atomic Decrement)

    const { data: newBalance, error: rpcError } = await supabase.rpc(
      "update_wallet_balance",
      {
        wallet_id: wallet.id,
        amount: -priceCents,
      },
    );

    if (rpcError) {
      console.error("Error deducting balance:", rpcError);
      return jsonErrorResponse(500, {
        code: ResponseCodesConstants.INTERNAL_SERVER_ERROR.code,
        success: false,
        message: "Payment failed during balance deduction",
      });
    }

    // 6. Record Transaction
    const { error: txError } = await supabase
      .from("wallet_transactions")
      .insert({
        wallet_id: wallet.id,
        amount: -priceCents,
        type: EXPENSE_TYPE.PAYMENT,
        status: TRANSACTION_STATUS.COMPLETED,
        description: `Pagamento prenotazione #${booking.id}`,
        created_at: new Date().toISOString(),
        user_id: userObject.id,
      });

    if (txError) {
      console.error("Error recording transaction:", txError);

      //Solving: since this is a wallet situation, the money have already been spent.
      //This means we don't need to work with Stripe, but just reset the balance on the wallet.
      const refundError = await BookingUtils.refundByWalletId(
        wallet.id,
        priceCents,
        booking.id,
        userObject.id,
      ); //logging handled in the utils function
      if (refundError) {
        return jsonErrorResponse(500, {
          code: ResponseCodesConstants.INTERNAL_SERVER_ERROR.code,
          success: false,
          message:
            "Critical error: payment deducted but failed to record transaction — manual reconciliation required.",
        });
      }
    }

    // 7. Update Booking Status
    const { data: updatedBooking, error: updateError } = await supabase
      .from("bookings")
      .update({
        payment_status: PaymentStatusEnum.PAID,
        payment_method: "WALLET",
        updated_at: new Date().toISOString(),
      })
      .eq("id", bookingId)
      .select(
        `
        *,
        consumer:consumers(*),
        vigil:vigils(*),
        service:services(*)
      `,
      )
      .single();

    if (updateError) {
      console.error("Error updating booking status:", updateError);
      const refundError = await BookingUtils.refundByWalletId(
        wallet.id,
        priceCents,
        booking.id,
        userObject.id,
      ); //logging handled in the utils function
      if (refundError) {
        return jsonErrorResponse(500, {
          code: ResponseCodesConstants.INTERNAL_SERVER_ERROR.code,
          success: false,
          message:
            "Critical error: payment deducted but failed to record transaction — manual reconciliation required.",
        });
      }
    }

    // 8. Send email notifications (best effort — don't fail the request)
    if (updatedBooking) {
      try {
        const consumerUser = await getUserByIdAdmin(userObject.id);
        if (consumerUser?.email) {
          await BookingUtilsServer.sendConsumerBookingStatusUpdateNotification(
            updatedBooking,
            consumerUser,
          );
        }

        if (updatedBooking.vigil_id) {
          const vigilUser = await getUserByIdAdmin(updatedBooking.vigil_id);
          if (vigilUser?.email) {
            await BookingUtilsServer.sendVigilBookingStatusUpdateNotification(
              updatedBooking,
              vigilUser,
            );
          }
        }
      } catch (emailError) {
        console.error(
          "Error sending wallet booking payment email notifications:",
          emailError,
        );
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        newBalance: newBalance,
        bookingId: bookingId,
      },
    });
  } catch (error) {
    console.error("API POST wallet/pay-booking error", error);
    return jsonErrorResponse(500, {
      code: ResponseCodesConstants.INTERNAL_SERVER_ERROR.code,
      success: false,
    });
  }
}
