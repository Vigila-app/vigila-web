"use client";

import { useState, useCallback, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button, ProgressBar } from "@/components";
import Card from "@/components/card/card";
import {
  MultiStepOnboardingProps,
  OnboardingFlowState,
  OnboardingStep,
  OnboardingQuestion,
} from "@/src/types/multiStepOnboard.types";
import QuestionRenderer from "./QuestionRenderer";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { RolesEnum } from "@/src/enums/roles.enums";

/**
 * Main component that manages the multi-step onboarding flow
 */
const MultiStepOnboarding = ({
  config,
  onCancel,
}: MultiStepOnboardingProps) => {
  const { role, steps, initialStepId, onComplete } = config;

  const [state, setState] = useState<OnboardingFlowState>({
    currentStepId: initialStepId,
    currentStepIndex: 0,
    answers: {},
    visitedSteps: [initialStepId],
    isLoading: false,
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    trigger,
    getValues,
  } = useForm({
    mode: "onChange",
    defaultValues: state.answers,
  });

  // Get current step
  const currentStep = useMemo(() => {
    return steps.find((step) => step.id === state.currentStepId);
  }, [steps, state.currentStepId]);

  // Check if this is the last step
  const isLastStep = useMemo(() => {
    if (!currentStep) return false;

    // If the step has no nextStep defined, it's the last step
    if (!currentStep.nextStep) return true;

    // If nextStep is a function, we need to evaluate it
    if (typeof currentStep.nextStep === "function") {
      const nextId = currentStep.nextStep(state.answers);
      return !nextId;
    }

    return false;
  }, [currentStep, state.answers]);
  console.log(state.answers); //TODO
  // Determine the next step based on current answers
  const getNextStepId = useCallback(
    (currentStepData: OnboardingStep, stepAnswers: Record<string, any>) => {
      // Check if any question has a conditional nextStep
      for (const question of currentStepData.questions) {
        const answer = stepAnswers[question.id];
        if (question.nextStep) {
          if (typeof question.nextStep === "function") {
            const nextId = question.nextStep(answer, stepAnswers);
            if (nextId) return nextId;
          } else {
            return question.nextStep;
          }
        }
      }

      // Use step-level nextStep
      if (currentStepData.nextStep) {
        if (typeof currentStepData.nextStep === "function") {
          return currentStepData.nextStep(stepAnswers);
        }
        return currentStepData.nextStep;
      }

      return null;
    },
    [],
  );

  // Handle moving to next step
  const handleNext = useCallback(async () => {
    if (!currentStep) return;

    // Validate current step questions
    const questionIds = currentStep.questions.map((q) => q.id);
    const isValid = await trigger(questionIds);

    if (!isValid) return;

    const currentValues = getValues();
    const updatedAnswers = { ...state.answers, ...currentValues };

    // Check if this is the last step
    const nextStepId = getNextStepId(currentStep, updatedAnswers);

    if (!nextStepId) {
      // Complete the onboarding
      setState((prev) => ({ ...prev, isLoading: true }));
      try {
        await onComplete(updatedAnswers);
      } catch (error) {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: error instanceof Error ? error.message : "An error occurred",
        }));
      }
      return;
    }

    // Move to next step
    setState((prev) => ({
      ...prev,
      currentStepId: nextStepId,
      currentStepIndex: prev.currentStepIndex + 1,
      answers: updatedAnswers,
      visitedSteps: [...prev.visitedSteps, nextStepId],
    }));
  }, [
    currentStep,
    getNextStepId,
    getValues,
    onComplete,
    state.answers,
    trigger,
  ]);

  // Handle moving to previous step
  const handleBack = useCallback(() => {
    if (state.visitedSteps.length <= 1) return;

    const newVisitedSteps = [...state.visitedSteps];
    newVisitedSteps.pop(); // Remove current step
    const previousStepId = newVisitedSteps[newVisitedSteps.length - 1];

    setState((prev) => ({
      ...prev,
      currentStepId: previousStepId,
      currentStepIndex: Math.max(0, prev.currentStepIndex - 1),
      visitedSteps: newVisitedSteps,
    }));
  }, [state.visitedSteps.length]);

  // Progress calculation
  const progress = useMemo(() => {
    const totalSteps = steps.length - 1;
    return Math.round(((state.currentStepIndex + 1) / totalSteps) * 100);
  }, [steps.length, state.currentStepIndex]);

  if (!currentStep) {
    return (
      <div className="text-center text-red-500">Error: Step not found</div>
    );
  }

  return (
    <div className="w-full max-w-full mx-auto px-4 pt-8 pb-4">
      {/* TODO: posso consigliare di aggiungere un testo all’inizio, es. Step1, in cui spieghiamo che abbiamo bisogno di alcune risposte per creare un’esperienza su misura e di qualità e che il tutto impiegherà meno di 5 minut */}
      <div className="mb-7">
        <ProgressBar percentage={progress} />
      </div>
      <Card>
        <div className="p-4 ">
       

          {/* Step header */}
          {currentStep.title && (
            <section className="flex flex-col items-center gap-2 mb-8">
              <h1 className={clsx("font-semibold text-2xl")}>
                {currentStep.title}
              </h1>
              {currentStep.description && (
                <span className="font-normal text-lg text-center">
                  {currentStep.description}
                </span>
              )}
            </section>
          )}

          {/* Error message */}
          {state.error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {state.error}
            </div>
          )}

          {/* Questions form */}
          <form
            onSubmit={handleSubmit(handleNext)}
            className="max-w-lg mx-auto space-y-6">
            {currentStep.questions.map((question: OnboardingQuestion) => (
              <Controller
                key={question.id}
                name={question.id}
                control={control}
                defaultValue={state.answers[question.id]}
                rules={{
                  required: question.validation?.required,
                  minLength: question.validation?.minLength,
                  maxLength: question.validation?.maxLength,
                  min: question.validation?.min,
                  max: question.validation?.max,
                  pattern: question.validation?.pattern,
                  validate: question.validation?.validate,
                }}
                render={({ field }) => (
                  <QuestionRenderer
                    question={question}
                    value={field.value}
                    onChange={field.onChange}
                    error={errors[question.id] as any}
                    role={role}
                  />
                )}
              />
            ))}
            <hr />
            {/* Navigation buttons */}
            <div className="flex justify-between items-center pt-4">
              {state.visitedSteps.length > 1 ? (
                <Button
                  type="button"
                  action={handleBack}
                  role={role}
                  label="Indietro"
                  icon={<ArrowLeftIcon className="size-5" />}
                  disabled={state.isLoading}
                />
              ) : (
                onCancel && (
                  <Button
                    type="button"
                    action={onCancel}
                    role={role}
                    label="Annulla"
                    disabled={state.isLoading}
                  />
                )
              )}

              <Button
                type="submit"
                primary
                role={role}
                label={isLastStep ? "Completa" : "Avanti "}
                icon={<ArrowRightIcon className="size-5" />}
                iconPosition="right"
                isLoading={state.isLoading}
                disabled={state.isLoading}
              />
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default MultiStepOnboarding;
