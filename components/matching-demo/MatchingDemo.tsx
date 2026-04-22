"use client";

import { useState } from "react";
import { MatchingService, ServicesService } from "@/src/services";
import {
  MatchingRequestI,
  MatchingResponseI,
  ScheduleEntryI,
  MatchedVigilI,
} from "@/src/types/matching.types";
import { WeekdayEnum } from "@/src/types/calendar.types";
import { ServiceCatalogTypeEnum } from "@/src/enums/services.enums";
import { Button } from "@/components";
import { Input, Select } from "@/components/form";
import { OptionI } from "../form/select";

const WEEKDAYS: { label: string; value: WeekdayEnum }[] = [
  { label: "Sun", value: WeekdayEnum.SUNDAY },
  { label: "Mon", value: WeekdayEnum.MONDAY },
  { label: "Tue", value: WeekdayEnum.TUESDAY },
  { label: "Wed", value: WeekdayEnum.WEDNESDAY },
  { label: "Thu", value: WeekdayEnum.THURSDAY },
  { label: "Fri", value: WeekdayEnum.FRIDAY },
  { label: "Sat", value: WeekdayEnum.SATURDAY },
];

const SERVICE_OPTIONS: { label: string; value: string }[] = [
  {
    label:
      ServicesService.getServicesByType(ServiceCatalogTypeEnum.COMPANIONSHIP)[0]
        ?.name || ServiceCatalogTypeEnum.COMPANIONSHIP,
    value: ServiceCatalogTypeEnum.COMPANIONSHIP,
  },
  {
    label:
      ServicesService.getServicesByType(
        ServiceCatalogTypeEnum.LIGHT_ASSISTANCE,
      )[0]?.name || ServiceCatalogTypeEnum.LIGHT_ASSISTANCE,
    value: ServiceCatalogTypeEnum.LIGHT_ASSISTANCE,
  },
  {
    label:
      ServicesService.getServicesByType(
        ServiceCatalogTypeEnum.MEDICAL_ASSISTANCE,
      )[0]?.name || ServiceCatalogTypeEnum.MEDICAL_ASSISTANCE,
    value: ServiceCatalogTypeEnum.MEDICAL_ASSISTANCE,
  },
  {
    label:
      ServicesService.getServicesByType(ServiceCatalogTypeEnum.HOUSE_KEEPING)[0]
        ?.name || ServiceCatalogTypeEnum.HOUSE_KEEPING,
    value: ServiceCatalogTypeEnum.HOUSE_KEEPING,
  },
  {
    label:
      ServicesService.getServicesByType(
        ServiceCatalogTypeEnum.TRANSPORTATION,
      )[0]?.name || ServiceCatalogTypeEnum.TRANSPORTATION,
    value: ServiceCatalogTypeEnum.TRANSPORTATION,
  },
  {
    label:
      ServicesService.getServicesByType(
        ServiceCatalogTypeEnum.SPECIALIZED_CARE,
      )[0]?.name || ServiceCatalogTypeEnum.SPECIALIZED_CARE,
    value: ServiceCatalogTypeEnum.SPECIALIZED_CARE,
  },
];

const today = new Date().toISOString().split("T")[0];
const defaultEndDate = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000)
  .toISOString()
  .split("T")[0];

const DEFAULT_SCHEDULE_ENTRY: ScheduleEntryI = {
  start: "09:00",
  end: "13:00",
  service: ServiceCatalogTypeEnum.LIGHT_ASSISTANCE,
};

/**
 * Demo component for the Matching API.
 * Lets you configure a full matching payload and send it to POST /api/v1/matching.
 */
export const MatchingDemo = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<MatchingResponseI | null>(null);

  // Selected weekdays
  const [selectedDays, setSelectedDays] = useState<WeekdayEnum[]>([
    WeekdayEnum.MONDAY,
    WeekdayEnum.WEDNESDAY,
  ]);

  // Per-day schedule entries
  const [schedule, setSchedule] = useState<
    Partial<Record<string, ScheduleEntryI>>
  >({
    [WeekdayEnum.MONDAY]: { ...DEFAULT_SCHEDULE_ENTRY },
    [WeekdayEnum.WEDNESDAY]: { ...DEFAULT_SCHEDULE_ENTRY },
  });

  // Date range
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(defaultEndDate);

  // Address
  const [postcode, setPostcode] = useState("23811");

  const toggleDay = (day: WeekdayEnum) => {
    setSelectedDays((prev) => {
      if (prev.includes(day)) {
        const next = prev.filter((d) => d !== day);
        setSchedule((s) => {
          const updated = { ...s };
          delete updated[String(day)];
          return updated;
        });
        return next;
      } else {
        setSchedule((s) => ({
          ...s,
          [String(day)]: { ...DEFAULT_SCHEDULE_ENTRY },
        }));
        return [...prev, day].sort((a, b) => a - b);
      }
    });
  };

  const updateScheduleEntry = (
    day: WeekdayEnum,
    field: keyof ScheduleEntryI,
    value: string,
  ) => {
    setSchedule((prev) => ({
      ...prev,
      [String(day)]: {
        ...(prev[String(day)] ?? DEFAULT_SCHEDULE_ENTRY),
        [field]: value,
      },
    }));
  };

  const buildPayload = (): MatchingRequestI => ({
    selectedDays,
    schedule,
    dates: { startDate, endDate },
    address: { postcode },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const payload = buildPayload();
      const result = await MatchingService.match(payload);
      setResponse(result);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Matching request failed";
      if (message.includes("401") || message.includes("Unauthorized")) {
        setError(
          "Authentication required. Log in as a Consumer to use this endpoint.",
        );
      } else {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  const payloadPreview = JSON.stringify(buildPayload(), null, 2);

  return (
    <div className="space-y-6">
      <div className="prose max-w-none">
        <h2 className="text-2xl font-bold">Matching API</h2>
        <p className="text-gray-600">
          Configure a matching request and send it to{" "}
          <code>POST /api/v1/matching</code>. The algorithm runs in three
          phases: CAP + gender filtering → availability scoring → quality
          ranking.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ── Left: form ── */}
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-gray-200 rounded-lg p-6 space-y-5"
        >
          {/* Weekday selector */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Days of the week
            </label>
            <div className="flex flex-wrap gap-2">
              {WEEKDAYS.map(({ label, value }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => toggleDay(value)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                    selectedDays.includes(value)
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-600 border-gray-300 hover:border-blue-400"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Per-day schedule entries */}
          {selectedDays.length === 0 && (
            <p className="text-sm text-amber-600">
              Select at least one day to configure a schedule.
            </p>
          )}
          {selectedDays.map((day) => {
            const entry = schedule[String(day)] ?? DEFAULT_SCHEDULE_ENTRY;
            const dayLabel =
              WEEKDAYS.find((w) => w.value === day)?.label ?? day;
            return (
              <div
                key={day}
                className="border border-gray-100 rounded-lg p-4 bg-gray-50 space-y-3"
              >
                <p className="text-sm font-semibold text-gray-700">
                  {dayLabel}
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Input
                      label="Inizio"
                      type="time"
                      value={entry.start}
                      onChange={(value) =>
                        updateScheduleEntry(day, "start", value.toString())
                      }
                    />
                  </div>
                  <div>
                    <Input
                      label="Fine"
                      type="time"
                      value={entry.end}
                      onChange={(value) =>
                        updateScheduleEntry(day, "end", value.toString())
                      }
                    />
                  </div>
                  <div>
                    <Select
                      label="Servizio"
                      value={entry.service}
                      onChange={(value) =>
                        updateScheduleEntry(day, "service", value?.toString())
                      }
                      options={
                        SERVICE_OPTIONS.map(({ label, value }) => ({
                          label,
                          value,
                        })) as OptionI[]
                      }
                    />
                  </div>
                </div>
              </div>
            );
          })}

          {/* Date range */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Input
                label="Data inizio"
                type="date"
                value={startDate}
                onChange={(value) => setStartDate(value.toString())}
              />
            </div>
            <div>
              <Input
                label="Data fine"
                type="date"
                value={endDate}
                onChange={(value) => setEndDate(value.toString())}
              />
            </div>
          </div>

          {/* Postcode */}
          <div>
            <Input
              label="Codice Postale (CAP)"
              type="text"
              value={postcode}
              onChange={(value) => setPostcode(value.toString())}
              placeholder="e.g. 23811"
            />
          </div>

          <Button
            type="submit"
            disabled={loading || selectedDays.length === 0}
            full
            label={loading ? "Ricerca in corso.." : "Trova Vigil compatibili"}
          />
        </form>

        {/* ── Right: payload preview + results ── */}
        <div className="space-y-4">
          {/* Payload preview */}
          <div className="bg-gray-900 text-green-400 rounded-lg p-4 font-mono text-xs overflow-auto max-h-64">
            <p className="text-gray-400 text-xs mb-2">Request payload</p>
            <pre>{payloadPreview}</pre>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 text-sm">
              <strong>Error:</strong> {error}
            </div>
          )}

          {/* Results */}
          {response && (
            <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-gray-800">
                  Results{" "}
                  <span className="text-gray-400 font-normal text-sm">
                    (code {response.code})
                  </span>
                </h4>
                {response.perfectMatch && (
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                    Perfect match
                  </span>
                )}
              </div>

              {response.data.length === 0 ? (
                <p className="text-sm text-gray-500 italic">
                  No matching Vigils found for this request.
                </p>
              ) : (
                <ul className="divide-y divide-gray-100">
                  {response.data.map((vigil: MatchedVigilI, idx: number) => (
                    <li key={vigil.id} className="py-3 space-y-2">
                      <div className="flex items-start gap-3">
                        <span className="text-lg font-bold text-blue-600 w-6 shrink-0">
                          {idx + 1}
                        </span>
                        <div className="flex-1 min-w-0 space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-medium text-gray-900 truncate">
                              {vigil.displayName ?? vigil.id}
                            </p>
                            {vigil.partialMatch ? (
                              <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                                Partial match
                              </span>
                            ) : (
                              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                                Full match
                              </span>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                            <span>
                              Slots:{" "}
                              <strong>
                                {vigil.compatibleSlots}/{vigil.totalSlots}
                              </strong>
                            </span>
                            {vigil.reviewCount > 0 && (
                              <span>
                                ★{" "}
                                <strong>
                                  {vigil.averageRating.toFixed(1)}
                                </strong>{" "}
                                ({vigil.reviewCount} reviews)
                              </span>
                            )}
                            {vigil.gender && (
                              <span>Gender: {vigil.gender}</span>
                            )}
                            {vigil.cap && vigil.cap.length > 0 && (
                              <span>CAP: {vigil.cap.join(", ")}</span>
                            )}
                          </div>
                        </div>
                      </div>
                      {/* Compatible slot details */}
                      {vigil.compatibleSlotDetails &&
                        vigil.compatibleSlotDetails.length > 0 && (
                          <details className="ml-9">
                            <summary className="text-xs text-blue-500 cursor-pointer hover:text-blue-700">
                              Compatible slots (
                              {vigil.compatibleSlotDetails.length})
                            </summary>
                            <ul className="mt-1 space-y-0.5">
                              {vigil.compatibleSlotDetails.map((slot, si) => (
                                <li
                                  key={si}
                                  className="text-xs text-gray-600 flex gap-2"
                                >
                                  <span className="font-medium">
                                    {slot.date}
                                  </span>
                                  <span>
                                    {slot.startTime}–{slot.endTime}
                                  </span>
                                  <span className="text-gray-400">
                                    {slot.service}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </details>
                        )}
                    </li>
                  ))}
                </ul>
              )}

              {/* Unmatched slots */}
              {response.unmatchedSlots &&
                response.unmatchedSlots.length > 0 && (
                  <details className="mt-2">
                    <summary className="text-xs text-amber-600 cursor-pointer hover:text-amber-800">
                      Unmatched slots ({response.unmatchedSlots.length}) — no
                      vigil covers these
                    </summary>
                    <ul className="mt-1 space-y-0.5 ml-2">
                      {response.unmatchedSlots.map((slot, si) => (
                        <li
                          key={si}
                          className="text-xs text-gray-600 flex gap-2"
                        >
                          <span className="font-medium">{slot.date}</span>
                          <span>
                            {slot.startTime}–{slot.endTime}
                          </span>
                          <span className="text-gray-400">{slot.service}</span>
                        </li>
                      ))}
                    </ul>
                  </details>
                )}

              {/* Raw JSON toggle */}
              <details className="mt-2">
                <summary className="text-xs text-gray-400 cursor-pointer hover:text-gray-600">
                  Show raw JSON
                </summary>
                <pre className="mt-2 bg-gray-50 text-gray-700 text-xs rounded p-3 overflow-auto max-h-64">
                  {JSON.stringify(response, null, 2)}
                </pre>
              </details>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
