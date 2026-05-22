import { useEffect, useMemo, useRef, useState } from "react";
import clsx from "clsx";
import { RolesEnum } from "@/src/enums/roles.enums";
import { CurrentDay } from "./CurrentDay";
import { SelectedDays } from "./SelectedDays";
import { ServiceDayForm } from "./ServiceDayForm";

export const dayNames = [
  "Domenica",
  "Lunedì",
  "Martedì",
  "Mercoledì",
  "Giovedì",
  "Venerdì",
  "Sabato",
];

export const Services = ({
  answers,
  setAnswers,
  role,
  isLastStep,
}: {
  answers?: Record<string, any>;
  setAnswers?: (
    updater:
      | Record<string, any>
      | ((prev: Record<string, any>) => Record<string, any>),
  ) => void;
  role?: RolesEnum;
  isLastStep?: boolean;
}) => {
  const selectedDays = useMemo(
    () =>
      Array.from(
        new Set(
          (answers?.availabilityRules || []).map((r: any) => Number(r.weekday)),
        ),
      ),
    [answers?.availabilityRules],
  ) as number[];

  const isHydratingDayRef = useRef(false);

  const [currentDayIdx, setCurrentDayIdx] = useState(() => {
    const initialIdx = Number(answers?.servicesCurrentDayIdx ?? 0);
    return Number.isFinite(initialIdx) && initialIdx >= 0 ? initialIdx : 0;
  });
  const isLastDay = currentDayIdx === selectedDays.length - 1;

  useEffect(() => {
    const nextIdx = Number(answers?.servicesCurrentDayIdx ?? 0);
    setCurrentDayIdx(Number.isFinite(nextIdx) && nextIdx >= 0 ? nextIdx : 0);
  }, [answers?.servicesCurrentDayIdx]);

  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [car, setCar] = useState(false);
  const [notes, setNotes] = useState("");

  const colorClasses = {
    bg: "bg-consumer-blue",
    bgLight: "bg-consumer-light-blue",
    text: "text-consumer-blue",
    border: "border-consumer-light-blue",
    hoverBorder: "hover:border-consumer-light-blue",
    hoverText: "hover:text-consumer-blue",
  };
  useEffect(() => {
    const day = selectedDays[currentDayIdx];
    isHydratingDayRef.current = true;
    const saved = answers?.services?.[day];
    if (saved) {
      setSelectedService(saved.services);
      setCar(!!saved.car);
      setNotes(saved.notes || "");
    } else {
      setSelectedService(null);
      setCar(false);
      setNotes("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentDayIdx, selectedDays.join("-")]);

  useEffect(() => {
    if (isHydratingDayRef.current) {
      isHydratingDayRef.current = false;
      return;
    }
    const day = selectedDays[currentDayIdx];
    if (!setAnswers || day === undefined) return;

    setAnswers((prev: Record<string, any>) => {
      const next = { ...prev };
      next.services = { ...next.services };
      next.services[day] = {
        weekday: Number(day),
        services: selectedService,
        car: !!car,
        notes: notes || "",
      };
      return next;
    });
  }, [car, currentDayIdx, notes, selectedDays, selectedService, setAnswers]);

  const bookingType = answers?.["booking-type"];
  const isSingleDate = bookingType === "occasional" || bookingType === "trial";

  return (
    <div className="bg-zinc-200 p-4">
      {!isSingleDate && (
        <div className="bg-white rounded-xl  mb-4">
          <div className="px-4 pt-3 text-sm text-zinc-500">
            Questi sono i giorni della tua disponibilità. Compila i servizi uno
            alla volta. Puoi andare avanti nei giorni premendo &quot;Prossimo
            giorno&quot; in fondo alla pagina.
          </div>
          <div className="flex gap-2 flex-wrap p-3 pt-2">
            <SelectedDays
              answers={answers}
              selectedDays={selectedDays}
              currentDayIdx={currentDayIdx}
              setCurrentDayIdx={setCurrentDayIdx}
              isInteractive={false}
              classes={colorClasses}
            />
          </div>
        </div>
      )}

      <div className="bg-white p-4 rounded-2xl">
        <CurrentDay
          answers={answers}
          selectedDays={selectedDays}
          currentDayIdx={currentDayIdx}
        />
        <div className="mb-4">
          <div className="font-semibold mb-2">Servizi</div>
          <p className="text-sm text-zinc-500">
            Scegli il servizio principale per questo giorno. Puoi aggiungere
            accompagnamento in auto e note opzionali.
          </p>
        </div>

        <ServiceDayForm
          selectedServiceName={selectedService}
          car={car}
          notes={notes}
          onServiceChange={setSelectedService}
          onCarChange={setCar}
          onNotesChange={setNotes}
          role={role}
          notesInputId="service-notes"
        />

        <div className="mt-6 flex items-center justify-between gap-3">
          <p className="text-xs text-zinc-500 self-center">
            Premi Avanti per salvare questo giorno e passare al successivo.
          </p>
          {isLastStep && isLastDay && (
            <span className="text-xs font-medium text-consumer-blue">
              Ultimo giorno disponibile
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
