"use client"
import React from "react"
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
}

export default function SingleRule({
  rule,
  index,
  editState,
  editRules,
  helpers,
  actions,
  loading,
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

  return (
    <div
      key={rule.id}
      className={`rounded-2xl border border-rose-200 bg-white px-4 py-3 shadow-sm ${isEditing ? 'ring-2 ring-orange-200' : ''}`}
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
              className="rounded-full border border-slate-200 px-2 py-0.5 text-xs text-slate-500 hover:border-orange-300 hover:text-orange-600"
            >
              Modifica
            </button>
          )}
          <button
            onClick={() => onDelete(rule.id)}
            disabled={loading}
            className="rounded-full border border-rose-200 px-2 py-0.5 text-xs text-rose-600 hover:border-rose-300 hover:text-rose-700 disabled:opacity-40"
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
                className="mt-1 w-full rounded-full border border-orange-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 focus:border-orange-300 focus:outline-none"
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
                className="mt-1 w-full rounded-full border border-orange-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 focus:border-orange-300 focus:outline-none"
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
              className="rounded-full bg-orange-500 px-3 py-2 text-xs font-semibold text-white hover:bg-orange-600"
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
              className="rounded-full border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:border-orange-300 hover:text-orange-600"
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
              <div className="mt-1 rounded-full border border-rose-200 px-3 py-2 text-sm font-semibold text-slate-800">{start}</div>
            </div>
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">Durata</p>
              <div className="mt-1 rounded-full border border-rose-200 px-3 py-2 text-sm font-semibold text-slate-800">{formatDuration(start, end)}</div>
            </div>
          </div>
          <p className="mt-3 text-xs text-slate-400">{formatTimeRange(rule.start_time, rule.end_time)}</p>
        </>
      )}
    </div>
  )
}
