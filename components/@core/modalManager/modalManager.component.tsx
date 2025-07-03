"use client";

import { useModalStore } from "@/src/store/modal/modal.store";
import { ModalPortalComponent } from "@/components/@core";
import { BookingFormComponent, BookingDetailsComponent } from "@/components/bookings";

const ModalManagerComponent = () => {
  const { isOpen, modalId, payload } = useModalStore();

  if (!isOpen || !modalId) return null;

  const renderModalContent = () => {
    switch (modalId) {
      case "booking-form":
        return (
          <BookingFormComponent
            isModal
            title={payload?.booking ? "Edit Booking" : "Create New Booking"}
            booking={payload?.booking}
            serviceId={payload?.serviceId}
          />
        );
      
      case "booking-details":
        return (
          <BookingDetailsComponent
            bookingId={payload?.bookingId}
          />
        );
      
      default:
        return null;
    }
  };

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