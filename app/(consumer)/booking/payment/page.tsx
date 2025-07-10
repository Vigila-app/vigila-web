"use client";
import { ProgressBar } from "@/components";
import { BookingPaymentComponent } from "@/components/bookings";
import { useQueryParams } from "@/src/hooks/useQueryParams";
import { Routes } from "@/src/routes";
import { redirect } from "next/navigation";

export default function PaymentBookingPage() {
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
