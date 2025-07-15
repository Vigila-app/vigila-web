import { NextRequest, NextResponse } from "next/server";
import {
  authenticateUser,
  getAdminClient,
  jsonErrorResponse,
} from "@/server/api.utils.server";
import { ResponseCodesConstants } from "@/src/constants";
import { RolesEnum } from "@/src/enums/roles.enums";

export async function GET(req: NextRequest) {
  try {
    console.log(`API GET admin/analytics`);

    // Verifica autenticazione e ruolo admin
    const userObject = await authenticateUser(req);
    if (!userObject?.id || userObject.user_metadata?.role !== RolesEnum.ADMIN) {
      return jsonErrorResponse(403, {
        code: "ADMIN_ANALYTICS_FORBIDDEN",
        success: false,
      });
    }

    const _admin = getAdminClient();
    
    // Ottieni statistiche di base
    const [bookingsResult, usersResult, vigilsResult, servicesResult] = await Promise.all([
      _admin.from("bookings").select("*", { count: "exact" }),
      _admin.from("consumers").select("*", { count: "exact" }),
      _admin.from("vigils").select("*", { count: "exact" }),
      _admin.from("services").select("*", { count: "exact" })
    ]);

    // Calcola metriche finanziarie
    const { data: paymentsData } = await _admin
      .from("payments")
      .select("amount, created_at, status")
      .eq("status", "completed");

    const totalRevenue = paymentsData?.reduce((sum, payment) => sum + payment.amount, 0) || 0;
    const platformCommission = totalRevenue * 0.1; // Assumendo 10% di commissione

    // Ottieni prenotazioni recenti con dettagli
    const { data: recentBookings } = await _admin
      .from("bookings")
      .select(`
        *,
        consumers(name, surname),
        vigils(name, surname),
        services(title)
      `)
      .order("created_at", { ascending: false })
      .limit(10);

    // Statistiche di crescita mensile (mock data per ora)
    const monthlyGrowth = {
      bookings: 23,
      revenue: 31,
      users: 18,
      vigils: 12
    };

    // Top performers (da implementare con query più complesse)
    const topVigils = [
      { name: "Roberto Rossi", earnings: 3120, rating: 4.9 },
      { name: "Luca Bianchi", earnings: 2340, rating: 4.8 },
      { name: "Marco Neri", earnings: 1890, rating: 4.6 }
    ];

    const analytics = {
      overview: {
        totalBookings: bookingsResult.count || 0,
        totalUsers: usersResult.count || 0,
        totalVigils: vigilsResult.count || 0,
        totalServices: servicesResult.count || 0,
        totalRevenue,
        platformCommission
      },
      monthlyGrowth,
      recentBookings: recentBookings?.map(booking => ({
        id: booking.id,
        consumer: `${booking.consumers?.name} ${booking.consumers?.surname}`,
        vigil: `${booking.vigils?.name} ${booking.vigils?.surname}`,
        service: booking.services?.title,
        date: booking.date,
        status: booking.status,
        amount: booking.amount
      })) || [],
      topPerformers: {
        vigils: topVigils
      }
    };

    return NextResponse.json({
      code: "ADMIN_ANALYTICS_SUCCESS",
      data: analytics,
      success: true,
    });

  } catch (error) {
    console.error("Admin analytics error:", error);
    return jsonErrorResponse(500, {
      code: "ADMIN_ANALYTICS_ERROR",
      success: false,
      error,
    });
  }
}
