"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Routes } from "@/src/routes";
import {
  CheckCircleIcon,
} from "@heroicons/react/24/solid";
import { ClockIcon, CalendarIcon, BellAlertIcon } from "@heroicons/react/24/outline";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { dayNames } from "@/components/calendar/AvailabilityRules/Services";
import { Avatar } from "@/components";

type MatchingResponse = {
  data?: Array<any>;
  price?: number | string;
  unmatchedSlots?: Array<any>;
};

export default function MatchingTrialConfirmedPage() {
  const router = useRouter();
  const [response, setResponse] = useState<MatchingResponse | null>(null);

  useEffect(() => {
    if (globalThis.window === undefined) return;
    try {
      const rawResp = sessionStorage.getItem("matching_response");
      if (rawResp) setResponse(JSON.parse(rawResp));
    } catch (e) {
      console.error(e);
    }
  }, []);

  const best = useMemo(() => {
    if (!response?.data || response.data.length === 0) return null;
    return response.data[0];
  }, [response]);

  const covered = useMemo(() => {
    if (!best?.compatibleSlotDetails) return { days: "-", range: "-" };
    const slots = best.compatibleSlotDetails as Array<any>;
    if (slots.length === 0) return { days: "-", range: "-" };

    const daySet = new Set<string>();
    const ranges = new Set<string>();

    slots.forEach((slot) => {
      const weekday = new Date(slot.date).getUTCDay();
      daySet.add(dayNames[weekday] || slot.date);
      ranges.add(`${slot.startTime}-${slot.endTime}`);
    });

    return {
      days: Array.from(daySet).join(", "),
      range: Array.from(ranges).join(" • "),
    };
  }, [best]);

  if (!best) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-8">
        <div className="text-slate-600">Caricamento risultato matching...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-8 flex justify-center">
      <div className="w-full max-w-lg">
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 rounded-full bg-consumer-blue/10 text-consumer-blue flex items-center justify-center">
            <CheckCircleIcon className="w-12 h-12" />
          </div>
          <h1 className="mt-6 text-2xl text-center font-semibold text-slate-900 tracking-tight">
            Il tuo trial è confermato
          </h1>
        </div>

        <div className="bg-white rounded-3xl shadow ring-1 ring-slate-200 p-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-consumer-light-blue text-consumer-blue flex items-center justify-center font-semibold text-2xl">
              <Avatar/>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900 leading-tight">
                {best.displayName || "-"}
              </h2>
              <p className="text-slate-500 ">Caregiver assegnato</p>
            </div>
          </div>

          <div className="my-5 h-px bg-slate-200" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-2xl bg-slate-50 p-4">
              <div className="text-slate-500 text-md flex gap-1">
                {" "}
                <CalendarIcon className="w-5" /> Giorni
              </div>
              <div className="text-slate-900 leading-tight mt-2">
                {covered.days}
              </div>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <div className="text-slate-500 text-md flex gap-1">
                <ClockIcon className="w-5" /> Orario
              </div>
              <div className="text-slate-900 leading-tight mt-2">
                {covered.range}
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-2xl bg-consumer-light-blue p-5 text-center">
            <div className="text-slate-500 text-lg">Prezzo trial</div>
            <div className="text-consumer-blue text-4xl font-bold leading-tight mt-1">
              €{response?.price || 120}
            </div>
          </div>
        </div>

        <div className="mt-4 rounded-2xl bg-white border-l-4 border-amber-400 p-4 flex gap-3 items-start">
          <div className="w-9 h-9 p-2 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center shrink-0 mt-0.5">
              <BellAlertIcon/>
          </div>
          <p className="text-slate-600 leading-snug">
            Stiamo cercando un caregiver anche per i giorni scoperti. Ti
            avviseremo se troviamo qualcuno.
          </p>
        </div>

        <button
          onClick={() => router.push(Routes.homeConsumer?.url || "/")}
          className="mt-5 w-full rounded-2xl bg-consumer-blue text-white font-semibold py-4 inline-flex items-center justify-center gap-2"
        >
          Vai alla dashboard <ArrowRightIcon className="w-4" />
        </button>
      </div>
    </div>
  );
}
