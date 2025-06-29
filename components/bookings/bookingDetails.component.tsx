"use client";

import { useEffect, useState } from "react";
import { BookingI } from "@/src/types/booking.types";
import { BookingsService } from "@/src/services";
import { Button, Badge } from "@/components";
import { BookingStatusEnum } from "@/src/enums/booking.enums";
import { amountDisplay, capitalize } from "@/src/utils/common.utils";
import { dateDisplay } from "@/src/utils/date.utils";
import { useAppStore } from "@/src/store/app/app.store";
import { ToastStatusEnum } from "@/src/enums/toast.enum";
import { useUserStore } from "@/src/store/user/user.store";
import { RolesEnum } from "@/src/enums/roles.enums";
import { useModalStore } from "@/src/store/modal/modal.store";

type BookingDetailsComponentI = {
  bookingId: BookingI["id"];
  onUpdate?: (booking: BookingI) => void;
};

const BookingDetailsComponent = (props: BookingDetailsComponentI) => {
  const { bookingId, onUpdate = () => ({}) } = props;
  const [booking, setBooking] = useState<BookingI | null>(null);
  const [loading, setLoading] = useState(true);
  const { showToast, showLoader, hideLoader } = useAppStore();
  const { user } = useUserStore();
  const { closeModal } = useModalStore();

  const isConsumer = user?.user_metadata?.role === RolesEnum.CONSUMER;
  const isVigil = user?.user_metadata?.role === RolesEnum.VIGIL;

  useEffect(() => {
    loadBookingDetails();
  }, [bookingId]);

  const loadBookingDetails = async () => {
    try {
      setLoading(true);
      const bookingDetails = await BookingsService.getBookingDetails(bookingId);
      setBooking(bookingDetails);
    } catch (error) {
      console.error("Error loading booking details", error);
      showToast({
        message: "Error loading booking details",
        type: ToastStatusEnum.ERROR,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (status: BookingStatusEnum) => {
    if (!booking) return;

    try {
      showLoader();
      const updatedBooking = await BookingsService.updateBookingStatus(booking.id, status);
      setBooking(updatedBooking);
      onUpdate(updatedBooking);
      
      showToast({
        message: `Booking ${status.toLowerCase()} successfully`,
        type: ToastStatusEnum.SUCCESS,
      });
    } catch (error) {
      console.error("Error updating booking status", error);
      showToast({
        message: "Error updating booking status",
        type: ToastStatusEnum.ERROR,
      });
    } finally {
      hideLoader();
    }
  };

  const handleCancelBooking = async () => {
    if (!booking) return;

    if (confirm("Are you sure you want to cancel this booking?")) {
      try {
        showLoader();
        await BookingsService.cancelBooking(booking.id);
        
        showToast({
          message: "Booking cancelled successfully",
          type: ToastStatusEnum.SUCCESS,
        });
        
        closeModal();
      } catch (error) {
        console.error("Error cancelling booking", error);
        showToast({
          message: "Error cancelling booking",
          type: ToastStatusEnum.ERROR,
        });
      } finally {
        hideLoader();
      }
    }
  };

  const getStatusColor = (status: BookingStatusEnum) => {
    switch (status) {
      case BookingStatusEnum.PENDING:
        return "yellow";
      case BookingStatusEnum.CONFIRMED:
        return "blue";
      case BookingStatusEnum.IN_PROGRESS:
        return "purple";
      case BookingStatusEnum.COMPLETED:
        return "green";
      case BookingStatusEnum.CANCELLED:
      case BookingStatusEnum.REFUNDED:
        return "red";
      default:
        return "gray";
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Loading booking details...</p>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Booking not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Booking Details</h2>
          <p className="text-gray-600">Booking ID: {booking.id}</p>
        </div>
        <Badge
          label={capitalize(booking.status)}
          color={getStatusColor(booking.status)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-gray-900">Service Information</h3>
            <div className="mt-2 space-y-2 text-sm">
              <p><span className="font-medium">Service:</span> {booking.service?.name}</p>
              <p><span className="font-medium">Description:</span> {booking.service?.description}</p>
              <p><span className="font-medium">Price per hour:</span> {booking.currency} {amountDisplay(booking.service?.price || 0)}</p>
            </div>
          </div>

          <div>
            <h3 className="font-medium text-gray-900">Booking Details</h3>
            <div className="mt-2 space-y-2 text-sm">
              <p><span className="font-medium">Service Date:</span> {dateDisplay(booking.service_date)}</p>
              <p><span className="font-medium">Duration:</span> {booking.duration_hours} hour(s)</p>
              <p><span className="font-medium">Total Amount:</span> {booking.currency} {amountDisplay(booking.total_amount)}</p>
              <p><span className="font-medium">Payment Status:</span> {capitalize(booking.payment_status)}</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-gray-900">
              {isConsumer ? "Vigil Information" : "Consumer Information"}
            </h3>
            <div className="mt-2 space-y-2 text-sm">
              {isConsumer ? (
                <>
                  <p><span className="font-medium">Name:</span> {booking.vigil?.user_metadata?.displayName}</p>
                  <p><span className="font-medium">Email:</span> {booking.vigil?.email}</p>
                </>
              ) : (
                <>
                  <p><span className="font-medium">Name:</span> {booking.consumer?.user_metadata?.displayName}</p>
                  <p><span className="font-medium">Email:</span> {booking.consumer?.email}</p>
                </>
              )}
            </div>
          </div>

          {booking.guest && (
            <div>
              <h3 className="font-medium text-gray-900">Guest Information</h3>
              <div className="mt-2 space-y-2 text-sm">
                <p><span className="font-medium">Name:</span> {booking.guest.name} {booking.guest.surname}</p>
                {booking.guest.email && (
                  <p><span className="font-medium">Email:</span> {booking.guest.email}</p>
                )}
                {booking.guest.phone && (
                  <p><span className="font-medium">Phone:</span> {booking.guest.phone}</p>
                )}
              </div>
            </div>
          )}

          {booking.notes && (
            <div>
              <h3 className="font-medium text-gray-900">Notes</h3>
              <p className="mt-2 text-sm text-gray-600">{booking.notes}</p>
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-4 pt-4 border-t">
        {isVigil && booking.status === BookingStatusEnum.PENDING && (
          <>
            <Button
              primary
              label="Confirm Booking"
              action={() => handleStatusUpdate(BookingStatusEnum.CONFIRMED)}
            />
            <Button
              danger
              label="Reject Booking"
              action={() => handleStatusUpdate(BookingStatusEnum.CANCELLED)}
            />
          </>
        )}

        {isVigil && booking.status === BookingStatusEnum.CONFIRMED && (
          <Button
            primary
            label="Start Service"
            action={() => handleStatusUpdate(BookingStatusEnum.IN_PROGRESS)}
          />
        )}

        {isVigil && booking.status === BookingStatusEnum.IN_PROGRESS && (
          <Button
            primary
            label="Complete Service"
            action={() => handleStatusUpdate(BookingStatusEnum.COMPLETED)}
          />
        )}

        {isConsumer && booking.status === BookingStatusEnum.PENDING && (
          <Button
            danger
            label="Cancel Booking"
            action={handleCancelBooking}
          />
        )}

        <Button
          secondary
          label="Close"
          action={closeModal}
        />
      </div>
    </div>
  );
};

export default BookingDetailsComponent;