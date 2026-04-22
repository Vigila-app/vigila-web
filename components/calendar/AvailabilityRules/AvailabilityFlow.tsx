"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import useMultiStepFlow from "@/src/hooks/useMultiStepFlow";
import {
  MultiStepOnboardingProps,
  QuestionType,
} from "@/src/types/multiStepOnboard.types";
import { RolesEnum } from "@/src/enums/roles.enums";
import { AvailabilityRulesDemo } from "@/components/calendar-demo";
import { Step } from "./Step";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { Services } from "./Services";
import { BookingTypeEnum } from "@/src/enums/booking.enums";
import clsx from "clsx";
import Button from "@/components/button/button";
import { ApiService, UserService } from "@/src/services";
import { apiConsumer } from "@/src/constants/api.constants";

export default function AvailabilityFlow({
  onComplete,
}: Readonly<{
  onComplete: () => void;
}>) {
  const config: MultiStepOnboardingProps["config"] = {
    role: RolesEnum.CONSUMER,
    steps: [
      {
        id: "welcome",
        title: "Prenota l'assistenza domiciliare",
        description: "",
        nextStep: (answers) => {
          console.log(answers["booking-type"]);
          if (
            answers["booking-type"] == BookingTypeEnum.OCCASIONAL ||
            answers["booking-type"] == BookingTypeEnum.TRIAL
          ) {
            return "single-booking";
          }
          return "availabilities";
        },
        questions: [
          {
            id: "booking-type",
            type: QuestionType.RADIO,
            description: "Scegli se la prenotazione è una tantum o ricorrente",
            label: "Tipo di prenotazione",
            options: [
              { label: "Una volta", value: BookingTypeEnum.OCCASIONAL },
              { label: "Ricorrente", value: BookingTypeEnum.RECURRING },
              { label: "Non lo so", value: BookingTypeEnum.TRIAL },
            ],
          },
        ],
      },
      {
        id: "single-booking",
        title: "",
        description: "",
        questions: [
          {
            id: "start-date",
            type: QuestionType.DATE,
            label: "Data del servizio",
            placeholder: "",
            validation: {
              required: true,
              min: new Date(new Date().setDate(new Date().getDate() + 1))
                .toISOString()
                .split("T")[0],
              max: new Date(new Date().setMonth(new Date().getMonth() + 3))
                .toISOString()
                .split("T")[0],
            },
            min: new Date(new Date().setDate(new Date().getDate() + 1))
              .toISOString()
              .split("T")[0],
            max: new Date(new Date().setMonth(new Date().getMonth() + 3))
              .toISOString()
              .split("T")[0],
            autoFocus: true,
          },
          {
            id: "address",
            type: QuestionType.ADDRESS,
            label: "Indirizzo",
            placeholder: "Via Napoli 123",
            description: "Dove si svolgerà l'assistenza",
            autoFocus: false,
            validation: {
              required: true,
            },
          },
        ],
        nextStep: "services",
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
              min: new Date(new Date().setDate(new Date().getDate() + 1))
                .toISOString()
                .split("T")[0],
              max: new Date(new Date().setMonth(new Date().getMonth() + 3))
                .toISOString()
                .split("T")[0],
            },
            min: new Date(new Date().setDate(new Date().getDate() + 1))
              .toISOString()
              .split("T")[0],
            max: new Date(new Date().setMonth(new Date().getMonth() + 3))
              .toISOString()
              .split("T")[0],
            autoFocus: true,
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
            autoFocus: false,
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
        component: Services,
        note: "Seleziona i servizi e mansioni per ogni giorno scelto.",
        nextStep: "",
      },
    ],
    initialStepId: "welcome",
    onComplete: async () => {
      console.log("Availability flow completed");
      onComplete();
    },
  };
  const { setAnswers, state, currentStep, next, back } = useMultiStepFlow({
    role: config.role,
    steps: config.steps,
    initialStepId: config.initialStepId,
    onComplete,
  } as any);
  const [address, setAddress] = useState<any>(undefined);
  const { handleSubmit, reset, getValues } = useForm({
    defaultValues: { ...state.answers },
  });

  const getAddress = async () => {
    try {
      const id = (await UserService.getUser())?.id;
      if (!id) throw new Error("User is not logged in or id is not available");
      const { data: details } = (await ApiService.get(
        apiConsumer.DETAILS(id),
      )) as {
        data: any;
      };
      const addr = details?.address;
      setAddress(addr);
      // Preserve any current form values (so user input like date isn't overwritten)
      const current = getValues();
      reset({ ...(current || {}), address: addr });
      // Keep the multi-step flow answers in sync using current values
      setAnswers({ ...(current || {}), address: addr });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getAddress();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!currentStep) return null;
  const onNext = async (values: { [key: string]: unknown }) => {
    // values are validated by react-hook-form
    await next(currentStep, values);
  };
  return (
    <div className="mx-auto w-full max-w-md">
      <form onSubmit={handleSubmit(onNext)} className="flex flex-col gap-5">
        <Step
          currentStep={currentStep}
          state={state}
          config={config}
          setAnswers={(...args) => {
            setAnswers(...args);
          }}
        />
        {currentStep.note && (
          <div className="text-zinc-500  text-sm flex items-start gap-3">
            <InformationCircleIcon className="text-zinc-500 h-6 w-10" />
            {currentStep.note}
          </div>
        )}
        <div className="flex gap-2 flex-wrap">
          <Button
            className={clsx(
              "border-2 flex-1 py-3 rounded-full",
              config.role === RolesEnum.VIGIL
                ? "border-vigil-orange"
                : "border-consumer-blue",
            )}
            type="button"
            onClick={back}
            label="Indietro"
          ></Button>
          <Button
            label="Avanti"
            className={clsx(
              "flex-1 py-3 rounded-full",
              config.role === RolesEnum.VIGIL
                ? "bg-vigil-orange"
                : "bg-consumer-blue text-white",
            )}
            type="submit"
          ></Button>
        </div>
      </form>
    </div>
  );
}
