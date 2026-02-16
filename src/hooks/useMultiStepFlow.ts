import { useCallback, useMemo, useState } from "react"
import {
  OnboardingFlowState,
  OnboardingStep,
  MultiStepOnboardingProps,
} from "@/src/types/multiStepOnboard.types"

/**
 * Generic hook to manage multi-step flows.
 * - Keeps track of current step, visited steps, answers and progress
 * - Does not depend on form library; components can call `next` with validated answers
 * This is intentionally small and backwards-compatible with the current onboarding component.
 */
export function useMultiStepFlow(config: MultiStepOnboardingProps["config"]) {
  const { steps, initialStepId, onComplete } = config

  const [state, setState] = useState<OnboardingFlowState>({
    currentStepId: initialStepId,
    currentStepIndex: 0,
    answers: {},
    visitedSteps: [initialStepId],
    isLoading: false,
  })

  const currentStep: OnboardingStep | undefined = useMemo(() => {
    return steps.find((s) => s.id === state.currentStepId)
  }, [steps, state.currentStepId])

  const isLastStep = useMemo(() => {
    if (!currentStep) return false
    if (!currentStep.nextStep) return true
    if (typeof currentStep.nextStep === "function") {
      const nextId = currentStep.nextStep(state.answers)
      return !nextId
    }
    return false
  }, [currentStep, state.answers])

  const getNextStepId = useCallback(
    (currentStepData: OnboardingStep, stepAnswers: Record<string, any>) => {
      for (const question of currentStepData.questions ?? []) {
        const answer = stepAnswers[question.id]
        if (question.nextStep) {
          if (typeof question.nextStep === "function") {
            const nextId = question.nextStep(answer, stepAnswers)
            if (nextId) return nextId
          } else {
            return question.nextStep
          }
        }
      }

      if (currentStepData.nextStep) {
        if (typeof currentStepData.nextStep === "function") {
          return currentStepData.nextStep(stepAnswers)
        }
        return currentStepData.nextStep
      }

      return null
    },
    [],
  )

  // Move forward given validated answers for the current step
  const next = useCallback(
    async (currentStepData: OnboardingStep, validatedAnswers: Record<string, any>) => {
      const updatedAnswers = { ...state.answers, ...validatedAnswers }

      const nextStepId = getNextStepId(currentStepData, updatedAnswers)

      if (!nextStepId) {
        setState((prev) => ({ ...prev, isLoading: true }))
        try {
          await onComplete(updatedAnswers)
        } finally {
          setState((prev) => ({ ...prev, isLoading: false }))
        }
        return
      }

      setState((prev) => ({
        ...prev,
        currentStepId: nextStepId,
        currentStepIndex: prev.currentStepIndex + 1,
        answers: updatedAnswers,
        visitedSteps: [...prev.visitedSteps, nextStepId],
      }))
    },
    [getNextStepId, onComplete, state.answers],
  )

  const back = useCallback(() => {
    if (state.visitedSteps.length <= 1) return
    const newVisited = [...state.visitedSteps]
    newVisited.pop()
    const previous = newVisited[newVisited.length - 1]
    setState((prev) => ({
      ...prev,
      currentStepId: previous,
      currentStepIndex: Math.max(0, prev.currentStepIndex - 1),
      visitedSteps: newVisited,
    }))
  }, [state.visitedSteps])

  const progress = useMemo(() => {
    const totalSteps = steps.length - 1
    return Math.round(((state.currentStepIndex + 1) / Math.max(1, totalSteps)) * 100)
  }, [steps.length, state.currentStepIndex])

  return {
    state,
    currentStep,
    isLastStep,
    getNextStepId,
    next,
    back,
    progress,
  }
}

export default useMultiStepFlow
