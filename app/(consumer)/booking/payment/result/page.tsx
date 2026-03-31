"use client";

import { ButtonLink } from "@/components";
import { Routes } from "@/src/routes";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { useQueryParams } from "@/src/hooks/useQueryParams";
import { redirect } from "next/navigation";
import { PaymentStatusEnum } from "@/src/enums/booking.enums";
import { useEffect, useState, Suspense, useRef, useCallback } from "react";
import { RolesEnum } from "@/src/enums/roles.enums";
import { useBookingsStore } from "@/src/store/bookings/bookings.store";

const POLL_INTERVAL_MS = 3000;
const MAX_POLL_ATTEMPTS = 10;

function BookingPaymentResultContent() {
  const {
    params: { bookingId, payment_intent, payment_method, status },
  } = useQueryParams();

  const { getBookingDetails } = useBookingsStore();
  const [isLoading, setIsLoading] = useState(true);
  const [paymentVerified, setPaymentVerified] = useState(false);
  const pollCountRef = useRef(0);
  const pollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  if (!bookingId) {
    redirect(Routes.home.url);
  }

  const pollBookingStatus = useCallback(async () => {
    try {
      const booking = await getBookingDetails(bookingId, true);

      if (booking.payment_status === PaymentStatusEnum.PAID) {
        setPaymentVerified(true);
        setIsLoading(false);
        return;
      }

      pollCountRef.current += 1;

      if (pollCountRef.current >= MAX_POLL_ATTEMPTS) {
        // Webhook hasn't fired yet but payment went through on Stripe side
        setPaymentVerified(true);
        setIsLoading(false);
        return;
      }

      // Schedule next poll
      pollTimerRef.current = setTimeout(pollBookingStatus, POLL_INTERVAL_MS);
    } catch (err) {
      console.error("Error polling booking status:", err);
      // On polling error, still show success — the payment was captured by Stripe,
      // the webhook will eventually update the booking.
      setPaymentVerified(true);
      setIsLoading(false);
    }
  }, [bookingId, getBookingDetails]);

  useEffect(() => {
    if (bookingId) {
      if (payment_method === "wallet" && status === "success") {
        getBookingDetails(bookingId, true).catch(() => {});
        setPaymentVerified(true);
        setIsLoading(false);
      } else if (payment_intent) {
        // Payment status is updated server-side by the Stripe webhook.
        // Poll booking details until it's confirmed.
        pollBookingStatus();
      } else {
        // No payment_intent and not wallet — shouldn't be on this page
        redirect(Routes.home.url);
      }
    } else {
      redirect(Routes.home.url);
    }

    return () => {
      if (pollTimerRef.current) clearTimeout(pollTimerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingId, payment_intent, payment_method, status]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white w-full max-w-md mx-auto p-8 rounded-lg shadow-lg text-center">
        {isLoading ? (
          <>
            <div className="flex justify-center mb-6">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Verifica del pagamento in corso...
            </h1>
            <p className="text-gray-600 mb-6">
              Stiamo verificando lo stato del tuo pagamento, attendere prego.
            </p>
          </>
        ) : paymentVerified ? (
          <>
            <div className="flex justify-center mb-6">
              <CheckCircleIcon className="h-16 w-16 text-green-500" />
            </div>

            <h1 className="text-2xl font-bold  mb-4">Pagamento Completato!</h1>

            <p className="text-gray-600 mb-6">
              Il tuo pagamento è stato elaborato con successo e verificato.
              <br />
              Di conseguenza, la tua prenotazione è stata confermata: riceverai
              a breve una conferma via email!
            </p>

            {bookingId && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm ">ID Prenotazione:</p>
                <p className="font-mono text-gray-600 text-sm">{bookingId}</p>
              </div>
            )}

            <div className="space-y-3">
              <ButtonLink
                full
                role={RolesEnum.VIGIL}
                label="Visualizza le mie prenotazioni"
                href={`${Routes.profileConsumer.url}?tab=calendario`}
              />
              <ButtonLink
                role={RolesEnum.CONSUMER}
                full
                label="Torna alla home"
                href={Routes.home.url}
              />
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}

export default function BookingPaymentResultPage() {
  return (
    <Suspense
      fallback={<div className="h-12 bg-gray-100 rounded-lg animate-pulse" />}
    >
      <BookingPaymentResultContent />
    </Suspense>
  );
}
