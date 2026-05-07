import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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

  const [currentDayIdx, setCurrentDayIdx] = useState(0);
  const isLastDay = currentDayIdx === selectedDays.length - 1;

  useEffect(() => {
    setCurrentDayIdx(0);
  }, [selectedDays.length]);

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

  const hasAutoSavedRef = useRef(false);

  useEffect(() => {
    hasAutoSavedRef.current = false;
  }, [isLastStep, selectedDays.join("-")]);

  const saveCurrentDaySelections = useCallback(() => {
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

  const loadDaySelections = (saved: Record<string, any> | undefined) => {
    setSelectedService(saved?.services);
    setCar(!!saved?.car);
    setNotes(saved?.notes || "");
  };

  useEffect(() => {
    if (!isLastStep || !isLastDay) return;
    if (hasAutoSavedRef.current) return;
    hasAutoSavedRef.current = true;
    saveCurrentDaySelections();
  }, [isLastDay, isLastStep, saveCurrentDaySelections]);

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

        <div className="flex justify-between mt-6">
          <div className="flex gap-2">
            <p className="text-xs text-zinc-500 self-center">
              Le scelte vengono salvate quando passi al giorno successivo.
            </p>
            {(!isLastStep || !isLastDay) && (
              <button
                type="button"
                onClick={async () => {
                  saveCurrentDaySelections();
                  if (currentDayIdx < selectedDays.length - 1) {
                    const nextIdx = currentDayIdx + 1;
                    const nextDay = selectedDays[nextIdx];
                    loadDaySelections(answers?.services?.[nextDay]);
                    setCurrentDayIdx(nextIdx);
                  } else {
                    console.log("All days filled, salva ricorrenza");
                    console.log(answers);
                  }
                }}
                className={clsx(
                  "px-4 py-2 rounded text-white disabled:opacity-50",
                  colorClasses.bg,
                )}
              >
                {isLastDay ? "Salva ricorrenza" : "Prossimo giorno"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
