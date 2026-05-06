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
 * A single compatible slot occurrence for a matched Vigil.
 * Describes the specific date, time window, and service type that this vigil can cover.
 */
export interface CompatibleSlotI {
  date: string; // ISO date YYYY-MM-DD
  startTime: string; // HH:MM format, e.g. "09:00"
  endTime: string; // HH:MM format, e.g. "13:00"
  service: ServiceCatalogTypeEnum; // ServiceCatalogTypeEnum value, e.g. "light_assistance"
}

/**
 * A requested slot occurrence that no vigil in the result set can cover.
 * Allows consumers to understand which parts of their schedule remain unmatched.
 */
export interface UnmatchedSlotI {
  date: string; // ISO date YYYY-MM-DD
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
  service: ServiceCatalogTypeEnum; // The service type requested for this slot
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
  activeFrom?: string; // ISO datetime when vigil became active
  reviewCount: number;
  compatibleSlots: number;
  totalSlots: number;
  /** Minimum estimated total price for all compatible slot occurrences. */
  totalPrice: number;
  /** Whether this vigil covers fewer than totalSlots (i.e. is a partial match). */
  partialMatch: boolean;
  /** Detailed list of slot occurrences this vigil is compatible with. */
  compatibleSlotDetails: CompatibleSlotI[];
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
  /** Slot occurrences from the request that no returned vigil can cover. */
  unmatchedSlots?: UnmatchedSlotI[];
  message?: string;
}
