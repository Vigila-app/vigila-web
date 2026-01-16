"use client"

import { Input, TextArea } from "@/components/form"
import Checkbox from "@/components/form/checkbox"
import Select from "@/components/form/select"
import SearchAddress from "@/components/maps/searchAddress.component"
import { RolesEnum } from "@/src/enums/roles.enums"
import {
  QuestionRendererProps,
  QuestionType,
} from "@/src/types/multiStepOnboard.types"
import { AddressI } from "@/src/types/maps.types"
import { useState, useEffect } from "react"
import clsx from "clsx"

/**
 * Component that renders a single question based on its type
 */
const QuestionRenderer = ({
  question,
  value,
  onChange,
  error,
  role,
}: QuestionRendererProps) => {
  const [address, setAddress] = useState<AddressI | null>(value || null)

  useEffect(() => {
    if (question.type === QuestionType.ADDRESS && address) {
      onChange(address)
    }
  }, [address, onChange, question.type])

  // Helper to get HTML input type from question type
  const getInputType = (questionType: QuestionType): string => {
    switch (questionType) {
      case QuestionType.EMAIL:
        return "email"
      case QuestionType.PHONE:
        return "tel"
      default:
        return "text"
    }
  }

  // Render based on question type
  switch (question.type) {
    case QuestionType.TEXT:
    case QuestionType.EMAIL:
    case QuestionType.PHONE:
      return (
        <Input
          label={question.label}
          placeholder={question.placeholder}
          value={value || ""}
          onChange={(val) => onChange(val)}
          type={getInputType(question.type)}
          required={question.validation?.required}
          minLength={question.validation?.minLength}
          maxLength={question.validation?.maxLength}
          role={role}
          error={error}
          autoFocus={question.autoFocus}
        />
      )

    case QuestionType.NUMBER:
      return (
        <Input
          label={question.label}
          placeholder={question.placeholder}
          value={value || ""}
          onChange={(val) => onChange(val)}
          type="number"
          required={question.validation?.required}
          min={question.validation?.min}
          max={question.validation?.max}
          role={role}
          error={error}
          autoFocus={question.autoFocus}
        />
      )

    case QuestionType.DATE:
      return (
        <Input
          label={question.label}
          placeholder={question.placeholder}
          value={value || ""}
          onChange={(val) => onChange(val)}
          type="date"
          required={question.validation?.required}
          role={role}
          error={error}
          autoFocus={question.autoFocus}
        />
      )

    case QuestionType.TEXTAREA:
      return (
        <TextArea
          label={question.label}
          placeholder={question.placeholder}
          value={value || ""}
          onChange={(val) => onChange(val)}
          required={question.validation?.required}
          minLength={question.validation?.minLength}
          maxLength={question.validation?.maxLength}
          role={role}
          error={error}
        />
      )

    case QuestionType.SELECT:
      return (
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

    case QuestionType.RADIO:
      return (
        <div>
          <label
            className={clsx(
              "block font-medium mb-2",
              role === RolesEnum.VIGIL && "text-vigil-orange",
              role === RolesEnum.CONSUMER && "text-consumer-blue"
            )}
          >
            {question.label}
            {question.validation?.required && "*"}
          </label>
          {question.description && (
            <p className="text-sm text-gray-600 mb-3">{question.description}</p>
          )}
          <div className="grid grid-cols-2 gap-2">
            {question.options?.map((option) => {
              const isChecked = value === option.value
              return (
                <div
                  key={option.value}
                  className={`p-2 border-1 border-grey-200 rounded-3xl py-3 ${
                    isChecked
                      ? clsx(
                          "text-white",
                          role === RolesEnum.VIGIL &&
                            "border-vigil-orange bg-vigil-orange",
                          role === RolesEnum.CONSUMER &&
                            "border-consumer-blue bg-vigil-blue"
                        )
                      : ""
                  }`}
                >
                  <label
                    key={option.value}
                    htmlFor={option.label}
                    className="flex flex-col items-center gap-2"
                  >
                    {option.icon && (
                      <option.icon
                        className={`text-gray-400 max-w-1/15 ${
                          isChecked
                            ? clsx(
                                role === RolesEnum.VIGIL && "text-vigil-orange",
                                role === RolesEnum.CONSUMER &&
                                  "text-consumer-blue"
                              )
                            : ""
                        }`}
                      />
                    )}
                    {option.label}
                    <div className="hidden">
                      <Checkbox
                        id={option.label}
                        label={option.label}
                        role={role}
                        checked={isChecked}
                        onChange={() => onChange(option.value)}
                        error={error}
                      />
                    </div>
                  </label>
                </div>
              )
            })}
          </div>
        </div>
      )

    case QuestionType.CHECKBOX:
      return (
        <Checkbox
          label={question.label}
          role={role}
          checked={!!value}
          onChange={(checked) => onChange(checked)}
          error={error}
        />
      )

    case QuestionType.MULTI_CHECKBOX:
      return (
        <div>
          <label
            className={clsx(
              "block font-medium mb-2",
              role === RolesEnum.VIGIL && "text-vigil-orange",
              role === RolesEnum.CONSUMER && "text-consumer-blue"
            )}
          >
            {question.label}
            {question.validation?.required && "*"}
          </label>
          {question.description && (
            <p className="text-sm text-gray-600 mb-3">{question.description}</p>
          )}
          <div
            className={clsx(
              question.options?.[0].icon
                ? "space-y-2"
                : "grid grid-cols-2 gap-2"
            )}
          >
            {question.options?.map((option) => {
              const isChecked =
                Array.isArray(value) && value.includes(option.value)
              return (
                <div
                  key={option.value}
                  className={clsx(
                    option.icon
                      ? "border-3 rounded-xl"
                      : "border-1 rounded-3xl",
                    "p-2 border-grey-200",
                    isChecked &&
                      role === RolesEnum.VIGIL &&
                      "border-vigil-orange bg-vigil-light-orange",
                    isChecked &&
                      role === RolesEnum.CONSUMER &&
                      "border-consumer-blue bg-vigil-light-blue"
                  )}
                >
                  <label
                    key={option.value}
                    htmlFor={option.label}
                    className="flex flex-col items-center gap-2"
                  >
                    {option.icon && (
                      <option.icon
                        className={`text-gray-400 max-w-1/15 ${
                          isChecked
                            ? clsx(
                                role === RolesEnum.VIGIL && "text-vigil-orange",
                                role === RolesEnum.CONSUMER &&
                                  "text-consumer-blue"
                              )
                            : ""
                        }`}
                      />
                    )}
                    {option.label}
                    <div className="hidden">
                      <Checkbox
                        id={option.label}
                        label={option.label}
                        role={role}
                        checked={isChecked}
                        onChange={(checked) => {
                          const currentValues = Array.isArray(value)
                            ? value
                            : []
                          if (checked) {
                            onChange([...currentValues, option.value])
                          } else {
                            onChange(
                              currentValues.filter((v) => v !== option.value)
                            )
                          }
                        }}
                        error={error}
                      />
                    </div>
                  </label>
                </div>
              )
            })}
          </div>
        </div>
      )

    case QuestionType.ADDRESS:
      return (
        <div>
          <SearchAddress
            role={role}
            onSubmit={(selectedAddress) => {
              setAddress(selectedAddress)
            }}
            placeholder={question.placeholder}
            label={question.label}
            autoFocus={question.autoFocus}
          />
          {address && (
            <div className="flex flex-col items-start text-start pt-1 mt-2 bg-gray-100 rounded-2xl">
              <span className="text-xs font-medium text-start px-2 text-gray-500">
                Se l&apos;indirizzo è sbagliato, ri-effettua la ricerca
              </span>
              <span className="text-black mt-2 p-2 rounded text-sm">
                {(address?.address
                  ? `${address.display_name || address.address.city || address.address.town || address.address.village || address.address.suburb}${address.address.city !== address.address.county ? ` (${address.address.county})` : ""}, ${address.address.postcode || ""}`
                  : null) || address.display_name}
              </span>
            </div>
          )}
          {error && (
            <p className="text-red-500 text-sm mt-1">
              {question.validation?.required ? "Seleziona un indirizzo" : ""}
            </p>
          )}
        </div>
      )

    default:
      return (
        <div className="text-red-500">
          Unsupported question type: {question.type}
        </div>
      )
  }
}

export default QuestionRenderer
