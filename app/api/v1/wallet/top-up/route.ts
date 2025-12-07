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
    const { amount, currency = "eur", metadata } = body;

    console.log(`API POST wallet/top-up`, { amount, currency, metadata });

    // 1. Authenticate user
    const userObject = await authenticateUser(req);
    if (!userObject?.id || userObject.user_metadata?.role !== RolesEnum.CONSUMER) {
      return jsonErrorResponse(401, {
        code: ResponseCodesConstants.WALLET_TOP_UP_UNAUTHORIZED.code,
        success: false,
      });
    }

    // 2. Validate input
    if (!amount || typeof amount !== "number" || amount <= 0) {
      return jsonErrorResponse(400, {
        code: ResponseCodesConstants.WALLET_TOP_UP_BAD_REQUEST.code,
        success: false,
        message: "Invalid amount: must be a positive number in cents",
      });
    }

    const _admin = getAdminClient();

    // 3. Get Consumer
    const { data: consumer, error: consumerError } = await _admin
      .from("consumers")
      .select("id, stripe_customer_id")
      .eq("id", userObject.id) // <--- FIX: id corrisponde a user_id
      .single();

    if (consumerError || !consumer) {
      console.error("Consumer not found:", consumerError);
      return jsonErrorResponse(404, {
        code: ResponseCodesConstants.WALLET_TOP_UP_NOT_FOUND.code,
        success: false,
        message: "Consumer profile not found",
      });
    }

    // 4. Get Wallet (con gestione Auto-Creazione)
    // Cerchiamo il wallet collegato a questo consumer
    let { data: wallet, error: walletError } = await _admin
      .from("wallets")
      .select("id, consumer_id, balance_cents, currency") // <--- FIX: consumer_id
      .eq("consumer_id", consumer.id) // <--- FIX: consumer_id
      .maybeSingle(); // Usa maybeSingle per non lanciare errore se non c'è

    if (walletError) {
      console.error("Database error fetching wallet:", walletError);
      return jsonErrorResponse(500, {
         code: ResponseCodesConstants.WALLET_TOP_UP_ERROR.code,
         success: false,
         message: "Database error fetching wallet"
      });
    }

    // --- LOGICA AUTO-CREAZIONE (LAZY CREATION) ---
    // Se il wallet non esiste, lo creiamo ora prima di procedere al pagamento
    if (!wallet) {
      console.log(`Wallet missing for consumer ${consumer.id}. Creating new wallet...`);
      
      const { data: newWallet, error: createError } = await _admin
        .from("wallets")
        .insert({
          consumer_id: consumer.id, // <--- FIX: consumer_id
          balance_cents: 0,
          currency: 'eur',
          // Aggiungi qui altri campi obbligatori se il tuo DB li richiede (es. created_at, updated_at)
        })
        .select("id, consumer_id, balance_cents, currency")
        .single();

      if (createError || !newWallet) {
        console.error("Failed to auto-create wallet:", createError);
        return jsonErrorResponse(500, {
          code: ResponseCodesConstants.WALLET_TOP_UP_ERROR.code,
          success: false,
          message: "Failed to create wallet for user", 
          error: createError.message
        });
      }
      
      // Assegniamo il nuovo wallet alla variabile wallet per usarla dopo
      wallet = newWallet;
      console.log(`Wallet created successfully: ${wallet.id}`);
    }

    // 5. Stripe Customer Logic
    let stripeCustomerId = consumer.stripe_customer_id;

    if (!stripeCustomerId) {
      try {
        const stripeCustomer = await stripe.customers.create({
          email: userObject.email,
          metadata: {
            user_id: userObject.id,
            consumer_id: consumer.id,
          },
        });

        stripeCustomerId = stripeCustomer.id;

        await _admin
          .from("consumers")
          .update({
            stripe_customer_id: stripeCustomerId,
            updated_at: new Date().toISOString(),
          })
          .eq("id", consumer.id);
          
      } catch (stripeError: any) {
        console.error("Failed to create Stripe customer:", stripeError);
        return jsonErrorResponse(500, {
             code: ResponseCodesConstants.WALLET_TOP_UP_ERROR.code,
             success: false,
             message: `Stripe error: ${stripeError.message}`,
        });
      }
    }

    // 6. Create PaymentIntent
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount),
        currency: currency.toLowerCase(),
        customer: stripeCustomerId,
        setup_future_usage: "off_session",
        automatic_payment_methods: { enabled: true },
        metadata: {
          user_id: userObject.id,
          wallet_id: wallet.id, // Ora siamo sicuri al 100% che wallet.id esiste
          transaction_type: "TOP_UP",
          ...(metadata?.bundleId && { bundle_id: metadata.bundleId }),
          ...(metadata?.creditAmount && { credit_amount: metadata.creditAmount }),
          ...(metadata?.type && { type: metadata.type }),
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
    } catch (stripeError: any) {
      console.error("Failed to create PaymentIntent:", stripeError);
      return jsonErrorResponse(500, {
        code: ResponseCodesConstants.WALLET_TOP_UP_ERROR.code,
        success: false,
        message: `Stripe error: ${stripeError.message}`,
      });
    }
  } catch (error: any) {
    console.error("Error in wallet top-up:", error);
    return jsonErrorResponse(500, {
      code: ResponseCodesConstants.WALLET_TOP_UP_ERROR.code,
      success: false,
      error: error.message || "Unknown error",
    });
  }
}