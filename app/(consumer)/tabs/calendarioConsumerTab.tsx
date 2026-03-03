"use client";

import { AgendaItem } from "@/components/calendar-demo/AgendaItem";
import { CalendarStrip } from "@/components/calendar-demo/CalendarStrip";
import { ConsumerCalendarResponseI } from "@/src/types/calendar.types";
import { CalendarService } from "@/src/services";
import { useCallback } from "react";
import ModalBase from "@/components/@core/modal/modalBase.component";
import BookingDetailsComponent from "@/components/bookings/bookingDetails.component";
import { useCalendar } from "@/src/hooks/useCalendar";
import { CalendarActionButtons } from "@/components/calendar-demo/CalendarActionButtons";

const INITIAL_DATA: ConsumerCalendarResponseI = {
  bookings: [],
};

export default function CalendarioTab() {
  const fetchData = useCallback(
    (from: Date, to: Date) => CalendarService.getConsumerCalendar(from, to),
    [],
  );

  const {
    daysToShow,
    selectedDate,
    setSelectedDate,
    isLoading,
    handleNextWeek,
    handlePrevWeek,
    currentMonthLabel,
    handleBookingClick,
    groupedWeeks,
    activeEventDates,
    selectedBookingId,
    modalId,
  } = useCalendar<ConsumerCalendarResponseI>({
    fetchData,
    modalId: "consumer-booking-details-modal",
    initialData: INITIAL_DATA,
  });
  return (
    <>
      <CalendarStrip
        days={daysToShow}
        selectedDate={selectedDate}
        eventsDates={activeEventDates} 
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
                  <AgendaItem
                    key={event.id}
                    event={event}
                    selectedDate={selectedDate}
                    onBookingClick={handleBookingClick}
                  />
                ))
              ) : (
                <p className="p-4 text-center text-gray-400 text-sm italic">
                  Nessun impegno previsto
                </p>
              )}
            </div>
          </div>
        ))}
        <CalendarActionButtons
          onAddVisit={() => {}}
          onEditRecurrence={() => {}}
        />
      </div>

      {selectedBookingId && (
        <ModalBase modalId={modalId} closable title="Dettagli Prenotazione">
          <BookingDetailsComponent bookingId={selectedBookingId} isModal={true} />
        </ModalBase>
      )}
    </>
  );
}
