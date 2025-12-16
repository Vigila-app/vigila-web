import { NextRequest, NextResponse } from "next/server"
import {
  authenticateUser,
  getAdminClient,
  getPagination,
  getQueryParams,
  jsonErrorResponse,
} from "@/server/api.utils.server"
import { ResponseCodesConstants } from "@/src/constants"
import {
  isValidExpenseType,
  isValidTransactionType,
} from "@/src/types/transactions.types"

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ userId: string }> }
) {
  try {
    const { nextUrl, url } = req

    const pagination = getPagination(nextUrl)
    const { from, to, page, itemPerPage } = pagination
    const filters = getQueryParams(url, ["page", "pageSize"])

    console.log(`API GET transaction`, filters, pagination)
    // 1. Authenticate user
    const userObject = await authenticateUser(req)
    if (!userObject?.id) {
      return jsonErrorResponse(401, {
        code: ResponseCodesConstants.WALLET_TRANSACTIONS_UNAUTHORIZED.code,
        success: false,
      })
    }

    // 2. Authorization: Ensure the wallet belongs to the authenticated user
    const supabase = getAdminClient()

    // 3. Get Transactions for user id
    let db_query = supabase
      .from("wallet_transactions")
      .select("*", { count: "exact" })
      .eq("user_id", userObject.id)
      .order("created_at", { ascending: false })

    if (from !== undefined && to !== undefined) {
      db_query = db_query.range(from, to)
    }

    const { data: transactions, error: txError, count } = await db_query

    if (txError) {
      console.error("Error fetching transactions:", txError)
      return jsonErrorResponse(500, {
        code: ResponseCodesConstants.WALLET_TRANSACTIONS_ERROR.code,
        success: false,
        message: "Failed to fetch transactions",
      })
    }

    const {
      data: { totalDeposited, totalSpent },
    } = await supabase.functions.invoke("wallet-totals", {
      body: { userId: userObject.id },
    })

    const { data: wallet, error: walletError } = await supabase
      .from("wallets")
      .select("balance_cents")
      .eq("user_id", userObject.id)
      .single()

    if (walletError) {
      return jsonErrorResponse(500, {
        code: ResponseCodesConstants.WALLET_NOT_FOUND.code,
        success: false,
        message: "Failed to fetch wallet",
      })
    }

    return NextResponse.json({
      success: true,
      data: {
        balance: wallet.balance_cents,
        totalDeposited,
        totalSpent,
        transactions,
        pagination: {
          page,
          pages: Math.ceil((count || 0) / itemPerPage),
          itemPerPage,
          count,
        },
      },
    })
  } catch (error) {
    console.error("API GET wallet/transactions error", error)
    return jsonErrorResponse(500, {
      code: ResponseCodesConstants.WALLET_TRANSACTIONS_ERROR.code,
      success: false,
    })
  }
}
