"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import { ChevronRightIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";

// Definizione dei giorni
const DAYS = [
  { label: "Lun", value: "lun" },
  { label: "Mar", value: "mar" },
  { label: "Mer", value: "mer" },
  { label: "Gio", value: "gio" },
  { label: "Ven", value: "ven" },
  { label: "Sab", value: "sab" },
  { label: "Dom", value: "dom" },
];

// Tipo per la gestione degli orari
type TimeSlot = {
  start: string;
  end: string;
};

type ScheduleMap = Record<string, TimeSlot>;

// Componente helper per input data personalizzato
const DateInput = ({
  label,
  value,
  onChange,
  isOptional = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  isOptional?: boolean;
}) => {
  const hiddenInputRef = useRef<HTMLInputElement>(null);

  const handleDisplayClick = () => {
    hiddenInputRef.current?.showPicker?.();
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString + "T00:00:00");
    return new Intl.DateTimeFormat("it-IT", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-semibold text-gray-800">
        {label}
        {isOptional && (
          <span className="text-xs font-normal text-gray-400">
            {" "}
            (opzionale)
          </span>
        )}
      </label>
      <div
        onClick={handleDisplayClick}
        className="w-full p-3 rounded-2xl border border-consumer-blue text-gray-700 text-sm text-center cursor-pointer hover:bg-gray-50 transition-colors bg-white"
      >
        {value ? formatDate(value) : "Seleziona data"}
      </div>
      <input
        ref={hiddenInputRef}
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ display: "none" }}
      />
    </div>
  );
};

export default function RecurringBookingPage() {
  const router = useRouter();

  // STATO
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [schedule, setSchedule] = useState<ScheduleMap>({});
  const [dates, setDates] = useState({ startDate: "", endDate: "" });

  // GESTIONE SELEZIONE GIORNI
  const toggleDay = (dayValue: string) => {
    if (selectedDays.includes(dayValue)) {
      // Rimuovi giorno
      setSelectedDays((prev) => prev.filter((d) => d !== dayValue));
      // Opzionale: Rimuovi orario dalla mappa se vuoi pulire lo stato
      const newSchedule = { ...schedule };
      delete newSchedule[dayValue];
      setSchedule(newSchedule);
    } else {
      // Aggiungi giorno e imposta orario default
      setSelectedDays((prev) => [...prev, dayValue]);
      setSchedule((prev) => ({
        ...prev,
        [dayValue]: { start: "09:00", end: "13:00" }, // Orario default
      }));
    }
  };

  // GESTIONE CAMBIO ORARIO
  const handleTimeChange = (
    day: string,
    type: "start" | "end",
    value: string,
  ) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [type]: value,
      },
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-8 px-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-sm p-6 md:p-8">
        {/* TITOLO E DESCRIZIONE */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Programmazione ricorrenze
          </h1>
          <p className="text-gray-500 text-sm">
            Indicazione generale della tua disponibilità settimanale.
          </p>
        </div>

        {/* 1. SELETTORE GIORNI (PALLINI) */}
        <div className="flex justify-between items-center mb-8 px-2">
          {DAYS.map((day) => {
            const isSelected = selectedDays.includes(day.value);
            return (
              <button
                key={day.value}
                onClick={() => toggleDay(day.value)}
                className={clsx(
                  "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200",
                  isSelected
                    ? "bg-consumer-blue text-white shadow-md scale-105" // Stile Selezionato (Blu)
                    : "bg-white border border-gray-200 text-gray-400 hover:border-consumer-blue hover:text-consumer-blue", // Stile Default
                )}>
                {day.label}
              </button>
            );
          })}
        </div>

        {/* 2. GRIGLIA ORARIA (VISUALIZZAZIONE DINAMICA) */}
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-gray-900 mb-1">
            Griglia oraria settimanale
          </h3>
          <p className="text-xs text-gray-400 mb-4">
            Imposta gli orari per i giorni selezionati
          </p>

          <div className="flex flex-col gap-3">
            {selectedDays.length === 0 && (
              <div className="text-center py-6 border-2 border-dashed border-gray-100 rounded-xl bg-gray-50">
                <span className="text-xs text-gray-400">
                  Nessun giorno selezionato
                </span>
              </div>
            )}

            {/* Ordiniamo i giorni selezionati in base all'ordine in DAYS */}
            {DAYS.filter((d) => selectedDays.includes(d.value)).map((day) => (
              <div
                key={day.value}
                className="flex items-center gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
                {/* Etichetta Giorno */}
                <span className="w-8 text-sm font-medium text-gray-600">
                  {day.label}
                </span>

                {/* Blocco Orario (Simulazione Slider/Input) */}
                <div className="flex-1 bg-gray-100 rounded-full h-10 relative flex items-center px-1">
                  {/* Questo div simula la "pillola" colorata interna */}
                  <div className="w-full h-8 bg-white border border-consumer-blue/30 rounded-full shadow-sm flex items-center justify-center gap-2 px-4 relative overflow-hidden">
                    {/* Sfondo leggero blu per l'area attiva */}
                    <div className="absolute inset-0 bg-consumer-light-blue/20 pointer-events-none" />

                    {/* Input Start */}
                    <input
                      type="time"
                      value={schedule[day.value]?.start}
                      onChange={(e) =>
                        handleTimeChange(day.value, "start", e.target.value)
                      }
                      className="bg-transparent text-xs font-semibold text-consumer-blue focus:outline-none cursor-pointer"
                    />
                    <span className="text-consumer-blue font-bold">-</span>
                    {/* Input End */}
                    <input
                      type="time"
                      value={schedule[day.value]?.end}
                      onChange={(e) =>
                        handleTimeChange(day.value, "end", e.target.value)
                      }
                      className="bg-transparent text-xs font-semibold text-consumer-blue focus:outline-none cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. DATE INIZIO E FINE */}
        <div className="grid grid-cols-2 gap-4 mb-10">
          <DateInput
            label="Data inizio"
            value={dates.startDate}
            onChange={(value) => setDates({ ...dates, startDate: value })}
          />
          <DateInput
            label="Data fine"
            value={dates.endDate}
            onChange={(value) => setDates({ ...dates, endDate: value })}
            isOptional={true}
          />
        </div>

        {/* 4. BOTTONI NAVIGAZIONE */}
        <div className="flex items-center justify-between mt-auto">
          {/* Bottone Indietro */}
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 px-6 py-3 rounded-full border border-consumer-blue text-consumer-blue font-medium hover:bg-consumer-light-blue/10 transition-colors">
            <ArrowLeftIcon className="w-4 h-4" />
            Indietro
          </button>

          {/* Bottone Continua */}
          <button
            onClick={() => {
              console.log({ selectedDays, schedule, dates });
              // router.push("/prossimo-step")
            }}
            disabled={selectedDays.length === 0 || !dates.startDate}
            className={clsx(
              "flex items-center gap-2 px-8 py-3 rounded-full text-white font-medium transition-all shadow-md",
              selectedDays.length > 0 && dates.startDate
                ? "bg-consumer-blue hover:bg-blue-600"
                : "bg-gray-300 cursor-not-allowed shadow-none",
            )}>
            Continua
            <ChevronRightIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
