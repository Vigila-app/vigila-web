"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { CalendarService } from "@/src/services"
import {
  VigilAvailabilityRuleI,
  VigilAvailabilityRuleFormI,
  WeekdayEnum,
} from "@/src/types/calendar.types"
import {
  formatTimeRange,
  getWeekdaysArray,
  getTimeSlots,
  formatDateToISO,
} from "@/src/utils/calendar.utils"

/**
 * Demo component for Availability Rules CRUD operations
 */
export const AvailabilityRulesDemo = ({
  setAnswers,
}: {
  setAnswers: (updater: (prev: Record<string, any>) => Record<string, any>) => void
}) => {
  const weekdays = getWeekdaysArray()
  const times = getTimeSlots(15) // 15-minute intervals

  const [rules, setRules] = useState<VigilAvailabilityRuleI[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [activeDays, setActiveDays] = useState<Record<number, boolean>>(() => {
    const initial: Record<number, boolean> = {}
    weekdays.forEach((day) => {
      initial[day.value] = false
    })
    return initial
  })

  const [draftSlots, setDraftSlots] = useState<
    Record<number, { start: string; durationHours: number }>
  >(() => {
    const initial: Record<number, { start: string; durationHours: number }> = {}
    weekdays.forEach((day) => {
      initial[day.value] = { start: "12:00", durationHours: 3 }
    })
    return initial
  })

  useEffect(() => {
    loadRules()
  }, [])

  const loadRules = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await CalendarService.getVigilAvailabilityRules()
      setRules(data)
      setAnswers((prev) => {
        if (JSON.stringify(prev?.availabilities) !== JSON.stringify(data)) {
          return { ...prev, availabilities: data }
        }
        return prev
      })
      setActiveDays((prev) => {
        const next = { ...prev }
        data.forEach((rule) => {
          next[rule.weekday] = true
        })
        return next
      })
    } catch (err: any) {
      setError(err.message || "Failed to load availability rules")
      console.error("Error loading rules:", err)
    } finally {
      setLoading(false)
    }
  }, [setAnswers])

  /**
   * Convert HH:MM to TIME format string (HH:MM:00)
   */
  const convertTimeToTimeFormat = (time: string): string => {
    return `${time}:00`
  }

  const getMinutesFromTime = (time: string) => {
    const [hours, minutes] = time.split(":").map(Number)
    return hours * 60 + minutes
  }

  const toTimeString = (totalMinutes: number) => {
    const hours = Math.floor(totalMinutes / 60) % 24
    const minutes = totalMinutes % 60
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`
  }

  const formatDuration = (start: string, end: string) => {
    const minutes = getMinutesFromTime(end) - getMinutesFromTime(start)
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (minutes <= 0) return "-"
    if (mins === 0) return `${hours} ore`
    return `${hours} ore ${mins} min`
  }

  const durationOptions = [1, 2, 3, 4, 6, 8]

  const rulesByWeekday = useMemo(() => {
    const grouped: Record<number, VigilAvailabilityRuleI[]> = {}
    weekdays.forEach((day) => {
      grouped[day.value] = []
    })
    rules.forEach((rule) => {
      if (!grouped[rule.weekday]) {
        grouped[rule.weekday] = []
      }
      grouped[rule.weekday].push(rule)
    })
    Object.keys(grouped).forEach((key) => {
      grouped[Number(key)].sort((a, b) =>
        a.start_time.localeCompare(b.start_time),
      )
    })
    return grouped
  }, [rules, weekdays])

  const handleCreate = async (weekday: WeekdayEnum) => {
    setLoading(true)
    setError(null)
    try {
      const draft = draftSlots[weekday]
      const startMinutes = getMinutesFromTime(draft.start)
      const endMinutes = startMinutes + draft.durationHours * 60
      if (endMinutes > 24 * 60) {
        setError("La durata supera il limite giornaliero")
        setLoading(false)
        return
      }
      if (endMinutes <= startMinutes) {
        setError("Orario di fine non valido")
        setLoading(false)
        return
      }
      const endTime = toTimeString(endMinutes)

      // Note: In a real scenario, vigil_id would come from authenticated user
      const ruleData: VigilAvailabilityRuleFormI = {
        vigil_id: "demo-vigil-id", // This would be from auth context
        weekday,
        start_time: convertTimeToTimeFormat(draft.start),
        end_time: convertTimeToTimeFormat(endTime),
        valid_from: formatDateToISO(new Date()),
        valid_to: null,
      }

      await CalendarService.createVigilAvailabilityRule(ruleData)
      await loadRules()
    } catch (err: any) {
      setError(err.message || "Failed to create availability rule")
      console.error("Error creating rule:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (ruleId: string) => {
    if (!confirm("Are you sure you want to delete this rule?")) return

    setLoading(true)
    setError(null)
    try {
      await CalendarService.deleteVigilAvailabilityRule(ruleId)
      await loadRules()
    } catch (err: any) {
      setError(err.message || "Failed to delete availability rule")
      console.error("Error deleting rule:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
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
          <button
            onClick={loadRules}
            disabled={loading}
            className="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600 hover:border-slate-300 hover:text-slate-800 disabled:opacity-50"
          >
            {loading ? "Carico..." : "Aggiorna"}
          </button>
        </div>

        {error && (
          <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        )}

        <div className="mt-6 divide-y divide-slate-200">
          {weekdays.map((day) => {
            const dayRules = rulesByWeekday[day.value] || []
            const isActive = activeDays[day.value]
            const draft = draftSlots[day.value]
            return (
              <div key={day.value} className="py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <label className="relative inline-flex h-6 w-11 cursor-pointer items-center">
                      <input
                        type="checkbox"
                        className="peer sr-only"
                        checked={isActive}
                        onChange={() =>
                          setActiveDays((prev) => ({
                            ...prev,
                            [day.value]: !prev[day.value],
                          }))
                        }
                      />
                      <span className="h-5 w-9 rounded-full bg-slate-200 transition peer-checked:bg-rose-500" />
                      <span className="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow transition peer-checked:translate-x-4" />
                    </label>
                    <span className="text-sm font-semibold text-slate-900">
                      {day.labelIT}
                    </span>
                  </div>
                  <button
                    onClick={() => handleCreate(day.value as WeekdayEnum)}
                    disabled={loading || !isActive}
                    className="text-xs font-semibold text-rose-600 hover:text-rose-700 disabled:opacity-40"
                  >
                    + Aggiungi fascia
                  </button>
                </div>

                {isActive && (
                  <div className="mt-4 space-y-4">
                    {dayRules.length === 0 ? (
                      <div className="rounded-2xl border border-rose-200 bg-rose-50/40 px-4 py-3 text-sm text-slate-500">
                        Nessuna fascia attiva. Aggiungine una qui sotto.
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {dayRules.map((rule, index) => {
                          const start = rule.start_time.slice(0, 5)
                          const end = rule.end_time.slice(0, 5)
                          return (
                            <div
                              key={rule.id}
                              className="rounded-2xl border border-rose-200 bg-white px-4 py-3 shadow-sm"
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold text-slate-500">
                                  Fascia {index + 1}
                                </span>
                                <button
                                  onClick={() => handleDelete(rule.id)}
                                  disabled={loading}
                                  className="rounded-full border border-rose-200 px-2 py-0.5 text-xs text-rose-600 hover:border-rose-300 hover:text-rose-700 disabled:opacity-40"
                                >
                                  Elimina
                                </button>
                              </div>
                              <div className="mt-3 grid grid-cols-2 gap-3">
                                <div>
                                  <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                                    Ora inizio
                                  </p>
                                  <div className="mt-1 rounded-full border border-rose-200 px-3 py-2 text-sm font-semibold text-slate-800">
                                    {start}
                                  </div>
                                </div>
                                <div>
                                  <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                                    Durata
                                  </p>
                                  <div className="mt-1 rounded-full border border-rose-200 px-3 py-2 text-sm font-semibold text-slate-800">
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
                          )
                        })}
                      </div>
                    )}

                    <div className="rounded-2xl border border-rose-200 bg-rose-50/60 px-4 py-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-rose-500">
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
                            className="mt-1 w-full rounded-full border border-rose-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 focus:border-rose-300 focus:outline-none"
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
                            className="mt-1 w-full rounded-full border border-rose-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 focus:border-rose-300 focus:outline-none"
                          >
                            {durationOptions.map((hours) => (
                              <option key={hours} value={hours}>
                                {hours} ore
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
