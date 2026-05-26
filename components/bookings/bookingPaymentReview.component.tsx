"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowRightIcon,
  CalendarDaysIcon,
  ClockIcon,
  ExclamationCircleIcon,
  MapPinIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import { StarIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";
import { Routes } from "@/src/routes";
import { ServicesService } from "@/src/services";
import { ServiceI } from "@/src/types/services.types";
import { Avatar, Button, Card } from "@/components";
import { ModalPortalComponent } from "@/components/@core";
import VigilInfoModal from "@/components/matching/VigilInfoModal";
import { useModalStore } from "@/src/store/modal/modal.store";
import { useAppStore } from "@/src/store/app/app.store";
import { useBookingsStore } from "@/src/store/bookings/bookings.store";
import { amountDisplay, capitalize } from "@/src/utils/common.utils";
import { dateDisplay } from "@/src/utils/date.utils";
import { calculateSlotDurationHours } from "@/src/utils/calendar.utils";
import { dayNames } from "@/components/calendar/AvailabilityRules/Services";
import { RolesEnum } from "@/src/enums/roles.enums";

type BookingPaymentReviewComponentProps = {
  bookingId?: string;
};

type MatchingFlowSnapshot = {
  answers?: Record<string, any>;
  response?: Record<string, any>;
};

type CompatibleSlot = {
  date: string;
  startTime: string;
  endTime: string;
  service: string;
};

type SlotPricing = {
  slot: CompatibleSlot;
  hours: number;
  matched?: ServiceI;
  unitPrice: number;
  subtotal: number;
  weekday: number;
  note?: string;
};

type SummaryRow = {
  weekdayLabel: string;
  ranges: string;
};

const formatCompactDate = (date: Date) =>
  new Intl.DateTimeFormat("it-IT", {
    day: "numeric",
    month: "short",
  }).format(date);

const formatTime = (value: string) => value.slice(0, 5);

const readMatchingFlowSnapshot = (): MatchingFlowSnapshot => {
  if (!globalThis.window) return {};

  try {
    const rawAnswers = sessionStorage.getItem("matching_answers");
    const rawResponse = sessionStorage.getItem("matching_response");

    return {
      answers: rawAnswers ? JSON.parse(rawAnswers) : undefined,
      response: rawResponse ? JSON.parse(rawResponse) : undefined,
    };
  } catch (error) {
    console.error("Failed to read matching flow snapshot", error);
    return {};
  }
};

const resolveAddress = (answers: any): string => {
  if (!answers) return "";
  if (typeof answers.address === "string") return answers.address;
  return (
    answers?.address?.display_name ||
    answers?.address?.address?.display_name ||
    answers?.matchingRequest?.address?.display_name ||
    answers?.matchingRequest?.address?.address ||
    answers?.matchingRequest?.address?.formatted ||
    ""
  );
};

const resolveDayNote = (answers: any, weekday: number): string | undefined =>
  answers?.services?.[weekday]?.notes ||
  answers?.services?.[String(weekday)]?.notes ||
  undefined;

const buildMatchingSummary = (slots: SlotPricing[]): SummaryRow[] => {
  const grouped = new Map<number, string[]>();

  slots.forEach(({ slot }) => {
    const weekday = new Date(`${slot.date}T00:00:00Z`).getUTCDay();
    const current = grouped.get(weekday) ?? [];
    current.push(
      `${formatCompactDate(new Date(`${slot.date}T00:00:00Z`))} • ${formatTime(slot.startTime)} - ${formatTime(slot.endTime)}`,
    );
    grouped.set(weekday, current);
  });

  return Array.from(grouped.entries())
    .sort(([left], [right]) => left - right)
    .map(([weekday, ranges]) => ({
      weekdayLabel: dayNames[weekday] ?? `Giorno ${weekday}`,
      ranges: ranges.join(", "),
    }));
};

const BookingPaymentReviewComponent = ({
  bookingId,
}: BookingPaymentReviewComponentProps) => {
  const router = useRouter();
  const { showLoader, hideLoader } = useAppStore();
  const { openModal, payload } = useModalStore();
  const { bookings } = useBookingsStore();

  const [flowSnapshot] = useState<MatchingFlowSnapshot>(() =>
    readMatchingFlowSnapshot(),
  );
  const [vigilServices, setVigilServices] = useState<ServiceI[]>([]);

  const booking = useMemo(
    () => bookings.find((item) => item.id === bookingId),
    [bookings, bookingId],
  );

  const answers = flowSnapshot.answers;
  const response = flowSnapshot.response;
  const best = response?.data?.[0];

  const slotDetails = useMemo<CompatibleSlot[]>(
    () =>
      Array.isArray(best?.compatibleSlotDetails)
        ? best.compatibleSlotDetails
        : [],
    [best?.compatibleSlotDetails],
  );

  const hasMatchingData = Boolean(best?.id) && slotDetails.length > 0;

  useEffect(() => {
    if (!best?.id) return;

    let cancelled = false;

    (async () => {
      try {
        showLoader();
        const services = await ServicesService.getServices(best.id);
        if (!cancelled) setVigilServices(services || []);
      } catch (error) {
        console.warn("Could not fetch vigil services", error);
      } finally {
        hideLoader();
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [best?.id, hideLoader, showLoader]);

  const slotsWithPricing = useMemo<SlotPricing[]>(() => {
    if (!hasMatchingData) return [];

    return slotDetails.map((slot) => {
      const weekday = new Date(`${slot.date}T00:00:00Z`).getUTCDay();
      const matched = vigilServices.find(
        (service) => service.type === slot.service,
      );
      const unitPrice =
        typeof matched?.unit_price === "number" ? matched.unit_price : 0;
      const hours = calculateSlotDurationHours(slot.startTime, slot.endTime);

      return {
        slot,
        hours,
        matched,
        unitPrice,
        subtotal: unitPrice * hours,
        weekday,
        note: resolveDayNote(answers, weekday),
      };
    });
  }, [answers, hasMatchingData, slotDetails, vigilServices]);

  const topSummary = useMemo<SummaryRow[]>(() => {
    if (hasMatchingData) {
      return buildMatchingSummary(slotsWithPricing);
    }

    const startDate = booking?.startDate ? new Date(booking.startDate) : null;
    const endDate = booking?.endDate ? new Date(booking.endDate) : null;

    if (!startDate) return [];

    return [
      {
        weekdayLabel: "Data servizio",
        ranges: endDate
          ? `${dateDisplay(startDate, "dateTime")} - ${dateDisplay(endDate, "dateTime")}`
          : dateDisplay(startDate, "dateTime"),
      },
    ];
  }, [booking?.endDate, booking?.startDate, hasMatchingData, slotsWithPricing]);

  const address =
    resolveAddress(answers) || booking?.address || "Indirizzo non disponibile";
  const totalPrice = hasMatchingData
    ? typeof best?.totalPrice === "number"
      ? best.totalPrice
      : slotsWithPricing.reduce((acc, item) => acc + item.subtotal, 0)
    : booking?.price || 0;

  const firstSlot = slotsWithPricing[0];
  const plannedSlots = slotsWithPricing.slice(1);
  const dateRangeLabel = hasMatchingData
    ? slotDetails.length > 0
      ? `${formatCompactDate(new Date(`${slotDetails[0].date}T00:00:00Z`))} - ${formatCompactDate(new Date(`${slotDetails[slotDetails.length - 1].date}T00:00:00Z`))}`
      : "Da pianificare"
    : booking?.startDate
      ? dateDisplay(booking.startDate, "dateTime")
      : "-";

  const openVigilModal = () => {
    if (!best?.id) return;

    openModal("vigil-info", {
      vigilId: best.id,
      displayName: best.displayName,
      averageRating: best.averageRating,
      reviewCount: best.reviewCount,
      activeFrom: best.activeFrom,
    });
  };

  const vigilModalPayload = payload as {
    vigilId?: string;
    displayName?: string;
    averageRating?: number;
    reviewCount?: number;
    activeFrom?: string;
  };

  if (!best && !booking) {
    return <div className="h-12 rounded-lg bg-gray-100 animate-pulse" />;
  }

  return (
    <div className="mx-auto mt-4 w-full max-w-md space-y-4 pb-28">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">
          Riepilogo prenotazione
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Controlla i dettagli prima di confermare.
        </p>
      </div>

      <Card customClass="rounded-2xl p-4 shadow-sm">
        <div className="flex flex-col items-start justify-between gap-4">
          <div className="flex-1 w-full">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-900">
                La tua ricorrenza
              </h3>
              <button
                onClick={openVigilModal}
                className="text-xs font-semibold text-consumer-blue"
                type="button"
              >
                {best?.displayName || "Vedi caregiver"}
              </button>
            </div>

            <div className="mt-3 space-y-2 text-sm text-gray-600">
              <button
                type="button"
                onClick={openVigilModal}
                className="flex w-full items-start gap-3 text-left"
              >
                <div className="w-16 h-16 rounded-full bg-slate-100 overflow-hidden flex items-center justify-center shrink-0">
                  <Avatar
                    userId={best?.id || booking?.vigil_id || bookingId}
                    size="big"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-medium text-gray-900">
                      {best?.displayName ||
                        booking?.vigil?.displayName ||
                        "Caregiver assegnato"}
                    </p>
                    {best?.reviewCount ? (
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <StarIcon className="h-4 w-4 text-[#fbbf24]" />
                        <span className="font-semibold text-gray-900">
                          {best.averageRating}
                        </span>
                        <span>| {best.reviewCount} recensioni</span>
                      </div>
                    ) : best?.activeFrom ? (
                      <span className="text-xs text-gray-500">
                        Attivo da{" "}
                        {dateDisplay(best.activeFrom, "monthYearLiteral")}
                      </span>
                    ) : null}
                  </div>
                </div>
              </button>

              <div className="flex items-start gap-3">
                <CalendarDaysIcon className="mt-0.5 h-5 w-5 text-consumer-blue" />
                <span className="font-medium">
                  {topSummary.length > 0
                    ? topSummary
                        .map((item) => {
                          return `${item.weekdayLabel}`;
                        })
                        .join(" · ")
                    : "Ricorrenza non disponibile"}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <ClockIcon className="h-5 w-5 text-consumer-blue" />
                <span className="text-sm">
                  {hasMatchingData
                    ? `${slotsWithPricing.length || 1} slot confermati`
                    : dateRangeLabel}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <MapPinIcon className="h-8 w-8 text-consumer-blue" />
                <span className="text-sm">{capitalize(address)}</span>
              </div>
            </div>
          </div>

          <div className="flex w-full flex-shrink-0 items-center justify-between border-t border-grey-200 pt-3 text-center">
            <div className="text-xs text-gray-500">Costo totale</div>
            <div className="text-lg font-bold text-gray-900">
              {amountDisplay(totalPrice)} EUR
            </div>
          </div>
        </div>
      </Card>

      <Card customClass="rounded-3xl p-4 shadow-sm">
        <div className="rounded-2xl border border-consumer-blue/30 bg-consumer-light-blue/20">
          <div className="flex items-center justify-between rounded-t-2xl bg-consumer-blue px-3 py-2 text-white">
            <div className="flex items-center gap-2 py-5 text-sm font-semibold">
              <ShieldCheckIcon className="h-6 w-6" />
              Da pagare ora
            </div>
            <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide">
              Garantito
            </span>
          </div>

          <div className="space-y-3 px-3 py-4 text-sm text-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-900">
                  {firstSlot?.slot
                    ? `${formatCompactDate(new Date(`${firstSlot.slot.date}T00:00:00Z`))}`
                    : "Prima disponibilità"}
                </p>
                <p className="text-xs text-gray-500">
                  {firstSlot?.slot
                    ? `${formatTime(firstSlot.slot.startTime)} - ${formatTime(firstSlot.slot.endTime)}`
                    : dateRangeLabel}
                </p>
                {firstSlot?.matched?.name && (
                  <p className="text-xs text-gray-500">
                    {firstSlot.matched.name}
                  </p>
                )}
                {firstSlot?.note && (
                  <p className="text-xs text-gray-500">{firstSlot.note}</p>
                )}
              </div>
              <p className="text-base font-bold text-gray-900">
                {amountDisplay(firstSlot?.subtotal ?? totalPrice)} EUR
              </p>
            </div>

            <div className="flex items-center justify-between border-t border-consumer-blue/20 pt-3">
              <span className="font-semibold text-gray-900">
                Totale da pagare ora
              </span>
              <span className="text-xl font-bold text-consumer-blue">
                {amountDisplay(totalPrice)} EUR
              </span>
            </div>
          </div>
        </div>
      </Card>

      <Card customClass="rounded-3xl border border-red-400 bg-red-200 p-4 shadow-sm">
        <p className="mb-2 text-sm font-semibold text-red-700">
          Cosa succede dopo il pagamento?
        </p>
        <ul className="space-y-1 text-xs text-red-700">
          <li className="flex items-start gap-2">
            <ExclamationCircleIcon className="mt-0.5 h-4 w-4 shrink-0" />
            Riceverai la conferma della prenotazione appena il pagamento sarà
            completato.
          </li>
          <li className="flex items-start gap-2 text-red-700">
            <ExclamationCircleIcon className="mt-0.5 h-4 w-4 shrink-0" />
            Se il pagamento non va a buon fine, potrai riprovare senza perdere i
            dati del flusso.
          </li>
          <li className="flex items-start gap-2 text-red-700">
            <ExclamationCircleIcon className="mt-0.5 h-4 w-4 shrink-0" />
            Le settimane successive resteranno pianificate in base alle tue
            risposte di disponibilità.
          </li>
        </ul>
      </Card>

      <Card customClass="rounded-3xl p-4 shadow-sm">
        <div className="rounded-2xl border border-amber-200 bg-amber-50">
          <div className="flex items-center justify-between rounded-t-2xl bg-amber-100 px-3 py-2 text-amber-800">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <CalendarDaysIcon className="h-4 w-4" />
              Pianificato
            </div>
            <span className="rounded-full bg-amber-200 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide">
              Non garantito
            </span>
          </div>

          <div className="space-y-3 px-3 py-4 text-sm text-gray-700">
            <p className="text-xs text-amber-700">
              Queste settimane saranno confermate dopo il pagamento.
            </p>

            <div className="space-y-3">
              {plannedSlots.length > 0 ? (
                plannedSlots.map(({ slot, matched, note, subtotal }, index) => (
                  <div
                    key={`${slot.date}-${slot.startTime}-${slot.endTime}-${index}`}
                    className="flex items-center justify-between"
                  >
                    <div>
                      <p className="font-semibold text-gray-900">
                        {formatCompactDate(new Date(`${slot.date}T00:00:00Z`))}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatTime(slot.startTime)} -{" "}
                        {formatTime(slot.endTime)}
                      </p>
                      {matched?.name && (
                        <p className="text-xs text-gray-500">{matched.name}</p>
                      )}
                      {note && <p className="text-xs text-gray-500">{note}</p>}
                    </div>
                    <p className="text-base font-bold text-gray-900">
                      {amountDisplay(subtotal)} EUR
                    </p>
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-900">
                      Nessuna settimana aggiuntiva
                    </p>
                    <p className="text-xs text-gray-500">{dateRangeLabel}</p>
                  </div>
                  <p className="text-base font-bold text-gray-900">
                    {amountDisplay(totalPrice)} EUR
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>

      <div className="fixed bottom-0 left-0 right-0 z-10 border-t border-gray-100 bg-white/95 p-4 backdrop-blur-sm">
        <div className="mx-auto max-w-md">
          <Button
            full
            role={RolesEnum.CONSUMER}
            iconPosition="right"
            icon={<ArrowRightIcon className="h-4 w-4" />}
            label="Procedi con il pagamento"
            action={() => {
              if (hasMatchingData) {
                router.push(`${Routes.matchingSuccess.url}?confirm=true`);
                return;
              }

              router.push(
                `${Routes.paymentBooking.url}?bookingId=${booking?.id || bookingId || ""}`,
              );
            }}
          />
          <button
            onClick={() => router.back()}
            className="mt-3 w-full text-center text-sm font-semibold text-gray-500"
            type="button"
          >
            Indietro
          </button>
        </div>
      </div>

      <ModalPortalComponent
        modalId="vigil-info"
        closable
        customClass="md:max-w-2xl"
      >
        <VigilInfoModal {...vigilModalPayload} />
      </ModalPortalComponent>
    </div>
  );
};

export default BookingPaymentReviewComponent;
