"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarEventI } from "@/src/types/calendar.types";
import {
  getMonday,
  generateTwoWeeksDays,
  formatDateToISO,
  getGroupedAgenda,
} from "@/src/utils/calendar.utils";
import { useModalStore } from "@/src/store/modal/modal.store";

interface CalendarDataBase {
  bookings: CalendarEventI[];
}

interface UseCalendarOptions<T extends CalendarDataBase> {
  /** Function to fetch calendar data for a date range */
  fetchData: (from: Date, to: Date) => Promise<T>;
  /** Unique modal ID for booking details */
  modalId: string;
  /** Initial empty state for the calendar data */
  initialData: T;
  /** Optional: extract unavailabilities from data for grouped agenda */
  getUnavailabilities?: (data: T) => CalendarEventI[];
}

export function useCalendar<T extends CalendarDataBase>({
  fetchData,
  modalId,
  initialData,
  getUnavailabilities,
}: UseCalendarOptions<T>) {
  const [pivotMonday, setPivotMonday] = useState(getMonday(new Date()));
  const [calendarData, setCalendarData] = useState<T>(initialData);
  const [selectedDate, setSelectedDate] = useState(formatDateToISO(new Date()));
  const [isLoading, setIsLoading] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const { openModal } = useModalStore();

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

  useEffect(() => {
    const fetchCalendarData = async () => {
      setIsLoading(true);

      const toDate = new Date(pivotMonday);
      toDate.setDate(pivotMonday.getDate() + 13);

      try {
        const data = await fetchData(pivotMonday, toDate);
        setCalendarData(data);
      } catch (error) {
        console.error("Failed to fetch calendar data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCalendarData();
  }, [pivotMonday, fetchData]);

  const handleBookingClick = (bookingId: string) => {
    setSelectedBookingId(bookingId);
    openModal(modalId);
  };

  const groupedWeeks = useMemo(() => {
    const unavailabilities = getUnavailabilities?.(calendarData) ?? [];
    return getGroupedAgenda(calendarData.bookings, pivotMonday, unavailabilities);
  }, [calendarData, pivotMonday, getUnavailabilities]);

  const activeEventDates = useMemo(() => {
    return calendarData.bookings.map((booking) => booking.start.split("T")[0]);
  }, [calendarData.bookings]);

  return {
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
  };
}
