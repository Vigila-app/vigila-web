import {
  authenticateUser,
  getAdminClient,
  jsonErrorResponse,
} from "@/server/api.utils.server";
import { ResponseCodesConstants } from "@/src/constants";
import { RolesEnum } from "@/src/enums/roles.enums";
import { ConsumerCalendarResponseI, CalendarEventI } from "@/src/types/calendar.types";
import { NextRequest, NextResponse } from "next/server";
import { BookingI } from "@/src/types/booking.types";

/**
 * GET /api/calendar/consumer
 * 
 * Returns the consumer's calendar with all their bookings
 * 
 * @returns ConsumerCalendarResponseI
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

    // Verify user is a consumer
    if (userObject.user_metadata?.role !== RolesEnum.CONSUMER) {
      return jsonErrorResponse(403, {
        code: ResponseCodesConstants.BOOKINGS_CREATE_UNAUTHORIZED.code,
        success: false,
        message: "Only consumers can access this endpoint",
      } as any);
    }

    const _admin = getAdminClient();

    // Get all bookings for this consumer
    const { data: bookings, error: bookingsError } = await _admin
      .from("bookings")
      .select(
        `
        *,
        vigil:vigils(displayName),
        service:services(name)
      `
      )
      .eq("consumer_id", userObject.id)
      .order("startDate", { ascending: true });

    if (bookingsError) throw bookingsError;

    // Transform bookings into calendar events
    const calendarEvents: CalendarEventI[] = (bookings || []).map(
      (booking: any) => ({
        id: booking.id,
        type: "booking" as const,
        title: `${booking.service?.name || "Service"} - ${booking.vigil?.displayName || "Vigil"}`,
        start: booking.startDate,
        end: booking.endDate,
        status: booking.status,
        metadata: {
          booking_id: booking.id,
          service_id: booking.service_id,
          vigil_id: booking.vigil_id,
          payment_status: booking.payment_status,
          price: booking.price,
        },
      })
    );

    const response: ConsumerCalendarResponseI = {
      bookings: calendarEvents,
    };

    return NextResponse.json(
      {
        code: "CONSUMER_CALENDAR_SUCCESS",
        data: response,
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Consumer calendar error:", error);
    return jsonErrorResponse(500, {
      code: "CONSUMER_CALENDAR_ERROR",
      success: false,
      error,
    } as any);
  }
}
