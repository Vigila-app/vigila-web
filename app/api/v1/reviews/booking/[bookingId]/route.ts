import { NextRequest, NextResponse } from "next/server";
import {
  authenticateUser,
  getAdminClient,
  jsonErrorResponse,
} from "@/server/api.utils.server";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ bookingId: string }> }
) {
  try {
    const { bookingId } = await context.params;
    console.log(`API GET reviews/booking/${bookingId}`);

    const userObject = await authenticateUser(req);
    if (!userObject?.id) {
      return jsonErrorResponse(401, {
        code: "REVIEWS_BOOKING_UNAUTHORIZED",
        success: false,
      });
    }

    if (!bookingId) {
      return jsonErrorResponse(400, {
        code: "REVIEWS_BOOKING_BAD_REQUEST",
        success: false,
        error: "Booking ID is required",
      });
    }

    const _admin = getAdminClient();

    // Get review for the booking
    const { data, error } = await _admin
      .from("reviews")
      .select(`
        *,
        booking:bookings(*),
        consumer:consumers(displayName),
        vigil:vigils(displayName)
      `)
      .eq("booking_id", bookingId)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return NextResponse.json({
      code: "REVIEWS_BOOKING_SUCCESS",
      data: data || null,
      success: true,
    });
  } catch (error) {
    console.error("Review by booking error:", error);
    return jsonErrorResponse(500, {
      code: "REVIEWS_BOOKING_ERROR",
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
