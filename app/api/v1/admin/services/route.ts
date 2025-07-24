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
    console.log(`API GET admin/services`);

    const userObject = await authenticateUser(req);
    if (!userObject?.id || userObject.user_metadata?.role !== RolesEnum.ADMIN) {
      return jsonErrorResponse(403, {
        code: "ADMIN_SERVICES_FORBIDDEN",
        success: false,
      });
    }

    const pagination = getPagination(nextUrl);
    const { from, to } = pagination;
    const filters = getQueryParams(req.url, ["category", "status", "vigil_id"]);

    const _admin = getAdminClient();

    let query = _admin
      .from("services")
      .select(
        `
        *,
        vigils(displayName)
      `,
        { count: "exact" }
      )
      .order("created_at", { ascending: false });

    if (filters.category) {
      query = query.eq("category", filters.category);
    }
    if (filters.status) {
      query = query.eq("status", filters.status);
    }
    if (filters.vigil_id) {
      query = query.eq("vigil_id", filters.vigil_id);
    }

    if (from !== undefined && to !== undefined) {
      query = query.range(from, to);
    }

    const { data, error, count } = await query;

    if (error) {
      throw error;
    }

    const servicesWithStats = await Promise.all(
      (data || []).map(async (service) => {
        const [bookingsResult, revenueResult] = await Promise.all([
          _admin
            .from("bookings")
            .select("*", { count: "exact" })
            .eq("service_id", service.id),
          _admin
            .from("bookings")
            .select("*")
            .eq("service_id", service.id)
            .eq("status", "COMPLETED"),
        ]);

        const totalRevenue =
          (revenueResult.data || []).length * (service.price || 0);

        return {
          ...service,
          total_bookings: bookingsResult.count || 0,
          total_revenue: totalRevenue,
        };
      })
    );

    return NextResponse.json({
      code: "ADMIN_SERVICES_SUCCESS",
      data: servicesWithStats,
      count,
      success: true,
    });
  } catch (error) {
    console.error("Admin services error:", error);
    return jsonErrorResponse(500, {
      code: "ADMIN_SERVICES_ERROR",
      success: false,
      error,
    });
  }
}

export async function PUT(req: NextRequest) {
  try {
    console.log(`API PUT admin/services`);

    // Verifica autenticazione e ruolo admin
    const userObject = await authenticateUser(req);
    if (!userObject?.id || userObject.user_metadata?.role !== RolesEnum.ADMIN) {
      return jsonErrorResponse(403, {
        code: "ADMIN_SERVICES_FORBIDDEN",
        success: false,
      });
    }

    const body = await req.json();
    const { id, ...updateData } = body;

    if (!id) {
      return jsonErrorResponse(400, {
        code: "ADMIN_SERVICES_BAD_REQUEST",
        success: false,
      });
    }

    const _admin = getAdminClient();

    const { data, error } = await _admin
      .from("services")
      .update({
        ...updateData,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({
      code: "ADMIN_SERVICES_UPDATE_SUCCESS",
      data,
      success: true,
    });
  } catch (error) {
    console.error("Admin services update error:", error);
    return jsonErrorResponse(500, {
      code: "ADMIN_SERVICES_UPDATE_ERROR",
      success: false,
      error,
    });
  }
}
