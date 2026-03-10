import {
  authenticateUser,
  getAdminClient,
  jsonErrorResponse,
} from "@/server/api.utils.server";
import { ResponseCodesConstants } from "@/src/constants";
import {
  AvailableSlotsResponseI,
  VigilAvailabilityRuleI,
  VigilUnavailabilityI,
} from "@/src/types/calendar.types";
import { BookingI } from "@/src/types/booking.types";
import { NextRequest, NextResponse } from "next/server";
import { AvailabilityEngine } from "@/src/services/calendar.service";
import { FrequencyEnum } from "@/src/enums/common.enums";

/**
 * GET /api/vigil/[vigilId]/available-slots
 * 
 * Returns available time slots for a vigil based on:
 * - Availability rules (weekly recurring patterns)
 * - Unavailabilities (blocked time ranges)
 * - Existing bookings
 * - Service duration
 * 
 * Query Parameters:
 * - start_date: ISO date (YYYY-MM-DD)
 * - end_date: ISO date (YYYY-MM-DD)
 * - service_id: UUID of the service
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ vigilId: string }> }
) {
  try {
    const { vigilId } = await params;
    const { searchParams } = new URL(req.url);

    // Authenticate user (consumers and vigils can check availability)
    const userObject = await authenticateUser(req);
    if (!userObject?.id) {
      return jsonErrorResponse(401, {
        code: ResponseCodesConstants.BOOKINGS_CREATE_UNAUTHORIZED.code,
        success: false,
        message: "Unauthorized",
      } as any);
    }

    // Get query parameters
    const startDateStr = searchParams.get("start_date");
    const endDateStr = searchParams.get("end_date");
    const serviceId = searchParams.get("service_id");

    // Validate required parameters
    if (!startDateStr || !endDateStr || !serviceId) {
      return jsonErrorResponse(400, {
        code: "AVAILABLE_SLOTS_BAD_REQUEST",
        success: false,
        message: "Missing required parameters: start_date, end_date, service_id",
      } as any);
    }

    // Validate dates
    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return jsonErrorResponse(400, {
        code: "AVAILABLE_SLOTS_BAD_REQUEST",
        success: false,
        message: "Invalid date format. Use YYYY-MM-DD",
      } as any);
    }

    if (endDate < startDate) {
      return jsonErrorResponse(400, {
        code: "AVAILABLE_SLOTS_BAD_REQUEST",
        success: false,
        message: "end_date must be after start_date",
      } as any);
    }

    // Limit date range to prevent excessive queries (max 90 days)
    const daysDiff = Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (daysDiff > 90) {
      return jsonErrorResponse(400, {
        code: "AVAILABLE_SLOTS_BAD_REQUEST",
        success: false,
        message: "Date range cannot exceed 90 days",
      } as any);
    }

    const _admin = getAdminClient();

    // Get service details to determine duration
    const { data: service, error: serviceError } = await _admin
      .from("services")
      .select("*")
      .eq("id", serviceId)
      .eq("vigil_id", vigilId)
      .single();

    if (serviceError || !service) {
      return jsonErrorResponse(404, {
        code: "SERVICE_NOT_FOUND",
        success: false,
        message: "Service not found for this vigil",
      } as any);
    }

    // Calculate service duration in hours
    let serviceDurationHours = 1;
    if (service.unit_type === FrequencyEnum.HOURS) {
      serviceDurationHours = service.min_unit || 1;
    } else if (service.unit_type === FrequencyEnum.DAYS) {
      serviceDurationHours = (service.min_unit || 1) * 24;
    }

    // Ensure minimum 1 hour granularity
    serviceDurationHours = Math.max(1, Math.ceil(serviceDurationHours));

    // Get availability rules for this vigil
    const { data: availabilityRules, error: rulesError } = await _admin
      .from("vigil_availability_rules")
      .select("*")
      .eq("vigil_id", vigilId)
      .lte("valid_from", endDateStr)
      .or(`valid_to.is.null,valid_to.gte.${startDateStr}`);

    if (rulesError) throw rulesError;

    // Get unavailabilities for this vigil in the date range
    const { data: unavailabilities, error: unavailabilitiesError } =
      await _admin
        .from("vigil_unavailabilities")
        .select("*")
        .eq("vigil_id", vigilId)
        .lte("start_at", endDate.toISOString())
        .gte("end_at", startDate.toISOString());

    if (unavailabilitiesError) throw unavailabilitiesError;

    // Get existing bookings for this vigil in the date range
    const { data: bookings, error: bookingsError } = await _admin
      .from("bookings")
      .select("*")
      .eq("vigil_id", vigilId)
      .lte("startDate", endDate.toISOString())
      .gte("endDate", startDate.toISOString())
      .in("status", ["confirmed", "pending"])
      .in("payment_status", ["paid", "pending"]);

    if (bookingsError) throw bookingsError;

    // Use the Availability Engine to calculate available slots
    const slots = AvailabilityEngine.generateAvailableSlots({
      availabilityRules: (availabilityRules || []) as VigilAvailabilityRuleI[],
      unavailabilities: (unavailabilities || []) as VigilUnavailabilityI[],
      bookings: (bookings || []) as BookingI[],
      startDate,
      endDate,
      serviceDurationHours,
    });

    const response: AvailableSlotsResponseI = {
      vigil_id: vigilId,
      service_id: serviceId,
      service_duration_hours: serviceDurationHours,
      slots,
    };

    return NextResponse.json(
      {
        code: "AVAILABLE_SLOTS_SUCCESS",
        data: response,
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get available slots error:", error);
    return jsonErrorResponse(500, {
      code: "AVAILABLE_SLOTS_ERROR",
      success: false,
      error,
    } as any);
  }
}
