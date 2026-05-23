"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  MapPinIcon,
  CalendarIcon,
  ClockIcon,
  HeartIcon,
  DocumentTextIcon,
  BanknotesIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";
import { StarIcon } from "@heroicons/react/24/solid";
import { Routes } from "@/src/routes";
import { ServicesService } from "@/src/services";
import { ServiceI } from "@/src/types/services.types";
import { Avatar, Button } from "@/components";
import { ModalPortalComponent } from "@/components/@core";
import VigilInfoModal from "@/components/matching/VigilInfoModal";
import { useModalStore } from "@/src/store/modal/modal.store";
import { useAppStore } from "@/src/store/app/app.store";
import { amountDisplay, capitalize } from "@/src/utils/common.utils";
import { dateDisplay } from "@/src/utils/date.utils";
import { calculateSlotDurationHours } from "@/src/utils/calendar.utils";

const dayNames = [
  "Domenica",
  "Lunedì",
  "Martedì",
  "Mercoledì",
  "Giovedì",
  "Venerdì",
  "Sabato",
];

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

export default function MatchingDetailsPage() {
  const router = useRouter();
  const { showLoader, hideLoader } = useAppStore();
  const { openModal, payload } = useModalStore();

  const [answers, setAnswers] = useState<any>(null);
  const [response, setResponse] = useState<any>(null);
  const [vigilServices, setVigilServices] = useState<ServiceI[]>([]);

  useEffect(() => {
    if (globalThis.window === undefined) return;
    try {
      const rawAns = sessionStorage.getItem("matching_answers");
      const rawResp = sessionStorage.getItem("matching_response");
      if (rawAns) {
        const parsed = JSON.parse(rawAns);
        const next = parsed?.answers ?? parsed;
        if (parsed?.matchingRequest)
          next.matchingRequest = parsed.matchingRequest;
        setAnswers(next);
      }
      if (rawResp) setResponse(JSON.parse(rawResp));
    } catch (e) {
      console.error(e);
    }
  }, []);

  const best = response?.data?.[0];

  useEffect(() => {
    const vigilId = best?.id;
    if (!vigilId) return;
    let cancelled = false;
    (async () => {
      try {
        showLoader();
        const services = await ServicesService.getServices(vigilId);
        if (!cancelled) setVigilServices(services || []);
      } catch (e) {
        console.warn("Could not fetch vigil services", e);
      } finally {
        hideLoader();
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [best?.id]);

  const slotDetails: any[] = useMemo(
    () =>
      Array.isArray(best?.compatibleSlotDetails)
        ? best.compatibleSlotDetails
        : [],
    [best],
  );

  const address = useMemo(() => resolveAddress(answers), [answers]);

  const slotsWithPricing = useMemo(() => {
    return slotDetails.map((slot) => {
      const hours = calculateSlotDurationHours(slot.startTime, slot.endTime);
      const matched = vigilServices.find((s) => s.type === slot.service);
      const unitPrice =
        typeof matched?.unit_price === "number" ? matched.unit_price : 0;
      const subtotal = unitPrice * hours;
      const weekday = new Date(slot.date).getUTCDay();
      return {
        slot,
        hours,
        matched,
        unitPrice,
        subtotal,
        weekday,
        note: resolveDayNote(answers, weekday),
      };
    });
  }, [slotDetails, vigilServices, answers]);

  const totalPrice: number =
    typeof best?.totalPrice === "number"
      ? best.totalPrice
      : Number(best?.totalPrice || 0);

  const vigilModalPayload = payload as {
    vigilId?: string;
    displayName?: string;
    averageRating?: number;
    reviewCount?: number;
    activeFrom?: string;
  };

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

  if (!response || !best) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-8">
        <div className="text-slate-600">Caricamento riepilogo…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-200 flex flex-col items-center px-4 py-8">
      <div className="w-full max-w-lg">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">
            Riepilogo prenotazione
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Controlla i dettagli prima di confermare.
          </p>
        </div>

        {/* Vigil card */}
        <button
          type="button"
          onClick={openVigilModal}
          aria-label={`Apri profilo vigil ${best.displayName || ""}`}
          className="w-full flex items-center gap-4 bg-white rounded-3xl shadow ring-1 ring-slate-200 p-5 text-left transition hover:shadow-md"
        >
          <div className="w-16 h-16 rounded-full bg-slate-100 overflow-hidden flex items-center justify-center">
            <Avatar userId={best.id} size="big" />
          </div>
          <div className="flex-1">
            <p className="text-xs font-black text-gray-400 uppercase">
              Caregiver assegnato
            </p>
            <h3 className="text-lg font-semibold">{best.displayName || "-"}</h3>
            {best.reviewCount ? (
              <div className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                <StarIcon className="w-4 inline text-[#fbbf24]" />
                <span className="font-bold text-black">
                  {best.averageRating}
                </span>
                <span>| {best.reviewCount} recensioni</span>
              </div>
            ) : best.activeFrom ? (
              <div className="text-sm text-slate-400 mt-1">
                Attivo da {dateDisplay(best.activeFrom, "monthYearLiteral")}
              </div>
            ) : null}
          </div>
        </button>

        {/* Location */}
        <div className="mt-4 bg-white rounded-3xl shadow ring-1 ring-slate-200 p-5">
          <div className="flex gap-4">
            <div className="mt-1 p-2.5 rounded-xl">
              <MapPinIcon className="w-6 h-6 text-gray-400" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-black text-gray-400 uppercase">
                Indirizzo
              </p>
              <p className="text-base font-bold mt-1">
                {address ? capitalize(address) : "Non specificato"}
              </p>
            </div>
          </div>
        </div>

        {/* Days */}
        <div className="mt-4 bg-white rounded-3xl shadow ring-1 ring-slate-200 p-5">
          <h2 className="text-base font-bold text-slate-900 mb-4">
            Dettaglio giornate
          </h2>
          {slotsWithPricing.length === 0 && (
            <p className="text-sm text-slate-500">
              Nessuna giornata pianificata.
            </p>
          )}
          <div className="space-y-3">
            {slotsWithPricing.map(
              ({ slot, hours, matched, subtotal, weekday, note }) => {
                const serviceName = matched?.name || slot.service || "Servizio";
                const serviceDescription = matched?.description;
                return (
                  <div
                    key={`${slot.date}-${slot.startTime}-${slot.endTime}`}
                    className="rounded-2xl border border-slate-200 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                        <CalendarIcon className="w-4 h-4 text-consumer-blue" />
                        <span>
                          {dayNames[weekday]}{" "}
                          {new Date(slot.date).toLocaleDateString("it-IT")}
                        </span>
                      </div>
                      <div className="text-sm font-bold text-consumer-blue whitespace-nowrap">
                        €{amountDisplay(subtotal)}
                      </div>
                    </div>

                    <div className="mt-2 flex items-center gap-2 text-sm text-slate-600">
                      <ClockIcon className="w-4 h-4 text-gray-400" />
                      <span>
                        {slot.startTime} - {slot.endTime}
                      </span>
                      <span className="text-slate-400">
                        ({hours} {hours === 1 ? "ora" : "ore"})
                      </span>
                    </div>

                    <div className="mt-2 flex items-start gap-2 text-sm text-slate-700">
                      <HeartIcon className="w-4 h-4 text-gray-400 mt-0.5" />
                      <div>
                        <div className="font-medium">{serviceName}</div>
                        {serviceDescription && (
                          <div className="text-xs text-slate-500 mt-0.5">
                            {serviceDescription}
                          </div>
                        )}
                      </div>
                    </div>

                    {note && (
                      <div className="mt-2 flex items-start gap-2 text-xs text-slate-600">
                        <PencilSquareIcon className="w-4 h-4 text-gray-400 mt-0.5" />
                        <div>
                          <span className="font-semibold uppercase tracking-wider text-gray-400 mr-1">
                            Note:
                          </span>
                          {note}
                        </div>
                      </div>
                    )}
                  </div>
                );
              },
            )}
          </div>
        </div>

        {/* Cost breakdown */}
        <div className="mt-4 bg-white rounded-3xl shadow ring-1 ring-slate-200 p-5">
          <div className="flex items-center gap-2 mb-3">
            <BanknotesIcon className="w-5 h-5 text-gray-400" />
            <h2 className="text-base font-bold text-slate-900">
              Riepilogo costi
            </h2>
          </div>

          {slotsWithPricing.length > 0 && (
            <div className="space-y-2 mb-4 border-b border-slate-100 pb-4">
              {slotsWithPricing.map(({ slot, weekday, subtotal }) => (
                <div
                  key={`cost-${slot.date}-${slot.startTime}`}
                  className="flex justify-between text-sm text-slate-600"
                >
                  <span>
                    {dayNames[weekday]}{" "}
                    {new Date(slot.date).toLocaleDateString("it-IT")}
                  </span>
                  <span>€{amountDisplay(subtotal)}</span>
                </div>
              ))}
            </div>
          )}

          <div className="rounded-2xl bg-consumer-light-blue p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-black text-consumer-blue uppercase tracking-wider">
                Totale
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">IVA inclusa</p>
            </div>
            <p className="text-2xl font-bold text-consumer-blue">
              €{amountDisplay(totalPrice)}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex flex-col gap-3">
          <button
            onClick={() =>
              router.push(`${Routes.matchingSuccess.url}?confirm=true`)
            }
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-full bg-consumer-blue text-white font-semibold"
          >
            Conferma e procedi al pagamento
          </button>
          <Button
            label="Indietro"
            secondary
            action={() => router.back()}
            full
          />
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
}
