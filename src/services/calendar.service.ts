/**
 * Calendar Service
 * 
 * Handles all calendar and availability-related business logic
 * including the core Availability Engine algorithm.
 */

import { ApiService } from "@/src/services/api.service";
import {
  VigilAvailabilityRuleI,
  VigilAvailabilityRuleFormI,
  VigilUnavailabilityI,
  VigilUnavailabilityFormI,
  TimeSlotI,
  AvailableSlotsRequestI,
  AvailableSlotsResponseI,
  ConsumerCalendarResponseI,
  VigilCalendarResponseI,
  SlotConflictI,
  WeekdayEnum,
} from "@/src/types/calendar.types";
import { BookingI } from "@/src/types/booking.types";
import {
  BookingStatusEnum,
  PaymentStatusEnum,
} from "@/src/enums/booking.enums";

/**
 * Availability Engine Algorithm
 * 
 * This algorithm:
 * 1. Expands weekly availability rules into concrete hourly slots for the date range
 * 2. Filters out slots that conflict with bookings or unavailabilities
 * 3. Aggregates consecutive slots if service duration > 1 hour
 * 4. Returns only bookable slots
 * 
 * Time Complexity: O(D * R + B + U) where:
 * - D = number of days in range
 * - R = number of availability rules
 * - B = number of bookings
 * - U = number of unavailabilities
 */
export class AvailabilityEngine {
  /**
   * Generate available slots for a vigil in a date range
   */
  static generateAvailableSlots(params: {
    availabilityRules: VigilAvailabilityRuleI[];
    unavailabilities: VigilUnavailabilityI[];
    bookings: BookingI[];
    startDate: Date;
    endDate: Date;
    serviceDurationHours: number;
  }): TimeSlotI[] {
    const {
      availabilityRules,
      unavailabilities,
      bookings,
      startDate,
      endDate,
      serviceDurationHours,
    } = params;

    // Step 1: Generate all potential slots from availability rules
    const potentialSlots = this.expandAvailabilityRules(
      availabilityRules,
      startDate,
      endDate
    );

    // Step 2: Build conflict map (bookings + unavailabilities)
    const conflicts = this.buildConflictMap(bookings, unavailabilities);

    // Step 3: Filter out conflicting slots
    const availableSlots = this.filterConflictingSlots(
      potentialSlots,
      conflicts
    );

    // Step 4: Aggregate consecutive slots for multi-hour services
    const aggregatedSlots = this.aggregateConsecutiveSlots(
      availableSlots,
      serviceDurationHours
    );

    return aggregatedSlots;
  }

  /**
   * Expand weekly availability rules into concrete time slots
   */
  private static expandAvailabilityRules(
    rules: VigilAvailabilityRuleI[],
    startDate: Date,
    endDate: Date
  ): TimeSlotI[] {
    const slots: TimeSlotI[] = [];
    const currentDate = new Date(startDate);

    // Iterate through each day in the range
    while (currentDate <= endDate) {
      const weekday = currentDate.getDay(); // 0=Sunday, 6=Saturday
      const dateStr = this.formatDate(currentDate);

      // Find applicable rules for this weekday
      const applicableRules = rules.filter((rule) => {
        if (rule.weekday !== weekday) return false;

        // Check if rule is valid for this date
        const validFrom = new Date(rule.valid_from);
        const validTo = rule.valid_to ? new Date(rule.valid_to) : null;

        if (currentDate < validFrom) return false;
        if (validTo && currentDate > validTo) return false;

        return true;
      });

      // Generate hourly slots for each applicable rule
      for (const rule of applicableRules) {
        for (let hour = rule.start_hour; hour < rule.end_hour; hour++) {
          slots.push({
            date: dateStr,
            start_hour: hour,
            end_hour: hour + 1,
            available: true,
            duration_hours: 1,
          });
        }
      }

      // Move to next day
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return slots;
  }

  /**
   * Build a map of time ranges that block slots (bookings + unavailabilities)
   */
  private static buildConflictMap(
    bookings: BookingI[],
    unavailabilities: VigilUnavailabilityI[]
  ): SlotConflictI[] {
    const conflicts: SlotConflictI[] = [];

    // Add bookings as conflicts
    for (const booking of bookings) {
      // Only confirmed/paid bookings block slots
      if (
        booking.status === BookingStatusEnum.CONFIRMED ||
        booking.payment_status === PaymentStatusEnum.PAID
      ) {
        conflicts.push({
          type: "booking",
          start: new Date(booking.startDate),
          end: new Date(booking.endDate),
          id: booking.id,
        });
      }
    }

    // Add unavailabilities as conflicts (they always block)
    for (const unavailability of unavailabilities) {
      conflicts.push({
        type: "unavailability",
        start: new Date(unavailability.start_at),
        end: new Date(unavailability.end_at),
        id: unavailability.id,
      });
    }

    return conflicts;
  }

  /**
   * Filter out slots that conflict with bookings or unavailabilities
   */
  private static filterConflictingSlots(
    slots: TimeSlotI[],
    conflicts: SlotConflictI[]
  ): TimeSlotI[] {
    return slots.filter((slot) => {
      const slotStart = this.slotToDateTime(slot, slot.start_hour);
      const slotEnd = this.slotToDateTime(slot, slot.end_hour);

      // Check if slot conflicts with any booking or unavailability
      for (const conflict of conflicts) {
        if (this.timeRangesOverlap(slotStart, slotEnd, conflict.start, conflict.end)) {
          return false;
        }
      }

      return true;
    });
  }

  /**
   * Aggregate consecutive slots for multi-hour services
   * Only return slots where the full service duration is available
   */
  private static aggregateConsecutiveSlots(
    slots: TimeSlotI[],
    serviceDurationHours: number
  ): TimeSlotI[] {
    if (serviceDurationHours <= 1) {
      return slots; // No aggregation needed for 1-hour services
    }

    const aggregated: TimeSlotI[] = [];

    // Group slots by date
    const slotsByDate = new Map<string, TimeSlotI[]>();
    for (const slot of slots) {
      if (!slotsByDate.has(slot.date)) {
        slotsByDate.set(slot.date, []);
      }
      slotsByDate.get(slot.date)!.push(slot);
    }

    // For each date, find consecutive slot sequences
    for (const [date, dateSlots] of Array.from(slotsByDate)) {
      // Sort by start_hour
      dateSlots.sort((a, b) => a.start_hour - b.start_hour);

      // Find consecutive sequences of required length
      for (let i = 0; i <= dateSlots.length - serviceDurationHours; i++) {
        let isConsecutive = true;

        // Check if next N slots are consecutive
        for (let j = 0; j < serviceDurationHours - 1; j++) {
          if (dateSlots[i + j].end_hour !== dateSlots[i + j + 1].start_hour) {
            isConsecutive = false;
            break;
          }
        }

        if (isConsecutive) {
          // Create aggregated slot
          aggregated.push({
            date,
            start_hour: dateSlots[i].start_hour,
            end_hour: dateSlots[i + serviceDurationHours - 1].end_hour,
            available: true,
            duration_hours: serviceDurationHours,
          });
        }
      }
    }

    return aggregated;
  }

  /**
   * Check if two time ranges overlap
   */
  private static timeRangesOverlap(
    start1: Date,
    end1: Date,
    start2: Date,
    end2: Date
  ): boolean {
    return start1 < end2 && end1 > start2;
  }

  /**
   * Convert a slot and hour to a Date object
   */
  private static slotToDateTime(slot: TimeSlotI, hour: number): Date {
    const date = new Date(slot.date);
    date.setHours(hour, 0, 0, 0);
    return date;
  }

  /**
   * Format date as YYYY-MM-DD
   */
  private static formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
}

/**
 * Calendar Service - API Client
 */
export const CalendarService = {
  // ============================================
  // CONSUMER APIS
  // ============================================

  /**
   * Get consumer calendar (bookings)
   */
  getConsumerCalendar: async (): Promise<ConsumerCalendarResponseI> => {
    try {
      const response = await ApiService.get("/api/calendar/consumer") as any;
      return response.data;
    } catch (error) {
      console.error("CalendarService.getConsumerCalendar error", error);
      throw error;
    }
  },

  // ============================================
  // VIGIL APIS - Availability Rules
  // ============================================

  /**
   * Get vigil availability rules
   */
  getVigilAvailabilityRules: async (): Promise<VigilAvailabilityRuleI[]> => {
    try {
      const response = await ApiService.get("/api/vigil/availability-rules") as any;
      return response.data;
    } catch (error) {
      console.error("CalendarService.getVigilAvailabilityRules error", error);
      throw error;
    }
  },

  /**
   * Create vigil availability rule
   */
  createVigilAvailabilityRule: async (
    rule: VigilAvailabilityRuleFormI
  ): Promise<VigilAvailabilityRuleI> => {
    try {
      const response = await ApiService.post("/api/vigil/availability-rules", rule) as any;
      return response.data;
    } catch (error) {
      console.error("CalendarService.createVigilAvailabilityRule error", error);
      throw error;
    }
  },

  /**
   * Delete vigil availability rule
   */
  deleteVigilAvailabilityRule: async (ruleId: string): Promise<void> => {
    try {
      await ApiService.delete(`/api/vigil/availability-rules/${ruleId}`);
    } catch (error) {
      console.error("CalendarService.deleteVigilAvailabilityRule error", error);
      throw error;
    }
  },

  // ============================================
  // VIGIL APIS - Unavailabilities
  // ============================================

  /**
   * Get vigil unavailabilities
   */
  getVigilUnavailabilities: async (): Promise<VigilUnavailabilityI[]> => {
    try {
      const response = await ApiService.get("/api/vigil/unavailabilities") as any;
      return response.data;
    } catch (error) {
      console.error("CalendarService.getVigilUnavailabilities error", error);
      throw error;
    }
  },

  /**
   * Create vigil unavailability
   */
  createVigilUnavailability: async (
    unavailability: VigilUnavailabilityFormI
  ): Promise<VigilUnavailabilityI> => {
    try {
      const response = await ApiService.post(
        "/api/vigil/unavailabilities",
        unavailability
      ) as any;
      return response.data;
    } catch (error) {
      console.error("CalendarService.createVigilUnavailability error", error);
      throw error;
    }
  },

  // ============================================
  // VIGIL APIS - Calendar
  // ============================================

  /**
   * Get vigil calendar (bookings + unavailabilities)
   */
  getVigilCalendar: async (): Promise<VigilCalendarResponseI> => {
    try {
      const response = await ApiService.get("/api/calendar/vigil/bookings") as any;
      return response.data;
    } catch (error) {
      console.error("CalendarService.getVigilCalendar error", error);
      throw error;
    }
  },

  // ============================================
  // AVAILABILITY ENGINE API
  // ============================================

  /**
   * Get available slots for a vigil and service
   */
  getAvailableSlots: async (
    params: AvailableSlotsRequestI
  ): Promise<AvailableSlotsResponseI> => {
    try {
      const { vigil_id, ...queryParams } = params;
      const query = new URLSearchParams(queryParams as any).toString();
      const response = await ApiService.get(
        `/api/vigil/${vigil_id}/available-slots?${query}`
      ) as any;
      return response.data;
    } catch (error) {
      console.error("CalendarService.getAvailableSlots error", error);
      throw error;
    }
  },
};
