import { ComponentType, useEffect, useState } from "react"
import { SingleService } from "./SingleService"
import { HeartIcon, UserGroupIcon } from "@heroicons/react/24/outline"
import Caffe from "@/components/svg/Caffe"
import Vasca from "@/components/svg/Vasca"
import { Car } from "@/components/svg"

export const Services = ({
  answers,
  setAnswers,
}: {
  answers?: Record<string, any>
  setAnswers?: (
    updater:
      | Record<string, any>
      | ((prev: Record<string, any>) => Record<string, any>),
  ) => void
}) => {
  console.log(answers)
  const ServiceIcons = [
    () => <span className="inline-block w-5 h-5 bg-blue-200 rounded-full" />, // Replace with real icons
    () => <span className="inline-block w-5 h-5 bg-green-200 rounded-full" />,
    () => <span className="inline-block w-5 h-5 bg-yellow-200 rounded-full" />,
    () => <span className="inline-block w-5 h-5 bg-pink-200 rounded-full" />,
  ]

  const SERVICES = [
    {
      name: "Compagnia e conversazione",
      desc: "Presenza, dialogo e supporto emotivo",
      Icon: Caffe as ComponentType<{ className?: string | undefined }>,
      price: 12,
    },
    {
      name: "Assistenza leggera",
      desc: "Supervisione, promemoria farmaci, piccole commissioni",
      Icon: HeartIcon as ComponentType<{ className?: string | undefined }>,
      price: 14,
    },
    {
      name: "Assistenza alla persona",
      desc: "Mobiiltà, pasti, vestizione",
      Icon: UserGroupIcon as ComponentType<{ className?: string | undefined }>,
      price: 16,
    },
    {
      name: "Igiene personale",
      desc: "Bagno, cambio, cura personale",
      Icon: Vasca as ComponentType<{ className?: string | undefined }>,
      price: 18,
    },
  ]
  const MANSIONI_LABELS = [
    "Conversazione e ascolto",
    "Lettura libri / giornali",
    "Giochi di società / carte",
    "Guardare TV insieme",
    "Passeggiata leggera",
  ]
  // Fetch availability rules from API using vigil_id from answers
  const [rules, setRules] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const dayNames = [
    "Domenica",
    "Lunedì",
    "Martedì",
    "Mercoledì",
    "Giovedì",
    "Venerdì",
    "Sabato",
  ]

  // derive unique ordered weekdays from answers.availabilities
  const selectedDays: number[] = Array.from(
    new Set((answers?.availabilities || []).map((r: any) => Number(r.weekday))),
  )

  const [currentDayIdx, setCurrentDayIdx] = useState(0)

  useEffect(() => {
    // reset to first day when availabilities change
    setCurrentDayIdx(0)
  }, [selectedDays.length])

  if (loading)
    return (
      <div className="text-zinc-500 text-sm">Caricamento disponibilità…</div>
    )
  if (error) return <div className="text-red-500 text-sm">{error}</div>

  // Group rules by weekday
  // const rulesByDay: Record<number, any[]> = {}
  // rules.forEach((rule) => {
  //   if (!rulesByDay[rule.weekday]) rulesByDay[rule.weekday] = []
  //   rulesByDay[rule.weekday].push(rule)
  // })

  return (
    <div className="bg-zinc-200 p-4">
      <div className="bg-white rounded-full mb-4">
        <div className="flex gap-2 flex-wrap p-3">
          {selectedDays.map((day, idx) => {
            const isActive = idx === currentDayIdx
            const dayServices = answers?.services?.[day]
            const hasEdited = !!dayServices
            return (
              <div key={"rule_" + day} className="flex items-center">
                <button
                  onClick={() => setCurrentDayIdx(idx)}
                  className={
                    "font-bold text-sm px-4 py-2 rounded-full " +
                    (isActive || hasEdited
                      ? "text-white bg-vigil-orange"
                      : "text-zinc-700 bg-white border")
                  }
                >
                  {dayNames[Number(day)]}
                </button>
              </div>
            )
          })}
        </div>
      </div>

      {/* Service checkboxes with icons */}
      <div className="bg-white p-4 rounded-2xl">
        <h2>{dayNames[Number(currentDayIdx)]}</h2>
        <span className="ml-2 text-zinc-600 text-sm">
          {(answers?.availabilities || [])
            .filter((r: any) => Number(r.weekday) === Number(currentDayIdx))
            .map(
              (r: any) =>
                `${r.start_time.slice(0, 5)} - ${r.end_time.slice(0, 5)}`,
            )
            .join(", ")}
          {/* TODO: add how mmany hours is each slot in this format (2h) */}
        </span>
        <div className="mb-4">
          <div className="font-semibold mb-2">Servizi</div>
          <div className="grid grid-cols-2 gap-3">
            {SERVICES.map((srv) => (
              <SingleService {...srv} />
            ))}
          </div>
        </div>

        {/* Mansioni checkboxes without icons */}
        <div className="mb-4">
          <div className="font-semibold mb-2">Mansioni</div>
          <div className="flex flex-col gap-2">
            {MANSIONI_LABELS.map((label, i) => (
              <label
                key={label}
                className="cursor-pointer w-full py-3 text-center rounded-full checked:border-vigil-orange border-1"
              >
                <input
                  type="checkbox"
                  checked={false}
                  onChange={() => {}}
                  className="hidden"
                />
                <span>{label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Accompagnamento in auto */}
        <div className="mb-4">
          <label className="block cursor-pointer w-full p-3 rounded-2xl checked:border-vigil-orange border-1">
            <input
              type="checkbox"
              checked={false}
              onChange={() => {}}
              className="hidden"
            />
            <h3 className="flex items-center gap-2 w-full font-bold text-lg">
              <Car className="w-5 h-5 text-vigil-orange " />
              <span>Accompagnamento in auto</span>
            </h3>
            <p className="text-md text-zinc-400">
              L'operatore accompagna con la sua propria auto
            </p>
            <p className="text-xs text-vigil-orange">
              +5 EUR rimborso carburante per visita
            </p>
          </label>
        </div>

        {/* Notes */}
        <div className="mb-4">
          <label className="block font-semibold mb-1">Note</label>
          <textarea
            className="w-full border rounded-md p-2"
            rows={2}
            value={""}
            onChange={(e) => {}}
            placeholder="Aggiungi note opzionali..."
          />
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          <div />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={async () => {
                const day = selectedDays[currentDayIdx]
                // Save current day selections into answers
                if (setAnswers) {
                  setAnswers((prev: Record<string, any>) => {
                    const next = { ...(prev || {}) }
                    next.services = { ...(next.services || {}) }
                    // Placeholder: collect values from UI components and save per day
                    // For now we mark the day as saved (you can replace with real selections)
                    next.services[day] = next.services[day] || { saved: true }
                    return next
                  })

                  // TODO: POST to API to save services for this day
                  // await ApiService.post(`/api/vigil/availability-rules/${ruleId}/services`, payload)
                }

                // move to next day or finalize
                if (currentDayIdx < selectedDays.length - 1) {
                  setCurrentDayIdx((idx) => idx + 1)
                } else {
                  // last day: finalize / salva ricorrenza
                  // TODO: trigger final save/API call for whole recurrence
                  console.log("All days filled, salva ricorrenza")
                }
              }}
              className="px-4 py-2 rounded bg-rose-500 text-white disabled:opacity-50"
            >
              {currentDayIdx === selectedDays.length - 1
                ? "Salva ricorrenza"
                : "Prossimo giorno"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
