"use client";

import { ProgressBar } from "@/components";
import BookingPaymentReviewComponent from "@/components/bookings/bookingPaymentReview.component";
import { Suspense } from "react";

function BookingPaymentReviewContent() {
  return (
    <div className="container mx-auto px-4 py-8">
      <ProgressBar percentage={60} />
      <BookingPaymentReviewComponent />
    </div>
  );
}

export default function BookingPaymentReviewPage() {
  return (
    <Suspense
      fallback={<div className="h-12 rounded-lg bg-gray-100 animate-pulse" />}
    >
      <BookingPaymentReviewContent />
    </Suspense>
  );
}
