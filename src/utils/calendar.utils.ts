/**
 * Calendar Utility Functions
 * 
 * Provides utility functions for working with calendar,
 * availability rules, and time slots.
 */

import { WeekdayEnum } from "@/src/types/calendar.types";

/**
 * Get weekday name from enum value
 */
export const getWeekdayName = (weekday: WeekdayEnum): string => {
  const weekdayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return weekdayNames[weekday] || "Unknown";
};

/**
 * Get Italian weekday name from enum value
 */
export const getWeekdayNameIT = (weekday: WeekdayEnum): string => {
  const weekdayNames = [
    "Domenica",
    "Lunedì",
    "Martedì",
    "Mercoledì",
    "Giovedì",
    "Venerdì",
    "Sabato",
  ];
  return weekdayNames[weekday] || "Sconosciuto";
};

/**
 * Format hour to display string (e.g., "9:00", "14:00")
 */
export const formatHour = (hour: number): string => {
  return `${hour.toString().padStart(2, "0")}:00`;
};

/**
 * Format time range (e.g., "9:00 - 17:00")
 */
export const formatTimeRange = (startHour: number, endHour: number): string => {
  return `${formatHour(startHour)} - ${formatHour(endHour)}`;
};

/**
 * Format date to YYYY-MM-DD
 */
export const formatDateToISO = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

/**
 * Format datetime to ISO string (for unavailabilities)
 */
export const formatDateTimeToISO = (date: Date): string => {
  return date.toISOString();
};

/**
 * Parse ISO date string to Date object
 */
export const parseISODate = (dateStr: string): Date => {
  return new Date(dateStr);
};

/**
 * Get date range (start and end dates)
 */
export const getDateRange = (days: number): { startDate: string; endDate: string } => {
  const today = new Date();
  const futureDate = new Date();
  futureDate.setDate(today.getDate() + days);
  
  return {
    startDate: formatDateToISO(today),
    endDate: formatDateToISO(futureDate),
  };
};

/**
 * Check if a date is in the past
 */
export const isDateInPast = (dateStr: string): boolean => {
  const date = parseISODate(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today;
};

/**
 * Get current weekday as enum
 */
export const getCurrentWeekday = (): WeekdayEnum => {
  return new Date().getDay() as WeekdayEnum;
};

/**
 * Validate hour range
 */
export const isValidHourRange = (startHour: number, endHour: number): boolean => {
  return (
    startHour >= 0 &&
    startHour <= 23 &&
    endHour >= 1 &&
    endHour <= 24 &&
    endHour > startHour
  );
};

/**
 * Validate date range
 */
export const isValidDateRange = (startDate: string, endDate: string): boolean => {
  const start = parseISODate(startDate);
  const end = parseISODate(endDate);
  return end >= start;
};

/**
 * Get hours array for select options
 */
export const getHoursArray = (from: number = 0, to: number = 24): number[] => {
  const hours: number[] = [];
  for (let i = from; i < to; i++) {
    hours.push(i);
  }
  return hours;
};

/**
 * Get weekdays array for select options
 */
export const getWeekdaysArray = (): Array<{ value: WeekdayEnum; label: string; labelIT: string }> => {
  return [
    { value: WeekdayEnum.SUNDAY, label: getWeekdayName(WeekdayEnum.SUNDAY), labelIT: getWeekdayNameIT(WeekdayEnum.SUNDAY) },
    { value: WeekdayEnum.MONDAY, label: getWeekdayName(WeekdayEnum.MONDAY), labelIT: getWeekdayNameIT(WeekdayEnum.MONDAY) },
    { value: WeekdayEnum.TUESDAY, label: getWeekdayName(WeekdayEnum.TUESDAY), labelIT: getWeekdayNameIT(WeekdayEnum.TUESDAY) },
    { value: WeekdayEnum.WEDNESDAY, label: getWeekdayName(WeekdayEnum.WEDNESDAY), labelIT: getWeekdayNameIT(WeekdayEnum.WEDNESDAY) },
    { value: WeekdayEnum.THURSDAY, label: getWeekdayName(WeekdayEnum.THURSDAY), labelIT: getWeekdayNameIT(WeekdayEnum.THURSDAY) },
    { value: WeekdayEnum.FRIDAY, label: getWeekdayName(WeekdayEnum.FRIDAY), labelIT: getWeekdayNameIT(WeekdayEnum.FRIDAY) },
    { value: WeekdayEnum.SATURDAY, label: getWeekdayName(WeekdayEnum.SATURDAY), labelIT: getWeekdayNameIT(WeekdayEnum.SATURDAY) },
  ];
};

/**
 * Calculate duration in hours between two datetime strings
 */
export const calculateDurationHours = (startAt: string, endAt: string): number => {
  const start = parseISODate(startAt);
  const end = parseISODate(endAt);
  const diffMs = end.getTime() - start.getTime();
  return Math.round(diffMs / (1000 * 60 * 60));
};
