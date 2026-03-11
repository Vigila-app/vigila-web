"use client"
import React, { useMemo } from "react"
import clsx from "clsx"
import { RolesEnum } from "@/src/enums/roles.enums"
import { VigilAvailabilityRuleI } from "@/src/types/calendar.types"

type EditState = {
  start: string
  durationHours: number
  error?: string
  editing: boolean
}
interface Helpers {
  times: string[]
  durationOptions: number[]
  formatDuration: (start: string, end: string) => string
  formatTimeRange: (start: string, end: string) => string
  getMinutesFromTime: (time: string) => number
  toTimeString: (totalMinutes: number) => string
  convertTimeToTimeFormat: (time: string) => string
}

interface Actions {
  setEditRules: React.Dispatch<React.SetStateAction<Record<string, EditState>>>
  onDelete: (id: string) => void
  saveEditedRule: (args: any) => Promise<void>
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
  setError: React.Dispatch<React.SetStateAction<string | null>>
  loadRules: () => Promise<void>
}

interface Props {
  rule: VigilAvailabilityRuleI
  index: number
  editState?: EditState
  editRules: Record<string, EditState>
  helpers: Helpers
  actions: Actions
  loading: boolean
  role?: RolesEnum
}

export default function SingleRule({
  rule,
  index,
  editState,
  editRules,
  helpers,
  actions,
  loading,
  role,
}: Props) {
  const start = rule.start_time.slice(0, 5)
  const end = rule.end_time.slice(0, 5)
  const isEditing = editRules[rule.id]?.editing
  const {
    times,
    durationOptions,
    formatDuration,
    formatTimeRange,
    getMinutesFromTime,
    toTimeString,
    convertTimeToTimeFormat,
  } = helpers
  const { setEditRules, onDelete, saveEditedRule, setLoading, setError, loadRules } = actions

  const colorClasses = useMemo(() => {
    const vigil = {
      border: "border-vigil-light-orange",
      text: "text-vigil-orange",
      bgLight: "bg-vigil-light-orange",
      bg: "bg-vigil-orange",
      hoverBorder: "hover:border-vigil-light-orange",
      hoverText: "hover:text-vigil-orange",
      focusBorder: "focus:border-vigil-light-orange",
      ring: "ring-vigil-light-orange",
    }
    const consumer = {
      border: "border-consumer-light-blue",
      text: "text-consumer-blue",
      bgLight: "bg-consumer-light-blue",
      bg: "bg-consumer-blue",
      hoverBorder: "hover:border-consumer-light-blue",
      hoverText: "hover:text-consumer-blue",
      focusBorder: "focus:border-consumer-light-blue",
      ring: "ring-consumer-light-blue",
    }
    return role === RolesEnum.CONSUMER ? consumer : vigil
  }, [role])

  return (
    <div
      key={rule.id}
      className={clsx(
        "rounded-2xl px-4 py-3 shadow-sm bg-white",
        "border",
        colorClasses.border,
        isEditing && clsx("ring-2", colorClasses.ring),
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500">Fascia {index + 1}</span>
        <div className="flex gap-2">
              {!isEditing && (
                <button
                  onClick={() =>
                    setEditRules((prev) => ({
                      ...prev,
                      [rule.id]: {
                        start,
                        durationHours: (getMinutesFromTime(end) - getMinutesFromTime(start)) / 60,
                        editing: true,
                      },
                    }))
                  }
                  className={clsx(
                    "rounded-full border border-slate-200 px-2 py-0.5 text-xs text-slate-500",
                    colorClasses.hoverBorder,
                    colorClasses.hoverText,
                  )}
                >
                  Modifica
                </button>
              )}
          <button
            onClick={() => onDelete(rule.id)}
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
      </div>

      {isEditing ? (
        <>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">Ora inizio</p>
              <select
                value={editState?.start}
                onChange={(e) =>
                  setEditRules((prev) => ({
                    ...prev,
                    [rule.id]: {
                      ...prev[rule.id],
                      start: e.target.value,
                      error: "",
                    },
                  }))
                }
                className={clsx(
                  "mt-1 w-full rounded-full bg-white px-3 py-2 text-sm font-semibold text-slate-800 focus:outline-none",
                  "border",
                  colorClasses.border,
                  colorClasses.focusBorder,
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
              <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">Durata</p>
              <select
                value={editState?.durationHours}
                onChange={(e) =>
                  setEditRules((prev) => ({
                    ...prev,
                    [rule.id]: {
                      ...prev[rule.id],
                      durationHours: Number(e.target.value),
                      error: "",
                    },
                  }))
                }
                className={clsx(
                  "mt-1 w-full rounded-full bg-white px-3 py-2 text-sm font-semibold text-slate-800 focus:outline-none",
                  "border",
                  colorClasses.border,
                  colorClasses.focusBorder,
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
          {editState?.error && <div className="mt-2 text-xs text-rose-600">{editState.error}</div>}
          <div className="flex gap-2 mt-4">
            <button
              className={clsx(
                "rounded-full px-3 py-2 text-xs font-semibold text-white",
                colorClasses.bg,
                "disabled:opacity-50",
              )}
              disabled={loading}
              onClick={async () => {
                await saveEditedRule({
                  rule,
                  editState,
                  setEditRules,
                  setLoading,
                  setError,
                  loadRules,
                  getMinutesFromTime,
                  toTimeString,
                  convertTimeToTimeFormat,
                })
              }}
            >
              Salva
            </button>
            <button
              className={clsx(
                "rounded-full border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600",
                colorClasses.hoverBorder,
                colorClasses.hoverText,
              )}
              disabled={loading}
              onClick={() =>
                setEditRules((prev) => {
                  const next = { ...prev }
                  delete next[rule.id]
                  return next
                })
              }
            >
              Annulla
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">Ora inizio</p>
              <div className={clsx("mt-1 rounded-full px-3 py-2 text-sm font-semibold text-slate-800", "border", colorClasses.border)}>{start}</div>
            </div>
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">Durata</p>
              <div className={clsx("mt-1 rounded-full px-3 py-2 text-sm font-semibold text-slate-800", "border", colorClasses.border)}>{formatDuration(start, end)}</div>
            </div>
          </div>
          <p className="mt-3 text-xs text-slate-400">{formatTimeRange(rule.start_time, rule.end_time)}</p>
        </>
      )}
    </div>
  )
}
