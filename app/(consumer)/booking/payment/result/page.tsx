"use client";

import { ButtonLink } from "@/components";
import { Routes } from "@/src/routes";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { useQueryParams } from "@/src/hooks/useQueryParams";
import { redirect } from "next/navigation";
import { BookingsService } from "@/src/services";
import {
  BookingStatusEnum,
  PaymentStatusEnum,
} from "@/src/enums/booking.enums";
import { useEffect } from "react";

export default function BookingPaymentResultPage() {
  const {
    params: { bookingId, payment_intent },
  } = useQueryParams();

  if (!bookingId) {
    redirect(Routes.home.url);
  }

  const updateBookingPaymentStatus = async () => {
    try {
      const result = await BookingsService.updateBookingPaymentStatus(
        bookingId,
        {
          payment_id: payment_intent,
          payment_status: PaymentStatusEnum.PAID,
          status: BookingStatusEnum.CONFIRMED,
        }
      );
      return result;
    } catch (error) {
      console.error("Failed to update booking payment status:", error);
      throw error;
    }
  };

  useEffect(() => {
    if (bookingId && payment_intent) {
      updateBookingPaymentStatus();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingId, payment_intent]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white w-full max-w-md mx-auto p-8 rounded-lg shadow-lg text-center">
        <div className="flex justify-center mb-6">
          <CheckCircleIcon className="h-16 w-16 text-green-500" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Pagamento Completato!
        </h1>

        <p className="text-gray-600 mb-6">
          Il tuo pagamento è stato elaborato con successo. La tua prenotazione è
          stata confermata, riceverai a breve una conferma via email.
        </p>

        {bookingId && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500">ID Prenotazione:</p>
            <p className="font-mono text-sm">{bookingId}</p>
          </div>
        )}

        <div className="space-y-3">
          <ButtonLink
            full
            label="Visualizza le mie prenotazioni"
            href={Routes.bookings.url}
          />
          <ButtonLink
            secondary
            full
            label="Torna alla home"
            href={Routes.home.url}
          />
        </div>
      </div>
    </div>
  );
}
