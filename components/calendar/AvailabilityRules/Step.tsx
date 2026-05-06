"use client";
import { useState } from "react";
import { QuestionRenderer } from "@/components/onboarding/multiStep";
import {
  OnboardingFlowConfig,
  OnboardingFlowState,
  OnboardingStep,
  QuestionType,
} from "@/src/types/multiStepOnboard.types";
import {
  CalendarIcon,
  ChatBubbleBottomCenterIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";
import { RolesEnum } from "@/src/enums/roles.enums";

export const Step = ({
  currentStep,
  state,
  config,
  setAnswers,
  isLastStep,
}: {
  currentStep: OnboardingStep;
  state: OnboardingFlowState;
  config: OnboardingFlowConfig;
  setAnswers?: (
    updater:
      | Record<string, any>
      | ((prev: Record<string, any>) => Record<string, any>),
  ) => void;
  isLastStep?: boolean;
}) => {
  // local tick forces this component to re-render when answers are mutated in-place
  const [, setTick] = useState(0);
  return (
    <>
      {currentStep.component && (
        <currentStep.component
          answers={state.answers}
          setAnswers={setAnswers}
          isLastStep={isLastStep}
        />
      )}
      {currentStep.questions?.map((q) => (
        <div
          key={q.id}
          className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200"
        >
          <div>
            <div className="flex gap-2 items-center mb-5">
              <div
                className={clsx(
                  "w-10 h-10  rounded-full p-2 ",
                  config.role == RolesEnum.VIGIL
                    ? "text-vigil-orange bg-vigil-light-orange"
                    : "text-consumer-blue bg-consumer-light-blue",
                )}
              >
                {q.type == QuestionType.DATE && <CalendarIcon />}
                {q.type == QuestionType.ADDRESS && <MapPinIcon />}
                {q.type !== QuestionType.DATE &&
                  q.type !== QuestionType.ADDRESS && (
                    <ChatBubbleBottomCenterIcon />
                  )}
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
                // Prefer updating via provided setter to avoid direct mutation and re-render loops
                if (setAnswers) {
                  setAnswers((prev) => ({ ...(prev || {}), [q.id]: value }));
                } else {
                  // Fallback: mutate and force local re-render
                  state.answers[q.id] = value;
                  setTick((t) => t + 1);
                }
              }}
              error={undefined}
              role={config.role}
            />
          </div>
        </div>
      ))}
    </>
  );
};
