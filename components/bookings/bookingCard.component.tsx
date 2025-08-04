"use client";

import { BookingStatusEnum } from "@/src/enums/booking.enums";
import { RolesEnum } from "@/src/enums/roles.enums";
import { useAppStore } from "@/src/store/app/app.store";
import { useBookingsStore } from "@/src/store/bookings/bookings.store";
import { useConsumerStore } from "@/src/store/consumer/consumer.store";
import { useServicesStore } from "@/src/store/services/services.store";
import { useUserStore } from "@/src/store/user/user.store";
import { useVigilStore } from "@/src/store/vigil/vigil.store";
import { BookingI } from "@/src/types/booking.types";
import { useEffect, useMemo, useState } from "react";
import { Avatar, Badge, Button, Card } from "@/components";
import {
  amountDisplay,
  capitalize,
} from "@/src/utils/common.utils";
import { dateDisplay } from "@/src/utils/date.utils";
import Orologio from "@/public/svg/Orologio";
import { CalendarIcon, MapPinIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { BookingUtils } from "@/src/utils/booking.utils";
import { ToastStatusEnum } from "@/src/enums/toast.enum";
import Link from "next/link";

type BookingCardComponentI = {
  bookingId: BookingI["id"];
  onUpdate?: (booking: BookingI) => void;
  context?: "home" | "profile";
};

const BookingCardComponent = (props: BookingCardComponentI) => {
  const { bookingId, onUpdate = () => ({}) } = props;
  const {
    showLoader,
    hideLoader,
    showToast,
    loader: { isLoading },
  } = useAppStore();
  const { bookings, getBookings, getBookingDetails } = useBookingsStore();
  const { consumers } = useConsumerStore();
  const { vigils } = useVigilStore();
  const { services } = useServicesStore();
  const { user } = useUserStore();

  const isConsumer = useMemo(() => {
    return user?.user_metadata?.role === RolesEnum.CONSUMER;
  }, [user]);

  const isVigil = useMemo(() => {
    return user?.user_metadata?.role === RolesEnum.VIGIL;
  }, [user]);

  const booking = useMemo(() => {
    return bookings.find((b) => b.id === bookingId);
  }, [bookings, bookingId]);

  const service = useMemo(() => {
    return (
      booking?.service || services.find((s) => s.id === booking?.service_id)
    );
  }, [services, booking]);

  const vigil = useMemo(() => {
    return booking?.vigil || vigils.find((v) => v.id === booking?.vigil_id);
  }, [vigils, booking]);

  const consumer = useMemo(() => {
    return (
      booking?.consumer || consumers.find((c) => c.id === booking?.consumer_id)
    );
  }, [consumers, booking]);

  useEffect(() => {
    if (bookingId) getBookingDetails(bookingId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingId]);

  useEffect(() => {
    getBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleStatusUpdate = async (status: BookingStatusEnum) => {
    if (!booking) return;

    try {
      showLoader();
      const updatedBooking = await BookingUtils.handleStatusUpdate(
        booking,
        status
      );
      if (updatedBooking) {
        getBookingDetails(bookingId, true);
        onUpdate(updatedBooking);

        showToast({
          message: "Prenotazione aggiornata con successo",
          type: ToastStatusEnum.SUCCESS,
        });
      }
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

  if (isLoading) {
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

  const getUserInfo = () => {
    switch (user?.user_metadata?.role) {
      case RolesEnum.CONSUMER:
        return vigil;
      case RolesEnum.VIGIL:
        return consumer;
      default:
        break;
    }
  };

  return (
    <Link
      href={BookingUtils.getBookingDetailsUrl(booking.id)}
      className="no-underline"
    >
      <Card>
        <div
          className={clsx(
            isVigil && "flex flex-col gap-1",
            isConsumer && "flex gap-1 "
          )}
        >
          <div
            className={clsx(
              isVigil && "flex items-start gap-2",
              isConsumer && "inline-flex items-center flex-nowrap gap-2"
            )}
          >
            <Avatar
              size="big"
              userId={getUserInfo()?.id}
              value={getUserInfo()?.displayName}
            />
            {isVigil && (
              <div className="flex flex-col">
                <p className="font-semibold text-[16]">
                  {consumer?.lovedOneName}
                </p>
                <p className="text-sm text-gray-600">
                  {consumer?.lovedOneAge}&nbsp;anni
                </p>
              </div>
            )}
          </div>

          {/* presente in entrambe servizio nome e price servizio*/}
          {isVigil && (
            <div className="flex justify-between">
              <p className="font-semibold text-[12px] text-consumer-blue">
                {service?.name}
              </p>
              <p className="font-semibold text-[12px] text-vigil-orange">
                {booking?.price}
                {service?.currency}
              </p>
            </div>
          )}

          {isConsumer && (
            <div className="flex flex-col justify-between flex-grow-1">
              <div className="flex justify-start text-[16px] font-semibold items-center">
                <span>{vigil?.displayName}</span>
              </div>
              <p className="font-semibold items-center text-[12px] text-consumer-blue">
                {service?.name}
              </p>
              <div className="flex gap-2 text-[10px] font-normal text-gray-600">
                <span className="inline-flex items-center justify-center gap-1">
                  <CalendarIcon className="size-4" />
                  <span>{dateDisplay(booking.startDate, "date")}</span>
                </span>
                <span className="inline-flex items-center justify-center gap-1">
                  <Orologio />
                  <span>{dateDisplay(booking.startDate, "time")}</span>
                </span>
              </div>
            </div>
          )}
          {/* presente i entrambe data e orario */}

          {isVigil && (
            <div>
              <div className="flex gap-4 text-[10px] font-normal text-gray-600">
                <span className="inline-flex items-center justify-center gap-1">
                  <CalendarIcon className="w-4 h-4" />
                  <span>{dateDisplay(booking.startDate, "date")}</span>
                </span>
                <span className="inline-flex items-center justify-center gap-1">
                  <Orologio />
                  <span>{dateDisplay(booking.startDate, "time")}</span>{" "}
                </span>
              </div>
              <div className="inline-flex items-start space-x-2 text-sm">
                <MapPinIcon className="w-8 h-8  mt-0.5" />
                <span className="text-gray-600">{booking.address}</span>
              </div>
            </div>
          )}
          {isConsumer && (
            <div className="flex flex-col justify-center items-center gap-1">
              <span className="text-[20px] font-semibold text-vigil-orange">
                {amountDisplay(booking?.price, service?.currency)}
              </span>
              <Badge
                label={BookingUtils.getStatusText(booking.status as BookingStatusEnum)}
                color={getStatusColor(booking.status as BookingStatusEnum)}
              />
            </div>
          )}

          {isVigil && booking?.note && (
            <div className="bg-gray-100 p-3 rounded-2xl">
              <p className="text-[10px] ">{booking.note}</p>
            </div>
          )}
          {isVigil && (
            <div className="flex justify-center gap-3 mt-2">
              {booking?.status === BookingStatusEnum.PENDING && (
                <>
                  <Button
                    customClass="!px-6 !py-2"
                    role={RolesEnum.CONSUMER}
                    label="Accetta"
                    action={() =>
                      handleStatusUpdate(BookingStatusEnum.CONFIRMED)
                    }
                  />
                  <Button
                    customClass="!px-6 !py-2"
                    role={RolesEnum.VIGIL}
                    action={() =>
                      handleStatusUpdate(BookingStatusEnum.CANCELLED)
                    }
                    label="Rifiuta"
                  />
                </>
              )}
              {booking?.status === BookingStatusEnum.CONFIRMED && (
                <Button label="Accettata" disabled />
              )}
              {booking?.status === BookingStatusEnum.CANCELLED && (
                <Button label="Rifiutata" disabled />
              )}
            </div>
          )}
        </div>
      </Card>
    </Link>
  );
};

export default BookingCardComponent;
