import { NextRequest, NextResponse } from "next/server";
import {
  authenticateUser,
  getAdminClient,
  jsonErrorResponse,
} from "@/server/api.utils.server";
import { RolesEnum } from "@/src/enums/roles.enums";
import { ReviewFormI } from "@/src/types/review.types";

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ reviewId: string }> }
) {
  try {
    const { reviewId } = await context.params;
    const body: Partial<ReviewFormI & { visible: boolean }> = await req.json();
    console.log(`API PUT reviews/${reviewId}`, body);

    const userObject = await authenticateUser(req);
    if (!userObject?.id) {
      return jsonErrorResponse(401, {
        code: "REVIEWS_UPDATE_UNAUTHORIZED",
        success: false,
      });
    }

    if (!reviewId) {
      return jsonErrorResponse(400, {
        code: "REVIEWS_UPDATE_BAD_REQUEST",
        success: false,
        error: "Review ID is required",
      });
    }

    const _admin = getAdminClient();

    // Get existing review
    const { data: existingReview, error: fetchError } = await _admin
      .from("reviews")
      .select("*")
      .eq("id", reviewId)
      .single();

    if (fetchError || !existingReview) {
      return jsonErrorResponse(404, {
        code: "REVIEWS_UPDATE_NOT_FOUND",
        success: false,
      });
    }

    // Check permissions
    const isOwner = existingReview.consumer_id === userObject.id;
    const isAdmin = userObject.user_metadata?.role === RolesEnum.ADMIN;

    if (!isOwner && !isAdmin) {
      return jsonErrorResponse(403, {
        code: "REVIEWS_UPDATE_FORBIDDEN",
        success: false,
      });
    }

    // Validate updates
    const updates: any = {};
    
    if (body.rating !== undefined) {
      if (body.rating < 1 || body.rating > 5) {
        return jsonErrorResponse(400, {
          code: "REVIEWS_UPDATE_BAD_REQUEST",
          success: false,
          error: "Rating must be between 1 and 5",
        });
      }
      updates.rating = body.rating;
    }

    if (body.comment !== undefined) {
      if (!body.comment.trim()) {
        return jsonErrorResponse(400, {
          code: "REVIEWS_UPDATE_BAD_REQUEST",
          success: false,
          error: "Comment cannot be empty",
        });
      }
      updates.comment = body.comment.trim();
    }

    // Only admins can update visibility
    if (body.visible !== undefined && isAdmin) {
      updates.visible = body.visible;
    }

    if (Object.keys(updates).length === 0) {
      return jsonErrorResponse(400, {
        code: "REVIEWS_UPDATE_BAD_REQUEST",
        success: false,
        error: "No valid updates provided",
      });
    }

    updates.updated_at = new Date().toISOString();

    // Update review
    const { data, error } = await _admin
      .from("reviews")
      .update(updates)
      .eq("id", reviewId)
      .select(`
        *,
        booking:bookings(*),
        consumer:auth.users!reviews_consumer_id_fkey(id, raw_user_meta_data),
        vigil:auth.users!reviews_vigil_id_fkey(id, raw_user_meta_data)
      `)
      .single();

    if (error || !data) {
      throw error;
    }

    return NextResponse.json({
      code: "REVIEWS_UPDATE_SUCCESS",
      data,
      success: true,
    });
  } catch (error) {
    console.error("Review update error:", error);
    return jsonErrorResponse(500, {
      code: "REVIEWS_UPDATE_ERROR",
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ reviewId: string }> }
) {
  try {
    const { reviewId } = await context.params;
    console.log(`API DELETE reviews/${reviewId}`);

    const userObject = await authenticateUser(req);
    if (!userObject?.id) {
      return jsonErrorResponse(401, {
        code: "REVIEWS_DELETE_UNAUTHORIZED",
        success: false,
      });
    }

    if (!reviewId) {
      return jsonErrorResponse(400, {
        code: "REVIEWS_DELETE_BAD_REQUEST",
        success: false,
        error: "Review ID is required",
      });
    }

    const _admin = getAdminClient();

    // Get existing review
    const { data: existingReview, error: fetchError } = await _admin
      .from("reviews")
      .select("*")
      .eq("id", reviewId)
      .single();

    if (fetchError || !existingReview) {
      return jsonErrorResponse(404, {
        code: "REVIEWS_DELETE_NOT_FOUND",
        success: false,
      });
    }

    // Check permissions
    const isOwner = existingReview.consumer_id === userObject.id;
    const isAdmin = userObject.user_metadata?.role === RolesEnum.ADMIN;

    if (!isOwner && !isAdmin) {
      return jsonErrorResponse(403, {
        code: "REVIEWS_DELETE_FORBIDDEN",
        success: false,
      });
    }

    // Delete review
    const { error } = await _admin
      .from("reviews")
      .delete()
      .eq("id", reviewId);

    if (error) {
      throw error;
    }

    return NextResponse.json({
      code: "REVIEWS_DELETE_SUCCESS",
      data: { id: reviewId },
      success: true,
    });
  } catch (error) {
    console.error("Review deletion error:", error);
    return jsonErrorResponse(500, {
      code: "REVIEWS_DELETE_ERROR",
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
