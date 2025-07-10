"use client";
import { ProgressBar } from "@/components";
import { BookingFormComponent } from "@/components/bookings";
import { useQueryParams } from "@/src/hooks/useQueryParams";
import { Routes } from "@/src/routes";
import { redirect } from "next/navigation";

export default function CreateBookingPage() {
  const {
    params: { serviceId, vigilId },
  } = useQueryParams();

  if (!(serviceId && vigilId)) {
    redirect(Routes.home.url);
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <ProgressBar percentage={40} />
      <BookingFormComponent
        serviceId={serviceId}
        vigilId={vigilId}
      />
    </div>
  );
}
