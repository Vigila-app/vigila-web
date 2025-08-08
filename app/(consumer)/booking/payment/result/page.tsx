"use client";

import { ButtonLink } from "@/components";
import { Routes } from "@/src/routes";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { useQueryParams } from "@/src/hooks/useQueryParams";
import { redirect } from "next/navigation";
import { BookingsService, PaymentService } from "@/src/services";
import {
  BookingStatusEnum,
  PaymentStatusEnum,
} from "@/src/enums/booking.enums";
import { useEffect, useState, Suspense } from "react";
import { RolesEnum } from "@/src/enums/roles.enums";

function BookingPaymentResultContent() {
  const {
    params: { bookingId, payment_intent },
  } = useQueryParams();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [paymentVerified, setPaymentVerified] = useState(false);

  if (!bookingId) {
    redirect(Routes.home.url);
  }

  const verifyAndUpdatePayment = async () => {
    try {
      setIsLoading(true);
      setError("");

      // Prima verifica lo stato del pagamento con Stripe
      const paymentVerification =
        await PaymentService.verifyPaymentIntent(payment_intent);

      if (!paymentVerification.success) {
        throw new Error("Impossibile verificare lo stato del pagamento");
      }

      const { data: paymentData } = paymentVerification;

      // Verifica che il pagamento sia andato a buon fine
      if (!paymentData.succeeded || paymentData.status !== "succeeded") {
        throw new Error("Il pagamento non è stato completato con successo");
      }

      // Verifica che il bookingId corrisponda
      if (paymentData.bookingId !== bookingId) {
        throw new Error("Errore nella corrispondenza dei dati di pagamento");
      }

      // Se la verifica è ok, aggiorna lo stato della prenotazione
      const result = await BookingsService.updateBookingPaymentStatus(
        bookingId,
        {
          payment_id: payment_intent,
          payment_status: PaymentStatusEnum.PAID,
          status: BookingStatusEnum.CONFIRMED,
        }
      );

      setPaymentVerified(true);
      return result;
    } catch (error) {
      console.error(
        "Failed to verify and update booking payment status:",
        error
      );
      setError(
        error instanceof Error
          ? error.message
          : "Errore durante la verifica del pagamento"
      );
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (bookingId && payment_intent) {
      verifyAndUpdatePayment();
    } else {
      setIsLoading(false);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingId, payment_intent]);

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
        ) : error ? (
          <>
            <div className="flex justify-center mb-6">
              <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-red-600 text-2xl font-bold">✕</span>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-red-600 mb-4">
              Errore nella verifica del pagamento
            </h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <p className=" text-gray-600 text-xs font-normal mb-4">
              Ti invitiamo a rifare il processo di prenotazione.
              <br />
              Se il problema dovesse sussistere, riprova più tardi o contatta il
              supporto!
            </p>
            <div className="space-y-3">
              <ButtonLink
                full
                role={RolesEnum.CONSUMER}
                label="Torna alle prenotazioni"
                href={Routes.bookings.url}
              />
              <ButtonLink
                role={RolesEnum.VIGIL}
                full
                label="Contatta il supporto"
                href={Routes.home.url}
              />
            </div>
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
                href={Routes.profileConsumer.url}
              />
              <ButtonLink
                role={RolesEnum.CONSUMER}
                full
                label="Torna alla home"
                href={Routes.home.url}
              />
            </div>
          </>
        ) : (
          <>
            <div className="flex justify-center mb-6 rounded-3xl">
              <div className="h-16 w-16 bg-yellow-100 rounded-full flex items-center justify-center">
                <span className="text-yellow-600 text-2xl font-bold">?</span>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-yellow-600 mb-4">
              Stato del pagamento sconosciuto
            </h1>
            <p className="text-gray-700 mb-6">
              Non è stato possibile determinare lo stato del pagamento.
            </p>
            <div className="space-y-3">
              <ButtonLink
                full
                role={RolesEnum.VIGIL}
                label="Torna alle prenotazioni"
                href={Routes.bookings.url}
              />
              <ButtonLink
                role={RolesEnum.CONSUMER}
                full
                label="Torna alla home"
                href={Routes.home.url}
              />
            </div>
          </>
        )}
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
