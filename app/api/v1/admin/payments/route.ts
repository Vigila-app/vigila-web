import { NextRequest, NextResponse } from "next/server";
import {
  authenticateUser,
  getAdminClient,
  jsonErrorResponse,
  getPagination,
  getQueryParams,
} from "@/server/api.utils.server";
import { RolesEnum } from "@/src/enums/roles.enums";
import { PaymentStatusEnum } from "@/src/enums/booking.enums";

export async function GET(req: NextRequest) {
  try {
    const { nextUrl } = req;
    console.log(`API GET admin/payments`);

    const userObject = await authenticateUser(req);
    if (!userObject?.id || userObject.user_metadata?.role !== RolesEnum.ADMIN) {
      return jsonErrorResponse(403, {
        code: "ADMIN_PAYMENTS_FORBIDDEN",
        success: false,
      });
    }

    const pagination = getPagination(nextUrl);
    const { from, to } = pagination;
    const filters = getQueryParams(req.url, [
      "status",
      "payment_method",
      "booking_id",
    ]);

    const _admin = getAdminClient();

    let query = _admin
      .from("bookings")
      .select(
        `
        id,
        created_at,
        updated_at,
        status,
        payment_status,
        payment_id,
        price,
        quantity,
        consumers(displayName),
        vigils(displayName),
        services(name, unit_price)
      `,
        { count: "exact" }
      )
      .not("payment_id", "is", null)
      .order("created_at", { ascending: false });

    if (filters.status) {
      query = query.eq("payment_status", filters.status);
    }
    if (filters.booking_id) {
      query = query.eq("id", filters.booking_id);
    }

    if (from !== undefined && to !== undefined) {
      query = query.range(from, to);
    }

    const { data, error, count } = await query;

    if (error) {
      throw error;
    }

    const paymentsData = (data || []).map((booking: any) => ({
      id: booking.id,
      booking_id: booking.id,
      payment_id: booking.payment_id,
      amount: booking.price,
      status: booking.payment_status,
      created_at: booking.created_at,
      updated_at: booking.updated_at,
      consumer_name: booking.consumers.displayName,
      vigil_name: booking.vigils.displayName,
      service_name: booking.services?.name,
      service_price: booking.services?.unit_price,
    }));

    const totalRevenue = paymentsData
      .filter((payment: any) => payment.status === PaymentStatusEnum.PAID)
      .reduce((sum: number, payment: any) => sum + payment.amount, 0);

    const totalPending = paymentsData
      .filter((payment: any) => payment.status === PaymentStatusEnum.PENDING)
      .reduce((sum: number, payment: any) => sum + payment.amount, 0);

    const totalRefunded = paymentsData
      .filter((payment: any) => payment.status === PaymentStatusEnum.REFUNDED)
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
      .select(
        `
        *,
        consumers(displayName),
        vigils(displayName),
        services(name, unit_price)
      `
      )
      .single();

    if (error) {
      throw error;
    }

    // TODO: Implementare logica di rimborso con Stripe se necessario
    if (payment_status === "REFUNDED" && data.payment_intent_id) {
      // Qui dovrebbe essere implementata la logica di rimborso con Stripe
      console.log(
        `Refund needed for payment_intent: ${data.payment_intent_id}`
      );
    }

    return NextResponse.json({
      code: "ADMIN_PAYMENTS_UPDATE_SUCCESS",
      data: {
        ...data,
        consumer_name: data.consumers.displayName,
        vigil_name: data.vigils.displayName,
        service_name: data.services?.name,
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
