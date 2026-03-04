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

import QuestionRenderer from "@/components/onboarding/multiStep/QuestionRenderer"
import { Step } from "./Step"
import { InformationCircleIcon } from "@heroicons/react/24/outline"
import { Services } from "./Services"
import { BookingTypeEnum } from "@/src/enums/booking.enums"

export default function AvailabilityFlow({
  onComplete,
}: Readonly<{
  onComplete: () => void
}>) {
  // --- New state for selected days and per-day service selection ---
  // In a real app, get this from answers or context. Here, we use a demo default:

  // ---

  const config: MultiStepOnboardingProps["config"] = {
    role: RolesEnum.VIGIL,
    steps: [
      {
        id: "welcome",
        title: "Prenota l'assistenza domiciliare",
        description: "",
        nextStep: "availabilities",
        questions: [
          {
            id: "booking-type",
            type: QuestionType.RADIO,
          description: "Scegli se la prenotazione è una tantum o ricorrente",
            label: "Tipo di prenotazione",
            options: [
              { label: "Una volta", value: BookingTypeEnum.OCCASIONAL },
              { label: "Ricorrente", value: BookingTypeEnum.RECURRING }]
          }]
      },
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
        // Pass answers as prop to Services
        component: Services,
        note: "Seleziona i servizi e mansioni per ogni giorno scelto.",
        nextStep: "",
      },
    ],
    initialStepId: "welcome",
    onComplete: async () => {
      console.log("Availability flow completed")
      onComplete()
    },
  }
  const { setAnswers, state, currentStep, next, back } = useMultiStepFlow({
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
        <Step
          currentStep={currentStep}
          state={state}
          config={config}
          setAnswers={setAnswers}
        />
        <div className="text-zinc-500  text-sm flex items-start gap-3">
          <InformationCircleIcon className="text-zinc-500 h-6 w-10" />
          {currentStep.note}
        </div>
        <div className="flex gap-2 flex-wrap">
          <button className="border-2 border-vigil-orange flex-1 py-3 rounded-full" type="button" onClick={back}>
            Back
          </button>
          <button className="bg-vigil-orange flex-1 py-3 rounded-full" type="submit">Next</button>
        </div>
      </form>
    </div>
  )
}
