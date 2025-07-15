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
    console.log(`API GET admin/payments`);

    // Verifica autenticazione e ruolo admin
    const userObject = await authenticateUser(req);
    if (!userObject?.id || userObject.user_metadata?.role !== RolesEnum.ADMIN) {
      return jsonErrorResponse(403, {
        code: "ADMIN_PAYMENTS_FORBIDDEN",
        success: false,
      });
    }

    const pagination = getPagination(nextUrl);
    const { from, to } = pagination;
    const filters = getQueryParams(req.url, ["status", "payment_method", "booking_id"]);

    const _admin = getAdminClient();
    
    let query = _admin
      .from("bookings")
      .select(`
        id,
        created_at,
        updated_at,
        status,
        payment_status,
        payment_intent_id,
        amount,
        consumers(name, surname, email),
        vigils(name, surname, email),
        services(title, price)
      `, { count: "exact" })
      .not("payment_intent_id", "is", null)
      .order("created_at", { ascending: false });

    // Applica filtri se presenti
    if (filters.status) {
      query = query.eq("payment_status", filters.status);
    }
    if (filters.booking_id) {
      query = query.eq("id", filters.booking_id);
    }

    // Applica paginazione
    if (from !== undefined && to !== undefined) {
      query = query.range(from, to);
    }

    const { data, error, count } = await query;

    if (error) {
      throw error;
    }

    // Trasforma i dati per il formato payment
    const paymentsData = (data || []).map((booking: any) => ({
      id: booking.id,
      booking_id: booking.id,
      payment_intent_id: booking.payment_intent_id,
      amount: booking.amount || booking.services?.price || 0,
      status: booking.payment_status,
      created_at: booking.created_at,
      updated_at: booking.updated_at,
      consumer_name: booking.consumers ? `${booking.consumers.name} ${booking.consumers.surname}` : "N/A",
      consumer_email: booking.consumers?.email || "N/A",
      vigil_name: booking.vigils ? `${booking.vigils.name} ${booking.vigils.surname}` : "N/A",
      service_name: booking.services?.title || "N/A",
      service_price: booking.services?.price || 0,
    }));

    // Calcola statistiche finanziarie
    const totalRevenue = paymentsData
      .filter((payment: any) => payment.status === "PAID")
      .reduce((sum: number, payment: any) => sum + payment.amount, 0);

    const totalPending = paymentsData
      .filter((payment: any) => payment.status === "PENDING")
      .reduce((sum: number, payment: any) => sum + payment.amount, 0);

    const totalRefunded = paymentsData
      .filter((payment: any) => payment.status === "REFUNDED")
      .reduce((sum: number, payment: any) => sum + payment.amount, 0);

    return NextResponse.json({
      code: "ADMIN_PAYMENTS_SUCCESS",
      data: paymentsData,
      count,
      stats: {
        total_revenue: totalRevenue,
        total_pending: totalPending,
        total_refunded: totalRefunded,
        total_transactions: count || 0,
      },
      success: true,
    });

  } catch (error) {
    console.error("Admin payments error:", error);
    return jsonErrorResponse(500, {
      code: "ADMIN_PAYMENTS_ERROR",
      success: false,
      error,
    });
  }
}

export async function PUT(req: NextRequest) {
  try {
    console.log(`API PUT admin/payments`);

    // Verifica autenticazione e ruolo admin
    const userObject = await authenticateUser(req);
    if (!userObject?.id || userObject.user_metadata?.role !== RolesEnum.ADMIN) {
      return jsonErrorResponse(403, {
        code: "ADMIN_PAYMENTS_FORBIDDEN",
        success: false,
      });
    }

    const body = await req.json();
    const { booking_id, payment_status, refund_reason } = body;

    if (!booking_id || !payment_status) {
      return jsonErrorResponse(400, {
        code: "ADMIN_PAYMENTS_BAD_REQUEST",
        success: false,
      });
    }

    const _admin = getAdminClient();
    
    // Aggiorna lo stato del pagamento nella prenotazione
    const updateData: any = {
      payment_status,
      updated_at: new Date().toISOString(),
    };

    if (refund_reason) {
      updateData.refund_reason = refund_reason;
    }

    const { data, error } = await _admin
      .from("bookings")
      .update(updateData)
      .eq("id", booking_id)
      .select(`
        *,
        consumers(name, surname, email),
        vigils(name, surname, email),
        services(title, price)
      `)
      .single();

    if (error) {
      throw error;
    }

    // TODO: Implementare logica di rimborso con Stripe se necessario
    if (payment_status === "REFUNDED" && data.payment_intent_id) {
      // Qui dovrebbe essere implementata la logica di rimborso con Stripe
      console.log(`Refund needed for payment_intent: ${data.payment_intent_id}`);
    }

    return NextResponse.json({
      code: "ADMIN_PAYMENTS_UPDATE_SUCCESS",
      data: {
        ...data,
        consumer_name: data.consumers ? `${data.consumers.name} ${data.consumers.surname}` : "N/A",
        vigil_name: data.vigils ? `${data.vigils.name} ${data.vigils.surname}` : "N/A",
        service_name: data.services?.title || "N/A",
      },
      success: true,
    });

  } catch (error) {
    console.error("Admin payments update error:", error);
    return jsonErrorResponse(500, {
      code: "ADMIN_PAYMENTS_UPDATE_ERROR",
      success: false,
      error,
    });
  }
}
