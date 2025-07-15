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
    console.log(`API GET admin/consumers`);

    // Verifica autenticazione e ruolo admin
    const userObject = await authenticateUser(req);
    if (!userObject?.id || userObject.user_metadata?.role !== RolesEnum.ADMIN) {
      return jsonErrorResponse(403, {
        code: "ADMIN_CONSUMERS_FORBIDDEN",
        success: false,
      });
    }

    const pagination = getPagination(nextUrl);
    const { from, to } = pagination;
    const filters = getQueryParams(req.url, ["status", "location", "verified"]);

    const _admin = getAdminClient();
    
    let query = _admin
      .from("consumers")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false });

    // Applica filtri se presenti
    if (filters.status) {
      query = query.eq("status", filters.status);
    }
    if (filters.location) {
      query = query.ilike("location", `%${filters.location}%`);
    }
    if (filters.verified !== undefined) {
      query = query.eq("verified", filters.verified === "true");
    }

    // Applica paginazione
    if (from !== undefined && to !== undefined) {
      query = query.range(from, to);
    }

    const { data, error, count } = await query;

    if (error) {
      throw error;
    }

    // Calcola statistiche aggiuntive per ogni consumer
    const consumersWithStats = await Promise.all(
      (data || []).map(async (consumer) => {
        const [bookingsResult, totalSpentResult] = await Promise.all([
          _admin
            .from("bookings")
            .select("*", { count: "exact" })
            .eq("consumer_id", consumer.id),
          _admin
            .from("bookings")
            .select("services(price)")
            .eq("consumer_id", consumer.id)
            .eq("status", "COMPLETED")
        ]);

        const totalSpent = totalSpentResult.data?.reduce((sum, booking: any) => {
          return sum + (booking.services?.price || 0);
        }, 0) || 0;

        return {
          ...consumer,
          total_bookings: bookingsResult.count || 0,
          total_spent: totalSpent,
        };
      })
    );

    return NextResponse.json({
      code: "ADMIN_CONSUMERS_SUCCESS",
      data: consumersWithStats,
      count,
      success: true,
    });

  } catch (error) {
    console.error("Admin consumers error:", error);
    return jsonErrorResponse(500, {
      code: "ADMIN_CONSUMERS_ERROR",
      success: false,
      error,
    });
  }
}

export async function PUT(req: NextRequest) {
  try {
    console.log(`API PUT admin/consumers`);

    // Verifica autenticazione e ruolo admin
    const userObject = await authenticateUser(req);
    if (!userObject?.id || userObject.user_metadata?.role !== RolesEnum.ADMIN) {
      return jsonErrorResponse(403, {
        code: "ADMIN_CONSUMERS_FORBIDDEN",
        success: false,
      });
    }

    const body = await req.json();
    const { id, ...updateData } = body;

    if (!id) {
      return jsonErrorResponse(400, {
        code: "ADMIN_CONSUMERS_BAD_REQUEST",
        success: false,
      });
    }

    const _admin = getAdminClient();
    
    const { data, error } = await _admin
      .from("consumers")
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
      code: "ADMIN_CONSUMERS_UPDATE_SUCCESS",
      data,
      success: true,
    });

  } catch (error) {
    console.error("Admin consumers update error:", error);
    return jsonErrorResponse(500, {
      code: "ADMIN_CONSUMERS_UPDATE_ERROR",
      success: false,
      error,
    });
  }
}
