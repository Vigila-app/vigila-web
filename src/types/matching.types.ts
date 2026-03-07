/**
 * Matching API Type Definitions
 *
 * These types define the structure for the Vigil matching request and response.
 */

import { ServiceCatalogTypeEnum } from "@/src/enums/services.enums";
import { WeekdayEnum } from "@/src/types/calendar.types";

/**
 * A single schedule entry for a specific day of the week.
 * Key is the weekday number (0=Sunday, 1=Monday, ..., 6=Saturday).
 */
export interface ScheduleEntryI {
  start: string; // HH:MM format, e.g. "09:00"
  end: string; // HH:MM format, e.g. "13:00"
  service: ServiceCatalogTypeEnum; // e.g. "light_assistance"
}

/**
 * Matching request body sent by the Consumer.
 */
export interface MatchingRequestI {
  selectedDays: WeekdayEnum[]; // Array of weekday numbers (0=Sunday, ..., 6=Saturday)
  schedule: Partial<Record<string, ScheduleEntryI>>; // Key is weekday as string
  dates: {
    startDate: string; // ISO date YYYY-MM-DD
    endDate: string; // ISO date YYYY-MM-DD
  };
  address: {
    postcode: string;
    road?: string;
    town?: string;
    state?: string;
    county?: string;
    country?: string;
    country_code?: string;
    [key: string]: string | undefined;
  };
}

/**
 * A matched Vigil entry with scoring metadata.
 * Only contains public-safe fields (no PII).
 */
export interface MatchedVigilI {
  id: string;
  displayName?: string;
  gender?: string;
  status: string;
  cap?: string[];
  averageRating: number;
  reviewCount: number;
  compatibleSlots: number;
  totalSlots: number;
}

/**
 * Matching API response body.
 */
export interface MatchingResponseI {
  code: number | string;
  success: boolean;
  data: MatchedVigilI[];
  perfectMatch?: boolean;
  totalSlots?: number;
  message?: string;
}
