"use client";

import { BookingI } from "@/src/types/booking.types";
import { useEffect, useMemo, useState } from "react";
import { useBookingsStore } from "@/src/store/bookings/bookings.store";
import { useAppStore } from "@/src/store/app/app.store";
import { CheckoutForm } from "@/components/checkout";
import { amountDisplay, getCurrency } from "@/src/utils/common.utils";
import { Routes } from "@/src/routes";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/src/store/user/user.store";
import { BookingsService, PaymentService } from "@/src/services";
import {
  PaymentStatusEnum,
  BookingStatusEnum,
} from "@/src/enums/booking.enums";
import { useServicesStore } from "@/src/store/services/services.store";
import { ServicesUtils } from "@/src/utils/services.utils";
import { dateDisplay } from "@/src/utils/date.utils";
import { useVigilStore } from "@/src/store/vigil/vigil.store";
import { AppConstants } from "@/src/constants";

type PaymentBookingI = {
  bookingId: BookingI["id"];
};

const BookingPaymentComponent = (props: PaymentBookingI) => {
  const { bookingId } = props;
  const router = useRouter();

  const [clientSecret, setClientSecret] = useState<string>("");
  const [error, setError] = useState<string>("");

  const { user } = useUserStore();
  const { bookings, getBookingDetails } = useBookingsStore();
  const { services, getServiceDetails } = useServicesStore();
  const { vigils, getVigilsDetails } = useVigilStore();
  const booking = useMemo(
    () => bookings.find((b) => b.id === bookingId),
    [bookings, bookingId]
  );
  const service = useMemo(
    () => services.find((s) => s.id === booking?.service_id),
    [services, booking?.service_id]
  );
  const vigil = useMemo(
    () => vigils.find((v) => v.id === booking?.vigil_id),
    [vigils, booking?.vigil_id]
  );

  if (error) {
    console.error("BookingPaymentComponent error:", error);
  }

  const { showLoader, hideLoader } = useAppStore();

  const loadBookingAndCreatePayment = async () => {
    try {
      // Previeni chiamate multiple
      setError("");
      if (clientSecret) {
        console.log("Payment creation already in progress or completed");
        return;
      }
      showLoader();

      if (booking?.id && user?.id) {
        const response = await PaymentService.createPaymentIntent({
          bookingId: booking.id,
          user: user.id,
          amount: Math.round(booking.price * 100), // Converti in centesimi
          currency: service?.currency
            ? getCurrency(service.currency)
            : booking.currency?.toLowerCase() || "eur",
        });

        if (response.success) {
          setClientSecret(response.clientSecret);
        } else {
          console.error("Payment intent creation failed:", response);
          setError("Errore durante la creazione del pagamento");
        }
      } else {
        console.error("Booking not found or missing ID");
        throw new Error("Booking not found");
      }
    } catch (err) {
      console.error("Error loading booking or creating payment:", err);
      setError("Errore durante il caricamento della prenotazione");
    } finally {
      hideLoader();
    }
  };

  useEffect(() => {
    if (bookingId) getBookingDetails(bookingId, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingId]);

  useEffect(() => {
    if (booking?.id) {
      getServiceDetails(booking.service_id);
      getVigilsDetails([booking.vigil_id]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [booking?.id]);

  useEffect(() => {
    if (booking?.id && service?.id) {
      loadBookingAndCreatePayment();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [booking?.id, service?.id]);

  const verifyAndUpdatePaymentStatus = async (paymentIntentId: string) => {
    try {
      showLoader();
      // Prima verifica lo stato del pagamento con Stripe
      const paymentVerification =
        await PaymentService.verifyPaymentIntent(paymentIntentId);

      if (!paymentVerification.success) {
        throw new Error("Impossibile verificare lo stato del pagamento");
      }

      const { data: paymentData } = paymentVerification;

      // Verifica che il pagamento sia andato a buon fine
      if (!paymentData.succeeded || paymentData.status !== "succeeded") {
        throw new Error("Il pagamento non è stato completato con successo");
      }

      // Verifica che il bookingId corrisponda
      if (paymentData.bookingId !== booking!.id) {
        throw new Error("Errore nella corrispondenza dei dati di pagamento");
      }

      // Se la verifica è ok, aggiorna lo stato della prenotazione
      const result = await BookingsService.updateBookingPaymentStatus(
        booking!.id,
        {
          payment_id: paymentIntentId,
          payment_status: PaymentStatusEnum.PAID,
          status: BookingStatusEnum.CONFIRMED,
        }
      );
      return result;
    } catch (error) {
      console.error(
        "Failed to verify and update booking payment status:",
        error
      );
      throw error;
    } finally {
      hideLoader();
    }
  };

  const handlePaymentSuccess = async (paymentIntentId: string) => {
    try {
      showLoader();
      // Verifica e aggiorna lo stato della prenotazione
      await verifyAndUpdatePaymentStatus(paymentIntentId);

      // Reindirizza alla pagina di successo o delle prenotazioni
      router.push(`${Routes.bookings.url}?success=true`);
    } catch (error) {
      console.error(
        "Error verifying and updating booking after payment:",
        error
      );
      // Anche se l'aggiornamento fallisce, il pagamento è andato a buon fine
      // Quindi reindirizza comunque alla pagina di risultato per gestire l'errore
      router.push(
        `${Routes.paymentBookingConfirm.url}?bookingId=${
          booking!.id
        }&payment_intent=${paymentIntentId}`
      );
    } finally {
      hideLoader();
    }
  };

  const handlePaymentError = (error: string) => {
    console.error("Payment error:", error);
    // Errore già gestito dal CheckoutForm tramite toast
  };

  if (error || !booking) {
    return <div className="h-12 bg-gray-100 rounded-lg animate-pulse" />;
  }

  return (
    <div className="bg-gray-50 w-full mx-auto p-6 rounded-lg shadow-lg">
      <div className="mb-6">
        <h2 className="text-center font-medium text-xl">
          Completa prenotazione
        </h2>
        <p className="text-center text-sm text-gray-500 mt-2">
          Per completare la prenotazione, procedi al pagamento. Una volta
          effettuato il pagamento, riceverai una conferma via email.
        </p>
      </div>

      {/* Riepilogo prenotazione */}
      <div className="my-6 p-4 bg-white rounded-lg shadow">
        <h3 className="font-medium text-gray-900 mb-3">
          Riepilogo Prenotazione
        </h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>ID Prenotazione:</span>
            <span className="font-mono text-xs">{booking.id}</span>
          </div>
          {service?.id && (
            <div className="flex justify-between">
              <span>Servizio:</span>
              <span>{service?.name}</span>
            </div>
          )}
          {vigil?.id && (
            <div className="flex justify-between">
              <span>Vigil:</span>
              <span>{vigil?.displayName}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Quando:</span>
            <span>{dateDisplay(booking.startDate)}</span>
          </div>
          <div className="flex justify-between">
            <span>Indirizzo:</span>
            <span>{booking.address}</span>
          </div>
          <div className="flex justify-between">
            <span>Quantità:</span>
            <span>
              {booking.quantity}&nbsp;
              {service?.unit_type
                ? ServicesUtils.getServiceUnitType(service?.unit_type)
                : ""}
            </span>
          </div>
          <div className="flex justify-between font-medium text-lg border-t pt-2">
            <span>Totale:</span>
            <span>
              {service?.currency}
              {amountDisplay(booking.price)}
            </span>
          </div>
        </div>
      </div>

      {/* Form di pagamento Stripe */}
      {clientSecret && (
        <div className="my-6 p-4 bg-white rounded-lg shadow">
          <h3 className="font-medium text-gray-900 mb-3">Pagamento</h3>
          <CheckoutForm
            returnUrl={`${window?.location?.origin || AppConstants.hostUrl}${Routes.paymentBookingConfirm.url}?bookingId=${booking.id}`}
            onSuccess={handlePaymentSuccess}
            onError={handlePaymentError}
            // onCancel={handleBackToBookings}
            submitLabel="Completa pagamento"
            clientSecret={clientSecret}
          />
        </div>
      )}
    </div>
  );
};

export default BookingPaymentComponent;
