import {
  authenticateUser,
  getAdminClient,
  getPagination,
  getQueryParams,
  jsonErrorResponse,
} from "@/server/api.utils.server";
import { ResponseCodesConstants } from "@/src/constants";
import { RolesEnum } from "@/src/enums/roles.enums";
import { BookingI, BookingFormI } from "@/src/types/booking.types";
import { BookingStatusEnum, PaymentStatusEnum } from "@/src/enums/booking.enums";
import { getPostgresTimestamp } from "@/src/utils/date.utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { nextUrl, url } = req;

    const pagination = getPagination(nextUrl);
    const { from, to, page, itemPerPage } = pagination;
    const filters = getQueryParams(url, ["page", "pageSize"]);
    const { orderBy = "created_at", orderDirection = "DESC" } = filters;

    console.log(`API GET bookings`, filters, pagination);

    const userObject = await authenticateUser(req);
    if (!userObject?.id)
      return jsonErrorResponse(401, {
        code: ResponseCodesConstants.BOOKINGS_CREATE_UNAUTHORIZED.code,
        success: false,
      });

    const _admin = getAdminClient();
    let db_query = _admin
      .from("bookings")
      .select(`
        *,
        service:services(*),
        consumer:auth.users!bookings_consumer_id_fkey(*),
        vigil:auth.users!bookings_vigil_id_fkey(*),
        guest:guests(*)
      `, { count: "exact" });

    // Filter based on user role
    if (userObject.user_metadata?.role === RolesEnum.CONSUMER) {
      db_query = db_query.eq("consumer_id", userObject.id);
    } else if (userObject.user_metadata?.role === RolesEnum.VIGIL) {
      db_query = db_query.eq("vigil_id", userObject.id);
    }

    if (Object.keys(filters).length) {
      Object.keys(filters).forEach((key) => {
        if (key !== "orderBy" && key !== "orderDirection") {
          db_query = db_query.eq(key, filters[key]);
        }
      });
    }

    if (orderBy) {
      db_query = db_query.order(orderBy, {
        ascending: orderDirection === "ASC" ? true : false,
      });
    }

    if (from !== undefined && to !== undefined) {
      db_query = db_query.range(from, to);
    }

    const { data = [], error, count = 0 } = await db_query.returns<BookingI[]>();

    if (error || !data) throw error;

    return NextResponse.json(
      {
        code: ResponseCodesConstants.BOOKINGS_CREATE_SUCCESS.code,
        data,
        success: true,
        pagination: {
          page,
          pages: Math.ceil((count || 0) / itemPerPage),
          itemPerPage,
          count,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return jsonErrorResponse(500, {
      code: ResponseCodesConstants.BOOKINGS_CREATE_ERROR.code,
      success: false,
      error,
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body: BookingFormI = await req.json();
    console.log(`API POST bookings`, body);

    const userObject = await authenticateUser(req);
    if (!userObject?.id || userObject.user_metadata?.role !== RolesEnum.CONSUMER)
      return jsonErrorResponse(401, {
        code: ResponseCodesConstants.BOOKINGS_CREATE_UNAUTHORIZED.code,
        success: false,
      });

    if (!(body?.service_id && body?.service_date && body?.duration_hours)) {
      return jsonErrorResponse(400, {
        code: ResponseCodesConstants.BOOKINGS_CREATE_BAD_REQUEST.code,
        success: false,
      });
    }

    const _admin = getAdminClient();

    // Get service details to calculate total amount and get vigil_id
    const { data: service, error: serviceError } = await _admin
      .from("services")
      .select("*")
      .eq("id", body.service_id)
      .single();

    if (serviceError || !service) {
      return jsonErrorResponse(400, {
        code: ResponseCodesConstants.BOOKINGS_CREATE_BAD_REQUEST.code,
        success: false,
      });
    }

    const totalAmount = service.price * body.duration_hours;

    const newBooking = {
      service_id: body.service_id,
      consumer_id: userObject.id,
      vigil_id: service.ownerId,
      guest_id: body.guest_id || null,
      service_date: body.service_date,
      duration_hours: body.duration_hours,
      total_amount: totalAmount,
      currency: service.currency,
      status: BookingStatusEnum.PENDING,
      payment_status: PaymentStatusEnum.PENDING,
      notes: body.notes || null,
      created_at: getPostgresTimestamp(),
      updated_at: getPostgresTimestamp(),
    };

    const { data, error } = await _admin
      .from("bookings")
      .insert(newBooking)
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
        code: ResponseCodesConstants.BOOKINGS_CREATE_SUCCESS.code,
        data,
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    return jsonErrorResponse(500, {
      code: ResponseCodesConstants.BOOKINGS_CREATE_ERROR.code,
      success: false,
      error,
    });
  }
}