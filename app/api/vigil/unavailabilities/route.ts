import {
  authenticateUser,
  getAdminClient,
  jsonErrorResponse,
} from "@/server/api.utils.server";
import { ResponseCodesConstants } from "@/src/constants";
import { RolesEnum } from "@/src/enums/roles.enums";
import {
  VigilUnavailabilityI,
  VigilUnavailabilityFormI,
} from "@/src/types/calendar.types";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/vigil/unavailabilities
 * 
 * Returns all unavailabilities for the authenticated vigil
 */
export async function GET(req: NextRequest) {
  try {
    // Authenticate user
    const userObject = await authenticateUser(req);
    if (!userObject?.id) {
      return jsonErrorResponse(401, {
        code: ResponseCodesConstants.BOOKINGS_CREATE_UNAUTHORIZED.code,
        success: false,
        message: "Unauthorized",
      } as any);
    }

    // Verify user is a vigil
    if (userObject.user_metadata?.role !== RolesEnum.VIGIL) {
      return jsonErrorResponse(403, {
        code: ResponseCodesConstants.BOOKINGS_CREATE_UNAUTHORIZED.code,
        success: false,
        message: "Only vigils can access this endpoint",
      } as any);
    }

    const _admin = getAdminClient();

    // Get all unavailabilities for this vigil
    const { data: unavailabilities, error } = await _admin
      .from("vigil_unavailabilities")
      .select("*")
      .eq("vigil_id", userObject.id)
      .order("start_at", { ascending: true });

    if (error) throw error;

    return NextResponse.json(
      {
        code: "UNAVAILABILITIES_LIST_SUCCESS",
        data: unavailabilities || [],
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get unavailabilities error:", error);
    return jsonErrorResponse(500, {
      code: "UNAVAILABILITIES_LIST_ERROR",
      success: false,
      error,
    } as any);
  }
}

/**
 * POST /api/vigil/unavailabilities
 * 
 * Creates a new unavailability for the authenticated vigil
 */
export async function POST(req: NextRequest) {
  try {
    // Authenticate user
    const userObject = await authenticateUser(req);
    if (!userObject?.id) {
      return jsonErrorResponse(401, {
        code: ResponseCodesConstants.BOOKINGS_CREATE_UNAUTHORIZED.code,
        success: false,
        message: "Unauthorized",
      } as any);
    }

    // Verify user is a vigil
    if (userObject.user_metadata?.role !== RolesEnum.VIGIL) {
      return jsonErrorResponse(403, {
        code: ResponseCodesConstants.BOOKINGS_CREATE_UNAUTHORIZED.code,
        success: false,
        message: "Only vigils can create unavailabilities",
      } as any);
    }

    const body: VigilUnavailabilityFormI = await req.json();

    // Validate required fields
    if (!body.start_at || !body.end_at) {
      return jsonErrorResponse(400, {
        code: "UNAVAILABILITIES_CREATE_BAD_REQUEST",
        success: false,
        message: "Missing required fields: start_at, end_at",
      } as any);
    }

    // Validate time range
    const startDate = new Date(body.start_at);
    const endDate = new Date(body.end_at);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return jsonErrorResponse(400, {
        code: "UNAVAILABILITIES_CREATE_BAD_REQUEST",
        success: false,
        message: "Invalid date format for start_at or end_at",
      } as any);
    }

    if (endDate <= startDate) {
      return jsonErrorResponse(400, {
        code: "UNAVAILABILITIES_CREATE_BAD_REQUEST",
        success: false,
        message: "end_at must be after start_at",
      } as any);
    }

    const _admin = getAdminClient();

    // Create the unavailability (vigil_id is set from authenticated user)
    const newUnavailability = {
      vigil_id: userObject.id, // Always use authenticated user's ID
      start_at: body.start_at,
      end_at: body.end_at,
      reason: body.reason || null,
    };

    const { data: unavailability, error } = await _admin
      .from("vigil_unavailabilities")
      .insert(newUnavailability)
      .select()
      .single<VigilUnavailabilityI>();

    if (error || !unavailability) throw error;

    return NextResponse.json(
      {
        code: "UNAVAILABILITIES_CREATE_SUCCESS",
        data: unavailability,
        success: true,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create unavailability error:", error);
    return jsonErrorResponse(500, {
      code: "UNAVAILABILITIES_CREATE_ERROR",
      success: false,
      error,
    } as any);
  }
}
