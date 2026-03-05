"use client";
import { ProgressBar } from "@/components";
import { BookingFormComponent } from "@/components/bookings";
import { useQueryParams } from "@/src/hooks/useQueryParams";
import { Routes } from "@/src/routes";
import { redirect } from "next/navigation";
import { Suspense } from "react";

function EditBookingContent() {
  const {
    params: { bookingId },
  } = useQueryParams();

  if (!bookingId) {
    redirect(Routes.home.url);
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <ProgressBar percentage={40} />
      <BookingFormComponent
        bookingId={bookingId}
        edit
      />
    </div>
  );
}

export default function EditBookingPage() {
  return (
    <Suspense fallback={<div className="h-12 bg-gray-100 rounded-lg animate-pulse" />}>
      <EditBookingContent />
    </Suspense>
  );
}
