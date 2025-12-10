import { NextRequest, NextResponse } from "next/server";
import {
  authenticateUser,
  getAdminClient,
  getPagination,
  getQueryParams,
  jsonErrorResponse,
} from "@/server/api.utils.server";
import { ResponseCodesConstants } from "@/src/constants";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await context.params;
    const { nextUrl, url } = req;

    const pagination = getPagination(nextUrl);
    const { from, to, page, itemPerPage } = pagination;
    const filters = getQueryParams(url, ["page", "pageSize"]);
    const { orderBy = "created_at", orderDirection = "DESC" } = filters;

     console.log(`API GET transaction`, filters, pagination);
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
      .select("id,balance_cents")
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
    let db_query = supabase
      .from("wallet_transactions")
      .select("*", { count: "exact" })
      .eq("wallet_id", wallet.id)
      .order("created_at", { ascending: false });

    if (from !== undefined && to !== undefined) {
      db_query = db_query.range(from, to);
    }

    const { data: transactions, error: txError, count } = await db_query;

    if (txError) {
      console.error("Error fetching transactions:", txError);
      return jsonErrorResponse(500, {
        code: ResponseCodesConstants.WALLET_TRANSACTIONS_ERROR.code,
        success: false,
        message: "Failed to fetch transactions",
      });
    }

    // Calculate totals (using a separate query to get full sums without pagination limits)
    // Note: For large datasets, this should be optimized or cached.
    const { data: allTransactions } = await supabase
        .from("wallet_transactions")
        .select("amount, type")
        .eq("wallet_id", wallet.id);

    let totalDeposited = 0;
    let totalSpent = 0;

    if (allTransactions) {
        const incomeTypes = ["TOP_UP", "CREDIT", "BONUS", "REFUND"];
        const expenseTypes = ["PAYMENT", "DEBIT"];

        totalDeposited = allTransactions
            .filter((tx) => incomeTypes.includes(tx.type))
            .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);

        totalSpent = allTransactions
            .filter((tx) => expenseTypes.includes(tx.type))
            .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);
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

    return NextResponse.json({
      success: true,
      data: { 
        balance: wallet.balance_cents, 
        totalDeposited,
        totalSpent,
        transactions: mappedTransactions, 
        pagination: { page, pages: Math.ceil((count || 0) / itemPerPage), itemPerPage, count } 
      },
    });
  } catch (error) {
    console.error("API GET wallet/transactions error", error);
    return jsonErrorResponse(500, {
      code: ResponseCodesConstants.WALLET_TRANSACTIONS_ERROR.code,
      success: false,
    });
  }
}
