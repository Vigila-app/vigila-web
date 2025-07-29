import { NextRequest, NextResponse } from "next/server";
import {
  authenticateUser,
  getAdminClient,
  jsonErrorResponse,
  getPagination,
} from "@/server/api.utils.server";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ vigilId: string }> }
) {
  try {
    const { vigilId } = await context.params;
    console.log(`API GET reviews/vigil/${vigilId}`);

    const userObject = await authenticateUser(req);
    if (!userObject?.id) {
      return jsonErrorResponse(401, {
        code: "REVIEWS_VIGIL_UNAUTHORIZED",
        success: false,
      });
    }

    if (!vigilId) {
      return jsonErrorResponse(400, {
        code: "REVIEWS_VIGIL_BAD_REQUEST",
        success: false,
        error: "Vigil ID is required",
      });
    }

    const { nextUrl } = req;
    const pagination = getPagination(nextUrl);
    const { from, to } = pagination;

    const _admin = getAdminClient();

    // Get reviews for the vigil
    let query = _admin
      .from("reviews")
      .select(`
        *,
        booking:bookings(*),
        consumer:consumers(displayName),
        vigil:vigils(displayName)
      `, { count: "exact" })
      .eq("vigil_id", vigilId)
      .eq("visible", true)
      .order("created_at", { ascending: false });

    if (from !== undefined && to !== undefined) {
      query = query.range(from, to);
    }

    const { data, error, count } = await query;

    if (error) {
      throw error;
    }

    return NextResponse.json({
      code: "REVIEWS_VIGIL_SUCCESS",
      data: data || [],
      count,
      success: true,
    });
  } catch (error) {
    console.error("Reviews by vigil error:", error);
    return jsonErrorResponse(500, {
      code: "REVIEWS_VIGIL_ERROR",
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
