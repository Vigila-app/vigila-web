import {
  authenticateUser,
  getAdminClient,
  jsonErrorResponse,
} from "@/server/api.utils.server";
import { ResponseCodesConstants } from "@/src/constants";
import { RolesEnum } from "@/src/enums/roles.enums";
import {
  ConsumerCalendarResponseI,
  CalendarEventI,
} from "@/src/types/calendar.types";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/calendar/consumer
 *
 * Returns the consumer's calendar with their bookings for a given period
 *
 * Query Parameters:
 * @param from - Start date (ISO format, optional)
 * @param to - End date (ISO format, optional)
 *
 * @returns ConsumerCalendarResponseI
 */
export async function GET(req: NextRequest) {
  try {
    // Authenticate user
    const userObject = await authenticateUser(req);
    if (!userObject?.id) {
      return jsonErrorResponse(401, {
        code: ResponseCodesConstants.CONSUMER_CALENDAR_UNAUTHORIZED.code,
        success: false,
        message: "Unauthorized",
      } as any);
    }

    // Verify user is a consumer
    if (userObject.user_metadata?.role !== RolesEnum.CONSUMER) {
      return jsonErrorResponse(403, {
        code: ResponseCodesConstants.CONSUMER_CALENDAR_FORBIDDEN.code,
        success: false,
        message: "Only consumers can access this endpoint",
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
        vigil:vigils(displayName),
        service:services(name,description)
      `,
      )
      .eq("consumer_id", userObject.id);

    if (from)
      bookingsQuery = bookingsQuery.gte("startDate", `${from}T00:00:00`);
    if (to) {
      const toDate = new Date(to);
      toDate.setDate(toDate.getDate() + 1);
      const toISO = toDate.toISOString().split("T")[0];
      bookingsQuery = bookingsQuery.lt("startDate", `${toISO}T00:00:00`);
    }

    const { data: bookings, error: bookingsError } = await bookingsQuery.order(
      "startDate",
      { ascending: true },
    );

    if (bookingsError) throw bookingsError;

    // Transform bookings into calendar events
    const calendarEvents: CalendarEventI[] = (bookings || []).map(
      (booking: any) => ({
        id: booking.id,
        type: "booking" as const,
        title: `${booking.service?.name || "Service"} - ${booking.vigil?.displayName || "Vigil"}`,
        description: booking.service?.description || "",
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
      }),
    );

    const response: ConsumerCalendarResponseI = {
      bookings: calendarEvents,
    };
    return NextResponse.json(
      {
        code: ResponseCodesConstants.CONSUMER_CALENDAR_SUCCESS.code,
        data: response,
        success: true,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Consumer calendar error:", error);
    return jsonErrorResponse(500, {
      code: ResponseCodesConstants.CONSUMER_CALENDAR_ERROR.code,
      success: false,
      error,
    } as any);
  }
}
