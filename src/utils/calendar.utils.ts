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
 * Format time to display string (e.g., "9:00", "14:15")
 * Accepts both number (hour as 0-23) and TIME format strings (HH:MM or HH:MM:SS)
 */
export const formatHour = (time: number | string): string => {
  if (typeof time === "number") {
    return `${time.toString().padStart(2, "0")}:00`;
  }
  // TIME format string (HH:MM:SS or HH:MM) - extract HH:MM
  return time.substring(0, 5);
};

/**
 * Format time range (e.g., "9:00 - 17:15")
 * Handles both number hours (0-23) and TIME strings (HH:MM or HH:MM:SS)
 */
export const formatTimeRange = (
  startTime: number | string,
  endTime: number | string,
): string => {
  const formatTime = (time: number | string): string => {
    if (typeof time === "number") {
      return formatHour(time);
    }
    // TIME format string (HH:MM:SS or HH:MM) - extract HH:MM
    return time.substring(0, 5);
  };

  return `${formatTime(startTime)} - ${formatTime(endTime)}`;
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
export const getDateRange = (
  days: number,
): { startDate: string; endDate: string } => {
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
 * Validate if time components are valid
 */
export const isValidTimeComponents = (
  hour: number,
  minute: number,
): boolean => {
  return hour >= 0 && hour <= 23 && minute >= 0 && minute <= 59;
};

/**
 * Validate hour range (for integer hours)
 */
export const isValidHourRange = (
  startHour: number,
  endHour: number,
): boolean => {
  return (
    startHour >= 0 &&
    startHour <= 23 &&
    endHour >= 1 &&
    endHour <= 24 &&
    endHour > startHour
  );
};

/**
 * Compare two TIME format strings (HH:MM)
 * Returns: -1 if timeA < timeB, 0 if equal, 1 if timeA > timeB
 */
export const compareTimeStrings = (timeA: string, timeB: string): number => {
  // Extract HH:MM format (works for both HH:MM and HH:MM:SS)
  const a = timeA.substring(0, 5);
  const b = timeB.substring(0, 5);

  if (a < b) return -1;
  if (a > b) return 1;
  return 0;
};

/**
 * Validate date range
 */
export const isValidDateRange = (
  startDate: string,
  endDate: string,
): boolean => {
  const start = parseISODate(startDate);
  const end = parseISODate(endDate);
  return end >= start;
};

/**
 * Get hours array for select options (legacy - for integer hours only)
 */
export const getHoursArray = (from: number = 0, to: number = 24): number[] => {
  const hours: number[] = [];
  for (let i = from; i < to; i++) {
    hours.push(i);
  }
  return hours;
};

/**
 * Get time slots array for select options (HH:MM format)
 * @param stepMinutes - interval between time slots (default: 15 minutes)
 * @param from - start hour (default: 0)
 * @param to - end hour (default: 24)
 */
export const getTimeSlots = (
  stepMinutes: number = 15,
  from: number = 0,
  to: number = 24,
): string[] => {
  const slots: string[] = [];
  for (let hour = from; hour < to; hour++) {
    for (let minute = 0; minute < 60; minute += stepMinutes) {
      const timeStr = `${hour.toString().padStart(2, "0")}:${minute
        .toString()
        .padStart(2, "0")}`;
      slots.push(timeStr);
    }
  }
  return slots;
};

/**
 * Get weekdays array for select options
 */
export const getWeekdaysArray = (): Array<{
  value: WeekdayEnum;
  label: string;
  labelIT: string;
}> => {
  return [
    {
      value: WeekdayEnum.SUNDAY,
      label: getWeekdayName(WeekdayEnum.SUNDAY),
      labelIT: getWeekdayNameIT(WeekdayEnum.SUNDAY),
    },
    {
      value: WeekdayEnum.MONDAY,
      label: getWeekdayName(WeekdayEnum.MONDAY),
      labelIT: getWeekdayNameIT(WeekdayEnum.MONDAY),
    },
    {
      value: WeekdayEnum.TUESDAY,
      label: getWeekdayName(WeekdayEnum.TUESDAY),
      labelIT: getWeekdayNameIT(WeekdayEnum.TUESDAY),
    },
    {
      value: WeekdayEnum.WEDNESDAY,
      label: getWeekdayName(WeekdayEnum.WEDNESDAY),
      labelIT: getWeekdayNameIT(WeekdayEnum.WEDNESDAY),
    },
    {
      value: WeekdayEnum.THURSDAY,
      label: getWeekdayName(WeekdayEnum.THURSDAY),
      labelIT: getWeekdayNameIT(WeekdayEnum.THURSDAY),
    },
    {
      value: WeekdayEnum.FRIDAY,
      label: getWeekdayName(WeekdayEnum.FRIDAY),
      labelIT: getWeekdayNameIT(WeekdayEnum.FRIDAY),
    },
    {
      value: WeekdayEnum.SATURDAY,
      label: getWeekdayName(WeekdayEnum.SATURDAY),
      labelIT: getWeekdayNameIT(WeekdayEnum.SATURDAY),
    },
  ];
};

/**
 * Calculate duration between two TIME format strings (HH:MM)
 * Returns duration in minutes
 */
export const calculateDurationMinutes = (
  startTime: string,
  endTime: string,
): number => {
  const startResult = parseTimeString(startTime);
  const endResult = parseTimeString(endTime);

  if (startResult.error || endResult.error) {
    return 0;
  }

  const startTotalMinutes = startResult.hour! * 60 + startResult.minute!;
  const endTotalMinutes = endResult.hour! * 60 + endResult.minute!;

  return endTotalMinutes - startTotalMinutes;
};

/**
 * Parse TIME format (HH:MM or HH:MM:SS) and return time components
 */
export const parseTimeString = (
  timeStr: string,
): { hour: number | null; minute: number | null; error?: string } => {
  // Accepts both HH:MM:SS and HH:MM formats
  const timeRegex = /^(\d{2}):(\d{2})(?::(\d{2}))?$/;
  const match = timeStr.match(timeRegex);

  if (!match) {
    return {
      hour: null,
      minute: null,
      error:
        "Invalid TIME format. Use HH:MM or HH:MM:SS (e.g., '09:00' or '09:15:30')",
    };
  }

  return {
    hour: parseInt(match[1], 10),
    minute: parseInt(match[2], 10),
  };
};

/**
 * Parse TIME format (HH:MM:SS) and return hour (deprecated - use parseTimeString)
 * Kept for backward compatibility
 */
export const parseTimeStringToHour = (
  timeStr: string,
): { hour: number | null; error?: string } => {
  const result = parseTimeString(timeStr);
  return {
    hour: result.hour,
    error: result.error,
  };
};

/**
 * Validate TIME range (start < end)
 * Accepts TIME format strings (HH:MM or HH:MM:SS)
 */
export const isValidTimeRange = (
  startTime: string,
  endTime: string,
): { valid: boolean; error?: string } => {
  const startResult = parseTimeString(startTime);
  const endResult = parseTimeString(endTime);

  if (startResult.error) return { valid: false, error: startResult.error };
  if (endResult.error) return { valid: false, error: endResult.error };

  if (!isValidTimeComponents(startResult.hour!, startResult.minute!)) {
    return {
      valid: false,
      error: "start_time must be between 00:00 and 23:59",
    };
  }

  if (!isValidTimeComponents(endResult.hour!, endResult.minute!)) {
    return {
      valid: false,
      error: "end_time must be between 00:00 and 23:59",
    };
  }

  const comparison = compareTimeStrings(startTime, endTime);
  if (comparison >= 0) {
    return {
      valid: false,
      error: "end_time must be after start_time",
    };
  }

  return { valid: true };
};

/**
 * Validate datetime range for unavailabilities
 */
export const isValidUnavailabilityDateRange = (
  startAt: string,
  endAt: string,
): { valid: boolean; error?: string } => {
  const start = parseISODate(startAt);
  const end = parseISODate(endAt);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return { valid: false, error: "Invalid date format" };
  }

  if (end <= start) {
    return { valid: false, error: "end_at must be after start_at" };
  }

  return { valid: true };
};

/**
 * Validate availability rule dates
 */
export const isValidAvailabilityRuleDateRange = (
  validFrom: string,
  validTo?: string | null,
): { valid: boolean; error?: string } => {
  const from = parseISODate(validFrom);

  if (isNaN(from.getTime())) {
    return { valid: false, error: "Invalid valid_from date format" };
  }

  if (validTo) {
    const to = parseISODate(validTo);
    if (isNaN(to.getTime())) {
      return { valid: false, error: "Invalid valid_to date format" };
    }
    if (to <= from) {
      return { valid: false, error: "valid_to must be after valid_from" };
    }
  }

  return { valid: true };
};

/**
 * Check if two time slots overlap
 * Slots overlap if they share any time within the same day
 * Example: 07:00-15:00 and 12:00-14:00 overlap
 * @param start1 - Start time of first slot (HH:MM format)
 * @param end1 - End time of first slot (HH:MM format)
 * @param start2 - Start time of second slot (HH:MM format)
 * @param end2 - End time of second slot (HH:MM format)
 * @returns true if slots overlap, false otherwise
 */
export const slotsOverlap = (
  start1: string,
  end1: string,
  start2: string,
  end2: string,
): boolean => {
  // Two intervals overlap if: start1 < end2 AND start2 < end1
  return (
    compareTimeStrings(start1, end2) < 0 && compareTimeStrings(start2, end1) < 0
  );
};
export const dateRangesOverlap = (
  from1: string, to1: string | null | undefined,
  from2: string, to2: string | null | undefined
): boolean => {
  const end1 = to1 || "9999-12-31"; 
  const end2 = to2 || "9999-12-31";
  
  return from1 <= end2 && from2 <= end1;
};


/**
 * Calculate duration in hours between two ISO datetime strings
 * Returns duration rounded to nearest hour
 */
export const calculateDurationHours = (
  startAt: string,
  endAt: string,
): number => {
  const start = parseISODate(startAt);
  const end = parseISODate(endAt);
  const diffMs = end.getTime() - start.getTime();
  return Math.round(diffMs / (1000 * 60 * 60));
};
