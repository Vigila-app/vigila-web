"use client"

import React from "react"
import { RolesEnum } from "@/src/enums/roles.enums"
import { QuestionRendererProps } from "@/src/types/multiStepOnboard.types"
import { Toggle } from "@/components/form"
import Select from "@/components/form/select"
import clsx from "clsx"

export interface DayAvailability {
  day: string
  enabled: boolean
  startTime?: string
  endTime?: string
}

export interface Availabilities {
  [key: string]: DayAvailability
}

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
const DAYS_LABELS = {
  Monday: "Lunedì",
  Tuesday: "Martedì",
  Wednesday: "Mercoledì",
  Thursday: "Giovedì",
  Friday: "Venerdì",
  Saturday: "Sabato",
  Sunday: "Domenica",
}

// Generate time options from 00:00 to 23:30 in 30-minute intervals
const generateTimeOptions = () => {
  const options = []
  for (let hour = 0; hour < 24; hour++) {
    for (let minute of [0, 30]) {
      const timeStr = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`
      options.push({ label: timeStr, value: timeStr })
    }
  }
  return options
}

const TIME_OPTIONS = generateTimeOptions()

const timeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(":").map(Number)
  return hours * 60 + minutes
}

export const AvailabilitiesInput = ({
  question,
  onChange,
  role,
  value,
}: QuestionRendererProps) => {
  const currentValue: Availabilities = value || initializeAvailabilities()
  const [errors, setErrors] = React.useState<{ [key: string]: string }>({})

  const validateTimeRange = (day: string, startTime?: string, endTime?: string) => {
    const newErrors = { ...errors }
    
    if (startTime && endTime) {
      const startMinutes = timeToMinutes(startTime)
      const endMinutes = timeToMinutes(endTime)
      
      if (endMinutes <= startMinutes) {
        newErrors[day] = "L'orario di fine deve essere dopo l'orario di inizio"
      } else {
        delete newErrors[day]
      }
    } else {
      delete newErrors[day]
    }
    
    setErrors(newErrors)
    return !newErrors[day]
  }

  const handleDayToggle = (day: string) => {
    const updated = { ...currentValue }
    updated[day].enabled = !updated[day].enabled
    if (!updated[day].enabled) {
      updated[day].startTime = undefined
      updated[day].endTime = undefined
      const newErrors = { ...errors }
      delete newErrors[day]
      setErrors(newErrors)
    }
    onChange(updated)
  }

  const handleTimeChange = (day: string, timeField: "startTime" | "endTime", timeValue: string) => {
    const updated = { ...currentValue }
    updated[day][timeField] = timeValue
    
    const startTime = timeField === "startTime" ? timeValue : updated[day].startTime
    const endTime = timeField === "endTime" ? timeValue : updated[day].endTime
    
    validateTimeRange(day, startTime, endTime)
    onChange(updated)
  }

  return (
    <div>
      <label
        className={clsx(
          "block font-medium mb-4",
          role === RolesEnum.VIGIL && "text-vigil-orange",
          role === RolesEnum.CONSUMER && "text-consumer-blue",
        )}
      >
        {question.label}
        {question.validation?.required && "*"}
      </label>
      {question.description && (
        <p className="text-sm text-gray-600 mb-4">{question.description}</p>
      )}
      
      <div className="space-y-4">
        {DAYS.map((day) => (
          <div
            key={day}
            className={clsx(
              "border rounded-lg p-4",
              currentValue[day].enabled
                ? clsx(
                    "border-2",
                    role === RolesEnum.VIGIL && "border-vigil-orange bg-vigil-light-orange/20",
                    role === RolesEnum.CONSUMER && "border-consumer-blue bg-vigil-light-blue/20",
                  )
                : "border-gray-200 bg-gray-50",
            )}
          >
            <div className="flex items-center justify-between mb-3">
              <label className="font-medium text-gray-700">
                {DAYS_LABELS[day as keyof typeof DAYS_LABELS]}
              </label>
              <Toggle
              withIcon
              
                role={role}
                name={`toggle-${day}`}
                checked={currentValue[day].enabled}
                onChange={() => handleDayToggle(day)}
              />
            </div>

            {currentValue[day].enabled && (
              <div className="flex gap-3 mt-3">
                <div className="flex-1">
                  <Select
                    label="Inizio"
                    placeholder="00:00"
                    options={TIME_OPTIONS}
                    value={currentValue[day].startTime || ""}
                    onChange={(val) => handleTimeChange(day, "startTime", val)}
                    role={role}
                  />
                </div>
                <div className="flex-1">
                  <Select
                    label="Fine"
                    placeholder="23:30"
                    options={TIME_OPTIONS}
                    value={currentValue[day].endTime || ""}
                    onChange={(val) => handleTimeChange(day, "endTime", val)}
                    role={role}
                  />
                </div>
              </div>
            )}
            {errors[day] && (
              <p className="text-sm text-red-500 mt-2">{errors[day]}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function initializeAvailabilities(): Availabilities {
  const availabilities: Availabilities = {}
  DAYS.forEach((day) => {
    availabilities[day] = {
      day,
      enabled: false,
      startTime: undefined,
      endTime: undefined,
    }
  })
  return availabilities
}
