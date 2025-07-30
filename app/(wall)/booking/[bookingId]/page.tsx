"use client";

import { Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import { BookingDetailsComponent } from "@/components/bookings";
import { Button } from "@/components";
import { Routes } from "@/src/routes";
import { NavigationUtils } from "@/src/utils/navigation.utils";

function BookingDetailsContent() {
  const params = useParams();
  const router = useRouter();
  const bookingId = params.bookingId as string;

  if (!bookingId) {
    router.push(Routes.bookings.url);
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {NavigationUtils.hasInternalNavigation() && (
        <div className="mb-6">
          <Button
            secondary
            label="← Torna indietro"
            action={() => router.back()}
            className="mb-4"
          />
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <BookingDetailsComponent bookingId={bookingId} />
      </div>
    </div>
  );
}

export default function BookingDetailsPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-gray-500">
              Caricamento dettagli prenotazione...
            </p>
          </div>
        </div>
      }
    >
      <BookingDetailsContent />
    </Suspense>
  );
}
