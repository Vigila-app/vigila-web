"use client";

import { useCallback, useMemo, useState } from "react";
import useMultiStepFlow from "@/src/hooks/useMultiStepFlow";
import { useForm, Controller } from "react-hook-form";
import { Button, ProgressBar } from "@/components";
import Card from "@/components/card/card";
import {
  MultiStepOnboardingProps,
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

  const { state, currentStep, isLastStep, next, back, progress } =
    useMultiStepFlow({ role, steps, initialStepId, onComplete } as any);

  const [error, setError] = useState<string | null>(null);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    getValues,
  } = useForm({
    mode: "onChange",
    defaultValues: state.answers,
  });

  // Helper for custom step components to advance with validated answers
  const onNext = useCallback(
    async (validatedAnswers: Record<string, any>) => {
      if (!currentStep) return;
      try {
        await next(currentStep, validatedAnswers);
      } catch (err: any) {
        setError(err?.message || "An error occurred");
      }
    },
    [currentStep, next],
  );

  const handleNext = useCallback(async () => {
    if (!currentStep) return;

    const questionIds = currentStep.questions?.map((q) => q.id);
    const isValid = await trigger(questionIds);
    if (!isValid) return;

    const currentValues = getValues();
    try {
      await next(currentStep, currentValues);
    } catch (err: any) {
      setError(err?.message || "An error occurred");
    }
  }, [currentStep, trigger, getValues, next]);

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
            <section className="flex flex-col items-center gap-2 mb-6">
              <h1 className={clsx("font-semibold text-2xl  text-center ")}>
                {currentStep.title}
              </h1>
              {currentStep.description && (
                <span className="font-normal text-lg  text-center">
                  {currentStep.description}
                </span>
              )}
            </section>
          )}

          {/* Error message */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}

          {/* Questions form */}
          <form
            onSubmit={handleSubmit(handleNext)}
            className="max-w-lg mx-auto space-y-4"
          >
            {currentStep.component
              ? // Render custom step component (backwards-compatible)
                (() => {
                  const StepComponent = currentStep.component as any;
                  return (
                    <StepComponent
                      control={control}
                      register={register}
                      errors={errors}
                      role={role}
                      step={currentStep}
                      answers={state.answers}
                      onNext={onNext}
                      onBack={back}
                    />
                  );
                })()
              : currentStep.questions?.map((question: OnboardingQuestion) => (
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
            <div className="flex items-center pt-2">
              {state.visitedSteps.length > 1 ? (
                <Button
                  type="button"
                  action={back}
                  onboard
                  label="Indietro"
                  icon={<ArrowLeftIcon className="size-5" />}
                  disabled={state.isLoading}
                />
              ) : (
                onCancel && (
                  <Button
                    type="button"
                    action={onCancel}
                    onboard
                    label="Annulla"
                    disabled={state.isLoading}
                  />
                )
              )}

              <Button
                type="submit"
                onboard
                label={isLastStep ? "Completa" : "Avanti "}
                icon={<ArrowRightIcon className="size-5" />}
                iconPosition="right"
                isLoading={state.isLoading}
                disabled={state.isLoading}
                customClass="ml-auto"
              />
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default MultiStepOnboarding;
