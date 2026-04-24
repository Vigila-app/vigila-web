import React from "react";
import { BookingFormComponent } from "@/components/bookings";

type SingleBookingProps = {
  answers?: Record<string, any>;
  setAnswers?: (
    updater:
      | Record<string, any>
      | ((prev: Record<string, any>) => Record<string, any>),
  ) => void;
  isLastStep?: boolean;
};

export const SingleBooking = ({ answers, setAnswers }: SingleBookingProps) => {
  const bookingPrefill = {
    // map onboarding question ids to booking fields used by BookingFormComponent
    address: answers?.["address"] || answers?.address,
    startDate: answers?.["start-date"] || answers?.["startDate"],
  };

  const handleOnSubmit = (newBooking: any) => {
    if (setAnswers) {
      setAnswers((prev: Record<string, any>) => ({
        ...(prev || {}),
        address: newBooking?.address || prev?.address,
        "start-date": newBooking?.startDate || prev?.["start-date"],
        bookingId: newBooking?.id || prev?.bookingId,
      }));
    }
  };

  return (
    <BookingFormComponent
      booking={bookingPrefill as any}
      onSubmit={handleOnSubmit}
    />
  );
};
