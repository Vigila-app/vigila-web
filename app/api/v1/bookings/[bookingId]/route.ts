import { NextResponse } from "next/server";
import {
  jsonErrorResponse,
  authenticateUser,
  getAdminClient,
} from "@/server/api.utils.server";
import { ResponseCodesConstants } from "@/src/constants";
import { deepMerge } from "@/src/utils/common.utils";
import { getPostgresTimestamp } from "@/src/utils/date.utils";
import { BookingI } from "@/src/types/booking.types";
import { RolesEnum } from "@/src/enums/roles.enums";
import { BookingStatusEnum } from "@/src/enums/booking.enums";

const verifyBookingAccess = async (bookingId: string, userId: string, userRole: string) => {
  const _admin = getAdminClient();
  const { data, error } = await _admin
    .from("bookings")
    .select("*")
    .eq("id", bookingId)
    .single();
    
  if (error)
    throw jsonErrorResponse(500, {
      code: ResponseCodesConstants.BOOKINGS_DETAILS_ERROR.code,
      success: false,
      error,
    });
    
  if (!data) 
    throw jsonErrorResponse(404, {
      code: ResponseCodesConstants.BOOKINGS_DETAILS_NOT_FOUND.code,
      success: false,
    });

  // Check access based on role
  if (userRole === RolesEnum.CONSUMER && data.consumer_id !== userId) {
    throw jsonErrorResponse(403, {
      code: ResponseCodesConstants.BOOKINGS_DETAILS_FORBIDDEN.code,
      success: false,
    });
  }
  
  if (userRole === RolesEnum.VIGIL && data.vigil_id !== userId) {
    throw jsonErrorResponse(403, {
      code: ResponseCodesConstants.BOOKINGS_DETAILS_FORBIDDEN.code,
      success: false,
    });
  }
  
  return data;
};

export async function DELETE(
  req: Request,
  context: { params: { bookingId: string } }
) {
  try {
    console.log(`API DELETE bookings/${context?.params?.bookingId}`);

    if (!context?.params?.bookingId) {
      return jsonErrorResponse(400, {
        code: ResponseCodesConstants.BOOKINGS_DETAILS_BAD_REQUEST.code,
        success: false,
      });
    }
    
    const userObject = await authenticateUser(req);
    if (!userObject?.id || userObject.user_metadata?.role !== RolesEnum.CONSUMER)
      return jsonErrorResponse(401, {
        code: ResponseCodesConstants.BOOKINGS_DETAILS_UNAUTHORIZED.code,
        success: false,
      });

    await verifyBookingAccess(context.params.bookingId, userObject.id, userObject.user_metadata?.role);
    const _admin = getAdminClient();

    const { error } = await _admin
      .from("bookings")
      .delete()
      .eq("id", context.params.bookingId);
      
    if (error) throw error;

    return NextResponse.json(
      {
        code: ResponseCodesConstants.BOOKINGS_DETAILS_SUCCESS.code,
        data: context.params.bookingId,
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    return jsonErrorResponse(500, {
      code: ResponseCodesConstants.BOOKINGS_DETAILS_ERROR.code,
      success: false,
      error,
    });
  }
}

export async function GET(
  req: Request,
  context: { params: { bookingId: string } }
) {
  try {
    console.log(`API GET bookings/${context?.params?.bookingId}`);

    if (!context?.params?.bookingId) {
      return jsonErrorResponse(400, {
        code: ResponseCodesConstants.BOOKINGS_DETAILS_BAD_REQUEST.code,
        success: false,
      });
    }
    
    const userObject = await authenticateUser(req);
    if (!userObject?.id)
      return jsonErrorResponse(403, {
        code: ResponseCodesConstants.BOOKINGS_DETAILS_FORBIDDEN.code,
        success: false,
      });

    await verifyBookingAccess(
      context.params.bookingId,
      userObject.id,
      userObject.user_metadata?.role
    );

    const _admin = getAdminClient();
    const { data: booking, error } = await _admin
      .from("bookings")
      .select(`
        *,
        service:services(*),
        consumer:auth.users!bookings_consumer_id_fkey(*),
        vigil:auth.users!bookings_vigil_id_fkey(*),
        guest:guests(*)
      `)
      .eq("id", context.params.bookingId)
      .single<BookingI>();

    if (error || !booking) throw error;

    return NextResponse.json(
      {
        code: ResponseCodesConstants.BOOKINGS_DETAILS_SUCCESS.code,
        data: booking,
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    return jsonErrorResponse(500, {
      code: ResponseCodesConstants.BOOKINGS_DETAILS_ERROR.code,
      success: false,
      error,
    });
  }
}

export async function PUT(
  req: Request,
  context: { params: { bookingId: string } }
) {
  try {
    const { data: updatedBooking } = await req.json();
    console.log(`API PUT bookings/${context?.params?.bookingId}`, updatedBooking);

    if (!context?.params?.bookingId) {
      return jsonErrorResponse(400, {
        code: ResponseCodesConstants.BOOKINGS_DETAILS_BAD_REQUEST.code,
        success: false,
      });
    }
    
    const userObject = await authenticateUser(req);
    if (!userObject?.id)
      return jsonErrorResponse(401, {
        code: ResponseCodesConstants.BOOKINGS_DETAILS_UNAUTHORIZED.code,
        success: false,
      });

    if (
      !updatedBooking?.id ||
      updatedBooking?.id !== context.params.bookingId
    ) {
      return jsonErrorResponse(400, {
        code: ResponseCodesConstants.BOOKINGS_DETAILS_BAD_REQUEST.code,
        success: false,
      });
    }

    const booking = await verifyBookingAccess(
      context.params.bookingId,
      userObject.id,
      userObject.user_metadata?.role
    ) as BookingI;

    const _admin = getAdminClient();

    // Only allow certain fields to be updated based on user role
    let allowedUpdates = {};
    if (userObject.user_metadata?.role === RolesEnum.CONSUMER) {
      // Consumers can only update certain fields and only if booking is pending
      if (booking.status === BookingStatusEnum.PENDING) {
        allowedUpdates = {
          service_date: updatedBooking.service_date,
          duration_hours: updatedBooking.duration_hours,
          notes: updatedBooking.notes,
        };
      }
    } else if (userObject.user_metadata?.role === RolesEnum.VIGIL) {
      // Vigils can update status and notes
      allowedUpdates = {
        status: updatedBooking.status,
        notes: updatedBooking.notes,
      };
    }

    const { data, error } = await _admin
      .from("bookings")
      .update({
        ...deepMerge(booking, allowedUpdates),
        updated_at: getPostgresTimestamp(),
      })
      .eq("id", updatedBooking.id)
      .select(`
        *,
        service:services(*),
        consumer:auth.users!bookings_consumer_id_fkey(*),
        vigil:auth.users!bookings_vigil_id_fkey(*),
        guest:guests(*)
      `)
      .single<BookingI>();

    if (error || !data) throw error;

    return NextResponse.json(
      {
        code: ResponseCodesConstants.BOOKINGS_DETAILS_SUCCESS.code,
        data,
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    return jsonErrorResponse(500, {
      code: ResponseCodesConstants.BOOKINGS_DETAILS_ERROR.code,
      success: false,
      error,
    });
  }
}