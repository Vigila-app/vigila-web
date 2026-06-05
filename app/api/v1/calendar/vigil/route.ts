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
} from "@/src/types/calendar.types";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/calendar/vigil
 *
 * Returns the vigil's calendar with their bookings and unavailabilities for a given period
 *
 * Query Parameters:
 * @param from - Start date (ISO format, optional)
 * @param to - End date (ISO format, optional)
 *
 * @returns VigilCalendarResponseI
 */
export async function GET(req: NextRequest) {
  try {
    // Authenticate user
    const userObject = await authenticateUser(req);
    if (!userObject?.id) {
      return jsonErrorResponse(401, {
        code: ResponseCodesConstants.VIGIL_CALENDAR_UNAUTHORIZED.code,
        success: false,
        message: "Unauthorized",
      } as any);
    }

    // Verify user is a vigil
    if (userObject.user_metadata?.role !== RolesEnum.VIGIL) {
      return jsonErrorResponse(403, {
        code: ResponseCodesConstants.VIGIL_CALENDAR_FORBIDDEN.code,
        success: false,
        message: "Only vigils can access this endpoint",
      } as any);
    }

    const _admin = getAdminClient();
    const { searchParams } = new URL(req.url);
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    // Build query for bookings with optional date filters
    let bookingsQuery = _admin
      .from("bookings")
      .select(
        `
        *,
        consumer:consumers(displayName),
        service:services(name,description)
      `,
      )
      .eq("vigil_id", userObject.id);

    if (from) bookingsQuery = bookingsQuery.gte("startDate", `${from}T00:00:00`);
    if (to) {
      const toDate = new Date(to);
      toDate.setDate(toDate.getDate() + 1);
      const toISO = toDate.toISOString().split('T')[0];
      bookingsQuery = bookingsQuery.lt("startDate", `${toISO}T00:00:00`);
    }

    const { data: bookings, error: bookingsError } = await bookingsQuery.order(
      "startDate",
      { ascending: true },
    );

    if (bookingsError) throw bookingsError;

    // Build query for unavailabilities with optional date filters
    let unavailabilitiesQuery = _admin
      .from("unavailabilities")
      .select("*")
      .eq("vigil_id", userObject.id);

    if (from) unavailabilitiesQuery = unavailabilitiesQuery.gte("startDate", `${from}T00:00:00`);
    if (to) {
      const toDate = new Date(to);
      toDate.setDate(toDate.getDate() + 1);
      const toISO = toDate.toISOString().split('T')[0];
      unavailabilitiesQuery = unavailabilitiesQuery.lt("startDate", `${toISO}T00:00:00`);
    }

    const { data: unavailabilities, error: unavailabilitiesError } =
      await unavailabilitiesQuery.order("startDate", { ascending: true });

    if (unavailabilitiesError) throw unavailabilitiesError;

    // Transform bookings into calendar events
    const calendarEvents: CalendarEventI[] = (bookings || []).map(
      (booking: any) => ({
        id: booking.id,
        type: "booking" as const,
        title: `${booking.service?.name || "Service"} - ${booking.consumer?.displayName || "Consumer"}`,
        description: booking.service?.description || "",
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
      }),
    );

    // Transform unavailabilities into calendar events
    const unavailabilityEvents: CalendarEventI[] = (unavailabilities || []).map(
      (unavailability: any) => ({
        id: unavailability.id,
        type: "unavailability" as const,
        title: "Non disponibile",
        description: unavailability.description || "",
        start: unavailability.startDate,
        end: unavailability.endDate,
        status: "unavailable",
        metadata: {
          unavailability_id: unavailability.id,
        },
      }),
    );

    const response: VigilCalendarResponseI = {
      bookings: calendarEvents,
      unavailabilities: unavailabilityEvents,
      availability_rules: [], // Placeholder for future use
    };

    console.log("Vigil calendar response:", response);
    return NextResponse.json(
      {
        code: ResponseCodesConstants.VIGIL_CALENDAR_SUCCESS.code,
        data: response,
        success: true,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Vigil calendar error:", error);
    return jsonErrorResponse(500, {
      code: ResponseCodesConstants.VIGIL_CALENDAR_ERROR.code,
      success: false,
      error,
    } as any);
  }
}