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
import {
  isValidUnavailabilityDateRange,
  unavailabilitiesOverlap,
} from "@/src/utils/calendar.utils";
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
      { status: 200 },
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
    // dati passati dal front end
    const body: VigilUnavailabilityFormI = await req.json();

    // Validate required fields
    if (!body.start_at || !body.end_at) {
      return jsonErrorResponse(400, {
        code: "UNAVAILABILITIES_CREATE_BAD_REQUEST",
        success: false,
        message: "Missing required fields: start_at, end_at",
      } as any);
    }
    // Validate datetime range using utility function
    const dateRangeValidation = isValidUnavailabilityDateRange(
      body.start_at,
      body.end_at,
    );
    if (!dateRangeValidation.valid) {
      return jsonErrorResponse(400, {
        code: "UNAVAILABILITIES_CREATE_BAD_REQUEST",
        success: false,
        message: dateRangeValidation.error,
      } as any);
    }
    //crezione oggetto date
    const startDate = new Date(body.start_at);
    const endDate = new Date(body.end_at);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return jsonErrorResponse(400, {
        code: "UNAVAILABILITIES_CREATE_BAD_REQUEST",
        success: false,
        message: "Invalid start_at or end_at date format",
      } as any);
    }
    //normalizzazione iso
    const startISO = startDate.toISOString();
    const endISO = endDate.toISOString();
    const _admin = getAdminClient();

    // Check for overlapping unavailabilities
    const { data: existingUnavailabilities, error: fetchError } = await _admin
      .from("vigil_unavailabilities")
      .select("*")
      .eq("vigil_id", userObject.id);

    if (fetchError) throw fetchError;

    if (existingUnavailabilities && existingUnavailabilities.length > 0) {
      const hasOverlap = existingUnavailabilities.some((unavail: any) =>
        unavailabilitiesOverlap(
          startISO,
          endISO,
          unavail.start_at,
          unavail.end_at,
        ),
      );

      if (hasOverlap) {
        return jsonErrorResponse(409, {
          code: "UNAVAILABILITIES_CREATE_OVERLAP",
          success: false,
          message: "This unavailability overlaps with an existing one",
        } as any);
      }
    }

    // Create the unavailability (vigil_id is set from authenticated user)
    const newUnavailability = {
      vigil_id: userObject.id, // Always use authenticated user's ID
      start_at: startISO,
      end_at: endISO,
      reason: body.reason?.trim() || null,
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
      { status: 201 },
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
