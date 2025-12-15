import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import {
  authenticateUser,
  getAdminClient,
  jsonErrorResponse,
} from "@/server/api.utils.server";
import { ResponseCodesConstants } from "@/src/constants";
import { RolesEnum } from "@/src/enums/roles.enums";
import { TRANSACTION_TYPE } from "@/src/types/transactions.types";

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
    if (
      !userObject?.id ||
      userObject.user_metadata?.role !== RolesEnum.CONSUMER
    ) {
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

    // 4. Get Wallet (con gestione Auto-Creazione)
    // Cerchiamo il wallet collegato a questo consumer
    let { data: wallet, error: walletError } = await _admin
      .from("wallets")
      .select("id, user_id, balance_cents, currency") 
      .eq("user_id", userObject.id) 
      .maybeSingle(); // Usa maybeSingle per non lanciare errore se non c'è
    if (walletError) {
      console.error("Database error fetching wallet:", walletError);
      return jsonErrorResponse(500, {
        code: ResponseCodesConstants.WALLET_TOP_UP_ERROR.code,
        success: false,
        message: "Database error fetching wallet",
      });
    }

    // --- LOGICA AUTO-CREAZIONE (LAZY CREATION) ---
    // Se il wallet non esiste, lo creiamo ora prima di procedere al pagamento
    if (!wallet) {
      console.log(
        `Wallet missing for consumer ${userObject.id}. Creating new wallet (with upsert)...`
      );
      /*
        // TODO: usare enum  
        // TODO: check "Payment intent does not belong to the authenticated user"
        // TODO: consumer_id -> user_id su wallets 
        // TODO: change wallet id to uuid
        TODO: check count functions on supabase
        TODO: add user_id to transactions (UUID)
        // TODO: change wallet_transaction_id to UUID 
        TODO: Manuel -> dove c'e' paginazione add calc totale speso e depositato 

        TODO da valutare: db function to create wallet when create consumer 
      */

      // Try to insert, but ignore if already exists (upsert)
      const { error: createError } = await _admin.from("wallets").insert({
        user_id: userObject.id,
        balance_cents: 0,
        currency: "eur",
      });

      if (createError) {
        console.error("Failed to create wallet:", createError);
        // If the error is not a unique violation, fail; otherwise, continue
        return jsonErrorResponse(500, {
          code: ResponseCodesConstants.WALLET_TOP_UP_ERROR.code,
          success: false,
          message: "Failed to create wallet for user",
          error: createError.message,
        });
      }

      // Fetch the wallet again (should exist now)
      const { data: fetchedWallet, error: fetchError } = await _admin
        .from("wallets")
        .select("id, user_id, balance_cents, currency")
        .eq("user_id", userObject.id)
        .maybeSingle();

      if (fetchError || !fetchedWallet) {
        console.error("Failed to fetch wallet after upsert:", fetchError);
        return jsonErrorResponse(500, {
          code: ResponseCodesConstants.WALLET_TOP_UP_ERROR.code,
          success: false,
          message: "Failed to fetch wallet after creation",
          error: fetchError?.message,
        });
      }

      wallet = fetchedWallet;
      console.log(`Wallet created or found successfully: ${wallet.id}`);
    }

    // 6. Create PaymentIntent
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount),
        currency: currency.toLowerCase(),
        setup_future_usage: "off_session",
        automatic_payment_methods: { enabled: true },
        metadata: {
          user_id: userObject.id,
          wallet_id: wallet.id, // Ora siamo sicuri al 100% che wallet.id esiste
          transaction_type: TRANSACTION_TYPE.TOP_UP,
          ...(metadata?.bundleId && { bundle_id: metadata.bundleId }),
          ...(metadata?.creditAmount && {
            credit_amount: metadata.creditAmount,
          }),
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
