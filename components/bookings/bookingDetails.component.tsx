"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { BookingI } from "@/src/types/booking.types";
import { Button, Badge, Avatar, Card } from "@/components";
import { ReviewButtonComponent } from "@/components/reviews";
import {
  BookingStatusEnum,
  PaymentStatusEnum,
} from "@/src/enums/booking.enums";
import {
  amountDisplay,
  capitalize,
  replaceDynamicUrl,
} from "@/src/utils/common.utils";
import { dateDiff, dateDisplay } from "@/src/utils/date.utils";
import { useAppStore } from "@/src/store/app/app.store";
import { ToastStatusEnum } from "@/src/enums/toast.enum";
import { useUserStore } from "@/src/store/user/user.store";
import { RolesEnum } from "@/src/enums/roles.enums";
import { useModalStore } from "@/src/store/modal/modal.store";
import { ServicesUtils } from "@/src/utils/services.utils";
import { Routes } from "@/src/routes";
import { useRouter } from "next/navigation";
import { useVigilStore } from "@/src/store/vigil/vigil.store";
import { useServicesStore } from "@/src/store/services/services.store";
import { useConsumerStore } from "@/src/store/consumer/consumer.store";
import { useBookingsStore } from "@/src/store/bookings/bookings.store";
import { CurrencyEnum } from "@/src/enums/common.enums";
import { BookingUtils } from "@/src/utils/booking.utils";
import Link from "next/link";

type BookingDetailsComponentI = {
  bookingId: BookingI["id"];
  onUpdate?: (booking: BookingI) => void;
  isModal?: boolean;
};

const BookingDetailsComponent = (props: BookingDetailsComponentI) => {
  const { bookingId, onUpdate = () => ({}), isModal = false } = props;
  const router = useRouter();
  const {
    showToast,
    showLoader,
    hideLoader,
    loader: { isLoading },
  } = useAppStore();
  const { bookings, getBookingDetails, resetLastUpdate } = useBookingsStore();
  const { consumers } = useConsumerStore();
  const { vigils } = useVigilStore();
  const { services } = useServicesStore();
  const { user } = useUserStore();
  const { closeModal } = useModalStore();
  const currentDate = new Date();

  const [canCancel, setCanCancel] = useState<boolean>(false);

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

  const checkCancellation = useCallback(async () => {
    if (!booking) {
      setCanCancel(false);
      return;
    }

    try {
      const canCancelBooking = await BookingUtils.canCancelBooking(booking);
      setCanCancel(canCancelBooking);
    } catch (error) {
      console.error(
        "Errore nel verificare la possibilità di cancellazione:",
        error
      );
      setCanCancel(false);
    }
  }, [booking]);

  useEffect(() => {
    if (bookingId) getBookingDetails(bookingId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingId]);

  // Effetto per verificare se la cancellazione è possibile
  useEffect(() => {
    checkCancellation();
  }, [checkCancellation]);

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
      resetLastUpdate();
      hideLoader();
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
  return (
    <div className="space-y-6  ">
      <div className="relative pr-6 ">
        <h2 className="text-[21.5px] font-bold  text-gray-900">
          Dettagli prenotazione
        </h2>
        <span className="absolute top-0 right-0">
          <Badge
            label={
              [
                BookingStatusEnum.CANCELLED,
                BookingStatusEnum.REFUNDED,
                BookingStatusEnum.COMPLETED,
              ].includes(booking.status as BookingStatusEnum)
                ? BookingUtils.getStatusText(
                    booking.status as BookingStatusEnum
                  )
                : booking.payment_status === PaymentStatusEnum.PAID
                  ? BookingUtils.getStatusText(
                      booking.status as BookingStatusEnum
                    )
                  : "Da pagare"
            }
            color={
              [
                BookingStatusEnum.CANCELLED,
                BookingStatusEnum.REFUNDED,
                BookingStatusEnum.COMPLETED,
              ].includes(booking.status as BookingStatusEnum)
                ? BookingUtils.getStatusColor(
                    booking.status as BookingStatusEnum
                  )
                : booking.payment_status === PaymentStatusEnum.PAID
                  ? BookingUtils.getStatusColor(
                      booking.status as BookingStatusEnum
                    )
                  : "yellow"
            }
          />
        </span>
        <p className="text-gray-600">ID Prenotazione: {booking.id}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-gray-900">Servizio prenotato</h3>
            <div className="mt-2 space-y-2 text-sm">
              <p className="font-medium ">{service?.name}</p>
              {service?.description && (
                <p>
                  <span className="font-medium ]">Descrizione:</span>&nbsp;
                  {service.description}
                </p>
              )}
              {/* <p>
                <span className="font-medium">
                  Prezzo per&nbsp;
                  {ServicesUtils.getServiceUnitType(
                    service?.unit_type as string
                  )}
                  :
                </span>
                &nbsp;
                {service?.currency}
                {amountDisplay(service?.unit_price || 0)}
              </p> */}
            </div>
          </div>

          <div>
            <h3 className="font-medium text-gray-900">Ulteriori dettagli:</h3>
            <div className="mt-2 space-y-2 text-sm">
              <p>
                <span className="font-medium">Data del Servizio:</span>&nbsp;
                {dateDisplay(booking.startDate, "dateTime")}
              </p>
              <p>
                <span className="font-medium">Indirizzo del servizio:</span>
                &nbsp;
                {capitalize(booking.address)}
              </p>
              <p>
                <span className="font-medium">Durata:</span>&nbsp;
                {booking.quantity}
                &nbsp;
                {ServicesUtils.getServiceUnitType(service?.unit_type as string)}
              </p>
              {isVigil && (
                <p>
                  <span className="font-medium">Prezzo del servizio:</span>
                  &nbsp;
                  {BookingUtils.calculateAmountVigil(booking)}
                  {service?.currency}
                </p>
              )}
              {!isVigil && (
                <p>
                  <span className="font-medium">Prezzo del servizio:</span>
                  &nbsp;
                  {amountDisplay(
                    booking.price,
                    booking.service?.currency as CurrencyEnum
                  )}
                </p>
              )}
              <p>
                <span className="font-medium">Stato del pagamento:</span>&nbsp;
                <Badge
                  label={BookingUtils.getPaymentStatusText(
                    booking.payment_status as PaymentStatusEnum
                  )}
                  color={BookingUtils.getStatusColor(
                    booking.payment_status as PaymentStatusEnum
                  )}
                />
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
                <Link
                  href={
                    vigil?.id
                      ? replaceDynamicUrl(
                          Routes.vigilDetails.url,
                          ":vigilId",
                          vigil?.id
                        )
                      : "#"
                  }
                >
                  <Card className="p-4 bg-vigil-light-orange border border-vigil-orange rounded-full shadow">
                    <div className="inline-flex items-center flex-nowrap gap-2 w-full">
                      <Avatar userId={vigil?.id} value={vigil?.displayName} />
                      <div className="flex-1">
                        <div className="font-medium">{vigil?.displayName}</div>
                      </div>
                    </div>
                  </Card>
                </Link>
              ) : (
                <Card className="p-4 bg-consumer-light-blue border border-consumer-blue rounded-full shadow">
                  <div className="inline-flex items-center flex-nowrap gap-2 w-full">
                    <Avatar
                      userId={consumer?.id}
                      value={consumer?.displayName}
                    />
                    <div className="flex-1">
                      <div className="font-medium">{consumer?.displayName}</div>
                    </div>
                  </div>
                </Card>
              )}
            </div>
          </div>

          {booking.note && (
            <div>
              <h3 className="font-medium ">Note</h3>
              <p className="mt-2 text-sm text-gray-600 break-words whitespace-pre-line">{booking.note}</p>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-center flex-wrap gap-4 pt-4 border-t">
        {isVigil && booking.status === BookingStatusEnum.PENDING && (
          <>
            <Button
              role={RolesEnum.CONSUMER}
              disabled={booking.payment_status !== PaymentStatusEnum.PAID}
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

        {isVigil &&
          booking.status === BookingStatusEnum.CONFIRMED &&
          dateDiff(booking.endDate, currentDate) < 0 && (
            <div className="flex flex-col items-center gap-3">
              <h3 className=" font font-medium">Completamento:</h3>
              <p className="text-sm">
                Ricorda di completare solo dopo che il servizio è stato erogato
                correttamente; altrimenti contatta l&apos;assistenza clienti!
              </p>
              <Button
                role={RolesEnum.CONSUMER}
                label="Completa Prenotazione"
                action={() => handleStatusUpdate(BookingStatusEnum.COMPLETED)}
              />
            </div>
          )}

        {canCancel && dateDiff(booking.endDate, currentDate) > 0 && (
          <Button
            danger
            label="Annulla Prenotazione"
            action={async () => {
              await handleStatusUpdate(BookingStatusEnum.CANCELLED);
              router.push(`${Routes.homeConsumer.url}`);
            }}
          />
        )}

        {isConsumer &&
          booking.payment_status === PaymentStatusEnum.PENDING &&
          booking.status === BookingStatusEnum.PENDING && (
            <Button
              label="Paga Prenotazione"
              role={RolesEnum.CONSUMER}
              action={() =>
                router.push(
                  `${Routes.paymentBooking.url}?bookingId=${booking.id}`
                )
              }
            />
          )}

        {isModal && <Button secondary label="Chiudi" action={closeModal} />}
      </div>

      {/* Review Section - Only for completed bookings */}
      {booking.status === BookingStatusEnum.COMPLETED && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <ReviewButtonComponent
            booking={booking}
            vigilName={vigil?.displayName}
            onReviewCreated={() => {
              // Optionally refresh booking details or show success message
              console.log("Review created/updated");
            }}
          />
        </div>
      )}
    </div>
  );
};

export default BookingDetailsComponent;
