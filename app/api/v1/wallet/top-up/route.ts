import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import {
  authenticateUser,
  getAdminClient,
  jsonErrorResponse,
} from "@/server/api.utils.server";
import { ResponseCodesConstants } from "@/src/constants";
import { RolesEnum } from "@/src/enums/roles.enums";

// Initialize Stripe with the latest API version
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-04-10",
});

/**
 * POST /api/v1/wallet/top-up
 * 
 * Initializes a wallet top-up by creating a Stripe PaymentIntent.
 * 
 * Security considerations:
 * - Authenticates user before processing
 * - Creates/reuses Stripe customer ID for secure payment tracking
 * - Uses setup_future_usage for SCA-compliant future payments
 * - Includes metadata for webhook reconciliation
 * - Never stores raw card numbers
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { amount, currency = "eur" } = body;

    console.log(`API POST wallet/top-up`, { amount, currency });

    // Authenticate user - only CONSUMERs can top up their wallet
    const userObject = await authenticateUser(req);
    if (!userObject?.id || userObject.user_metadata?.role !== RolesEnum.CONSUMER) {
      return jsonErrorResponse(401, {
        code: ResponseCodesConstants.WALLET_TOP_UP_UNAUTHORIZED.code,
        success: false,
      });
    }

    // Validate input
    if (!amount || typeof amount !== "number" || amount <= 0) {
      return jsonErrorResponse(400, {
        code: ResponseCodesConstants.WALLET_TOP_UP_BAD_REQUEST.code,
        success: false,
        message: "Invalid amount: must be a positive number in cents",
      });
    }

    // Validate currency - whitelist of supported ISO 4217 currency codes
    // Using a whitelist to prevent invalid codes and limit to currencies we support
    const SUPPORTED_CURRENCIES = ["eur", "usd", "gbp", "chf"];
    const normalizedCurrency = currency.toLowerCase();
    if (!SUPPORTED_CURRENCIES.includes(normalizedCurrency)) {
      return jsonErrorResponse(400, {
        code: ResponseCodesConstants.WALLET_TOP_UP_BAD_REQUEST.code,
        success: false,
        message: `Invalid currency: must be one of ${SUPPORTED_CURRENCIES.join(", ").toUpperCase()}`,
      });
    }

    const _admin = getAdminClient();

    // Fetch the user's consumer record to get/create stripe_customer_id
    const { data: consumer, error: consumerError } = await _admin
      .from("consumers")
      .select("id, user_id, stripe_customer_id")
      .eq("user_id", userObject.id)
      .single();

    if (consumerError || !consumer) {
      console.error("Consumer not found:", consumerError);
      return jsonErrorResponse(404, {
        code: ResponseCodesConstants.WALLET_TOP_UP_NOT_FOUND.code,
        success: false,
        message: "Consumer profile not found",
      });
    }

    // Fetch the user's wallet
    const { data: wallet, error: walletError } = await _admin
      .from("wallets")
      .select("id, user_id, balance_cents, currency")
      .eq("user_id", userObject.id)
      .single();

    if (walletError || !wallet) {
      console.error("Wallet not found:", walletError);
      return jsonErrorResponse(404, {
        code: ResponseCodesConstants.WALLET_TOP_UP_NOT_FOUND.code,
        success: false,
        message: "Wallet not found",
      });
    }

    let stripeCustomerId = consumer.stripe_customer_id;

    // Customer Logic: Create Stripe customer if not exists
    if (!stripeCustomerId) {
      try {
        // Create a new Stripe customer
        const stripeCustomer = await stripe.customers.create({
          email: userObject.email,
          metadata: {
            user_id: userObject.id,
            consumer_id: consumer.id,
          },
        });

        stripeCustomerId = stripeCustomer.id;

        // Save the Stripe customer ID to the consumer record
        const { error: updateError } = await _admin
          .from("consumers")
          .update({
            stripe_customer_id: stripeCustomerId,
            updated_at: new Date().toISOString(),
          })
          .eq("id", consumer.id);

        if (updateError) {
          console.error("Failed to save Stripe customer ID:", updateError);
          // Continue anyway - the payment can still proceed
        }
      } catch (stripeError) {
        console.error("Failed to create Stripe customer:", stripeError);
        
        if (stripeError instanceof Stripe.errors.StripeError) {
          return jsonErrorResponse(500, {
            code: ResponseCodesConstants.WALLET_TOP_UP_ERROR.code,
            success: false,
            message: `Stripe error: ${stripeError.message}`,
          });
        }
        throw stripeError;
      }
    }

    // Payment Logic: Create a Stripe PaymentIntent
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount), // Amount in cents
        currency: normalizedCurrency,
        customer: stripeCustomerId,
        // Enable future off-session payments (handles SCA mandates)
        setup_future_usage: "off_session",
        automatic_payment_methods: {
          enabled: true,
        },
        // CRITICAL: Metadata for webhook reconciliation
        metadata: {
          user_id: userObject.id,
          wallet_id: wallet.id,
          transaction_type: "TOP_UP",
        },
        description: `Wallet top-up for user ${userObject.id}`,
      });

      return NextResponse.json(
        {
          code: ResponseCodesConstants.WALLET_TOP_UP_SUCCESS.code,
          clientSecret: paymentIntent.client_secret,
          success: true,
        },
        { status: 200 }
      );
    } catch (stripeError) {
      console.error("Failed to create PaymentIntent:", stripeError);

      if (stripeError instanceof Stripe.errors.StripeError) {
        // Handle specific Stripe errors
        if (stripeError.type === "StripeCardError") {
          return jsonErrorResponse(400, {
            code: ResponseCodesConstants.WALLET_TOP_UP_BAD_REQUEST.code,
            success: false,
            message: stripeError.message,
          });
        }

        return jsonErrorResponse(500, {
          code: ResponseCodesConstants.WALLET_TOP_UP_ERROR.code,
          success: false,
          message: `Stripe error: ${stripeError.message}`,
        });
      }

      throw stripeError;
    }
  } catch (error) {
    console.error("Error in wallet top-up:", error);
    return jsonErrorResponse(500, {
      code: ResponseCodesConstants.WALLET_TOP_UP_ERROR.code,
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
