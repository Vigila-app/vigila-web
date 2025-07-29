import { NextRequest, NextResponse } from "next/server";
import {
  authenticateUser,
  getAdminClient,
  jsonErrorResponse,
  getPagination,
  getQueryParams,
} from "@/server/api.utils.server";
import { RolesEnum } from "@/src/enums/roles.enums";
import { ReviewFormI } from "@/src/types/review.types";
import { BookingStatusEnum } from "@/src/enums/booking.enums";

export async function GET(req: NextRequest) {
  try {
    const { nextUrl, url } = req;
    console.log(`API GET reviews`);

    const userObject = await authenticateUser(req);
    if (!userObject?.id) {
      return jsonErrorResponse(401, {
        code: "REVIEWS_UNAUTHORIZED",
        success: false,
      });
    }

    const pagination = getPagination(nextUrl);
    const { from, to } = pagination;
    const filters = getQueryParams(url, ["vigil_id", "consumer_id"]);

    const _admin = getAdminClient();
    let query = _admin
      .from("reviews")
      .select(
        `
        *,
        booking:bookings(*),
        consumer:consumers(displayName),
        vigil:vigils(displayName)
      `,
        { count: "exact" }
      )
      .order("created_at", { ascending: false });

    // Apply role-based filtering
    if (userObject.user_metadata?.role === RolesEnum.CONSUMER) {
      query = query.eq("consumer_id", userObject.id);
    } else if (filters.consumer_id) {
      query = query.eq("consumer_id", filters.consumer_id);
    }
    if (userObject.user_metadata?.role === RolesEnum.VIGIL) {
      query = query.eq("vigil_id", userObject.id);
    } else if (filters.vigil_id) {
      query = query.eq("vigil_id", filters.vigil_id);
    }
    if (userObject.user_metadata?.role !== RolesEnum.ADMIN) {
      query = query.eq("visible", true);
    }

    if (from !== undefined && to !== undefined) {
      query = query.range(from, to);
    }

    const { data, error, count } = await query;

    if (error) {
      throw error;
    }

    return NextResponse.json({
      code: "REVIEWS_LIST_SUCCESS",
      data: data || [],
      count,
      success: true,
    });
  } catch (error) {
    console.error("Reviews list error:", error);
    return jsonErrorResponse(500, {
      code: "REVIEWS_LIST_ERROR",
      success: false,
      error,
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body: ReviewFormI = await req.json();
    console.log(`API POST reviews`, body);

    const userObject = await authenticateUser(req);
    if (
      !userObject?.id ||
      userObject.user_metadata?.role !== RolesEnum.CONSUMER
    ) {
      return jsonErrorResponse(401, {
        code: "REVIEWS_CREATE_UNAUTHORIZED",
        success: false,
      });
    }

    if (!(body?.booking_id && body?.rating && body?.comment)) {
      return jsonErrorResponse(400, {
        code: "REVIEWS_CREATE_BAD_REQUEST",
        success: false,
        error: "Missing required fields: booking_id, rating, comment",
      });
    }

    if (body.rating < 1 || body.rating > 5) {
      return jsonErrorResponse(400, {
        code: "REVIEWS_CREATE_BAD_REQUEST",
        success: false,
        error: "Rating must be between 1 and 5",
      });
    }

    // Validate comment length
    if (!body.comment.trim()) {
      return jsonErrorResponse(400, {
        code: "REVIEWS_CREATE_BAD_REQUEST",
        success: false,
        error: "Comment cannot be empty",
      });
    }

    const _admin = getAdminClient();

    const { data: booking, error: bookingError } = await _admin
      .from("bookings")
      .select("*")
      .eq("id", body.booking_id)
      .eq("consumer_id", userObject.id)
      .eq("status", BookingStatusEnum.COMPLETED)
      .single();

    if (bookingError || !booking) {
      return jsonErrorResponse(400, {
        code: "REVIEWS_CREATE_BAD_REQUEST",
        success: false,
        error: "Booking not found, not owned by user, or not completed",
      });
    }

    const { data: existingReview, error: existingError } = await _admin
      .from("reviews")
      .select("id")
      .eq("booking_id", body.booking_id)
      .maybeSingle();

    if (existingError) {
      throw existingError;
    }

    if (existingReview) {
      return jsonErrorResponse(409, {
        code: "REVIEWS_CREATE_CONFLICT",
        success: false,
        error: "Review already exists for this booking",
      });
    }

    const newReview = {
      booking_id: body.booking_id,
      consumer_id: userObject.id,
      vigil_id: booking.vigil_id,
      rating: body.rating,
      comment: body.comment.trim().substring(0, 500), // TODO sanitize comment
      visible: true,
    };

    const { data, error } = await _admin
      .from("reviews")
      .insert(newReview)
      .select("*")
      .single();

    if (error || !data) {
      throw error;
    }

    return NextResponse.json(
      {
        code: "REVIEWS_CREATE_SUCCESS",
        data,
        success: true,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Review creation error:", error);
    return jsonErrorResponse(500, {
      code: "REVIEWS_CREATE_ERROR",
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
