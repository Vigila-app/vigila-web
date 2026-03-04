"use client";

import { useState, useEffect } from "react";
import { CalendarService } from "@/src/services";
import {
  VigilUnavailabilityI,
  VigilUnavailabilityFormI,
} from "@/src/types/calendar.types";
import {
  calculateDurationHours,
} from "@/src/utils/calendar.utils";
import { dateDisplay } from "@/src/utils/date.utils";

/**
 * Demo component for Unavailabilities CRUD operations
 */
export const UnavailabilitiesDemo = () => {
  const [unavailabilities, setUnavailabilities] = useState<
    VigilUnavailabilityI[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState<Partial<VigilUnavailabilityFormI>>({
    start_at: "",
    end_at: "",
    reason: "",
  });

  useEffect(() => {
    loadUnavailabilities();
  }, []);

  const loadUnavailabilities = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await CalendarService.getVigilUnavailabilities();
      setUnavailabilities(data);
    } catch (err: any) {
      setError(err.message || "Failed to load unavailabilities");
      console.error("Error loading unavailabilities:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {

      // Note: In a real scenario, vigil_id would come from authenticated user
      const unavailabilityData: VigilUnavailabilityFormI = {
        vigil_id: "demo-vigil-id", // This would be from auth context
        start_at: formData.start_at!,
        end_at: formData.end_at!,
        reason: formData.reason || undefined,
      };

      await CalendarService.createVigilUnavailability(unavailabilityData);
      await loadUnavailabilities();

      // Reset form
      setFormData({
        start_at: "",
        end_at: "",
        reason: "",
      });
    } catch (err: any) {
  
      setError(
        err.message || "Failed to create unavailability",
      );
      console.error("Error creating unavailability:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4">Unavailabilities Demo</h2>
        <p className="text-gray-600 mb-4">
          Test CRUD operations for Vigil unavailabilities (specific time blocks)
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Create Form */}
        <form
          onSubmit={handleCreate}
          className="space-y-4 mb-6 p-4 bg-gray-50 rounded">
          <h3 className="text-lg font-semibold">Create New Unavailability</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date & Time
              </label>
              <input
                type="datetime-local"
                value={formData.start_at}
                onChange={(e) =>
                  setFormData({ ...formData, start_at: e.target.value })
                }
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date & Time
              </label>
              <input
                type="datetime-local"
                value={formData.end_at}
                onChange={(e) =>
                  setFormData({ ...formData, end_at: e.target.value })
                }
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reason (optional)
              </label>
              <input
                type="text"
                value={formData.reason}
                onChange={(e) =>
                  setFormData({ ...formData, reason: e.target.value })
                }
                placeholder="e.g., Vacation, Doctor appointment, etc."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !formData.start_at || !formData.end_at}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed">
            {loading ? "Creating..." : "Create Unavailability"}
          </button>
        </form>

        {/* Unavailabilities List */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Existing Unavailabilities</h3>
            <button
              onClick={loadUnavailabilities}
              disabled={loading}
              className="bg-gray-200 text-gray-700 py-1 px-3 rounded hover:bg-gray-300 disabled:opacity-50">
              {loading ? "Loading..." : "Refresh"}
            </button>
          </div>

          {unavailabilities.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              No unavailabilities found. Create one above!
            </p>
          ) : (
            <div className="space-y-2">
              {unavailabilities.map((unavailability) => {
                const duration = calculateDurationHours(
                  unavailability.start_at,
                  unavailability.end_at,
                );
                return (
                  <div
                    key={unavailability.id}
                    className="p-3 bg-gray-50 border border-gray-200 rounded">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-lg">
                          {unavailability.reason || "No reason specified"}
                        </p>
                        <p className="text-sm text-gray-600">
                          From:{" "}
                          {dateDisplay(unavailability.start_at, "dateTime")}
                        </p>
                        <p className="text-sm text-gray-600">
                          To: {dateDisplay(unavailability.end_at, "dateTime")}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          Duration: {duration} hours
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
