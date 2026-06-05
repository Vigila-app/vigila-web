"use client";

import { CalendarStrip } from "@/components/calendar-demo/CalendarStrip";
import {
  getMonday,
  generateTwoWeeksDays,
  formatDateToISO,
} from "@/src/utils/calendar.utils";
import { useMemo, useState } from "react";
export default function CalendarPage() {
  const [pivotMonday, setPivotMonday] = useState(getMonday(new Date()));

  // 2. Stato: La data selezionata dall'utente (default oggi)
  const [selectedDate, setSelectedDate] = useState(formatDateToISO(new Date()));

  // 3. Calcolo dei giorni: useMemo evita ricalcoli inutili
  const daysToShow = useMemo(
    () => generateTwoWeeksDays(pivotMonday),
    [pivotMonday],
  );

  // 4. Navigazione di settimana in settimana
  const handleNextWeek = () => {
    setPivotMonday((prev) => {
      const next = new Date(prev);
      next.setDate(prev.getDate() + 7);
      return next;
    });
  };

  const handlePrevWeek = () => {
    setPivotMonday((prev) => {
      const next = new Date(prev);
      next.setDate(prev.getDate() - 7);
      return next;
    });
  };

  // Label per il mese (es: "Febbraio 2026")
  const currentMonthLabel = pivotMonday.toLocaleDateString("it-IT", {
    month: "long",
    year: "numeric",
  });

 
  return (
    <CalendarStrip 
        days={daysToShow}
        selectedDate={selectedDate}
        eventsDates={["2026-02-16", "2026-02-18"]} // Mock data per ora
        onDateClick={setSelectedDate}
        onNextWeek={handleNextWeek}
        onPrevWeek={handlePrevWeek}
        currentMonthLabel={currentMonthLabel}
      />
  );
}
