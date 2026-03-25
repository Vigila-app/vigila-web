"use client";

import { useState, useEffect, useMemo } from "react";
import clsx from "clsx";
import {
  VigilAvailabilityRuleI,
  VigilAvailabilityRuleFormI,
  WeekdayEnum,
} from "@/src/types/calendar.types";
import {
  formatTimeRange,
  getWeekdaysArray,
  getTimeSlots,
  formatDateToISO,
} from "@/src/utils/calendar.utils";
import { RolesEnum } from "@/src/enums/roles.enums";
import { AuthService, UserService } from "@/src/services";

/**
 * Demo component for Availability Rules CRUD operations
 */
export const AvailabilityRulesDemo = ({
  setAnswers,
  role,
  availabilityRules,
}: {
  role?: RolesEnum;
  setAnswers?: (
    updater: (prev: Record<string, any>) => Record<string, any>,
  ) => void;
  availabilityRules?: VigilAvailabilityRuleI[];
} = {}) => {
  const weekdays = getWeekdaysArray();
  const times = getTimeSlots(15); // 15-minute intervals
  const user = UserService.getUser() 
   const [rules, setRules] = useState<VigilAvailabilityRuleI[]>(
    () => availabilityRules ?? [],
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Propagate local rules to parent answers so the parent can decide
  // when to persist them (e.g. when user moves to next step).
  useEffect(() => {
    if (setAnswers) {
      setAnswers((prev) => ({ ...prev, availabilityRules: rules }));
    }
  }, [rules, setAnswers]);

  // If parent provides availabilityRules (e.g. from answers object), keep local state in sync
  useEffect(() => {
    if (availabilityRules) {
      setRules(availabilityRules);
    }
  }, [availabilityRules?.length]);

  const [activeDays, setActiveDays] = useState<Record<number, boolean>>(() => {
    const initial: Record<number, boolean> = {};
    weekdays.forEach((day) => {
      initial[day.value] = false;
    });
    return initial;
  });

  const [draftSlots, setDraftSlots] = useState<
    Record<number, { start: string; durationHours: number }>
  >(() => {
    const initial: Record<number, { start: string; durationHours: number }> =
      {};
    weekdays.forEach((day) => {
      initial[day.value] = { start: "12:00", durationHours: 3 };
    });
    return initial;
  });

  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [creatingSlots, setCreatingSlots] = useState<Record<number, boolean>>(
    () => {
      const initial: Record<number, boolean> = {};
      weekdays.forEach((d) => (initial[d.value] = false));
      return initial;
    },
  );

  // Rules are read-only after being saved to the API; no inline edit state needed

  /**
   * Convert HH:MM to TIME format string (HH:MM:00)
   */
  const convertTimeToTimeFormat = (time: string): string => {
    return `${time}:00`;
  };

  const getMinutesFromTime = (time: string) => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  };

  const toTimeString = (totalMinutes: number) => {
    const hours = Math.floor(totalMinutes / 60) % 24;
    const minutes = totalMinutes % 60;
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
  };

  const formatDuration = (start: string, end: string) => {
    const minutes = getMinutesFromTime(end) - getMinutesFromTime(start);
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (minutes <= 0) return "-";
    if (mins === 0) return `${hours} ore`;
    return `${hours} ore ${mins} min`;
  };

  /**
   * Check whether a proposed time range overlaps any existing rule for the same weekday.
   * Returns true if overlapping, false otherwise.
   */
  const isOverlapping = (
    weekday: WeekdayEnum,
    newStartMinutes: number,
    newEndMinutes: number,
    ignoreRuleId?: string,
  ) => {
    return rules.some((r) => {
      if (r.weekday !== weekday) return false;
      if (ignoreRuleId && r.id === ignoreRuleId) return false;
      const existingStart = getMinutesFromTime(r.start_time.slice(0, 5));
      const existingEnd = getMinutesFromTime(r.end_time.slice(0, 5));
      // Overlap occurs when max(start) < min(end)
      return (
        Math.max(existingStart, newStartMinutes) <
        Math.min(existingEnd, newEndMinutes)
      );
    });
  };

  const durationOptions = [1, 2, 3, 4, 6, 8];

  const rulesByWeekday = useMemo(() => {
    const grouped: Record<number, VigilAvailabilityRuleI[]> = {};
    weekdays.forEach((day) => {
      grouped[day.value] = [];
    });
    rules.forEach((rule) => {
      if (!grouped[rule.weekday]) {
        grouped[rule.weekday] = [];
      }
      grouped[rule.weekday].push(rule);
    });
    Object.keys(grouped).forEach((key) => {
      grouped[Number(key)].sort((a, b) =>
        a.start_time.localeCompare(b.start_time),
      );
    });
    return grouped;
  }, [rules, weekdays]);

  const colorClasses = useMemo(() => {
    const vigil = {
      bgLight: "bg-vigil-light-orange",
      text: "text-vigil-orange",
      border: "border-vigil-light-orange",
      hoverBorder: "hover:border-vigil-light-orange",
      hoverText: "hover:text-vigil-orange",
      peerCheckedBg: "peer-checked:bg-vigil-orange",
      textMuted: "text-vigil-orange",
    };
    const consumer = {
      bgLight: "bg-consumer-light-blue",
      text: "text-consumer-blue",
      border: "border-consumer-light-blue",
      hoverBorder: "hover:border-consumer-light-blue",
      hoverText: "hover:text-consumer-blue",
      peerCheckedBg: "peer-checked:bg-consumer-blue",
      textMuted: "text-consumer-blue",
    };
    return role === RolesEnum.CONSUMER ? consumer : vigil;
  }, [role]);

  const handleCreate = async (weekday: WeekdayEnum) => {
    setLoading(true);
    setError(null);
    try {
      const draft = draftSlots[weekday];
      const startMinutes = getMinutesFromTime(draft.start);
      const endMinutes = startMinutes + draft.durationHours * 60;
      if (endMinutes > 24 * 60) {
        setError("La durata supera il limite giornaliero");
        setLoading(false);
        return;
      }
      if (endMinutes <= startMinutes) {
        setError("Orario di fine non valido");
        setLoading(false);
        return;
      }
      const endTime = toTimeString(endMinutes);

      // Note: In a real scenario, vigil_id would come from authenticated user
      const ruleData: VigilAvailabilityRuleFormI = {
        vigil_id: (await user)!.id, // This would be from auth context
        weekday,
        start_time: convertTimeToTimeFormat(draft.start),
        end_time: convertTimeToTimeFormat(endTime),
        valid_from: formatDateToISO(new Date()),
        valid_to: null,
      };
      // Check client-side for overlapping rules and prevent adding if overlaps.
      const newStartMinutes = getMinutesFromTime(draft.start);
      const newEndMinutes = endMinutes;
      if (isOverlapping(weekday, newStartMinutes, newEndMinutes)) {
        setError("La fascia si sovrappone a una esistente");
        setLoading(false);
        return;
      }
      // For this flow: persist to local state only. Parent will persist to API
      // when the user completes the flow — the parent reads `availabilityRules`
      // from `setAnswers` (see useEffect above).
      const now = new Date().toISOString();
      const newRule: VigilAvailabilityRuleI = {
        id: `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        created_at: now,
        updated_at: now,
        vigil_id: ruleData.vigil_id,
        weekday: ruleData.weekday,
        start_time: ruleData.start_time,
        end_time: ruleData.end_time,
        valid_from: ruleData.valid_from,
        valid_to: ruleData.valid_to ?? null,
      };

      setRules((prev) => [...prev, newRule]);
    } catch (err: any) {
      setError(err.message || "Failed to create availability rule");
      console.error("Error creating rule:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (ruleId: string) => {
    setLoading(true);
    setError(null);
    try {
      // Remove locally; parent will persist deletions when flow completes.
      setRules((prev) => prev.filter((r) => r.id !== ruleId));
    } catch (err: any) {
      setError(err.message || "Failed to delete availability rule");
      console.error("Error deleting rule:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span
                className={clsx(
                  "flex h-8 w-8 items-center justify-center rounded-xl",
                  colorClasses.bgLight,
                  colorClasses.text,
                )}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </span>
              <h2 className="text-lg font-semibold text-slate-900">
                Giorni e orari
              </h2>
            </div>
            <p className="mt-2 text-sm text-slate-500">
              Seleziona i giorni e gli orari per la tua assistenza.
            </p>
          </div>
        </div>

        {error && (
          <div
            className={clsx(
              "mt-4 rounded-xl px-4 py-3 text-sm",
              "border",
              colorClasses.border,
              colorClasses.bgLight,
              colorClasses.text,
            )}
          >
            {error}
          </div>
        )}

        <div className="mt-6 divide-y divide-slate-200">
          {weekdays.map(
            (day: { value: WeekdayEnum; label: string; labelIT: string }) => {
              const dayRules = rulesByWeekday[day.value] || [];
              const isActive = activeDays[day.value];
              const draft = draftSlots[day.value];
              return (
                <div key={day.value} className="py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <label className="relative inline-flex h-6 w-11 cursor-pointer items-center">
                        <input
                          type="checkbox"
                          className="peer sr-only"
                          checked={isActive}
                          onChange={() => {
                            setActiveDays((prev) => ({
                              ...prev,
                              [day.value]: !prev[day.value],
                            }));
                          }}
                        />
                        <span
                          className={clsx(
                            "h-5 w-9 rounded-full bg-slate-200 transition",
                            colorClasses.peerCheckedBg,
                          )}
                        />
                        <span className="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow transition peer-checked:translate-x-4" />
                      </label>
                      <span
                        className="text-sm font-semibold text-slate-900 cursor-pointer"
                        onClick={() => setSelectedDay(day.value)}
                      >
                        {day.labelIT}
                      </span>
                    </div>
                    <button
                      onClick={() =>
                        setCreatingSlots((prev) => ({
                          ...prev,
                          [day.value]: true,
                        }))
                      }
                      disabled={
                        loading || !isActive || creatingSlots[day.value]
                      }
                      className={clsx(
                        "text-xs font-semibold disabled:opacity-40",
                        colorClasses.text,
                        colorClasses.hoverText,
                      )}
                    >
                      + Aggiungi fascia
                    </button>
                  </div>

                  {isActive && (
                    <div className="mt-4 space-y-4">
                      {dayRules.length === 0 ? (
                        <div
                          className={clsx(
                            "rounded-2xl px-4 py-3 text-sm text-slate-500",
                            "border",
                            colorClasses.border,
                            `${colorClasses.bgLight}/40`,
                          )}
                        >
                          Nessuna fascia attiva. Aggiungine una qui sotto.
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {dayRules.map((rule, index) => {
                            const start = rule.start_time.slice(0, 5);
                            const end = rule.end_time.slice(0, 5);
                            return (
                              <div
                                key={rule.id}
                                className={clsx(
                                  "rounded-2xl px-4 py-3 shadow-sm",
                                  "border",
                                  colorClasses.border,
                                )}
                              >
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-semibold text-slate-500">
                                    Fascia {index + 1}
                                  </span>
                                  <button
                                    onClick={() => handleDelete(rule.id)}
                                    disabled={loading}
                                    className={clsx(
                                      "rounded-full px-2 py-0.5 text-xs disabled:opacity-40",
                                      "border",
                                      colorClasses.border,
                                      colorClasses.text,
                                      colorClasses.hoverBorder,
                                      colorClasses.hoverText,
                                    )}
                                  >
                                    Elimina
                                  </button>
                                </div>
                                <div className="mt-3 grid grid-cols-2 gap-3">
                                  <div>
                                    <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                                      Ora inizio
                                    </p>
                                    <div
                                      className={clsx(
                                        "mt-1 rounded-full px-3 py-2 text-sm font-semibold text-slate-800",
                                        "border",
                                        colorClasses.border,
                                      )}
                                    >
                                      {start}
                                    </div>
                                  </div>
                                  <div>
                                    <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                                      Durata
                                    </p>
                                    <div
                                      className={clsx(
                                        "mt-1 rounded-full px-3 py-2 text-sm font-semibold text-slate-800",
                                        "border",
                                        colorClasses.border,
                                      )}
                                    >
                                      {formatDuration(start, end)}
                                    </div>
                                  </div>
                                </div>
                                <p className="mt-3 text-xs text-slate-400">
                                  {formatTimeRange(
                                    rule.start_time,
                                    rule.end_time,
                                  )}
                                </p>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {creatingSlots[day.value] ? (
                        <div
                          className={clsx(
                            "rounded-2xl px-4 py-4",
                            "border",
                            colorClasses.border,
                            `${colorClasses.bgLight}/60`,
                          )}
                        >
                          <p
                            className={clsx(
                              "text-xs font-semibold uppercase tracking-wide",
                              colorClasses.text,
                            )}
                          >
                            Nuova fascia
                          </p>
                          <div className="mt-3 grid grid-cols-2 gap-3">
                            <div>
                              <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                                Ora inizio
                              </p>
                              <select
                                value={draft.start}
                                onChange={(e) =>
                                  setDraftSlots((prev) => ({
                                    ...prev,
                                    [day.value]: {
                                      ...prev[day.value],
                                      start: e.target.value,
                                    },
                                  }))
                                }
                                className={clsx(
                                  "mt-1 w-full rounded-full bg-white px-3 py-2 text-sm font-semibold text-slate-800 focus:outline-none",
                                  "border",
                                  colorClasses.border,
                                  colorClasses.hoverBorder,
                                )}
                              >
                                {times.map((time) => (
                                  <option key={time} value={time}>
                                    {time}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                                Durata
                              </p>
                              <select
                                value={draft.durationHours}
                                onChange={(e) =>
                                  setDraftSlots((prev) => ({
                                    ...prev,
                                    [day.value]: {
                                      ...prev[day.value],
                                      durationHours: Number(e.target.value),
                                    },
                                  }))
                                }
                                className={clsx(
                                  "mt-1 w-full rounded-full bg-white px-3 py-2 text-sm font-semibold text-slate-800 focus:outline-none",
                                  "border",
                                  colorClasses.border,
                                  colorClasses.hoverBorder,
                                )}
                              >
                                {durationOptions.map((hours) => (
                                  <option key={hours} value={hours}>
                                    {hours} ore
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                          <div className="mt-4 flex gap-2">
                            <button
                              onClick={async () => {
                                // Save draft
                                setLoading(true);
                                setError(null);
                                try {
                                  const d = draftSlots[day.value];
                                  const startM = getMinutesFromTime(d.start);
                                  const endM = startM + d.durationHours * 60;
                                  if (endM > 24 * 60) {
                                    setError(
                                      "La durata supera il limite giornaliero",
                                    );
                                    return;
                                  }
                                  if (endM <= startM) {
                                    setError("Orario di fine non valido");
                                    return;
                                  }
                                  if (isOverlapping(day.value, startM, endM)) {
                                    setError(
                                      "La fascia si sovrappone a una esistente",
                                    );
                                    return;
                                  }
                                  const now = new Date().toISOString();
                                  const newRule: VigilAvailabilityRuleI = {
                                    id: `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
                                    created_at: now,
                                    updated_at: now,
                                    vigil_id: (await user)!.id,
                                    weekday: day.value,
                                    start_time: convertTimeToTimeFormat(
                                      d.start,
                                    ),
                                    end_time: convertTimeToTimeFormat(
                                      toTimeString(endM),
                                    ),
                                    valid_from: formatDateToISO(new Date()),
                                    valid_to: null,
                                  };
                                  setRules((prev) => [...prev, newRule]);
                                  setCreatingSlots((prev) => ({
                                    ...prev,
                                    [day.value]: false,
                                  }));
                                  // reset draft to defaults after successful save
                                  setDraftSlots((prev) => ({
                                    ...prev,
                                    [day.value]: {
                                      start: "12:00",
                                      durationHours: 3,
                                    },
                                  }));
                                } catch (err: any) {
                                  setError(
                                    err?.message || "Failed to save draft",
                                  );
                                } finally {
                                  setLoading(false);
                                }
                              }}
                              className={clsx(
                                "rounded-full px-3 py-1 text-sm font-semibold",
                                colorClasses.text,
                                colorClasses.hoverText,
                              )}
                            >
                              Salva
                            </button>
                            <button
                              onClick={() => {
                                setCreatingSlots((prev) => ({
                                  ...prev,
                                  [day.value]: false,
                                }));
                                // reset draft to defaults
                                setDraftSlots((prev) => ({
                                  ...prev,
                                  [day.value]: {
                                    start: "12:00",
                                    durationHours: 3,
                                  },
                                }));
                                setError(null);
                              }}
                              className="rounded-full px-3 py-1 text-sm border"
                            >
                              Annulla
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="mt-2 text-xs text-slate-400">
                          Clicca "+ Aggiungi fascia" per creare una nuova
                          fascia.
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            },
          )}
        </div>
      </div>
    </div>
  );
};
