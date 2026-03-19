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

const SERVICE_MANSIONI_MAP: Record<string, string[]> = {
  "Compagnia e conversazione": [
    "Conversazione e ascolto",
    "Lettura libri / giornali",
    "Giochi di società / carte",
    "Guardare TV insieme",
    "Passeggiata leggera",
  ],
  "Assistenza leggera": [
    "Promemoria farmaci",
    "Spesa e commissioni",
    "Preparazione pasti semplici",
    "Accompagnamento Visite",
    "Rassetto e pulizia leggera",
  ],
  "Assistenza alla persona": [
    "Aiuto mobilità",
    "Vestizione / svestizione",
    "Somministrazione pasti",
    "Trasferimento letto / poltrona",
  ],
  "Igiene personale": [
    "Bagno completo",
    "Spugnature a letto",
    "Cambio pannolone",
    "Igiene orale",
    "Cura capelli e barba",
  ],
};

const getVisibleMansioni = (service: string | null): string[] =>
  service ? SERVICE_MANSIONI_MAP[service] || [] : [];

const normalizeMansioniByService = (
  services: string[],
  saved: Record<string, any> | undefined,
): Record<string, string[]> => {
  const savedByService: Record<string, string[]> =
    saved?.mansioniByService && typeof saved.mansioniByService === "object"
      ? saved.mansioniByService
      : {};

  const normalized: Record<string, string[]> = {};
  services.forEach((service) => {
    const allowed = new Set(SERVICE_MANSIONI_MAP[service] || []);
    const fromByService = Array.isArray(savedByService[service])
      ? savedByService[service]
      : [];
    const fromFlat = Array.isArray(saved?.mansioni)
      ? saved.mansioni.filter((m: string) => allowed.has(m))
      : [];
    normalized[service] = Array.from(new Set([...fromByService, ...fromFlat]));
  });

  return normalized;
};

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // derive unique ordered weekdays from answers.availabilityRules
  const selectedDays = useMemo(
    () =>
      Array.from(
        new Set(
          (answers?.availabilityRules || []).map((r: any) => Number(r.weekday)),
        ),
      ),
    [answers?.availabilityRules],
  ) as number[]

  const [currentDayIdx, setCurrentDayIdx] = useState(0);

  useEffect(() => {
    // reset to first day when availabilities change
    setCurrentDayIdx(0);
  }, [selectedDays.length]);

  // per-day local selections
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [activeService, setActiveService] = useState<string | null>(null);
  const [selectedMansioniByService, setSelectedMansioniByService] = useState<
    Record<string, string[]>
  >({});
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
      const loadedServices = Array.isArray(saved.services)
        ? saved.services
        : [];
      setSelectedServices(loadedServices);
      setSelectedMansioniByService(
        normalizeMansioniByService(loadedServices, saved),
      );
      setActiveService((prev) =>
        loadedServices.includes(prev || "")
          ? (prev as string)
          : loadedServices[0] || null,
      );
      setCar(!!saved.car);
      setNotes(saved.notes || "");
    } else {
      setSelectedServices([]);
      setActiveService(null);
      setSelectedMansioniByService({});
      setCar(false);
      setNotes("");
    }
  }, [currentDayIdx, selectedDays.join("-")]);

  if (loading)
    return (
      <div className="text-zinc-500 text-sm">Caricamento disponibilità…</div>
    );
  if (error) return <div className="text-red-500 text-sm">{error}</div>;

  const handleServiceToggle = (serviceName: string, next: boolean) => {
    setSelectedServices((prev) => {
      if (next) {
        const nextServices = Array.from(new Set([...prev, serviceName]));
        setActiveService(serviceName);
        return nextServices;
      }
      const remaining = prev.filter((s) => s !== serviceName);
      if (activeService === serviceName) {
        setActiveService(remaining[0] || null);
      }
      return remaining;
    });
  };

  const toggleMansione = (serviceName: string, label: string) => {
    if (!serviceName) return;
    setSelectedMansioniByService((prev) => {
      const existing = prev[serviceName] || [];
      const nextMansioni = existing.includes(label)
        ? existing.filter((p) => p !== label)
        : [...existing, label];
      return { ...prev, [serviceName]: nextMansioni };
    });
  };

  const saveCurrentDaySelections = () => {
    const day = selectedDays[currentDayIdx];
    if (!setAnswers) return;

    setAnswers((prev: Record<string, any>) => {
      const next = { ...prev };
      next.services = { ...next.services };

      const mansioniAll = Array.from(
        new Set(
          selectedServices.flatMap(
            (service) => selectedMansioniByService[service] || [],
          ),
        ),
      );

      next.services[day] = {
        weekday: Number(day),
        services: selectedServices,
        mansioni: mansioniAll,
        mansioniByService: selectedMansioniByService,
        car: !!car,
        notes: notes || "",
      };
      return next;
    });
  };

  const loadDaySelections = (saved: Record<string, any> | undefined) => {
    const nextServices = Array.isArray(saved?.services) ? saved.services : [];
    setSelectedServices(nextServices);
    setSelectedMansioniByService(
      normalizeMansioniByService(nextServices, saved),
    );
    setActiveService(nextServices[0] || null);
    setCar(!!saved?.car);
    setNotes(saved?.notes || "");
  };

  return (
    <div className="bg-zinc-200 p-4">
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
                checked={selectedServices.includes(srv.name)}
                onChange={(next: boolean) =>
                  handleServiceToggle(srv.name, next)
                }
              />
            ))}
          </div>
        </div>

        {/* Mansioni checkboxes without icons */}
        <div className="mb-4">
          <div className="font-semibold mb-2">Mansioni</div>
          {selectedServices.length === 0 ? (
            <div className="text-sm text-zinc-500">
              Seleziona almeno un servizio per visualizzare le mansioni
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {getVisibleMansioni(activeService).map((label) => {
                const currentService = activeService || "";
                const serviceMansioni =
                  selectedMansioniByService[currentService] || [];
                const isChecked = serviceMansioni.includes(label);
                return (
                  <label
                    key={label}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      toggleMansione(currentService, label);
                    }}
                    className={clsx(
                      "cursor-pointer w-full py-3 text-center rounded-full border-zinc-200 border-1",
                      isChecked
                        ? clsx(colorClasses.border, colorClasses.bgLight)
                        : "border-zinc-200 bg-white",
                    )}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      readOnly
                      className="hidden"
                    />
                    <span>{label}</span>
                  </label>
                );
              })}
            </div>
          )}
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
              L'operatore accompagna con la sua propria auto
            </p>
            <p className={clsx("text-xs", colorClasses.text)}>
              +5 EUR rimborso carburante per visita
            </p>
          </label>
        </div>

        {/* Notes */}
        <div className="mb-4">
          <label className="block font-semibold mb-1">Note</label>
          <textarea
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
