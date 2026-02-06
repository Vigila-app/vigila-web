"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import { RolesEnum } from "@/src/enums/roles.enums"; // Assicurati che il path sia corretto
import { Button } from "@/components";
// Se hai icone specifiche importale, altrimenti le ho lasciate opzionali nel tipo

type BookingOption = {
  label: string;
  value: string;
  description: string;
  icon?: React.ElementType; // Opzionale, se vuoi aggiungere icone
};

const bookingOptions: BookingOption[] = [
  {
    label: "Ricorrente",
    value: "recurring",
    description: "Servizio regolare su più giorni",
  },
  {
    label: "Singola/Occasionale",
    value: "occasional",
    description: "Una volta o occasionalmente",
  },
  {
    label: "Ancora non lo so",
    value: "trial",
    description: "Inizia con una prova",
  },
];

const FirstBookingSelection = () => {
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);

  // Impostiamo il ruolo CONSUMER per attivare lo stile blu definito nel tuo snippet
  const role = RolesEnum.CONSUMER;

  const handleProceed = () => {
    if (!selected) return;

    if (selected === "recurring") {
      //todo pagina con calendario ecc
      router.push("/booking/recurrence");
    } else {
      router.push("/home");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-sm p-6 md:p-8">
      
        <h1 className="text-2xl font-bold text-center mb-8 leading-tight">
          Quale situazione descrive meglio il bisogno?
        </h1>

        <div className="flex flex-col gap-4 mt-2">
          {bookingOptions.map((option) => {
            const isChecked = selected === option.value;

            return (
              <div
                key={option.value}
                onClick={() => setSelected(option.value)}
                className={clsx(
                  "cursor-pointer relative w-full p-4 rounded-2xl border-2 transition-all duration-200 flex flex-col items-center justify-center gap-2 min-h-[100px]",

                  !isChecked &&
                    "bg-white border-gray-200 hover:border-gray-300",

                  isChecked &&
                    role === RolesEnum.CONSUMER &&
                    "border-consumer-blue bg-consumer-light-blue text-consumer-blue ",
                )}>
                <span className="font-medium text-lg text-center">
                  {option.label}
                </span>
                {option.description && (
                  <span className="text-xs text-center opacity-80">
                    {option.description}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-8 flex justify-center w-full">
          <Button action={handleProceed} disabled={!selected} label="Procedi" role={role} />
        </div>
      </div>
    </div>
  );
};

export default FirstBookingSelection;
