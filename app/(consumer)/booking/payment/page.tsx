"use client";
import { ProgressBar } from "@/components";
import { useQueryParams } from "@/src/hooks/useQueryParams";
import { Routes } from "@/src/routes";
import dynamic from "next/dynamic";
import { redirect } from "next/navigation";
import { Suspense } from "react";

const BookingPaymentComponent = dynamic(
  () => import("@/components/bookings/bookingPayment.component"),
  {
    ssr: false,
    loading: () => (
      <div className="h-12 bg-gray-100 rounded-lg animate-pulse" />
    ),
  }
);

function BookingPaymentContent() {
  const {
    params: { bookingId },
  } = useQueryParams();

  if (!bookingId) {
    redirect(Routes.home.url);
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <ProgressBar percentage={80} />
      <BookingPaymentComponent bookingId={bookingId} />
    </div>
  );
}

export default function BookingPaymentBookingPage() {
  return (
    <Suspense fallback={<div className="h-12 bg-gray-100 rounded-lg animate-pulse" />}>
      <BookingPaymentContent />
    </Suspense>
  );
}
