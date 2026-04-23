import { ComponentType, useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import { RolesEnum } from "@/src/enums/roles.enums";
import { SingleService } from "./SingleService";
import { HeartIcon, UserGroupIcon } from "@heroicons/react/24/outline";
import Caffe from "@/components/svg/Caffe";
import Vasca from "@/components/svg/Vasca";
import { Car } from "@/components/svg";
import { CurrentDay } from "./CurrentDay";
import { SelectedDays } from "./SelectedDays";
export const dayNames = [
  "Domenica",
  "Lunedì",
  "Martedì",
  "Mercoledì",
  "Giovedì",
  "Venerdì",
  "Sabato",
];



const SERVICES = [
  {
    name: "Compagnia e conversazione",
    desc: "Presenza, dialogo e supporto emotivo",
    Icon: Caffe as ComponentType<{ className?: string }>,
    price: 12,
  },
  {
    name: "Assistenza leggera",
    desc: "Supervisione, promemoria farmaci, piccole commissioni",
    Icon: HeartIcon as ComponentType<{ className?: string }>,
    price: 14,
  },
  {
    name: "Assistenza alla persona",
    desc: "Mobiiltà, pasti, vestizione",
    Icon: UserGroupIcon as ComponentType<{ className?: string }>,
    price: 16,
  },
  {
    name: "Igiene personale",
    desc: "Bagno, cambio, cura personale",
    Icon: Vasca as ComponentType<{ className?: string }>,
    price: 18,
  },
];

export const Services = ({
  answers,
  setAnswers,
  role,
}: {
  answers?: Record<string, any>;
  setAnswers?: (
    updater:
      | Record<string, any>
      | ((prev: Record<string, any>) => Record<string, any>),
  ) => void;
  role?: RolesEnum;
}) => {
  // derive unique ordered weekdays from answers.availabilityRules
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

  useEffect(() => {
    // reset to first day when availabilities change

    setCurrentDayIdx(0);
  }, [selectedDays.length]);

  // per-day local selections
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [car, setCar] = useState(false);
  const [notes, setNotes] = useState("");

  const colorClasses = useMemo(() => {
    const vigil = {
      bg: "bg-vigil-orange",
      bgLight: "bg-vigil-light-orange",
      text: "text-vigil-orange",
      border: "border-vigil-orange",
      hoverBorder: "hover:border-vigil-light-orange",
      hoverText: "hover:text-vigil-orange",
    };
    const consumer = {
      bg: "bg-consumer-blue",
      bgLight: "bg-consumer-light-blue",
      text: "text-consumer-blue",
      border: "border-consumer-light-blue",
      hoverBorder: "hover:border-consumer-light-blue",
      hoverText: "hover:text-consumer-blue",
    };
    return role === RolesEnum.CONSUMER ? consumer : vigil;
  }, [role]);

  // load per-day values when current day changes
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

  const saveCurrentDaySelections = () => {
    const day = selectedDays[currentDayIdx];
    if (!setAnswers) return;

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
  };

  const loadDaySelections = (saved: Record<string, any> | undefined) => {
    setSelectedService(saved?.services);
    setCar(!!saved?.car);
    setNotes(saved?.notes || "");
  };

  const bookingType = answers?.["booking-type"];
  const isSingleDate = bookingType === "occasional" || bookingType === "trial";

  return (
    <div className="bg-zinc-200 p-4">
      {!isSingleDate && (
        <div className="bg-white rounded-full mb-4">
          <div className="flex gap-2 flex-wrap p-3">
            <SelectedDays
              answers={answers}
              selectedDays={selectedDays}
              currentDayIdx={currentDayIdx}
              setCurrentDayIdx={setCurrentDayIdx}
              classes={colorClasses}
            />
          </div>
        </div>
      )}

      {/* Service checkboxes with icons */}
      <div className="bg-white p-4 rounded-2xl">
        <CurrentDay
          answers={answers}
          selectedDays={selectedDays}
          currentDayIdx={currentDayIdx}
        />
        <div className="mb-4">
          <div className="font-semibold mb-2">Servizi</div>
          <div className="grid grid-cols-2 gap-3">
            {SERVICES.map((srv) => (
              <SingleService
                key={srv.name}
                {...srv}
                checked={selectedService === srv.name}
                onChange={(next: boolean) => setSelectedService(srv.name)}
              />
            ))}
          </div>
        </div>

        {/* Accompagnamento in auto */}
        <div className="mb-4">
          <label
            className={clsx(
              "block cursor-pointer w-full p-3 rounded-2xl",
              car
                ? clsx(colorClasses.border, colorClasses.bgLight)
                : "border-zinc-200 bg-white",
            )}
          >
            <input
              type="checkbox"
              checked={car}
              onChange={() => setCar((v) => !v)}
              className="hidden"
            />
            <h3 className="flex items-center gap-2 w-full font-bold text-lg">
              <Car className={clsx("w-5 h-5", colorClasses.text)} />
              <span>Accompagnamento in auto</span>
            </h3>
            <p className="text-md text-zinc-400">
              L&apos;operatore accompagna con la sua propria auto
            </p>
            <p className={clsx("text-xs", colorClasses.text)}>
              +5 EUR rimborso carburante per visita
            </p>
          </label>
        </div>

        {/* Notes */}
        <div className="mb-4">
          <label htmlFor="service-notes" className="block font-semibold mb-1">
            Note
          </label>
          <textarea
            id="service-notes"
            className="w-full border rounded-md p-2"
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Aggiungi note opzionali..."
          />
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={async () => {
                saveCurrentDaySelections();

                // move to next day or finalize
                if (currentDayIdx < selectedDays.length - 1) {
                  const nextIdx = currentDayIdx + 1;
                  const nextDay = selectedDays[nextIdx];
                  // load saved values for next day (if any) so UI reflects them immediately
                  const savedNext = answers?.services?.[nextDay];
                  loadDaySelections(savedNext);
                  setCurrentDayIdx(nextIdx);
                } else {
                  // last day: finalize / salva ricorrenza
                  console.log("All days filled, salva ricorrenza");
                  console.log(answers);
                }
              }}
              className={clsx(
                "px-4 py-2 rounded text-white disabled:opacity-50",
                colorClasses.bg,
              )}
            >
              {currentDayIdx === selectedDays.length - 1
                ? "Salva ricorrenza"
                : "Prossimo giorno"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
