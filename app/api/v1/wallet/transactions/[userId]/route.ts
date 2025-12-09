import { NextRequest, NextResponse } from "next/server";
import {
  authenticateUser,
  getAdminClient,
  jsonErrorResponse,
} from "@/server/api.utils.server";
import { ResponseCodesConstants } from "@/src/constants";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await context.params;

    // 1. Authenticate user
    const userObject = await authenticateUser(req);
    if (!userObject?.id) {
      return jsonErrorResponse(401, {
        code: ResponseCodesConstants.WALLET_TRANSACTIONS_UNAUTHORIZED.code,
        success: false,
      });
    }

    // 2. Authorization: Ensure the wallet belongs to the authenticated user
    const supabase = getAdminClient();

    // 3. Get Wallet ID for the authenticated user
    const { data: wallet, error: walletError } = await supabase
      .from("wallets")
      .select("id")
      .eq("consumer_id", userObject.id)
      .single();

    if (walletError || !wallet) {
      console.error("Wallet not found for user:", userObject.id, walletError);
      return jsonErrorResponse(403, {
        code: ResponseCodesConstants.WALLET_TRANSACTIONS_UNAUTHORIZED.code,
        success: false,
        message: "You are not authorized to access these wallet transactions",
      });
    }

    // 4. Get Transactions for the wallet
    const { data: transactions, error: txError } = await supabase
      .from("wallet_transactions")
      .select("*")
      .eq("wallet_id", wallet.id)
      .order("created_at", { ascending: false });

    if (txError) {
      console.error("Error fetching transactions:", txError);
      return jsonErrorResponse(500, {
        code: ResponseCodesConstants.WALLET_TRANSACTIONS_ERROR.code,
        success: false,
        message: "Failed to fetch transactions",
      });
    }

    // 5. Map to frontend type
    const mappedTransactions = transactions.map((tx: any) => ({
      id: tx.id,
      wallet_id: wallet.id,
      amount: tx.amount,
      currency: tx.currency || "EUR",
      status: tx.status,
      type: tx.type,
      description: tx.description || tx.title || "Transaction",
      created_at: tx.created_at,
      stripe_payment_id: tx.stripe_payment_id || null,
    }));

    return NextResponse.json({ data: mappedTransactions });
  } catch (error) {
    console.error("API GET wallet/transactions error", error);
    return jsonErrorResponse(500, {
      code: ResponseCodesConstants.WALLET_TRANSACTIONS_ERROR.code,
      success: false,
    });
  }
}
