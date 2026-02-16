// Save edited rule (for edit mode)

"use client"

import { useState, useEffect, useMemo } from "react"
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
import SingleRule from "@/components/calendar/AvailabilityRules/SingleRule"

/**
 * Demo component for Availability Rules CRUD operations
 */
export const AvailabilityRulesDemo = () => {
  const weekdays = getWeekdaysArray()
  const times = getTimeSlots(15) // 15-minute intervals

  const [rules, setRules] = useState<VigilAvailabilityRuleI[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Allow multiple draft slots per day
  const [activeDays, setActiveDays] = useState<Record<number, boolean>>(() => {
    const initial: Record<number, boolean> = {}
    weekdays.forEach((day) => {
      initial[day.value] = false
    })
    return initial
  })
  async function saveEditedRule({
    rule,
    editState,
    setEditRules,
    setLoading,
    setError,
    loadRules,
    getMinutesFromTime,
    toTimeString,
    convertTimeToTimeFormat,
  }: {
    rule: VigilAvailabilityRuleI
    editState: {
      start: string
      durationHours: number
      error?: string
      editing: boolean
    }
    setEditRules: React.Dispatch<
      React.SetStateAction<
        Record<
          string,
          {
            start: string
            durationHours: number
            error?: string
            editing: boolean
          }
        >
      >
    >
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
    setError: React.Dispatch<React.SetStateAction<string | null>>
    loadRules: () => Promise<void>
    getMinutesFromTime: (time: string) => number
    toTimeString: (totalMinutes: number) => string
    convertTimeToTimeFormat: (time: string) => string
  }) {
    const startMinutes = getMinutesFromTime(editState.start)
    const endMinutes = startMinutes + editState.durationHours * 60
    if (endMinutes > 24 * 60) {
      setEditRules((prev) => ({
        ...prev,
        [rule.id]: {
          ...prev[rule.id],
          error: "La durata supera il limite giornaliero",
        },
      }))
      return
    }
    if (endMinutes <= startMinutes) {
      setEditRules((prev) => ({
        ...prev,
        [rule.id]: {
          ...prev[rule.id],
          error: "Orario di fine non valido",
        },
      }))
      return
    }
    setLoading(true)
    setError(null)
    try {
      const endTime = toTimeString(endMinutes)
      const ruleData: VigilAvailabilityRuleFormI = {
        vigil_id: rule.vigil_id,
        weekday: rule.weekday,
        start_time: convertTimeToTimeFormat(editState.start),
        end_time: convertTimeToTimeFormat(endTime),
        valid_from: rule.valid_from,
        valid_to: rule.valid_to,
      }
      await CalendarService.updateVigilAvailabilityRule(rule.id, ruleData)
      await loadRules()
      setEditRules((prev) => {
        const next = { ...prev }
        delete next[rule.id]
        return next
      })
    } catch (err: any) {
      if (err?.status === 400 || err?.response?.status === 400) {
        setEditRules((prev) => ({
          ...prev,
          [rule.id]: {
            ...prev[rule.id],
            error: err.message || "Errore di validazione",
          },
        }))
      } else {
        setError(err.message || "Failed to update rule")
      }
      console.error("Error updating rule:", err)
    } finally {
      setLoading(false)
    }
  }
  // Multiple drafts per day, auto-save on change
  const [draftSlots, setDraftSlots] = useState<
    Record<number, Array<{ start: string; durationHours: number }>>
  >(() => {
    const initial: Record<
      number,
      Array<{ start: string; durationHours: number }>
    > = {}
    weekdays.forEach((day) => {
      initial[day.value] = [{ start: "12:00", durationHours: 3 }]
    })
    return initial
  })

  // Track error per draft per day (array of string)
  const [draftErrors, setDraftErrors] = useState<Record<number, string[]>>(
    () => {
      const initial: Record<number, string[]> = {}
      weekdays.forEach((day) => {
        initial[day.value] = [""]
      })
      return initial
    },
  )

  useEffect(() => {
    loadRules()
  }, [])

  const loadRules = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await CalendarService.getVigilAvailabilityRules()
      setRules(data)
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
  }

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

  // Edit state for rules: { [ruleId]: { start, durationHours, error, editing } }
  const [editRules, setEditRules] = useState<
    Record<
      string,
      {
        start: string
        durationHours: number
        error?: string
        editing: boolean
      }
    >
  >({})

  // Track which draft input is focused for orange bg
  const [focusedDraft, setFocusedDraft] = useState<{
    day: number
    idx: number
  } | null>(null)

  // Only validate on change, do not save until user clicks add
  const handleDraftChange = (
    weekday: WeekdayEnum,
    draftIdx: number,
    field: "start" | "durationHours",
    value: string | number,
  ) => {
    setDraftSlots((prev) => {
      const next = { ...prev }
      next[weekday] = next[weekday].map((slot, i) =>
        i === draftIdx ? { ...slot, [field]: value } : slot,
      )
      return next
    })
    setDraftErrors((prev) => {
      const next = { ...prev }
      next[weekday][draftIdx] = ""
      return next
    })

    // Validate
    const draft = {
      ...draftSlots[weekday][draftIdx],
      [field]: value,
    }
    const startMinutes = getMinutesFromTime(draft.start)
    const endMinutes = startMinutes + draft.durationHours * 60
    if (endMinutes > 24 * 60) {
      setDraftErrors((prev) => {
        const next = { ...prev }
        next[weekday][draftIdx] = "La durata supera il limite giornaliero"
        return next
      })
      return
    }
    if (endMinutes <= startMinutes) {
      setDraftErrors((prev) => {
        const next = { ...prev }
        next[weekday][draftIdx] = "Orario di fine non valido"
        return next
      })
      return
    }
  }

  // Save draft as rule when clicking add button
  const handleAddDraft = async (weekday: WeekdayEnum, draftIdx: number) => {
    const draft = draftSlots[weekday][draftIdx]
    const startMinutes = getMinutesFromTime(draft.start)
    const endMinutes = startMinutes + draft.durationHours * 60
    if (endMinutes > 24 * 60 || endMinutes <= startMinutes) return
    const endTime = toTimeString(endMinutes)
    setLoading(true)
    setError(null)
    try {
      const ruleData: VigilAvailabilityRuleFormI = {
        vigil_id: "demo-vigil-id",
        weekday,
        start_time: convertTimeToTimeFormat(draft.start),
        end_time: convertTimeToTimeFormat(endTime),
        valid_from: formatDateToISO(new Date()),
        valid_to: null,
      }
      await CalendarService.createVigilAvailabilityRule(ruleData)
      await loadRules()
      // Remove the draft after successful save
      setDraftSlots((prev) => {
        const next = { ...prev }
        next[weekday] = next[weekday].filter((_, i) => i !== draftIdx)
        if (next[weekday].length === 0)
          next[weekday] = [{ start: "12:00", durationHours: 3 }]
        return next
      })
      setDraftErrors((prev) => {
        const next = { ...prev }
        next[weekday] = next[weekday].filter((_, i) => i !== draftIdx)
        if (next[weekday].length === 0) next[weekday] = [""]
        return next
      })
    } catch (err: any) {
      if (err?.status === 400 || err?.response?.status === 400) {
        setDraftErrors((prev) => {
          const next = { ...prev }
          next[weekday][draftIdx] = err.message || "Errore di validazione"
          return next
        })
      } else {
        setError(err.message || "Failed to create availability rule")
      }
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
                <div className="flex items-center gap-3">
                  <label className="relative flex h-6 w-11 cursor-pointer items-center">
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
                    <span className="absolute left-0.5 h-4 w-4 rounded-full bg-white shadow transition peer-checked:translate-x-4" />
                  </label>
                  <span className="text-sm font-semibold text-slate-900">
                    {day.labelIT}
                  </span>
                </div>

                {isActive && (
                  <div className="mt-4 space-y-4">
                    {dayRules.length === 0 ? (
                      <div className="rounded-2xl border border-rose-200 bg-rose-50/40 px-4 py-3 text-sm text-slate-500">
                        Nessuna fascia attiva. Imposta una nuova fascia qui
                        sotto.
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {dayRules.map((rule, index) => (
                          <SingleRule
                            key={rule.id}
                            rule={rule}
                            index={index}
                            editState={editRules[rule.id]}
                            editRules={editRules}
                            helpers={{
                              times,
                              durationOptions,
                              formatDuration,
                              formatTimeRange,
                              getMinutesFromTime,
                              toTimeString,
                              convertTimeToTimeFormat,
                            }}
                            actions={{
                              setEditRules,
                              onDelete: handleDelete,
                              saveEditedRule,
                              setLoading,
                              setError,
                              loadRules,
                            }}
                            loading={loading}
                          />
                        ))}
                      </div>
                    )}

                    {/* Multiple draft inputs per day, auto-save on change */}
                    {draftSlots[day.value].map((draft, draftIdx) => {
                      const isFocused =
                        focusedDraft &&
                        focusedDraft.day === day.value &&
                        focusedDraft.idx === draftIdx
                      return (
                        <div
                          key={draftIdx}
                          className={`rounded-2xl border border-rose-200 px-4 py-4 mt-2 transition-colors ${isFocused ? "bg-orange-50" : "bg-rose-50/60"}`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-500">
                              Fascia {dayRules.length + draftIdx + 1}
                            </span>
                            <button
                              type="button"
                              className="ml-2 text-xs text-slate-400 hover:text-rose-500"
                              onClick={() => {
                                setDraftSlots((prev) => {
                                  const next = { ...prev }
                                  next[day.value] = next[day.value].filter(
                                    (_, i) => i !== draftIdx,
                                  )
                                  if (next[day.value].length === 0)
                                    next[day.value] = [
                                      { start: "12:00", durationHours: 3 },
                                    ]
                                  return next
                                })
                                setDraftErrors((prev) => {
                                  const next = { ...prev }
                                  next[day.value] = next[day.value].filter(
                                    (_, i) => i !== draftIdx,
                                  )
                                  if (next[day.value].length === 0)
                                    next[day.value] = [""]
                                  return next
                                })
                              }}
                              title="Rimuovi questa fascia"
                            >
                              ✕
                            </button>
                          </div>
                          <div className="mt-3 grid grid-cols-2 gap-3">
                            <div>
                              <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                                Ora inizio
                              </p>
                              <select
                                value={draft.start}
                                onChange={(e) =>
                                  handleDraftChange(
                                    day.value as WeekdayEnum,
                                    draftIdx,
                                    "start",
                                    e.target.value,
                                  )
                                }
                                onFocus={() =>
                                  setFocusedDraft({
                                    day: day.value,
                                    idx: draftIdx,
                                  })
                                }
                                onBlur={() => setFocusedDraft(null)}
                                className="mt-1 w-full rounded-full border border-rose-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 focus:border-orange-300 focus:outline-none"
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
                                  handleDraftChange(
                                    day.value as WeekdayEnum,
                                    draftIdx,
                                    "durationHours",
                                    Number(e.target.value),
                                  )
                                }
                                onFocus={() =>
                                  setFocusedDraft({
                                    day: day.value,
                                    idx: draftIdx,
                                  })
                                }
                                onBlur={() => setFocusedDraft(null)}
                                className="mt-1 w-full rounded-full border border-rose-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 focus:border-orange-300 focus:outline-none"
                              >
                                {durationOptions.map((hours) => (
                                  <option key={hours} value={hours}>
                                    {hours} ore
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                          {draftErrors[day.value] &&
                            draftErrors[day.value][draftIdx] && (
                              <div className="mt-2 text-xs text-rose-600">
                                {draftErrors[day.value][draftIdx]}
                              </div>
                            )}
                          <button
                            type="button"
                            className="mt-4 w-full rounded-full bg-rose-500 px-3 py-2 text-xs font-semibold text-white hover:bg-rose-600 disabled:opacity-40"
                            disabled={
                              loading || !!draftErrors[day.value][draftIdx]
                            }
                            onClick={() =>
                              handleAddDraft(day.value as WeekdayEnum, draftIdx)
                            }
                          >
                            Salva fascia
                          </button>
                        </div>
                      )
                    })}
                    <button
                      type="button"
                      className="mt-4 w-full rounded-full bg-rose-500 px-3 py-2 text-xs font-semibold text-white hover:bg-rose-600 disabled:opacity-40"
                      onClick={() => {
                        setDraftSlots((prev) => {
                          const next = { ...prev }
                          next[day.value] = [
                            ...next[day.value],
                            { start: "12:00", durationHours: 3 },
                          ]
                          return next
                        })
                        setDraftErrors((prev) => {
                          const next = { ...prev }
                          next[day.value] = [...(next[day.value] || []), ""]
                          return next
                        })
                      }}
                      disabled={loading}
                    >
                      + Aggiungi un'altra fascia
                    </button>
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
