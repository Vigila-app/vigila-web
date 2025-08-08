import { NextRequest, NextResponse } from "next/server";
import {
  authenticateUser,
  getAdminClient,
  jsonErrorResponse,
  getPagination,
  getQueryParams,
} from "@/server/api.utils.server";
import { RolesEnum } from "@/src/enums/roles.enums";

export async function GET(req: NextRequest) {
  try {
    const { nextUrl } = req;
    console.log(`API GET admin/bookings`);

    const userObject = await authenticateUser(req);
    if (!userObject?.id || userObject.user_metadata?.role !== RolesEnum.ADMIN) {
      return jsonErrorResponse(403, {
        code: "ADMIN_BOOKINGS_FORBIDDEN",
        success: false,
      });
    }

    const pagination = getPagination(nextUrl);
    const { from, to } = pagination;
    const filters = getQueryParams(req.url, [
      "status",
      "consumer_id",
      "vigil_id",
    ]);

    const _admin = getAdminClient();

    let query = _admin
      .from("bookings")
      .select(
        `
        *,
        consumers(displayName),
        vigils(displayName),
        services(name,currency)
      `,
        { count: "exact" }
      )
      .order("created_at", { ascending: false });

    if (filters.status) {
      query = query.eq("status", filters.status);
    }
    if (filters.consumer_id) {
      query = query.eq("consumer_id", filters.consumer_id);
    }
    if (filters.vigil_id) {
      query = query.eq("vigil_id", filters.vigil_id);
    }

    // Applica paginazione
    if (from !== undefined && to !== undefined) {
      query = query.range(from, to);
    }

    const { data, error, count } = await query;

    if (error) {
      throw error;
    }

    return NextResponse.json({
      code: "ADMIN_BOOKINGS_SUCCESS",
      data,
      count,
      success: true,
    });
  } catch (error) {
    console.error("Admin bookings error:", error);
    return jsonErrorResponse(500, {
      code: "ADMIN_BOOKINGS_ERROR",
      success: false,
      error,
    });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { bookingId, status } = await req.json();
    console.log(`API PUT admin/bookings`, { bookingId, status });

    // Verifica autenticazione e ruolo admin
    const userObject = await authenticateUser(req);
    if (!userObject?.id || userObject.user_metadata?.role !== RolesEnum.ADMIN) {
      return jsonErrorResponse(403, {
        code: "ADMIN_BOOKINGS_FORBIDDEN",
        success: false,
      });
    }

    if (!bookingId || !status) {
      return jsonErrorResponse(400, {
        code: "ADMIN_BOOKINGS_BAD_REQUEST",
        success: false,
      });
    }

    const _admin = getAdminClient();

    const { data, error } = await _admin
      .from("bookings")
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", bookingId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({
      code: "ADMIN_BOOKING_UPDATE_SUCCESS",
      data,
      success: true,
    });
  } catch (error) {
    console.error("Admin booking update error:", error);
    return jsonErrorResponse(500, {
      code: "ADMIN_BOOKING_UPDATE_ERROR",
      success: false,
      error,
    });
  }
}
