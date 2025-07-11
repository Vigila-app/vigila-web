import { BookingI } from "@/src/types/booking.types";
import { useEffect, useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useBookingsStore } from "@/src/store/bookings/bookings.store";
import { useAppStore } from "@/src/store/app/app.store";
import { Button } from "@/components";
import { CheckoutForm } from "@/components/checkout";
import { amountDisplay } from "@/src/utils/common.utils";
import { Routes } from "@/src/routes";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/src/store/user/user.store";
import { BookingsService, PaymentService } from "@/src/services";
import {
  PaymentStatusEnum,
  BookingStatusEnum,
} from "@/src/enums/booking.enums";

// Carica Stripe (sostituisci con la tua chiave pubblica)
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

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
  const booking = bookings.find((b) => b.id === bookingId);

  const {
    showLoader,
    hideLoader,
    loader: { isLoading },
  } = useAppStore();

  const loadBookingAndCreatePayment = async () => {
    try {
      showLoader();
      if (booking?.id) {
        // Crea il Payment Intent con Stripe tramite il servizio
        const response = await PaymentService.createPaymentIntent({
          bookingId: booking.id,
          user: user.id,
          amount: Math.round(booking.price * 100), // Converti in centesimi
          currency: booking.currency.toLowerCase(),
        });

        if (response.success) {
          setClientSecret(response.clientSecret);
        } else {
          setError("Errore durante la creazione del pagamento");
        }
      } else {
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
      loadBookingAndCreatePayment();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [booking]);

  const updateBookingPaymentStatus = async (paymentIntentId: string) => {
    try {
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
      console.error("Failed to update booking payment status:", error);
      throw error;
    }
  };

  const handlePaymentSuccess = async (paymentIntentId: string) => {
    try {
      // Aggiorna lo stato della prenotazione
      await updateBookingPaymentStatus(paymentIntentId);

      // Reindirizza alla pagina di successo o delle prenotazioni
      router.push(`${Routes.bookings.url}?success=true`);
    } catch (error) {
      console.error("Error updating booking after payment:", error);
      // Anche se l'aggiornamento fallisce, il pagamento è andato a buon fine
      // Quindi reindirizza comunque
      router.push(`${Routes.bookings.url}?success=true`);
    }
  };

  const handlePaymentError = (error: string) => {
    console.error("Payment error:", error);
    // Errore già gestito dal CheckoutForm tramite toast
  };

  const handleBackToBookings = () => {
    router.push(Routes.bookings.url);
  };

  if (isLoading) {
    return (
      <div className="bg-white w-full mx-auto p-6 rounded-lg shadow-lg">
        <div className="text-center">
          <p>Caricamento...</p>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="bg-white w-full mx-auto p-6 rounded-lg shadow-lg">
        <div className="text-center">
          <h2 className="text-xl font-medium text-red-600 mb-4">Errore</h2>
          <p className="text-gray-600 mb-6">
            {error || "Prenotazione non trovata"}
          </p>
          <Button
            label="Torna alle prenotazioni"
            action={handleBackToBookings}
          />
        </div>
      </div>
    );
  }

  const appearance = {
    theme: "stripe" as const,
    variables: {
      colorPrimary: "#f97316",
      colorBackground: "#ffffff",
      colorText: "#30313d",
      colorDanger: "#df1b41",
      fontFamily: "Inter, system-ui, sans-serif",
      spacingUnit: "4px",
      borderRadius: "8px",
    },
  };

  const options = {
    clientSecret,
    appearance,
  };

  return (
    <div className="bg-white w-full mx-auto p-6 rounded-lg shadow-lg">
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
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-medium text-gray-900 mb-3">
          Riepilogo Prenotazione
        </h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>ID Prenotazione:</span>
            <span className="font-mono text-xs">{booking.id}</span>
          </div>
          <div className="flex justify-between">
            <span>Indirizzo:</span>
            <span>{booking.address}</span>
          </div>
          <div className="flex justify-between">
            <span>Quantità:</span>
            <span>{booking.quantity}</span>
          </div>
          <div className="flex justify-between font-medium text-lg border-t pt-2">
            <span>Totale:</span>
            <span>
              {booking.currency} {amountDisplay(booking.price)}
            </span>
          </div>
        </div>
      </div>

      {/* Form di pagamento Stripe */}
      {clientSecret && (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm
            returnUrl={`${window.location.origin}/booking/payment/success?bookingId=${booking.id}`}
            onSuccess={handlePaymentSuccess}
            onError={handlePaymentError}
            onCancel={handleBackToBookings}
            submitLabel="Completa pagamento"
            cancelLabel="Torna alle prenotazioni"
          />
        </Elements>
      )}
    </div>
  );
};

export default BookingPaymentComponent;
