"use client";

import { useEffect, useState } from "react";
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
  const router = useRouter();
  const [answers, setAnswers] = useState<any>(null);
  const [response, setResponse] = useState<any>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const rawAns = sessionStorage.getItem("matching_answers");
      const rawResp = sessionStorage.getItem("matching_response");
      if (rawAns) {
        const parsed = JSON.parse(rawAns);
        const payload = parsed?.answers ?? parsed;
        // if a built matchingRequest was stored alongside answers, attach it
        if (parsed?.matchingRequest) {
          payload.matchingRequest = parsed.matchingRequest;
        }
        setAnswers(payload);
      }
      if (rawResp) setResponse(JSON.parse(rawResp));
    } catch (e) {
      console.error(e);
    }
  }, []);

  const serviceLabel = () => {
    try {
      const a = answers || {};
      // derive service and mansioni from services object
      const s = a.services;
      if (s && typeof s === "object") {
        const keys = Object.keys(s);
        if (keys.length > 0) {
          const first = s[keys[0]];
          const svc = first?.services && first.services.length > 0 ? first.services[0] : null;
          const mans = Array.isArray(first?.mansioni) ? first.mansioni : [];
          if (svc) {
            return mans.length > 0 ? `${svc} (${mans.join(", ")})` : svc;
          }
        }
      }

      // fallback: schedule (may live in matchingRequest when built earlier)
      const schedule = a.matchingRequest?.schedule ?? a.schedule;
      if (schedule && typeof schedule === "object") {
        const k = Object.keys(schedule)[0];
        if (k) {
          const svc = schedule[k]?.service;
          const mans = Array.isArray(schedule[k]?.mansioni)
            ? schedule[k].mansioni
            : [];
          return svc ? (mans.length > 0 ? `${svc} (${mans.join(", ")})` : svc) : "Assistenza";
        }
      }
    } catch (e) {
      /* ignore */
    }
    return "Assistenza";
  };

  const zoneLabel = () => {
    return (
      answers?.address.display_name ||
      answers?.address.address.postcode ||
      "Zona"
    );
  };

  const daysLabel = () => {
    try {
      const sel =
        answers?.selectedDays ||
        answers?.availabilityRules?.map((r: any) => Number(r.weekday));
      if (Array.isArray(sel) && sel.length > 0) {
        const mapped = sel
          .map((d: number) => dayNames[Number(d)])
          .slice(0, 3)
          .join(" - ");
        return mapped;
      }
    } catch (e) {}
    return "—";
  };

  const timeLabel = () => {
    return (
      answers?.availabilityRules
        .map(
          (rule: { start_time: string; end_time: string }) =>
            rule.start_time.slice(0, 5) + " - " + rule.end_time.slice(0, 5),
        )
        .join("; ") || " - "
    );
  };

  return (
    <div className="min-h-screen bg-gray-200 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md bg-white rounded-xl shadow ring-1 ring-slate-200 overflow-hidden">
        

        <div className="p-6">
          <div className="flex flex-col items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center">
              <svg
                className="w-10 h-10 text-slate-700"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z" />
                <path d="M6 20c0-3.3137 2.6863-6 6-6s6 2.6863 6 6" />
              </svg>
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

          <div className="mt-6">
            <button
              onClick={() => router.push(Routes.homeConsumer?.url || "/")}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-full bg-consumer-blue text-white font-semibold"
            >
              Attiva Vigila nella tua zona
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
