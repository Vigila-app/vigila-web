import { ComponentType, useEffect, useState, useMemo } from "react"
import clsx from "clsx"
import { RolesEnum } from "@/src/enums/roles.enums"
import { SingleService } from "./SingleService"
import { HeartIcon, UserGroupIcon } from "@heroicons/react/24/outline"
import Caffe from "@/components/svg/Caffe"
import Vasca from "@/components/svg/Vasca"
import { Car } from "@/components/svg"

export const Services = ({
  answers,
  setAnswers,
  role,
}: {
  answers?: Record<string, any>
  setAnswers?: (
    updater:
      | Record<string, any>
      | ((prev: Record<string, any>) => Record<string, any>),
  ) => void
  role?: RolesEnum
}) => {
  

  const SERVICES = [
    {
      name: "Compagnia e conversazione",
      desc: "Presenza, dialogo e supporto emotivo",
      Icon: Caffe as ComponentType<{ className?: string }>,
      price: 12,
    },
    {
      name: "Assistenza leggera",
      desc: "Supervisione, promemoria farmaci, piccole commissioni",
      Icon: HeartIcon as ComponentType<{ className?: string }>,
      price: 14,
    },
    {
      name: "Assistenza alla persona",
      desc: "Mobiiltà, pasti, vestizione",
      Icon: UserGroupIcon as ComponentType<{ className?: string }>,
      price: 16,
    },
    {
      name: "Igiene personale",
      desc: "Bagno, cambio, cura personale",
      Icon: Vasca as ComponentType<{ className?: string }>,
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

  // derive unique ordered weekdays from answers.availabilityRules
  const selectedDays: number[] = Array.from(
    new Set(
      (answers?.availabilityRules || []).map((r: any) => Number(r.weekday)),
    ),
  )

  const [currentDayIdx, setCurrentDayIdx] = useState(0)

  useEffect(() => {
    // reset to first day when availabilities change
    setCurrentDayIdx(0)
  }, [selectedDays.length])

  // per-day local selections
  const [selectedServices, setSelectedServices] = useState<string[]>([])
  const [selectedMansioni, setSelectedMansioni] = useState<string[]>([])
  const [car, setCar] = useState(false)
  const [notes, setNotes] = useState("")

  const colorClasses = useMemo(() => {
    const vigil = {
      bg: "bg-vigil-orange",
      bgLight: "bg-vigil-light-orange",
      text: "text-vigil-orange",
      border: "border-vigil-orange",
      hoverBorder: "hover:border-vigil-light-orange",
      hoverText: "hover:text-vigil-orange",
    }
    const consumer = {
      bg: "bg-consumer-blue",
      bgLight: "bg-consumer-light-blue",
      text: "text-consumer-blue",
      border: "border-consumer-light-blue",
      hoverBorder: "hover:border-consumer-light-blue",
      hoverText: "hover:text-consumer-blue",
    }
    return role === RolesEnum.CONSUMER ? consumer : vigil
  }, [role])

  // load per-day values when current day changes
  useEffect(() => {
    const day = selectedDays[currentDayIdx]
    const saved = answers?.services?.[day]
    if (saved) {
      setSelectedServices(Array.isArray(saved.services) ? saved.services : [])
      setSelectedMansioni(Array.isArray(saved.mansioni) ? saved.mansioni : [])
      setCar(!!saved.car)
      setNotes(saved.notes || "")
    } else {
      setSelectedServices([])
      setSelectedMansioni([])
      setCar(false)
      setNotes("")
    }
  }, [currentDayIdx, selectedDays.join("-")])

  if (loading)
    return (
      <div className="text-zinc-500 text-sm">Caricamento disponibilità…</div>
    )
  if (error) return <div className="text-red-500 text-sm">{error}</div>

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
                  className={clsx(
                    "font-bold text-sm px-4 py-2 rounded-full",
                    isActive || hasEdited
                      ? clsx("text-white", colorClasses.bg)
                      : "text-zinc-700 bg-white border",
                  )}
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
        {selectedDays.length === 0 ? (
          <div className="text-sm text-zinc-500">Nessun giorno selezionato</div>
        ) : (
          <>
            <h2>{dayNames[Number(selectedDays[currentDayIdx])]}</h2>
            <span className="ml-2 text-zinc-600 text-sm">
              {(answers?.availabilityRules || [])
                .filter(
                  (r: any) =>
                    Number(r.weekday) === Number(selectedDays[currentDayIdx]),
                )
                .map(
                  (r: any) =>
                    `${r.start_time.slice(0, 5)} - ${r.end_time.slice(0, 5)}`,
                )
                .join(", ")}
            </span>
          </>
        )}
        <div className="mb-4">
          <div className="font-semibold mb-2">Servizi</div>
          <div className="grid grid-cols-2 gap-3">
            {SERVICES.map((srv) => (
              <SingleService
                key={srv.name}
                {...srv}
                checked={selectedServices.includes(srv.name)}
                onChange={(next: boolean) => {
                  setSelectedServices((prev) => {
                    if (next) return Array.from(new Set([...prev, srv.name]))
                    return prev.filter((s) => s !== srv.name)
                  })
                }}
              />
            ))}
          </div>
        </div>

        {/* Mansioni checkboxes without icons */}
        <div className="mb-4">
          <div className="font-semibold mb-2">Mansioni</div>
          <div className="flex flex-col gap-2">
            {MANSIONI_LABELS.map((label) => {
              const isChecked = selectedMansioni.includes(label)
              return (
                <label
                  key={label}
                  onMouseDown={(e) => {
                    e.preventDefault()
                    setSelectedMansioni((prev) =>
                      prev.includes(label)
                        ? prev.filter((p) => p !== label)
                        : [...prev, label],
                    )
                  }}
                  className={clsx(
                    "cursor-pointer w-full py-3 text-center rounded-full",
                    isChecked
                      ? clsx(colorClasses.border, colorClasses.bgLight)
                      : "border-zinc-200 bg-white",
                  )}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    readOnly
                    className="hidden"
                  />
                  <span>{label}</span>
                </label>
              )
            })}
          </div>
        </div>

        {/* Accompagnamento in auto */}
        <div className="mb-4">
          <label
            className={clsx(
              "block cursor-pointer w-full p-3 rounded-2xl",
              car
                ? clsx(colorClasses.border, colorClasses.bgLight)
                : "border-zinc-200 bg-white",
            )}
          >
            <input
              type="checkbox"
              checked={car}
              onChange={() => setCar((v) => !v)}
              className="hidden"
            />
            <h3 className="flex items-center gap-2 w-full font-bold text-lg">
              <Car className={clsx("w-5 h-5", colorClasses.text)} />
              <span>Accompagnamento in auto</span>
            </h3>
            <p className="text-md text-zinc-400">
              L'operatore accompagna con la sua propria auto
            </p>
            <p className={clsx("text-xs", colorClasses.text)}>
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
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
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
                    const next = { ...prev }
                    next.services = { ...next.services }
                    // Save actual selections for the day
                    next.services[day] = {
                      weekday: Number(day),
                      services: selectedServices,
                      mansioni: selectedMansioni,
                      car: !!car,
                      notes: notes || "",
                    }
                    return next
                  })
                }

                // move to next day or finalize
                if (currentDayIdx < selectedDays.length - 1) {
                  const nextIdx = currentDayIdx + 1
                  const nextDay = selectedDays[nextIdx]
                  // load saved values for next day (if any) so UI reflects them immediately
                  const savedNext = answers?.services?.[nextDay]
                  setSelectedServices(
                    Array.isArray(savedNext?.services)
                      ? savedNext.services
                      : [],
                  )
                  setSelectedMansioni(
                    Array.isArray(savedNext?.mansioni)
                      ? savedNext.mansioni
                      : [],
                  )
                  setCar(!!savedNext?.car)
                  setNotes(savedNext?.notes || "")
                  setCurrentDayIdx(nextIdx)
                } else {
                  // last day: finalize / salva ricorrenza
                  console.log("All days filled, salva ricorrenza")
                }
              }}
              className={clsx(
                "px-4 py-2 rounded text-white disabled:opacity-50",
                colorClasses.bg,
              )}
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
