"use client";

import { useEffect, useState } from "react";
import { UserIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { Routes } from "@/src/routes";

const dayNames = [
  "Domenica",
  "Lunedì",
  "Martedì",
  "Mercoledì",
  "Giovedì",
  "Venerdì",
  "Sabato",
];

export default function NoMatchPage() {
  const [answers, setAnswers] = useState<any>(null);

  useEffect(() => {
    if (globalThis.window === undefined) return;
    try {
      const rawAns = sessionStorage.getItem("matching_answers");
      if (rawAns) {
        const parsed = JSON.parse(rawAns);
        const payload = parsed?.answers ?? parsed;
        // if a built matchingRequest was stored alongside answers, attach it
        if (parsed?.matchingRequest) {
          payload.matchingRequest = parsed.matchingRequest;
        }
        setAnswers(payload);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const getServiceFromServices = (services: any) => {
    if (!services || typeof services !== "object") return null;
    const key = Object.keys(services)[0];
    if (!key) return null;
    return services[key]?.services ?? null;
  };

  const getServiceFromSchedule = (schedule: any) => {
    if (!schedule || typeof schedule !== "object") return null;
    const key = Object.keys(schedule)[0];
    if (!key) return null;
    return schedule[key]?.service ?? null;
  };

  const serviceLabel = () => {
    const payload = answers || {};
    const fromServices = getServiceFromServices(payload.services);
    if (fromServices) return fromServices;

    const schedule = payload.matchingRequest?.schedule ?? payload.schedule;
    return getServiceFromSchedule(schedule) || "Assistenza";
  };

  const zoneLabel = () => {
    const address = answers?.address;

    if (typeof address === "string" && address.trim()) {
      return address;
    }

    return address?.display_name || address?.address?.postcode || "Zona";
  };

  const daysLabel = () => {
    const sel =
      answers?.selectedDays ??
      answers?.availabilityRules?.map((r: any) => Number(r.weekday));
    if (Array.isArray(sel) && sel.length > 0) {
      return sel
        .map((d: number) => dayNames[Number(d)])
        .slice(0, 3)
        .join(" - ");
    }
    return "—";
  };

  const timeLabel = () => {
    const rules = Array.isArray(answers?.availabilityRules)
      ? answers.availabilityRules
      : [];
    const label = rules
      .map(
        (rule: { start_time: string; end_time: string }) =>
          `${rule.start_time.slice(0, 5)} - ${rule.end_time.slice(0, 5)}`,
      )
      .join("; ");
    return label || " - ";
  };
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-200 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md bg-white rounded-xl shadow ring-1 ring-slate-200 overflow-hidden">
        <div className="p-6">
          <div className="flex flex-col items-center gap-4">
            <div className="w-20 h-20 p-5 rounded-full bg-slate-100 flex items-center justify-center">
              <UserIcon />
            </div>

            <h2 className="text-center text-lg font-bold text-slate-900">
              Non abbiamo ancora trovato l'assistente perfetto
            </h2>

            <p className="text-center text-sm text-slate-500">
              Pubblicheremo la tua richiesta con queste preferenze. Ti avvisiamo
              via email non appena un assistente si rende disponibile.
            </p>
          </div>

          <div className="mt-6 bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold mb-3">Le tue preferenze:</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 aspect-square rounded-full bg-white ring-1 ring-slate-200 flex items-center justify-center text-consumer-blue">
                  S
                </div>
                <div>
                  <div className="text-sm font-semibold">Servizio</div>
                  <div className="text-sm text-slate-600">{serviceLabel()}</div>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <div className="w-8 h-8 aspect-square rounded-full bg-white ring-1 ring-slate-200 flex items-center justify-center text-consumer-blue">
                  Z
                </div>
                <div>
                  <div className="text-sm font-semibold">Zona</div>
                  <div className="text-sm text-slate-600">{zoneLabel()}</div>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <div className="w-8 h-8 aspect-square rounded-full bg-white ring-1 ring-slate-200 flex items-center justify-center text-consumer-blue">
                  G
                </div>
                <div>
                  <div className="text-sm font-semibold">Giorni</div>
                  <div className="text-sm text-slate-600">{daysLabel()}</div>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <div className="w-8 h-8 aspect-square rounded-full bg-white ring-1 ring-slate-200 flex items-center justify-center text-consumer-blue">
                  O
                </div>
                <div>
                  <div className="text-sm font-semibold">Orario</div>
                  <div className="text-sm text-slate-600">{timeLabel()}</div>
                </div>
              </li>
            </ul>
          </div>
          <div className="text-center mt-3">
            <button
              onClick={() => router.push(Routes.inizializationBooking.url)}
              className="text-sm text-consumer-blue underline"
            >
              Nuova ricerca
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
