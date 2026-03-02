"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { BookingI } from "@/src/types/booking.types";
import { Button, Badge, Avatar } from "@/components";
import { ReviewButtonComponent } from "@/components/reviews";
import {
  MapPinIcon,
  HeartIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  PencilSquareIcon,
  XMarkIcon,
  CheckIcon,
  BanknotesIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/outline";
import {
  BookingStatusEnum,
  PaymentStatusEnum,
} from "@/src/enums/booking.enums";
import {
  amountDisplay,
  capitalize,
  formatBookingDate,
} from "@/src/utils/common.utils";
import { dateDiff, dateDisplay } from "@/src/utils/date.utils";
import { useAppStore } from "@/src/store/app/app.store";
import { ToastStatusEnum } from "@/src/enums/toast.enum";
import { useUserStore } from "@/src/store/user/user.store";
import { RolesEnum } from "@/src/enums/roles.enums";
import { useModalStore } from "@/src/store/modal/modal.store";
import { useBookingsStore } from "@/src/store/bookings/bookings.store";
import { BookingUtils } from "@/src/utils/booking.utils";
import { CurrencyEnum } from "@/src/enums/common.enums";
import { Routes } from "@/src/routes";
import { useRouter } from "next/navigation"; // CORRETTO (era next/router)
import { ServiceCatalogItem } from "@/src/types/services.types";
import { ServicesService } from "@/src/services";

type BookingDetailsComponentI = {
  bookingId: BookingI["id"];
  onUpdate?: (booking: BookingI) => void;
  isModal?: boolean;
};

const BookingDetailsComponent = (props: BookingDetailsComponentI) => {
  const { bookingId, onUpdate = () => ({}), isModal = false } = props;
  const {
    showToast,
    showLoader,
    hideLoader,
    loader: { isLoading },
  } = useAppStore();
  const { bookings, getBookingDetails, resetLastUpdate } = useBookingsStore();
  const { user } = useUserStore();
  const { closeModal } = useModalStore();
  const currentDate = new Date();
  const router = useRouter();

  const [canCancel, setCanCancel] = useState<boolean>(false);

  const isConsumer = useMemo(
    () => user?.user_metadata?.role === RolesEnum.CONSUMER,
    [user],
  );
  const isVigil = useMemo(
    () => user?.user_metadata?.role === RolesEnum.VIGIL,
    [user],
  );

  const booking = useMemo(
    () => bookings.find((b) => b.id === bookingId),
    [bookings, bookingId],
  );
  const service = useMemo(() => booking?.service, [booking]);
  const vigil = useMemo(() => booking?.vigil, [booking]);
  const consumer = useMemo(() => booking?.consumer, [booking]);

  const serviceCatalog: ServiceCatalogItem | undefined = useMemo(
    () =>
      service?.info?.catalog_id
        ? ServicesService.getServiceCatalogById(service.info.catalog_id)
        : undefined,
    [service],
  );

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
        error,
      );
      setCanCancel(false);
    }
  }, [booking]);

  useEffect(() => {
    if (bookingId) getBookingDetails(bookingId);
  }, [bookingId, getBookingDetails]);

  useEffect(() => {
    checkCancellation();
  }, [checkCancellation]);

  const handleStatusUpdate = async (status: BookingStatusEnum) => {
    if (!booking) return;
    try {
      showLoader();
      const updated = await BookingUtils.handleStatusUpdate(booking, status);
      if (updated) {
        await getBookingDetails(bookingId, true);
        onUpdate(updated);
        showToast({
          message: "Stato aggiornato",
          type: ToastStatusEnum.SUCCESS,
        });
      }
    } catch (error) {
      console.error("Error updating booking status", error);
      showToast({
        message: "Si è verificato un errore durante l'aggiornamento.",
        type: ToastStatusEnum.ERROR,
      });
    } finally {
      resetLastUpdate();
      hideLoader();
    }
  };

  if (isLoading || !booking)
    return <div className="p-10 text-center">Caricamento...</div>;

  return (
    <div className="bg-white min-h-screen pb-10">
      {/* HEADER: Data e Stato */}
      <div className="p-5 border-b border-gray-100 sticky top-0 bg-white z-10">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-black  leading-tight">
              {formatBookingDate(booking.startDate.toString())}
            </h1>
            <p className="text-gray-500 font-medium">
              {dateDisplay(booking.startDate, "HH:mm")} -{" "}
              {dateDisplay(booking.endDate, "HH:mm")} ({booking.quantity} ore)
            </p>
          </div>
          {isModal && (
            <button
              onClick={closeModal}
              className="p-2 bg-gray-50 rounded-full text-gray-400">
              <XMarkIcon className="w-6 h-6" />
            </button>
          )}
        </div>

        <div className="mt-4 flex items-center gap-2">
          <Badge
            label={BookingUtils.getStatusText(
              booking.status as BookingStatusEnum,
            )}
            color={BookingUtils.getStatusColor(
              booking.status as BookingStatusEnum,
            )}
          />
          {isConsumer && booking.payment_status !== PaymentStatusEnum.PAID && (
            <Badge label="Da Pagare" color="yellow" />
          )}
        </div>
      </div>

      <div className="p-5 space-y-8">
        {/* INFO PRINCIPALI */}
        <div className="space-y-6">
          {/* Indirizzo */}
          <div className="flex gap-4">
            <div className="mt-1 p-2.5 rounded-xl">
              <MapPinIcon className="w-6 h-6 text-gray-400" />
            </div>
            <div>
              <p className="text-xs font-black text-gray-400 uppercase ">
                Indirizzo
              </p>
              <p className="text-base font-bold ">
                {capitalize(booking.address)}
              </p>
            </div>
          </div>

          {/* Servizio */}
          <div className="flex gap-4">
            <div className="mt-1 p-2.5 rounded-xl">
              <HeartIcon className="w-6 h-6 text-gray-400" />
            </div>
            <div>
              <p className="text-xs font-black text-gray-400 uppercase ">
                Servizio
              </p>
              <p className="text-base font-bold">{service?.name}</p>
            </div>
          </div>

          {booking.extras &&
            booking.extras.length > 0 &&
            serviceCatalog?.extra && (
              <div className="flex gap-4">
                <div className="mt-1 p-2.5 rounded-xl">
                  <PlusCircleIcon className="w-6 h-6 text-gray-400" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-black text-gray-400 uppercase">
                    Extra Richiesti
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2 text-sm font-medium">
                    {serviceCatalog.extra
                      .filter((extra) =>
                        (booking.extras || []).includes(extra.id),
                      )
                      .map((extra) => extra.name)
                      .join(", ")}
                  </div>
                </div>
              </div>
            )}

          {/* Guadagno/Prezzo */}
          <div className="flex gap-4">
            <div className="mt-1 p-2.5 rounded-xl">
              <BanknotesIcon className="w-6 h-6 text-gray-400" />
            </div>
            <div>
              <p className="text-xs font-black text-gray-400 uppercase ">
                {isVigil ? "Il tuo compenso netto" : "Prezzo totale"}
              </p>
              <p className="text-xl font-black ">
                {isVigil
                  ? `${BookingUtils.calculateAmountVigil(booking)} ${service?.currency || "€"}`
                  : amountDisplay(
                      booking.price,
                      service?.currency as CurrencyEnum,
                    )}
              </p>
            </div>
          </div>

          {/* Mansioni */}
          <div className="flex gap-4">
            <div className="mt-1 p-2.5 rounded-xl">
              <DocumentTextIcon className="w-6 h-6 text-gray-400" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-black text-gray-400 uppercase ">
                Mansioni
              </p>
              <div className="mt-2 flex flex-wrap gap-2 text-xs">
                {service?.description || (
                  <p className="text-sm italic text-gray-400">
                    Non specificate
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Note */}
          {booking.note && (
            <div className="flex gap-4">
              <div className="mt-1 p-2.5 rounded-xl">
                <PencilSquareIcon className="w-6 h-6 text-gray-400" />
              </div>
              <div>
                <p className="text-xs font-black text-gray-400 uppercase ">
                  Note importanti
                </p>
                <p className="text-sm font-medium rounded-xl mt-1">
                  {booking.note}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* PROFILO CONTROPARTE */}
        <div
          className={`rounded-3xl p-5 border ${isConsumer ? "bg-blue-50 border-blue-100" : "bg-purple-50 border-purple-100"}`}>
          <p
            className={`font-bold text-xs uppercase tracking-wider mb-4 ${isConsumer ? "text-blue-500" : "text-purple-500"}`}>
            {isConsumer ? "Operatore assegnato" : "Cliente da assistere"}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar
                userId={isConsumer ? vigil?.id : consumer?.id}
                value={isConsumer ? vigil?.displayName : consumer?.displayName}
              />
              <div>
                <p className="font-bold text-lg">
                  {isConsumer
                    ? vigil?.displayName || "In attesa..."
                    : consumer?.displayName}
                </p>
                <div className="flex items-center gap-1 text-green-600 text-xs font-black uppercase">
                  <span className="p-0.5 bg-green-600 rounded-full text-white">
                    <CheckIcon className="w-2 h-2" />
                  </span>
                  Profilo Verificato
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* POLICY CANCELLAZIONE */}
        {isConsumer && (
          <div className="bg-yellow-50 rounded-2xl p-4 border border-yellow-100 flex gap-3">
            <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500 flex-shrink-0" />
            <p className="text-xs text-yellow-800 leading-relaxed font-medium">
              <span className="font-bold">Policy:</span> Cancellazione gratuita
              entro 24h. Dopo tale termine verrà applicata una penale del 50%.
            </p>
          </div>
        )}

        {/* AZIONI DINAMICHE IN BASE AL RUOLO */}
        <div className="space-y-3 pt-4 border-t">
          {isVigil && booking.status === BookingStatusEnum.PENDING && (
            <div className="grid grid-cols-2 gap-4">
              <Button
                full
                action={() => handleStatusUpdate(BookingStatusEnum.CONFIRMED)}
                label={"Accetta"}
                role={RolesEnum.CONSUMER}
                icon={<CheckIcon className="w-5 h-5" />}
              />
              <Button
                full
                danger
                action={() => handleStatusUpdate(BookingStatusEnum.REJECTED)}
                label={"Rifiuta"}
                icon={<XMarkIcon className="w-5 h-5" />}
              />
            </div>
          )}

          {isVigil &&
            booking.status === BookingStatusEnum.CONFIRMED &&
            dateDiff(booking.endDate, currentDate) < 0 && (
              <Button
                full
                role={RolesEnum.VIGIL}
                action={() => handleStatusUpdate(BookingStatusEnum.COMPLETED)}
                label={"Segna come Completata"}
              />
            )}

          {isConsumer &&
            booking.payment_status === PaymentStatusEnum.PENDING && (
              <Button
                label={"Procedi al pagamento"}
                full
                action={() =>
                  router.push(
                    `${Routes.paymentBooking.url}?bookingId=${booking.id}`,
                  )
                }
              />
            )}

          {canCancel && dateDiff(booking.endDate, currentDate) > 0 && (
            <Button
              full
              danger
              label="Annulla Prenotazione"
              action={async () => {
                await handleStatusUpdate(
                  isConsumer
                    ? BookingStatusEnum.CANCELLED_USER
                    : BookingStatusEnum.CANCELLED_VIGIL,
                );
                router.push(`${Routes.homeConsumer.url}`);
              }}
              icon={<XMarkIcon className="w-5 h-5" />}
            />
          )}

          {/* AZIONI COMUNI */}
          <Button
            full
            role={RolesEnum.VIGIL}
            label={"Contatta Assistenza"}
            action={() => {
              router.push(`${Routes.customerCare.url}`);
            }}
          />
        </div>

        {booking.status === BookingStatusEnum.COMPLETED && (
          <div className="mt-6 pt-6 border-t items-center border-gray-100">
            <ReviewButtonComponent
              booking={booking}
              vigilName={vigil?.displayName}
              onReviewCreated={() => {
                console.log("Review created/updated");
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingDetailsComponent;
