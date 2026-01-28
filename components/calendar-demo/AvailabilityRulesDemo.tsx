"use client";

import { useState, useEffect } from "react";
import { CalendarService } from "@/src/services";
import {
  VigilAvailabilityRuleI,
  VigilAvailabilityRuleFormI,
  WeekdayEnum,
} from "@/src/types/calendar.types";
import {
  getWeekdayNameIT,
  formatTimeRange,
  getWeekdaysArray,
  getHoursArray,
  formatDateToISO,
} from "@/src/utils/calendar.utils";

/**
 * Demo component for Availability Rules CRUD operations
 */
export const AvailabilityRulesDemo = () => {
  const [rules, setRules] = useState<VigilAvailabilityRuleI[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState<Partial<VigilAvailabilityRuleFormI>>({
    weekday: WeekdayEnum.MONDAY,
    start_hour: 9,
    end_hour: 17,
    valid_from: formatDateToISO(new Date()),
    valid_to: null,
  });

  const weekdays = getWeekdaysArray();
  const hours = getHoursArray();

  useEffect(() => {
    loadRules();
  }, []);

  const loadRules = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await CalendarService.getVigilAvailabilityRules();
      setRules(data);
    } catch (err: any) {
      setError(err.message || "Failed to load availability rules");
      console.error("Error loading rules:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      // Validate hour range
      if (formData.end_hour! <= formData.start_hour!) {
        setError("End hour must be greater than start hour");
        setLoading(false);
        return;
      }

      // Validate date range if valid_to is provided
      if (formData.valid_to && formData.valid_to < formData.valid_from!) {
        setError("Valid To date must be after or equal to Valid From date");
        setLoading(false);
        return;
      }

      // Note: In a real scenario, vigil_id would come from authenticated user
      const ruleData: VigilAvailabilityRuleFormI = {
        vigil_id: "demo-vigil-id", // This would be from auth context
        weekday: formData.weekday!,
        start_hour: formData.start_hour!,
        end_hour: formData.end_hour!,
        valid_from: formData.valid_from!,
        valid_to: formData.valid_to || null,
      };

      await CalendarService.createVigilAvailabilityRule(ruleData);
      await loadRules();
      
      // Reset form
      setFormData({
        weekday: WeekdayEnum.MONDAY,
        start_hour: 9,
        end_hour: 17,
        valid_from: formatDateToISO(new Date()),
        valid_to: null,
      });
    } catch (err: any) {
      setError(err.message || "Failed to create availability rule");
      console.error("Error creating rule:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (ruleId: string) => {
    if (!confirm("Are you sure you want to delete this rule?")) return;

    setLoading(true);
    setError(null);
    try {
      await CalendarService.deleteVigilAvailabilityRule(ruleId);
      await loadRules();
    } catch (err: any) {
      setError(err.message || "Failed to delete availability rule");
      console.error("Error deleting rule:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4">Availability Rules Demo</h2>
        <p className="text-gray-600 mb-4">
          Test CRUD operations for Vigil availability rules (weekly recurring patterns)
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Create Form */}
        <form onSubmit={handleCreate} className="space-y-4 mb-6 p-4 bg-gray-50 rounded">
          <h3 className="text-lg font-semibold">Create New Rule</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Weekday
              </label>
              <select
                value={formData.weekday}
                onChange={(e) =>
                  setFormData({ ...formData, weekday: Number(e.target.value) as WeekdayEnum })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {weekdays.map((day) => (
                  <option key={day.value} value={day.value}>
                    {day.labelIT} ({day.label})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Hour
              </label>
              <select
                value={formData.start_hour}
                onChange={(e) =>
                  setFormData({ ...formData, start_hour: Number(e.target.value) })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {hours.slice(0, 23).map((hour) => (
                  <option key={hour} value={hour}>
                    {hour}:00
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Hour
              </label>
              <select
                value={formData.end_hour}
                onChange={(e) =>
                  setFormData({ ...formData, end_hour: Number(e.target.value) })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {hours.slice(1).map((hour) => (
                  <option key={hour} value={hour}>
                    {hour}:00
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Valid From
              </label>
              <input
                type="date"
                value={formData.valid_from}
                onChange={(e) =>
                  setFormData({ ...formData, valid_from: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Valid To (optional)
              </label>
              <input
                type="date"
                value={formData.valid_to || ""}
                onChange={(e) =>
                  setFormData({ ...formData, valid_to: e.target.value || null })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? "Creating..." : "Create Rule"}
          </button>
        </form>

        {/* Rules List */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Existing Rules</h3>
            <button
              onClick={loadRules}
              disabled={loading}
              className="bg-gray-200 text-gray-700 py-1 px-3 rounded hover:bg-gray-300 disabled:opacity-50"
            >
              {loading ? "Loading..." : "Refresh"}
            </button>
          </div>

          {rules.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No rules found. Create one above!</p>
          ) : (
            <div className="space-y-2">
              {rules.map((rule) => (
                <div
                  key={rule.id}
                  className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded"
                >
                  <div>
                    <p className="font-medium">
                      {getWeekdayNameIT(rule.weekday)} - {formatTimeRange(rule.start_hour, rule.end_hour)}
                    </p>
                    <p className="text-sm text-gray-600">
                      Valid from {rule.valid_from}
                      {rule.valid_to && ` to ${rule.valid_to}`}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(rule.id)}
                    disabled={loading}
                    className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 disabled:opacity-50"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
