import { NextRequest, NextResponse } from "next/server";
import {
  authenticateUser,
  getAdminClient,
  jsonErrorResponse,
} from "@/server/api.utils.server";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ vigilId: string }> }
) {
  try {
    const { vigilId } = await context.params;
    console.log(`API GET reviews/vigil/${vigilId}/stats`);

    const userObject = await authenticateUser(req);
    if (!userObject?.id) {
      return jsonErrorResponse(401, {
        code: "REVIEWS_STATS_UNAUTHORIZED",
        success: false,
      });
    }

    if (!vigilId) {
      return jsonErrorResponse(400, {
        code: "REVIEWS_STATS_BAD_REQUEST",
        success: false,
        error: "Vigil ID is required",
      });
    }

    const _admin = getAdminClient();

    // Get average rating and total reviews
    const { data: averageData, error: averageError } = await _admin
      .rpc("get_vigil_average_rating", { vigil_user_id: vigilId });

    if (averageError) {
      throw averageError;
    }

    // Get rating distribution
    const { data: distributionData, error: distributionError } = await _admin
      .rpc("get_vigil_rating_distribution", { vigil_user_id: vigilId });

    if (distributionError) {
      throw distributionError;
    }

    const stats = {
      average_rating: averageData?.[0]?.average_rating || 0,
      total_reviews: Number(averageData?.[0]?.total_reviews || 0),
      rating_distribution: distributionData || [],
    };

    return NextResponse.json({
      code: "REVIEWS_STATS_SUCCESS",
      data: stats,
      success: true,
    });
  } catch (error) {
    console.error("Vigil stats error:", error);
    return jsonErrorResponse(500, {
      code: "REVIEWS_STATS_ERROR",
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
