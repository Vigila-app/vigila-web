import {
  authenticateUser,
  getAdminClient,
  jsonErrorResponse,
} from "@/server/api.utils.server";
import { ResponseCodesConstants } from "@/src/constants";
import { RolesEnum } from "@/src/enums/roles.enums";
import {
  VigilCalendarResponseI,
  CalendarEventI,
  VigilAvailabilityRuleI,
} from "@/src/types/calendar.types";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/calendar/vigil/bookings
 * 
 * Returns the vigil's calendar with bookings, unavailabilities, and availability rules
 * 
 * @returns VigilCalendarResponseI
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

    // Get all bookings for this vigil
    const { data: bookings, error: bookingsError } = await _admin
      .from("bookings")
      .select(
        `
        *,
        consumer:consumers(displayName),
        service:services(name)
      `
      )
      .eq("vigil_id", userObject.id)
      .order("startDate", { ascending: true });

    if (bookingsError) throw bookingsError;

    // Get all unavailabilities for this vigil
    const { data: unavailabilities, error: unavailabilitiesError } =
      await _admin
        .from("vigil_unavailabilities")
        .select("*")
        .eq("vigil_id", userObject.id)
        .order("start_at", { ascending: true });

    if (unavailabilitiesError) throw unavailabilitiesError;

    // Get all availability rules for this vigil
    const { data: availabilityRules, error: rulesError } = await _admin
      .from("vigil_availability_rules")
      .select("*")
      .eq("vigil_id", userObject.id)
      .order("weekday", { ascending: true });

    if (rulesError) throw rulesError;

    // Transform bookings into calendar events
    const bookingEvents: CalendarEventI[] = (bookings || []).map(
      (booking: any) => ({
        id: booking.id,
        type: "booking" as const,
        title: `${booking.service?.name || "Service"} - ${booking.consumer?.displayName || "Consumer"}`,
        start: booking.startDate,
        end: booking.endDate,
        status: booking.status,
        metadata: {
          booking_id: booking.id,
          service_id: booking.service_id,
          consumer_id: booking.consumer_id,
          payment_status: booking.payment_status,
          price: booking.price,
        },
      })
    );

    // Transform unavailabilities into calendar events
    const unavailabilityEvents: CalendarEventI[] = (
      unavailabilities || []
    ).map((unavailability: any) => ({
      id: unavailability.id,
      type: "unavailability" as const,
      title: unavailability.reason || "Unavailable",
      start: unavailability.start_at,
      end: unavailability.end_at,
      metadata: {
        reason: unavailability.reason,
      },
    }));

    const response: VigilCalendarResponseI = {
      bookings: bookingEvents,
      unavailabilities: unavailabilityEvents,
      availability_rules: (availabilityRules || []) as VigilAvailabilityRuleI[],
    };

    return NextResponse.json(
      {
        code: "VIGIL_CALENDAR_SUCCESS",
        data: response,
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Vigil calendar error:", error);
    return jsonErrorResponse(500, {
      code: "VIGIL_CALENDAR_ERROR",
      success: false,
      error,
    } as any);
  }
}
