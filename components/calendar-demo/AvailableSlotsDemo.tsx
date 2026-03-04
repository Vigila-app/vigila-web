"use client";

import { useState, useEffect, useMemo } from "react";
import { CalendarService } from "@/src/services";
import {
  AvailableSlotsRequestI,
  AvailableSlotsResponseI,
  TimeSlotI,
} from "@/src/types/calendar.types";
import {
  formatTimeRange,
  formatDateToISO,
  getDateRange,
} from "@/src/utils/calendar.utils";

/**
 * Demo component for Available Slots API
 */
export const AvailableSlotsDemo = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [slotsData, setSlotsData] = useState<AvailableSlotsResponseI | null>(null);

  // Form state
  const [formData, setFormData] = useState<AvailableSlotsRequestI>({
    vigil_id: "demo-vigil-id", // In real scenario, this would be selected from a list
    start_date: formatDateToISO(new Date()),
    end_date: getDateRange(30).endDate, // 30 days from now
    service_id: "demo-service-id", // In real scenario, this would be selected from a list
  });

  const handleFetchSlots = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSlotsData(null);
    
    // Validate date range
    if (formData.end_date < formData.start_date) {
      setError("End date must be after or equal to start date");
      setLoading(false);
      return;
    }
    
    try {
      const data = await CalendarService.getAvailableSlots(formData);
      setSlotsData(data);
    } catch (err: any) {
      // Provide helpful error messages for demo
      if (err.message?.includes("401") || err.message?.includes("Unauthorized")) {
        setError("Authentication required. This is expected in demo mode - in production, you would be authenticated.");
      } else {
        setError(err.message || "Failed to fetch available slots");
      }
      console.error("Error fetching slots:", err);
    } finally {
      setLoading(false);
    }
  };

  // Group slots by date for better display - memoized for performance
  const groupedSlotsByDate = useMemo(() => {
    return slotsData?.slots.reduce((acc, slot) => {
      if (!acc[slot.date]) {
        acc[slot.date] = [];
      }
      acc[slot.date].push(slot);
      return acc;
    }, {} as Record<string, TimeSlotI[]>) || {};
  }, [slotsData]);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4">Available Slots Demo</h2>
        <p className="text-gray-600 mb-4">
          Test the Availability Engine API - calculates bookable time slots
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Search Form */}
        <form onSubmit={handleFetchSlots} className="space-y-4 mb-6 p-4 bg-gray-50 rounded">
          <h3 className="text-lg font-semibold">Search Available Slots</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Vigil ID
              </label>
              <input
                type="text"
                value={formData.vigil_id}
                onChange={(e) =>
                  setFormData({ ...formData, vigil_id: e.target.value })
                }
                required
                placeholder="Enter vigil ID"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                In production, this would be a dropdown of available vigils
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Service ID
              </label>
              <input
                type="text"
                value={formData.service_id}
                onChange={(e) =>
                  setFormData({ ...formData, service_id: e.target.value })
                }
                required
                placeholder="Enter service ID"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                In production, this would be a dropdown of available services
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={formData.start_date}
                onChange={(e) =>
                  setFormData({ ...formData, start_date: e.target.value })
                }
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input
                type="date"
                value={formData.end_date}
                onChange={(e) =>
                  setFormData({ ...formData, end_date: e.target.value })
                }
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? "Searching..." : "Search Available Slots"}
          </button>
        </form>

        {/* Results */}
        {slotsData && (
          <div>
            <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded">
              <h3 className="font-semibold text-blue-900">Search Results</h3>
              <p className="text-sm text-blue-700">
                Vigil ID: {slotsData.vigil_id}
              </p>
              <p className="text-sm text-blue-700">
                Service ID: {slotsData.service_id}
              </p>
              <p className="text-sm text-blue-700">
                Service Duration: {slotsData.service_duration_hours} hour(s)
              </p>
              <p className="text-sm text-blue-700 font-medium mt-2">
                Found {slotsData.slots.length} available slot(s)
              </p>
            </div>

            {slotsData.slots.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                No available slots found for the selected criteria.
              </p>
            ) : (
              <div className="space-y-4">
                {Object.entries(groupedSlotsByDate).map(([date, slots]) => (
                  <div key={date} className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-lg mb-2">
                      {new Date(date).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                      {slots.map((slot, index) => (
                        <div
                          key={`${slot.date}-${slot.start_time}-${index}`}
                          className={`p-2 rounded text-center text-sm ${
                            slot.available
                              ? "bg-green-100 text-green-800 border border-green-300"
                              : "bg-gray-100 text-gray-500 border border-gray-300"
                          }`}
                        >
                          <div className="font-medium">
                            {formatTimeRange(slot.start_time, slot.end_time)}
                          </div>
                          {slot.duration_hours > 1 && (
                            <div className="text-xs">({slot.duration_hours}h)</div>
                          )}
                          <div className="text-xs mt-1">
                            {slot.available ? "✓ Available" : "✗ Unavailable"}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {!slotsData && !loading && (
          <p className="text-gray-500 text-center py-8">
            Enter search criteria and click "Search Available Slots" to see results
          </p>
        )}
      </div>
    </div>
  );
};
