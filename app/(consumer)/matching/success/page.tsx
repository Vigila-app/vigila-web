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

export default function MatchingSuccessPage() {
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
        if (parsed?.matchingRequest) payload.matchingRequest = parsed.matchingRequest;
        setAnswers(payload);
      }
      if (rawResp) setResponse(JSON.parse(rawResp));
    } catch (e) {
      console.error(e);
    }
  }, []);

  if (!response) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-8">
        <div className="text-slate-600">Caricamento risultato matching…</div>
      </div>
    );
  }

  const best = response.data && response.data.length > 0 ? response.data[0] : null;
  if (!best) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-8">
        <div className="text-slate-600">Nessun risultato disponibile.</div>
      </div>
    );
  }

  // build covered slots grouped by weekday
  const coveredByDay: Record<string, string[]> = {};
  (best.compatibleSlotDetails || []).forEach((slot: any) => {
    const d = new Date(slot.date).getUTCDay();
    const label = `${slot.startTime} - ${slot.endTime}`;
    const dayName = dayNames[d] || slot.date;
    coveredByDay[dayName] = coveredByDay[dayName] || [];
    if (!coveredByDay[dayName].includes(label)) coveredByDay[dayName].push(label);
  });

  const uncovered = response.unmatchedSlots || [];

  return (
    <div className="min-h-screen bg-gray-200 flex flex-col items-center px-4 py-8">
      <div className="w-full max-w-lg bg-white rounded-xl shadow ring-1 ring-slate-200 overflow-hidden">
        <div className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-slate-100 overflow-hidden flex items-center justify-center">
              <img src="/assets/graphics/avatar-placeholder.png" alt="avatar" className="w-16 h-16 object-cover" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold">{best.displayName || "-"}</h3>
                <div className="text-sm text-slate-500">{best.reviewCount} recensioni</div>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <div className="text-sm font-bold text-emerald-600">{Math.round((best.compatibleSlots / Math.max(best.totalSlots || 1, 1)) * 100)}%</div>
                <div className="text-sm text-slate-500">Compatibilità</div>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {/* service tags: try to show a few examples from answers */}
                {answers?.matchingRequest?.schedule && (
                  Object.values(answers.matchingRequest.schedule).map((s: any, idx: number) => (
                    <span key={idx} className="text-xs bg-blue-50 text-consumer-blue px-2 py-1 rounded-full">{s.service}</span>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="mt-6 bg-slate-50 rounded-lg p-4">
            <div className="text-sm text-slate-500 mb-2">Slot coperti</div>
            <div className="space-y-2">
              {Object.keys(coveredByDay).length === 0 && (
                <div className="text-sm text-slate-500">Nessuno slot coperto</div>
              )}
              {Object.entries(coveredByDay).map(([day, ranges]) => (
                <div key={day} className="flex items-center justify-between bg-green-50 rounded p-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white ring-1 ring-slate-200 flex items-center justify-center text-emerald-600">✓</div>
                    <div className="text-sm">{day}</div>
                  </div>
                  <div className="text-sm text-slate-700">{ranges.join(' • ')}</div>
                </div>
              ))}
            </div>

            {uncovered.length > 0 && (
              <div className="mt-4">
                <div className="text-sm text-slate-500 mb-2">Slot non coperti</div>
                <div className="space-y-2">
                  {uncovered.map((u: any, i: number) => (
                    <div key={i} className="flex items-center gap-3 bg-red-50 rounded p-3">
                      <div className="w-3 h-3 rounded-full bg-red-400"></div>
                      <div className="text-sm text-red-600">{new Date(u.date).toLocaleDateString()} — non disponibile</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-4 p-4 bg-white rounded border">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-500">Prezzo del trial</div>
                  <div className="text-lg font-semibold">€{response.price || "120"}</div>
                </div>
                <div className="text-sm text-slate-400">calcolato su {response.coveredDays || 4} giorni su {response.totalSlots || 5}</div>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={() => router.push(Routes.matchingSuccess?.url || "#")}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-full bg-consumer-blue text-white font-semibold"
            >
              Procedi con questo caregiver
            </button>
            <div className="text-center mt-3">
              <button onClick={() => router.push(Routes.matchingNoMatch?.url || "/matching/no-match")} className="text-sm text-consumer-blue underline">Cerco una copertura completa</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
