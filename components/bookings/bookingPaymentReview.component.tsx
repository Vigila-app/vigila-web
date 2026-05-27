"use client";

import { useMemo, useState } from "react";
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
import { ServiceCatalogTypeEnum } from "@/src/enums/services.enums";
import { ServiceCatalogItem } from "@/src/types/services.types";
import { Avatar, Button, Card } from "@/components";
import { ModalPortalComponent } from "@/components/@core";
import VigilInfoModal from "@/components/matching/VigilInfoModal";
import { useModalStore } from "@/src/store/modal/modal.store";
import { amountDisplay } from "@/src/utils/common.utils";
import { dateDisplay } from "@/src/utils/date.utils";
import { calculateSlotDurationHours } from "@/src/utils/calendar.utils";
import { dayNames } from "@/components/calendar/AvailabilityRules/Services";
import { RolesEnum } from "@/src/enums/roles.enums";

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
  matched?: ServiceCatalogItem;
  unitPrice: number;
  fee: number;
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

const toUtcDate = (date: string) => new Date(`${date}T00:00:00Z`);

const formatSlotLabel = (slot: CompatibleSlot) =>
  `${formatCompactDate(toUtcDate(slot.date))} • ${formatTime(slot.startTime)} - ${formatTime(slot.endTime)}`;

const formatSlotDateRange = (slots: CompatibleSlot[]) => {
  const firstSlot = slots[0];
  const lastSlot = slots.at(-1);

  if (!firstSlot || !lastSlot) return "Da pianificare";

  return `${formatCompactDate(toUtcDate(firstSlot.date))} - ${formatCompactDate(toUtcDate(lastSlot.date))}`;
};

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

const resolveAddress = (request: any): string => {
  if (!request) return "";
  if (typeof request.address === "string") return request.address;
  return [
    request?.address?.road,
    request?.address?.number ?? "",
    request?.address?.neighbourhood ?? "",
    request?.address?.city ?? "",
    request?.address?.postcode,
  ].join(" ");
};

const resolveDayNote = (answers: any, weekday: number): string | undefined =>
  answers?.services?.[weekday]?.notes ||
  answers?.services?.[String(weekday)]?.notes ||
  undefined;

const resolveServiceCatalog = (serviceType: string) =>
  ServicesService.getServicesByType(serviceType as ServiceCatalogTypeEnum);

const buildMatchingSummary = (slots: SlotPricing[]): SummaryRow[] => {
  const grouped = new Map<number, string[]>();

  slots.forEach(({ slot }) => {
    const weekday = toUtcDate(slot.date).getUTCDay();
    const current = grouped.get(weekday) ?? [];
    current.push(formatSlotLabel(slot));
    grouped.set(weekday, current);
  });

  return Array.from(grouped.entries())
    .sort(([left], [right]) => left - right)
    .map(([weekday, ranges]) => ({
      weekdayLabel: dayNames[weekday] ?? `Giorno ${weekday}`,
      ranges: ranges.join(", "),
    }));
};

const BookingPaymentReviewComponent = () => {
  const router = useRouter();
  const { openModal, payload } = useModalStore();

  const [flowSnapshot] = useState<MatchingFlowSnapshot>(() =>
    readMatchingFlowSnapshot(),
  );

  const answers = flowSnapshot.answers;
  const response = flowSnapshot.response;
  const best = response?.data?.[0];

  const slotDetails = useMemo<CompatibleSlot[]>(() => {
    if (!Array.isArray(best?.compatibleSlotDetails)) return [];
    return best.compatibleSlotDetails;
  }, [best]);

  const hasMatchingData = Boolean(best?.id) && slotDetails.length > 0;

  const slotsWithPricing = useMemo<SlotPricing[]>(() => {
    if (!hasMatchingData) return [];

    return slotDetails.map((slot) => {
      const weekday = toUtcDate(slot.date).getUTCDay();
      const matched = resolveServiceCatalog(slot.service);
      const unitPrice =
        typeof matched?.min_hourly_rate === "number"
          ? matched.min_hourly_rate
          : 0;
      const fee = typeof matched?.fee === "number" ? matched.fee : 0;
      const hours = calculateSlotDurationHours(slot.startTime, slot.endTime);

      return {
        slot,
        hours,
        matched,
        unitPrice,
        fee,
        subtotal: (unitPrice + fee) * hours,
        weekday,
        note: resolveDayNote(answers, weekday),
      };
    });
  }, [answers, hasMatchingData, slotDetails]);

  const topSummary = useMemo<SummaryRow[]>(() => {
    if (hasMatchingData) {
      return buildMatchingSummary(slotsWithPricing);
    }
    return [];
  }, [hasMatchingData, slotsWithPricing]);

  const address =
    resolveAddress(answers?.matchingRequest) || "Indirizzo non disponibile";
  const totalPrice = hasMatchingData
    ? slotsWithPricing.reduce((acc, item) => acc + item.subtotal, 0)
    : 0;

  const dateRangeLabel = hasMatchingData
    ? formatSlotDateRange(slotDetails)
    : "-";
  const activeFromLabel = best?.activeFrom
    ? dateDisplay(best.activeFrom, "monthYearLiteral")
    : null;
  const activeFromNode = activeFromLabel ? (
    <span className="text-xs text-gray-500">Attivo da {activeFromLabel}</span>
  ) : null;
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

  if (!best) {
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
                  <Avatar userId={best?.id} size="big" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-medium text-gray-900">
                      {best?.displayName || "Caregiver assegnato"}
                    </p>
                    {best?.reviewCount ? (
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <StarIcon className="h-4 w-4 text-[#fbbf24]" />
                        <span className="font-semibold text-gray-900">
                          {best.averageRating}
                        </span>
                        <span>| {best.reviewCount} recensioni</span>
                      </div>
                    ) : (
                      activeFromNode
                    )}
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
                <MapPinIcon className="h-5 w-5 text-consumer-blue" />
                <span className="text-sm">{address}</span>
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
            {slotsWithPricing.map((slot, index) => (
              <div
                key={"slot_" + index}
                className="flex items-center justify-between"
              >
                <div>
                  <p className="font-semibold text-gray-900">
                    {formatCompactDate(toUtcDate(slot.slot.date))}
                  </p>
                  <p className="text-xs text-gray-500">
                    {slot?.slot
                      ? `${formatTime(slot.slot.startTime)} - ${formatTime(slot.slot.endTime)}`
                      : dateRangeLabel}
                  </p>
                  {slot?.matched?.name && (
                    <p className="text-xs text-gray-500">{slot.matched.name}</p>
                  )}
                  <p className="text-xs text-gray-500">
                    {amountDisplay(slot.unitPrice)} EUR/h +{" "}
                    {amountDisplay(slot.fee)} EUR fee
                  </p>
                  {slot?.note && (
                    <p className="text-xs text-gray-500">{slot.note}</p>
                  )}
                </div>
                <p className="text-base font-bold text-gray-900">
                  {amountDisplay(slot?.subtotal ?? totalPrice)} EUR
                </p>
              </div>
            ))}

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

      {/* <Card customClass="rounded-3xl p-4 shadow-sm">
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
      </Card> */}

      <div className="fixed bottom-0 left-0 right-0 z-10 border-t border-gray-100 bg-white/95 p-4 backdrop-blur-sm">
        <div className="mx-auto max-w-md">
          <Button
            full
            role={RolesEnum.CONSUMER}
            iconPosition="right"
            icon={<ArrowRightIcon className="h-4 w-4" />}
            label="Procedi con il pagamento"
            action={() => {
              if (!hasMatchingData) return;
              router.push(`${Routes.matchingSuccess.url}?confirm=true`);
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
