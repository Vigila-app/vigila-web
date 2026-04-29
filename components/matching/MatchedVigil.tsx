"use client";

import { useState } from "react";
import { CheckCircleIcon, StarIcon } from "@heroicons/react/24/solid";
import { Avatar } from "@/components";

const dayNames = [
  "Domenica",
  "Lunedì",
  "Martedì",
  "Mercoledì",
  "Giovedì",
  "Venerdì",
  "Sabato",
];

export default function MatchedVigil({
  vigil,
  schedule,
}: {
  vigil: any;
  schedule: any;
}) {
  // If checkout is in progress, show checkout form

  // build covered slots grouped by weekday
  const coveredByDay: Record<string, string[]> = {};
  (vigil.compatibleSlotDetails || []).forEach((slot: any) => {
    const d = new Date(slot.date).getUTCDay();
    const label = `${slot.startTime} - ${slot.endTime}`;
    const dayName = dayNames[d] || slot.date;
    coveredByDay[dayName] = coveredByDay[dayName] || [];
    if (!coveredByDay[dayName].includes(label))
      coveredByDay[dayName].push(label);
  });

  const uncovered = vigil.unmatchedSlots || [];

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 bg-white rounded-xl shadow ring-1 ring-slate-200 overflow-hidden p-5">
        <div className="w-16 h-16 rounded-full bg-slate-100 overflow-hidden flex items-center justify-center">
          <Avatar />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold">{vigil.displayName || "-"}</h3>
          <div className="text-sm text-slate-500 flex items-center gap-1">
            <StarIcon className="w-4 inline text-[#fbbf24]" />
            <span className="font-bold text-black">
              {vigil.averageRating}{" "}
            </span>{" "}
            | {vigil.reviewCount} recensioni
          </div>
          <div className="flex items-center gap-2 mt-2"></div>
          <div className="mt-3 flex flex-wrap gap-2">
            {/* service tags: try to show a few examples from answers */}
            {schedule &&
              Object.values(schedule).map((s: any, idx: number) => (
                <span
                  key={idx}
                  className="text-xs bg-blue-50 text-consumer-blue px-2 py-1 rounded-full"
                >
                  {s.service}
                </span>
              ))}
          </div>
        </div>
      </div>

      <div className="mt-6 bg-slate-50 rounded-lg p-4">
        <div className="bg-consumer-light-blue text-center p-5 mb-3 rounded-lg">
          <div className="text-sm text-slate-500">Compatibilità</div>
          <div className="font-bold text-consumer-blue text-4xl ">
            {Math.round(
              (vigil.compatibleSlots / Math.max(vigil.totalSlots || 1, 1)) *
                100,
            )}
            %
          </div>
        </div>
        <div className="text-sm font-bold mb-2">Slot coperti</div>
        <div className="space-y-2">
          {Object.keys(coveredByDay).length === 0 && (
            <div className="text-sm text-slate-500">Nessuno slot coperto</div>
          )}
          {Object.entries(coveredByDay).map(([day, ranges]) => (
            <div
              key={day}
              className="flex items-center justify-between bg-consumer-light-blue rounded p-3"
            >
              <div className="flex items-center gap-3">
                <CheckCircleIcon className="w-8 h-8 text-[#22c55e]" />
                <div className="text-sm">
                  {day} — {ranges.join(" • ")}
                </div>
              </div>
            </div>
          ))}
        </div>

        {uncovered.length > 0 && (
          <div className="mt-4">
            <div className="text-sm font-bold mb-2">Slot non coperti</div>
            <div className="space-y-2">
              {uncovered.map((u: any, i: number) => (
                <div
                  key={i}
                  className="flex items-center gap-3 bg-red-50 rounded p-3"
                >
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="text-sm text-red-600">
                    {new Date(u.date).toLocaleDateString()} — non disponibile
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-4 p-4 bg-consumer-light-blue rounded border-2 border-[#c2e8f6]">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-500">Prezzo del trial</div>
              <div className="font-semibold text-consumer-blue text-2xl">
                €{vigil.totalPrice}
                {/* TODO: add to response */}
              </div>
            </div>
            <div className="text-sm text-slate-400">
              calcolato per {vigil.compatibleSlots || "-"} giorni su{" "}
              {vigil.totalSlots ?? "-"} settimane
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
