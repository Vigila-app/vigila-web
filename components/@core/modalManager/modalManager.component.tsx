"use client";

import { useModalStore } from "@/src/store/modal/modal.store";
import { ModalPortalComponent } from "@/components/@core";
import { BookingFormComponent, BookingDetailsComponent } from "@/components/bookings";
import { ReviewFormComponent } from "@/components/reviews";
import { BookingI } from "@/src/types/booking.types";
import { ServiceI } from "@/src/types/services.types";

const ModalManagerComponent = () => {
  const { isOpen, modalId, payload } = useModalStore();

  if (!isOpen || !modalId) return null;

  const renderModalContent = () => {
    switch (modalId) {
      case "booking-form":
        return (
          <BookingFormComponent
            isModal
            title={payload?.booking ? "Modifica Prenotazione" : "Nuova Prenotazione"}
            booking={payload?.booking as BookingI}
            serviceId={payload?.serviceId as ServiceI["id"]}
            vigilId={payload?.vigilId as ServiceI["vigil_id"]}
          />
        );
      
      case "booking-details":
        return (
          <BookingDetailsComponent
            bookingId={payload?.bookingId as BookingI["id"]}
          />
        );

      case "review-form":
        return (
          <ReviewFormComponent
            isModal
            bookingId={payload?.bookingId as string}
            vigilName={payload?.vigilName as string}
            onSuccess={payload?.onSuccess as (() => void) | undefined}
          />
        );

      case "review-edit":
        return (
          <ReviewFormComponent
            isModal
            bookingId={payload?.bookingId as string}
            vigilName={payload?.vigilName as string}
            onSuccess={payload?.onSuccess as (() => void) | undefined}
            // For editing, we could pass initial data
            initialData={payload?.initialData as { rating: number; comment: string } | undefined}
          />
        );
      
      default:
        return null;
    }
  };

  if (!isOpen || !modalId) return null;

  return (
    <ModalPortalComponent
      modalId={modalId}
      closable
      customClass="md:max-w-4xl"
    >
      {renderModalContent()}
    </ModalPortalComponent>
  );
};

export default ModalManagerComponent;