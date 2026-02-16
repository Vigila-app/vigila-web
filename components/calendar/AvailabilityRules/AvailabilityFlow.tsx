import React from "react"
import { useForm } from "react-hook-form"
import useMultiStepFlow from "@/src/hooks/useMultiStepFlow"
import {
  MultiStepOnboardingProps,
  QuestionType,
} from "@/src/types/multiStepOnboard.types"
import { RolesEnum } from "@/src/enums/roles.enums"
import { AvailabilityRulesDemo } from "@/components/calendar-demo"
import QuestionRenderer from "@/components/onboarding/multiStep/QuestionRenderer"

export default function AvailabilityFlow({
  onComplete,
}: Readonly<{
  onComplete: () => void
}>) {
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
            placeholder: "",
            description: "Dove si svolgerà l'assistenza",
            validation: {
              required: true,
            },
          },
        ],
        component: AvailabilityRulesDemo,
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
          {currentStep.component && <currentStep.component />}
        {currentStep.questions?.map((q) => (
          <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <QuestionRenderer
              key={q.id}
              question={q}
              value={state.answers[q.id]}
              onChange={(value) => {
                state.answers[q.id] = value
              }}
              error={undefined} // Adjusted to match the expected prop
              role={config.role} // Added role prop as required by QuestionRenderer
            />
          </div>
        ))}
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
