"use client";

import { useEffect, useState } from "react";
import { BookingI } from "@/src/types/booking.types";
import { BookingsService } from "@/src/services";
import { Button, Badge } from "@/components";
import {
  BookingStatusEnum,
  PaymentStatusEnum,
} from "@/src/enums/booking.enums";
import { amountDisplay, capitalize } from "@/src/utils/common.utils";
import { dateDisplay } from "@/src/utils/date.utils";
import { useAppStore } from "@/src/store/app/app.store";
import { ToastStatusEnum } from "@/src/enums/toast.enum";
import { useUserStore } from "@/src/store/user/user.store";
import { RolesEnum } from "@/src/enums/roles.enums";
import { useModalStore } from "@/src/store/modal/modal.store";
import { ServicesUtils } from "@/src/utils/services.utils";
import { Routes } from "@/src/routes";
import { useRouter } from "next/navigation";

type BookingDetailsComponentI = {
  bookingId: BookingI["id"];
  onUpdate?: (booking: BookingI) => void;
};

const BookingDetailsComponent = (props: BookingDetailsComponentI) => {
  const { bookingId, onUpdate = () => ({}) } = props;
  const router = useRouter();
  const [booking, setBooking] = useState<BookingI | null>(null);
  const [loading, setLoading] = useState(true);
  const { showToast, showLoader, hideLoader } = useAppStore();
  const { user } = useUserStore();
  const { closeModal } = useModalStore();

  const isConsumer = user?.user_metadata?.role === RolesEnum.CONSUMER;
  const isVigil = user?.user_metadata?.role === RolesEnum.VIGIL;

  useEffect(() => {
    loadBookingDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingId]);

  const loadBookingDetails = async () => {
    try {
      setLoading(true);
      const bookingDetails = await BookingsService.getBookingDetails(bookingId);
      setBooking(bookingDetails);
    } catch (error) {
      console.error("Error loading booking details", error);
      showToast({
        message:
          "Si è verificato un errore durante il caricamento dei dettagli della prenotazione",
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
      const updatedBooking = await BookingsService.updateBookingStatus(
        booking.id,
        status
      );
      setBooking(updatedBooking);
      onUpdate(updatedBooking);

      showToast({
        message: "Prenotazione aggiornata con successo",
        type: ToastStatusEnum.SUCCESS,
      });
    } catch (error) {
      console.error("Error updating booking status", error);
      showToast({
        message:
          "Si è verificato un errore durante l'aggiornamento della prenotazione",
        type: ToastStatusEnum.ERROR,
      });
    } finally {
      hideLoader();
    }
  };

  const handleCancelBooking = async () => {
    if (!booking) return;

    if (
      confirm(
        "Sei sicuro di voler procedere alla cancellazione della prenotazione?"
      )
    ) {
      try {
        showLoader();
        await BookingsService.cancelBooking(booking.id);

        showToast({
          message: "Prenotazione cancellata con successo",
          type: ToastStatusEnum.SUCCESS,
        });

        closeModal();
      } catch (error) {
        console.error("Error cancelling booking", error);
        showToast({
          message:
            "Si è verificato un errore durante la cancellazione della prenotazione",
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
        <p className="text-gray-500">
          Recupero i dettagli della prenotazione...
        </p>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Prenotazione non trovata</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Dettagli della Prenotazione
          </h2>
          <p className="text-gray-600">ID Prenotazione: {booking.id}</p>
        </div>
        <Badge
          label={capitalize(booking.status as string)}
          color={getStatusColor(booking.status as BookingStatusEnum)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-gray-900">Servizio prenotato</h3>
            <div className="mt-2 space-y-2 text-sm">
              <p>{booking.service?.name}</p>
              <p>
                <span className="font-medium">Descrizione:</span>{" "}
                {booking.service?.description}
              </p>
              <p>
                <span className="font-medium">
                  Prezzo per{" "}
                  {ServicesUtils.getServiceUnitType(booking.service?.unit_type)}
                  :
                </span>{" "}
                {booking.service?.currency}{" "}
                {amountDisplay(booking.service?.price || 0)}
              </p>
            </div>
          </div>

          <div>
            <h3 className="font-medium text-gray-900">Ulteriori dettagli:</h3>
            <div className="mt-2 space-y-2 text-sm">
              <p>
                <span className="font-medium">Data del Servizio:</span>{" "}
                {dateDisplay(booking.startDate)}
              </p>
              <p>
                <span className="font-medium">Durata:</span> {booking.quantity}
                &nbsp;
                {ServicesUtils.getServiceUnitType(booking.service?.unit_type)}
              </p>
              <p>
                <span className="font-medium">Prezzo Totale:</span>{" "}
                {booking.currency}{" "}
                {amountDisplay(booking.price * booking.quantity)}
              </p>
              <p>
                <span className="font-medium">Stato del pagamento:</span>{" "}
                {capitalize(booking.payment_status)}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-gray-900">
              {isConsumer ? "Vigil" : "Consumer"}
            </h3>
            <div className="mt-2 space-y-2 text-sm">
              {isConsumer ? (
                <>
                  <p>
                    <span className="font-medium">Nome:</span>{" "}
                    {booking.vigil?.displayName}
                  </p>
                  <p>
                    <span className="font-medium">Email:</span>{" "}
                    {booking.vigil?.email}
                  </p>
                </>
              ) : (
                <>
                  <p>
                    <span className="font-medium">Nome:</span>{" "}
                    {booking.consumer?.displayName}
                  </p>
                  <p>
                    <span className="font-medium">Email:</span>{" "}
                    {booking.consumer?.email}
                  </p>
                </>
              )}
            </div>
          </div>

          {booking.note && (
            <div>
              <h3 className="font-medium text-gray-900">Note</h3>
              <p className="mt-2 text-sm text-gray-600">{booking.note}</p>
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-4 pt-4 border-t">
        {isVigil && booking.status === BookingStatusEnum.PENDING && (
          <>
            <Button
              primary
              label="Conferma Prenotazione"
              action={() => handleStatusUpdate(BookingStatusEnum.CONFIRMED)}
            />
            <Button
              danger
              label="Rifiuta Prenotazione"
              action={() => handleStatusUpdate(BookingStatusEnum.CANCELLED)}
            />
          </>
        )}

        {isVigil && booking.status === BookingStatusEnum.CONFIRMED && (
          <Button
            primary
            label="Completa Prenotazione"
            action={() => handleStatusUpdate(BookingStatusEnum.COMPLETED)}
          />
        )}

        {isConsumer && booking.status === BookingStatusEnum.PENDING && (
          <Button
            danger
            label="Annulla Prenotazione"
            action={handleCancelBooking}
          />
        )}
        {isConsumer && booking.payment_status === PaymentStatusEnum.PENDING && (
          <Button
            label="Paga Prenotazione"
            action={() =>
              router.push(
                `${Routes.paymentBooking.url}?bookingId=${booking.id}`
              )
            }
          />
        )}

        <Button secondary label="Chiudi" action={closeModal} />
      </div>
    </div>
  );
};

export default BookingDetailsComponent;
