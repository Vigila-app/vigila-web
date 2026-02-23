import { ComponentType, useEffect, useState } from "react"
import { SingleService } from "./SingleService"
import { HeartIcon, UserGroupIcon } from "@heroicons/react/24/outline"
import Caffe from "@/components/svg/Caffe"
import Vasca from "@/components/svg/Vasca"
import { Car } from "@/components/svg"

export const Services = ({ answers }: { answers?: Record<string, any> }) => {
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
          {Array.from(
            new Set(answers?.availabilities.map((rule) => rule.weekday)),
          ).map((day) => (
            <>
              <span
                key={"rule_" + day}
                className="font-bold text-white text-sm px-4 py-2 bg-vigil-orange rounded-full"
              >
                {dayNames[Number(day)]}
              </span>
              <span className="ml-2 text-zinc-600 text-sm">
                {rules
                  .map(
                    (r: any) =>
                      `${r.start_time.slice(0, 5)} - ${r.end_time.slice(0, 5)}`,
                  )
                  .join(", ")}
              </span>
            </>
          ))}
        </div>
      </div>

      {/* Service checkboxes with icons */}
      <div className="bg-white p-4 rounded-2xl">
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
          <div className="grid grid-cols-2 gap-3">
            {MANSIONI_LABELS.map((label, i) => (
              <label
                key={label}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={false}
                  onChange={() => {}}
                  className="accent-rose-500"
                />
                <span>{label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Accompagnamento in auto */}
        <div className="mb-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={false}
              onChange={() => {}}
              className="accent-rose-500"
            /> 
             <Car className="w-5 h-5" />
            <span>Accompagnamento in auto</span>
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
          {/* <button
            type="button"
            disabled={currentDayIdx === 0}
            onClick={() => setCurrentDayIdx((idx) => Math.max(0, idx - 1))}
            className="px-4 py-2 rounded bg-gray-100 text-gray-700 disabled:opacity-50"
          >
            Giorno precedente
          </button>
          <button
            type="button"
            disabled={currentDayIdx === selectedDays.length - 1}
            onClick={() =>
              setCurrentDayIdx((idx) =>
                Math.min(selectedDays.length - 1, idx + 1),
              )
            }
            className="px-4 py-2 rounded bg-rose-500 text-white disabled:opacity-50"
          >
            Prossimo giorno
          </button> */}
        </div>
      </div>
    </div>
  )
}
