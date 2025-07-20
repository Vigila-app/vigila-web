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
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Card from "../card/card";
import Avatar from "../avatar/avatar";
import Badge from "../badge/badge.component";
import { capitalize } from "@/src/utils/common.utils";
import { dateDisplay } from "@/src/utils/date.utils";
import Button from "../button/button";
import Prenotazioni from "@/public/svg/Prenotazioni";
import Orologio from "@/public/svg/Orologio";
import { MapPinIcon, TrashIcon } from "@heroicons/react/24/outline";
import { BookingsService } from "@/src/services";
import Cestino from "@/public/svg/cestino";

type BookingCardComponentI = {
  bookingId: BookingI["id"];
  onUpdate?: (booking: BookingI) => void;
  context?: "home" | "profile";
};

const BookingCardComponent = (props: BookingCardComponentI) => {
  const { bookingId, onUpdate = () => ({}) } = props;
  const router = useRouter();
  const {
    showToast,
    showLoader,
    hideLoader,
    loader: { isLoading },
  } = useAppStore();
  const { bookings, getBookings, getBookingDetails } = useBookingsStore();
  const { consumers, getConsumersDetails } = useConsumerStore();
  const { vigils, getVigilsDetails } = useVigilStore();
  const { services, getServiceDetails } = useServicesStore();
  const { user } = useUserStore();
  const booking = bookings.find((b) => b.id === bookingId);
  const service = services.find((s) => s.id === booking?.service_id);
  const vigil = vigils.find((v) => v.id === booking?.vigil_id);
  const consumer = consumers.find((c) => c.id === booking?.consumer_id);
  const isConsumer = user?.user_metadata?.role === RolesEnum.CONSUMER;
  const isVigil = user?.user_metadata?.role === RolesEnum.VIGIL;
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (bookingId) getBookingDetails(bookingId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingId]);
  useEffect(() => {
    if (booking?.vigil_id && user?.user_metadata?.role === RolesEnum.CONSUMER)
      getVigilsDetails([booking?.vigil_id]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [booking?.vigil_id]);

  useEffect(() => {
    if (booking?.service_id) getServiceDetails(booking?.service_id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [booking?.service_id]);
  useEffect(() => {
    if (booking?.consumer_id && user?.user_metadata?.role === RolesEnum.VIGIL)
      getConsumersDetails([booking?.consumer_id]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [booking?.consumer_id]);

  useEffect(() => {
    handleGetBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const handleGetBookings = async (force = false) => {
    setLoading(true);
    try {
      await getBookings(force);
    } finally {
      setLoading(false);
    }
  };
  const [accepted, setAccepted] = useState<null | boolean>(null);

  const handleAccepted = async () => {
    setLoading(true);
    // try {
    await // TODO SERVICE PER I BOOKING BookingService.updateStatus(
    //             ...,true,
    //           );
    console.log("successo");
    setAccepted(true);
    // showToast({
    //   message: "Prenotazione updated successfully",
    //   type: ToastStatusEnum.SUCCESS,
    // });
    // } catch (error) {...
    // } finally {
    setLoading(false);
    // }
  };
  const handleRefused = async () => {
    setLoading(true);
    //   try {
    console.log("successo");
    setAccepted(false);
    //   } catch (error) {...
    //   } finally {
    setLoading(false);
    //   }
  };

  //cancellare prenotazione
  const handleCancelBooking = async () => {
    if (!bookingId) return;
    setLoading(true);
    try {
      await BookingsService.cancelBooking(bookingId);
      showToast({
        message: "Prenotazione cancellata con successo.",
        // type: "success",
      });

      if (booking) {
        //se esiste booking per evitare il caso in cui booking è undefined
        onUpdate?.(booking);
      } // o triggera un refetch
    } catch (error) {
      showToast({
        message: "Errore nella cancellazione della prenotazione.",
        // type: "error",
      });
    } finally {
      setLoading(false);
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
  if (isConsumer) {
    if (props.context === "profile") {
      return (
        <Card>
          <div className="flex flex-col gap-2 mb-1">
            <div className="flex justify-between items-start">
              <div className="flex items-start gap-2">
                <Avatar
                  size="big"
                  userId={vigil?.id}
                  value={vigil?.displayName}
                />
                <div className="flex flex-col">
                  <p className="font-semibold text-[16]">
                    {consumer?.lovedOneName}{" "}
                  </p>
                  <p className="text-sm text-gray-600">
                    {consumer?.lovedOneAge} anni
                  </p>
                </div>
              </div>
              <Button
                label={<Cestino />}
                className=" flex items-center justify-center "
                action={handleCancelBooking}
              />
            </div>
            <div className="flex justify-between">
              <p className="font-semibold text-[12px] text-consumer-blue">
                {service?.name}
              </p>
              <p className="font-semibold text-[12px] text-vigil-orange">
                €{service?.unit_price}{" "}
              </p>
              {/* <p>{service?.adress}</p> */}
            </div>
            <div className="flex gap-2">
              <span className="flex items-center justify-center gap-1">
                <Prenotazioni /> date
              </span>
              <span className="flex items-center justify-center gap-1">
                <Orologio /> time
              </span>
            </div>
            <div className="flex items-start space-x-2 text-sm">
              <MapPinIcon className="w-4 h-4  mt-0.5" />
              <span className="text-gray-600">{booking?.address}</span>
            </div>
            {service?.description && (
              <div className="flex flex-col">
                <p className="text-[10px] font-semibold text-consumer-blue">
                  Note
                </p>
                <p className="text-[10px] font-normal">{booking?.note}</p>
              </div>
            )}
          </div>
        </Card>
      );
    } else {
      return (
        <Card>
          <div className="flex gap-2 ">
            <div className="">
              <div className="inline-flex items-center flex-nowrap gap-2">
                <Avatar
                  size="big"
                  userId={consumer?.id}
                  value={consumer?.displayName}
                />
              </div>
            </div>
            <div className=" text-[10px]">
              <p>{service?.name}</p>
              <p>{service?.description}</p>
              <p>
                <span className="font-medium text-[10px]">
                  Data del Servizio:
                </span>
                {dateDisplay(booking.startDate)}
              </p>
            </div>
            <div className="flex justify-between items-center">
              <Badge
                label={capitalize(booking.status as string)}
                color={getStatusColor(booking.status as BookingStatusEnum)}
              />
            </div>
          </div>
        </Card>
      );
    }
  }
  return (
    <Card>
      <div className="flex flex-col gap-2">
        <div className="flex items-start gap-2">
          <Avatar size="big" userId={vigil?.id} value={vigil?.displayName} />
          <div className="flex flex-col">
            <p className="font-semibold text-[16]">{consumer?.lovedOneName} </p>
            <p className="text-sm text-gray-600">
              {consumer?.lovedOneAge} anni
            </p>
          </div>
        </div>
        <div className="flex justify-between">
          <p className="font-semibold text-[12px] text-consumer-blue">
            {service?.name}
          </p>
          <p className="font-semibold text-[12px] text-vigil-orange">
            €{service?.unit_price}{" "}
          </p>
          {/* <p>{service?.adress}</p> */}
        </div>
        <div className="flex gap-2">
          <span className="flex items-center justify-center gap-1">
            <Prenotazioni /> date
          </span>
          <span className="flex items-center justify-center gap-1">
            <Orologio /> time
          </span>
        </div>
        <div className="flex items-start space-x-2 text-sm">
          <MapPinIcon className="w-4 h-4  mt-0.5" />
          <span className="text-gray-600">{booking?.address}</span>
        </div>
        {booking?.note && (
          <div className="bg-gray-100 p-3 rounded-2xl">
            <p className="text-[10px] ">{booking?.note}</p>
          </div>
        )}
        <div className="flex justify-center gap-3">
          {accepted === null ? (
            <>
              <Button
                customclass="!px-6 !py-2"
                role={RolesEnum.CONSUMER}
                label="Accetta"
                action={handleAccepted}
              />
              <Button
                customclass="!px-6 !py-2"
                role={RolesEnum.VIGIL}
                action={handleRefused}
                label="Rifiuta"
              />
            </>
          ) : accepted === true ? (
            <Button label="Accettata" disabled />
          ) : (
            <Button label="Rifiutata" disabled />
          )}
        </div>
      </div>
    </Card>
  );
};
export default BookingCardComponent;
