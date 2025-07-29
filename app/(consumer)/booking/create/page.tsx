"use client";
import { ProgressBar } from "@/components";
import { BookingFormComponent } from "@/components/bookings";
import { useQueryParams } from "@/src/hooks/useQueryParams";
import { Routes } from "@/src/routes";
import { redirect } from "next/navigation";
import { Suspense } from "react";

function CreateBookingContent() {
  const {
    params: { serviceId, vigilId },
  } = useQueryParams();

  if (!vigilId) {
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

export default function CreateBookingPage() {
  return (
    <Suspense fallback={<div className="h-12 bg-gray-100 rounded-lg animate-pulse" />}>
      <CreateBookingContent />
    </Suspense>
  );
}
