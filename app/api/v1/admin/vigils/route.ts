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
    console.log(`API GET admin/vigils`);

    const userObject = await authenticateUser(req);
    if (!userObject?.id || userObject.user_metadata?.role !== RolesEnum.ADMIN) {
      return jsonErrorResponse(403, {
        code: "ADMIN_VIGILS_FORBIDDEN",
        success: false,
      });
    }

    const pagination = getPagination(nextUrl);
    const { from, to } = pagination;
    const filters = getQueryParams(req.url, ["status", "verified", "location"]);

    const _admin = getAdminClient();

    let query = _admin
      .from("vigils")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false });

    if (filters.status) {
      query = query.eq("status", filters.status);
    }
    if (filters.verified !== undefined) {
      query = query.eq("verified", filters.verified === "true");
    }
    if (filters.location) {
      query = query.ilike("location", `%${filters.location}%`);
    }

    if (from !== undefined && to !== undefined) {
      query = query.range(from, to);
    }

    const { data, error, count } = await query;

    if (error) {
      throw error;
    }

    const vigilsWithStats = await Promise.all(
      (data || []).map(async (vigil) => {
        const { data: servicesCount } = await _admin
          .from("services")
          .select("*", { count: "exact" })
          .eq("vigil_id", vigil.id);

        const { data: bookingsData } = await _admin
          .from("bookings")
          .select("*")
          .eq("vigil_id", vigil.id);

        const totalBookings = bookingsData?.length || 0;
        const totalEarnings =
          bookingsData?.reduce(
            (sum, booking) => sum + (booking.amount || 0),
            0
          ) || 0;

        return {
          ...vigil,
          total_services: servicesCount || 0,
          total_bookings: totalBookings,
          earnings: totalEarnings,
          rating: null, // TODO: Implement rating calculation or retrieval system
        };
      })
    );

    return NextResponse.json({
      code: "ADMIN_VIGILS_SUCCESS",
      data: vigilsWithStats,
      count,
      success: true,
    });
  } catch (error) {
    console.error("Admin vigils error:", error);
    return jsonErrorResponse(500, {
      code: "ADMIN_VIGILS_ERROR",
      success: false,
      error,
    });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { vigilId, status, verified } = await req.json();
    console.log(`API PUT admin/vigils`, { vigilId, status, verified });

    // Verifica autenticazione e ruolo admin
    const userObject = await authenticateUser(req);
    if (!userObject?.id || userObject.user_metadata?.role !== RolesEnum.ADMIN) {
      return jsonErrorResponse(403, {
        code: "ADMIN_VIGILS_FORBIDDEN",
        success: false,
      });
    }

    if (!vigilId) {
      return jsonErrorResponse(400, {
        code: "ADMIN_VIGILS_BAD_REQUEST",
        success: false,
      });
    }

    const _admin = getAdminClient();

    const updateData: any = {
      updated_at: new Date().toISOString(),
    };

    if (status !== undefined) {
      updateData.status = status;
    }
    if (verified !== undefined) {
      updateData.verified = verified;
    }

    const { data, error } = await _admin
      .from("vigils")
      .update(updateData)
      .eq("id", vigilId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({
      code: "ADMIN_VIGIL_UPDATE_SUCCESS",
      data,
      success: true,
    });
  } catch (error) {
    console.error("Admin vigil update error:", error);
    return jsonErrorResponse(500, {
      code: "ADMIN_VIGIL_UPDATE_ERROR",
      success: false,
      error,
    });
  }
}
