import { useState } from "react"
import { QuestionRenderer } from "@/components/onboarding/multiStep"
import { OnboardingFlowConfig, OnboardingFlowState, OnboardingStep, QuestionType } from "@/src/types/multiStepOnboard.types"
import { CalendarIcon, MapIcon, MapPinIcon } from "@heroicons/react/24/outline"

export const Step = ({currentStep, state, config}: {currentStep: OnboardingStep, state: OnboardingFlowState, config: OnboardingFlowConfig}) => {
  // local tick forces this component to re-render when answers are mutated in-place
  const [, setTick] = useState(0)

  return (
    <>
      {" "}
      {currentStep.component && <currentStep.component />}
      {currentStep.questions?.map((q) => (
        <div
          key={q.id}
          className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200"
        >
          <div>
            <div className="flex gap-2 items-center mb-5">
              <div className="w-10 h-10 rounded rounded-full text-vigil-orange p-2 bg-vigil-light-orange">
                {q.type == QuestionType.DATE && <CalendarIcon />}
                {q.type == QuestionType.ADDRESS && <MapPinIcon />}
              </div>
              <div>

              <h3 className="fw-bold">{q.label}</h3>
              <div className="text-sm text-zinc-600">{q.description}</div>
              </div>
            </div>
            <QuestionRenderer
              question={{ ...q, label: "", description: "" }}
              value={state.answers[q.id]}
              onChange={(value) => {
                // persist answer and trigger a local re-render so controlled inputs update
                state.answers[q.id] = value
                setTick((t) => t + 1)
              }}
              error={undefined} // Adjusted to match the expected prop
              role={config.role} // Added role prop as required by QuestionRenderer
            />
          </div>
        </div>
      ))}
    </>
  )
}
