"use client";

import { AgendaItem } from "@/components/calendar-demo/AgendaItem";
import { CalendarStrip } from "@/components/calendar-demo/CalendarStrip";
import { ConsumerCalendarResponseI, } from "@/src/types/calendar.types";
import {
  getMonday,
  generateTwoWeeksDays,
  formatDateToISO,
  getGroupedAgenda,
} from "@/src/utils/calendar.utils";
import { CalendarService } from "@/src/services";
import { useEffect, useMemo, useState } from "react";

export default function CalendarioTab() {
  const [pivotMonday, setPivotMonday] = useState(getMonday(new Date()));
  const [calendarData, setCalendarData] = useState<ConsumerCalendarResponseI>({
    bookings: [],
   
  });
  const [selectedDate, setSelectedDate] = useState(formatDateToISO(new Date()));
  const [isLoading, setIsLoading] = useState(false);

  const daysToShow = useMemo(
    () => generateTwoWeeksDays(pivotMonday),
    [pivotMonday],
  );

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

  const currentMonthLabel = pivotMonday.toLocaleDateString("it-IT", {
    month: "long",
    year: "numeric",
  });

  // 1. Spostiamo la fetch DENTRO useEffect per evitare warning di dipendenze
  useEffect(() => {
    const fetchCalendarData = async () => {
      setIsLoading(true);

      const toDate = new Date(pivotMonday);
      toDate.setDate(pivotMonday.getDate() + 13);

      try {
        const data = await CalendarService.getConsumerCalendar(
          pivotMonday,
          toDate,
        );
        setCalendarData(data);

        // if (result?.success || result?.data) {
        //   setCalendarData(result?.data || result);
        // }
      } catch (error) {
        console.error("Failed to fetch calendar data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCalendarData();
  }, [pivotMonday]); // Ora dipende solo da pivotMonday, pulitissimo.

  const groupedWeeks = useMemo(() => {
    return getGroupedAgenda(
      calendarData.bookings,
      pivotMonday,
    );
  }, [calendarData, pivotMonday]);

  // 2. Calcoliamo i pallini dinamicamente in base alle prenotazioni
  const activeEventDates = useMemo(() => {
    return calendarData.bookings.map((booking) => {
      return booking.start.split("T")[0];
    });
  }, [calendarData.bookings]);
  return (
    <>
      <CalendarStrip
        days={daysToShow}
        selectedDate={selectedDate}
        eventsDates={activeEventDates} // <-- Usiamo i dati reali qui
        onDateClick={setSelectedDate}
        onNextWeek={handleNextWeek}
        onPrevWeek={handlePrevWeek}
        currentMonthLabel={currentMonthLabel}
      />

      {/* 3. Aggiunto effetto visivo quando isLoading è true */}
      <div
        className={`flex-1 overflow-y-auto transition-opacity duration-300 ${isLoading ? "opacity-50 pointer-events-none" : "opacity-100"}`}>
        {groupedWeeks.map((week, index) => (
          <div key={index} className="mb-6">
            <div className="flex justify-between items-center px-4 py-2 bg-gray-100 text-sm">
              <span className="font-bold text-gray-700">{week.title}</span>
              <span className="text-gray-500">{week.rangeLabel}</span>
            </div>

            <div className="divide-y divide-gray-200">
              {week.events.length > 0 ? (
                week.events.map((event) => (
                  <AgendaItem key={event.id} event={event} />
                ))
              ) : (
                <p className="p-4 text-center text-gray-400 text-sm italic">
                  Nessun impegno previsto
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
