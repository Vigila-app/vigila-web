/**
 * Calendar & Availability System Type Definitions
 * 
 * These types define the structure for calendar, availability rules,
 * and unavailabilities in the Vigila platform.
 */

/**
 * Weekday enum (0=Sunday, 6=Saturday)
 * Follows JavaScript Date.getDay() convention
 */
export enum WeekdayEnum {
  SUNDAY = 0,
  MONDAY = 1,
  TUESDAY = 2,
  WEDNESDAY = 3,
  THURSDAY = 4,
  FRIDAY = 5,
  SATURDAY = 6,
}

/**
 * Vigil Availability Rule
 * Represents a weekly recurring availability pattern
 * Example: "Every Monday from 9:00 to 17:00"
 */
export interface VigilAvailabilityRuleI {
  id: string;
  created_at: string;
  updated_at: string;
  vigil_id: string;
  weekday: WeekdayEnum; // 0-6 (Sunday-Saturday)
  start_hour: number; // 0-23
  end_hour: number; // 1-24
  valid_from: string; // ISO date format (YYYY-MM-DD)
  valid_to: string | null; // ISO date format or null for indefinite
}

/**
 * Form data for creating/updating an availability rule
 */
export interface VigilAvailabilityRuleFormI {
  vigil_id: string;
  weekday: WeekdayEnum;
  start_hour: number;
  end_hour: number;
  valid_from: string;
  valid_to?: string | null;
}

/**
 * Vigil Unavailability
 * Represents a specific time range when a Vigil is unavailable
 * Overrides availability rules
 */
export interface VigilUnavailabilityI {
  id: string;
  created_at: string;
  updated_at: string;
  vigil_id: string;
  start_at: string; // ISO datetime format
  end_at: string; // ISO datetime format
  reason?: string | null;
}

/**
 * Form data for creating/updating an unavailability
 */
export interface VigilUnavailabilityFormI {
  vigil_id: string;
  start_at: string; // ISO datetime format
  end_at: string; // ISO datetime format
  reason?: string;
}

/**
 * Time Slot
 * Represents a bookable time slot
 */
export interface TimeSlotI {
  date: string; // ISO date format (YYYY-MM-DD)
  start_hour: number; // 0-23
  end_hour: number; // 1-24
  available: boolean;
  duration_hours: number;
}

/**
 * Available Slots Request Parameters
 */
export interface AvailableSlotsRequestI {
  vigil_id: string;
  start_date: string; // ISO date format (YYYY-MM-DD)
  end_date: string; // ISO date format (YYYY-MM-DD)
  service_id: string;
}

/**
 * Available Slots Response
 */
export interface AvailableSlotsResponseI {
  vigil_id: string;
  service_id: string;
  service_duration_hours: number;
  slots: TimeSlotI[];
}

/**
 * Calendar Event (for Consumer/Vigil calendar views)
 */
export interface CalendarEventI {
  id: string;
  type: 'booking' | 'unavailability' | 'availability';
  title: string;
  start: string; // ISO datetime
  end: string; // ISO datetime
  status?: string;
  metadata?: Record<string, any>;
}

/**
 * Consumer Calendar Response
 */
export interface ConsumerCalendarResponseI {
  bookings: CalendarEventI[];
}

/**
 * Vigil Calendar Response
 */
export interface VigilCalendarResponseI {
  bookings: CalendarEventI[];
  unavailabilities: CalendarEventI[];
  availability_rules: VigilAvailabilityRuleI[];
}

/**
 * Slot Conflict
 * Represents a time range that blocks a slot
 */
export interface SlotConflictI {
  type: 'booking' | 'unavailability';
  start: Date;
  end: Date;
  id: string;
}
