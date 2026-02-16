"use client"

import {
  QuestionRendererProps,
  QuestionType,
} from "@/src/types/multiStepOnboard.types"
import { AddressI } from "@/src/types/maps.types"
import { useState, useEffect } from "react"
import {
  TextAreaInput,
  TextLikeInput,
} from "./components/TextLikeInput.component"
import { NumericInput } from "./components/NumericInput.component"
import { DateInput } from "./components/DateInput.component"
import {
  SelectInput,
  SelectMultiInput,
} from "./components/SelectInput.component"
import { RadioInput } from "./components/RadioInput.component"
import { CardInput } from "./components/CardInput.component"
import {
  CheckboxInput,
  MulticheckboxInput,
} from "./components/CheckboxInput.component"
import {
  AddressInput,
  MultiAddressInput,
} from "./components/AddressInput.component"
import { FileInput } from "./components/FileInput.component"
import { AvailabilitiesInput } from "./components/AvailabilitiesInput.component"

/**
 * Component that renders a single question based on its type
 */
const QuestionRenderer = (props: QuestionRendererProps) => {
  const [address, setAddress] = useState<AddressI | null>(props.value || null)
  const [searchInput, setSearchInput] = useState("")
  const [fileError, setFileError] = useState<string | null>(null)

  useEffect(() => {
    if (props.question.type === QuestionType.ADDRESS && address) {
      props.onChange(address)
    }
  }, [address, props.onChange, props.question.type])

  // Helper to get HTML input type from question type

  // Render based on question type
  switch (props.question.type) {
    case QuestionType.TEXT:
    case QuestionType.EMAIL:
    case QuestionType.PHONE:
      return <TextLikeInput {...props} />

    case QuestionType.NUMBER:
      return <NumericInput {...props} />

    case QuestionType.DATE:
      return <DateInput {...props} />

    case QuestionType.TEXTAREA:
      return <TextAreaInput {...props} />

    case QuestionType.SELECT:
      return <SelectInput {...props} />

    case QuestionType.RADIO:
      return <RadioInput {...props} />
    case QuestionType.CARD:
      return <CardInput {...props} />
    case QuestionType.CHECKBOX:
      return <CheckboxInput {...props} />

    case QuestionType.MULTI_CHECKBOX:
      return <MulticheckboxInput {...props} />

    case QuestionType.ADDRESS:
      return (
        <AddressInput {...props} setAddress={setAddress} address={address} />
      )
    case QuestionType.MULTI_ADDRESS:
      return <MultiAddressInput {...props} />
    case QuestionType.FILE:
      return (
        <FileInput
          {...props}
          setFileError={setFileError}
          fileError={fileError}
        />
      )

    case QuestionType.SELECT_MULTI:
      return (
        <SelectMultiInput
          {...props}
          searchInput={searchInput}
          setSearchInput={setSearchInput}
        />
      )

    case QuestionType.AVAILABILITIES:
      return <AvailabilitiesInput {...props} />

    default:
      return (
        <div className="text-red-500">
          Unsupported question type: {props.question.type}
        </div>
      )
  }
}

export default QuestionRenderer
