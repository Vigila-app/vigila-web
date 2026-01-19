import { Input, Select } from "@/components/form"
import { getInputType } from "../utils"
import { QuestionRendererProps } from "@/src/types/multiStepOnboard.types"
import clsx from "clsx"
import { RolesEnum } from "@/src/enums/roles.enums"
import { ExclamationTriangleIcon, MagnifyingGlassIcon, XCircleIcon } from "@heroicons/react/24/outline"

export const SelectInput = ({
  question,
  onChange,
  role,
  error,
  value,
}: QuestionRendererProps) => (
  <Select
    label={question.label}
    placeholder={question.placeholder}
    value={value || ""}
    onChange={(val) => onChange(val)}
    required={question.validation?.required}
    role={role}
    error={error}
    options={question.options || []}
  />
)

interface SelectMultiI {
  searchInput: string
  setSearchInput: (str:string) => void
}
export const SelectMultiInput = ({
  question,
  onChange,
  role,
  error,
  value, searchInput, setSearchInput
}: QuestionRendererProps & SelectMultiI) => {
  const selectedValues = (value as (string | number)[]) || []
  const filteredOptions =
    question.options?.filter((option) =>
      option.label.toLowerCase().includes(searchInput.toLowerCase()),
    ) || []

  return (
    <div>
      <label
        className={clsx(
          "block font-medium mb-2",
          role === RolesEnum.VIGIL && "text-vigil-orange",
          role === RolesEnum.CONSUMER && "text-consumer-blue",
        )}
      >
        {question.label}
        {question.validation?.required && "*"}
      </label>

      {/* Selected items section */}
      {selectedValues.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Selected:</h4>
          <ul className="flex flex-wrap gap-2">
            {selectedValues.map((selectedValue) => {
              const option = question.options?.find(
                (o) => o.value === selectedValue,
              )
              return (
                <li
                  key={selectedValue}
                  className={clsx(
                    "inline-flex items-center gap-2 text-sm border rounded-full px-3 py-1.5",
                    role === RolesEnum.VIGIL
                      ? "bg-orange-50 border-orange-200 text-orange-800"
                      : "bg-blue-50 border-blue-200 text-blue-800",
                  )}
                >
                  {option?.icon && <option.icon className="w-4 h-4" />}
                  <span>{option?.label || selectedValue}</span>
                  <button
                    type="button"
                    onClick={() => {
                      onChange(
                        selectedValues.filter((v) => v !== selectedValue),
                      )
                    }}
                    className="text-red-500 hover:text-red-700 ml-1"
                    aria-label="Remove"
                  >
                    <XCircleIcon className="w-4 h-4" />
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      )}

      {/* Search input */}
      <div className="relative mb-3">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder={question.placeholder || "Search options..."}
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className={clsx(
            "w-full pl-10 pr-4 py-2 border-2 rounded-lg focus:outline-none transition-colors",
            role === RolesEnum.VIGIL
              ? "border-gray-300 focus:border-vigil-orange"
              : "border-gray-300 focus:border-consumer-blue",
          )}
          autoFocus={question.autoFocus}
        />
      </div>

      {/* Options list */}
      <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg">
        {filteredOptions.length > 0 ? (
          <ul className="divide-y">
            {filteredOptions.map((option) => {
              const isChecked = selectedValues.includes(option.value)
              return (
                <li
                  key={option.value}
                  className={clsx(
                    "p-3 cursor-pointer hover:bg-gray-50 transition-colors flex items-center gap-3",
                    isChecked &&
                      role === RolesEnum.VIGIL &&
                      "bg-vigil-light-orange",
                    isChecked &&
                      role === RolesEnum.CONSUMER &&
                      "bg-consumer-light-blue",
                  )}
                >
                  {/* Icon on the left */}
                  {option.icon && (
                    <option.icon className="w-5 h-5 text-gray-600 mr-2" />
                  )}
                  {/* Label in the middle */}
                  <label
                    htmlFor={`option-${option.value}`}
                    className="flex-1 cursor-pointer flex items-center gap-2"
                  >
                    <span>{option.label}</span>
                  </label>
                  {/* Checkbox on the right */}
                  <input
                    type="checkbox"
                    id={`option-${option.value}`}
                    checked={isChecked}
                    onChange={() => {
                      if (isChecked) {
                        onChange(
                          selectedValues.filter((v) => v !== option.value),
                        )
                      } else {
                        onChange([...selectedValues, option.value])
                      }
                      setSearchInput("")
                    }}
                    className="w-4 h-4 cursor-pointer accent-gray-600 ml-2"
                  />
                </li>
              )
            })}
          </ul>
        ) : (
          <div className="p-4 text-center text-gray-500 text-sm">
            No options found
          </div>
        )}
      </div>

      {error && (
        <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
          <ExclamationTriangleIcon className="w-4 h-4" />
          {error.message}
        </p>
      )}
    </div>
  )
}