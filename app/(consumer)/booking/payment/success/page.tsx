"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components";
import { Routes } from "@/src/routes";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [bookingId, setBookingId] = useState<string>("");

  useEffect(() => {
    const id = searchParams.get("bookingId");
    if (id) {
      setBookingId(id);
    }
  }, [searchParams]);

  const handleGoToBookings = () => {
    router.push(Routes.bookings.url);
  };

  const handleGoHome = () => {
    router.push(Routes.home.url);
  };

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
          <Button
            full
            label="Visualizza le mie prenotazioni"
            action={handleGoToBookings}
          />
          <Button
            secondary
            full
            label="Torna alla home"
            action={handleGoHome}
          />
        </div>
      </div>
    </div>
  );
}
