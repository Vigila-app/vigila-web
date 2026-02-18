import React, { useState, useMemo } from "react"
import { useForm } from "react-hook-form"
import useMultiStepFlow from "@/src/hooks/useMultiStepFlow"
import {
  MultiStepOnboardingProps,
  QuestionType,
} from "@/src/types/multiStepOnboard.types"
import { RolesEnum } from "@/src/enums/roles.enums"
import { AvailabilityRulesDemo } from "@/components/calendar-demo"
// Dummy icons for demo (replace with your own icons as needed)
const ServiceIcons = [
  () => <span className="inline-block w-5 h-5 bg-blue-200 rounded-full" />, // Replace with real icons
  () => <span className="inline-block w-5 h-5 bg-green-200 rounded-full" />,
  () => <span className="inline-block w-5 h-5 bg-yellow-200 rounded-full" />,
  () => <span className="inline-block w-5 h-5 bg-pink-200 rounded-full" />,
]

const SERVICE_LABELS = ["Servizio 1", "Servizio 2", "Servizio 3", "Servizio 4"]
const MANSIONI_LABELS = [
  "Mansione 1",
  "Mansione 2",
  "Mansione 3",
  "Mansione 4",
  "Mansione 5",
]
import QuestionRenderer from "@/components/onboarding/multiStep/QuestionRenderer"
import { Step } from "./Step"
import { InformationCircleIcon } from "@heroicons/react/24/outline"

export default function AvailabilityFlow({
  onComplete,
}: Readonly<{
  onComplete: () => void
}>) {
  // --- New state for selected days and per-day service selection ---
  // In a real app, get this from answers or context. Here, we use a demo default:
  const [selectedDays, setSelectedDays] = useState<number[]>([1, 2, 3]) // 1=Monday, ...
  const [currentDayIdx, setCurrentDayIdx] = useState(0)
  const [perDayServices, setPerDayServices] = useState<
    Record<
      number,
      {
        services: boolean[]
        mansioni: boolean[]
        auto: boolean
        note: string
      }
    >
  >(() => {
    const obj: any = {}
    ;[1, 2, 3, 4, 5, 6, 7].forEach((d) => {
      obj[d] = {
        services: [false, false, false, false],
        mansioni: [false, false, false, false, false],
        auto: false,
        note: "",
      }
    })
    return obj
  })

  // ---

  const config: MultiStepOnboardingProps["config"] = {
    role: RolesEnum.VIGIL,
    steps: [
      {
        id: "availabilities",
        title: "",
        description: "",
        questions: [
          {
            id: "start-date",
            type: QuestionType.DATE,
            label: "Data Inizio",
            placeholder: "",
            description: "La ricorrenza durerà 4 settimane",
            validation: {
              required: true,
            },
          },
          {
            id: "address",
            type: QuestionType.ADDRESS,
            label: "Indirizzo",
            placeholder: "Via Napoli 123",
            description: "Dove si svolgerà l'assistenza",
            validation: {
              required: true,
            },
          },
        ],
        component: AvailabilityRulesDemo,
        note: "Potrai modificare la ricorrenza in qualsiasi momento: cambiare i giorni, aggiungere o cancellare singole visite e gestire eccezioni",
        nextStep: "services",
      },
      {
        id: "services",
        title: "Seleziona servizi per giorno",
        description: "",
        questions: [],
        component: (props: any) => {
          // --- UI for per-day service selection ---
          const day = selectedDays[currentDayIdx]
          const dayNames = [
            "Lunedì",
            "Martedì",
            "Mercoledì",
            "Giovedì",
            "Venerdì",
            "Sabato",
            "Domenica",
          ]
          if (!day) return null
          return (
            <div>
              {/* Badges for all selected days */}
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedDays.map((d, idx) => (
                  <span
                    key={d}
                    className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                      idx === currentDayIdx
                        ? "bg-rose-500 text-white border-rose-500"
                        : "bg-white text-rose-500 border-rose-300 cursor-pointer hover:bg-rose-50"
                    }`}
                    onClick={() => setCurrentDayIdx(idx)}
                  >
                    {dayNames[d - 1]}
                  </span>
                ))}
              </div>

              {/* Service checkboxes with icons */}
              <div className="mb-4">
                <div className="font-semibold mb-2">Servizi</div>
                <div className="grid grid-cols-2 gap-3">
                  {SERVICE_LABELS.map((label, i) => {
                    const Icon = ServiceIcons[i]
                    return (
                      <label
                        key={label}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={perDayServices[day].services[i]}
                          onChange={() => {
                            setPerDayServices((prev) => ({
                              ...prev,
                              [day]: {
                                ...prev[day],
                                services: prev[day].services.map((v, idx) =>
                                  idx === i ? !v : v,
                                ),
                              },
                            }))
                          }}
                          className="accent-rose-500"
                        />
                        <Icon />
                        <span>{label}</span>
                      </label>
                    )
                  })}
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
                        checked={perDayServices[day].mansioni[i]}
                        onChange={() => {
                          setPerDayServices((prev) => ({
                            ...prev,
                            [day]: {
                              ...prev[day],
                              mansioni: prev[day].mansioni.map((v, idx) =>
                                idx === i ? !v : v,
                              ),
                            },
                          }))
                        }}
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
                    checked={perDayServices[day].auto}
                    onChange={() => {
                      setPerDayServices((prev) => ({
                        ...prev,
                        [day]: {
                          ...prev[day],
                          auto: !prev[day].auto,
                        },
                      }))
                    }}
                    className="accent-rose-500"
                  />
                  {/* <CarIcon className="w-5 h-5" /> */}
                  <span>Accompagnamento in auto</span>
                </label>
              </div>

              {/* Notes */}
              <div className="mb-4">
                <label className="block font-semibold mb-1">Note</label>
                <textarea
                  className="w-full border rounded-md p-2"
                  rows={2}
                  value={perDayServices[day].note}
                  onChange={(e) => {
                    setPerDayServices((prev) => ({
                      ...prev,
                      [day]: {
                        ...prev[day],
                        note: e.target.value,
                      },
                    }))
                  }}
                  placeholder="Aggiungi note opzionali..."
                />
              </div>

              {/* Navigation */}
              <div className="flex justify-between mt-6">
                <button
                  type="button"
                  disabled={currentDayIdx === 0}
                  onClick={() =>
                    setCurrentDayIdx((idx) => Math.max(0, idx - 1))
                  }
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
                </button>
              </div>
            </div>
          )
        },
        note: "Seleziona i servizi e mansioni per ogni giorno scelto.",
        nextStep: "",
      },
    ],
    initialStepId: "availabilities",
    onComplete: async () => {
      console.log("Availability flow completed")
      onComplete()
    },
  }
  const { state, currentStep, next, back } = useMultiStepFlow({
    role: config.role,
    steps: config.steps,
    initialStepId: config.initialStepId,
    onComplete,
  } as any)
  const { handleSubmit } = useForm({ defaultValues: state.answers })

  if (!currentStep) return null

  const onNext = async (values: { [key: string]: unknown }) => {
    // values are validated by react-hook-form
    await next(currentStep, values)
  }

  return (
    <div className="mx-auto w-full max-w-md">
      <form onSubmit={handleSubmit(onNext)} className="flex flex-col gap-5">
        <Step currentStep={currentStep} state={state} config={config} />
        <div className="text-zinc-500  text-sm flex items-start gap-3">
          <InformationCircleIcon className="text-zinc-500 h-6 w-10" />
          {currentStep.note}
        </div>
        <div>
          <button type="button" onClick={back}>
            Back
          </button>
          <button type="submit">Next</button>
        </div>
      </form>
    </div>
  )
}
