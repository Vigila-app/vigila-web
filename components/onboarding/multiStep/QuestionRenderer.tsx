"use client";

import {
  QuestionRendererProps,
  QuestionType,
} from "@/src/types/multiStepOnboard.types";
import { AddressI } from "@/src/types/maps.types";
import { useState, useEffect } from "react";
import {
  TextAreaInput,
  TextLikeInput,
} from "./components/TextLikeInput.component";
import { NumericInput } from "./components/NumericInput.component";
import { DateInput } from "./components/DateInput.component";
import {
  SelectInput,
  SelectMultiInput,
} from "./components/SelectInput.component";
import { RadioInput } from "./components/RadioInput.component";
import { CardInput } from "./components/CardInput.component";
import {
  CheckboxInput,
  MulticheckboxInput,
} from "./components/CheckboxInput.component";
import {
  AddressInput,
  MultiAddressInput,
} from "./components/AddressInput.component";
import { FileInput } from "./components/FileInput.component";
import { AvailabilitiesInput } from "./components/AvailabilitiesInput.component";

/**
 * Component that renders a single question based on its type
 */
const QuestionRenderer = (props: QuestionRendererProps) => {
  const [address, setAddress] = useState<AddressI | null>(props.value || null);
  const [searchInput, setSearchInput] = useState("");
  const [fileError, setFileError] = useState<string | null>(null);

  // useEffect(() => {
  //   if (props.question.type === QuestionType.ADDRESS && address) {
  //     props.onChange(address);
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [address, props.onChange, props.question.type]);

  // Helper to get HTML input type from question type
  // console.log(
  //   "Rendering question:",
  //   props.question.id,
  //   "of type:",
  //   props.question.type,
  //   props,
  // );

  // Render based on question type
  switch (props.question.type) {
    case QuestionType.TEXT:
    case QuestionType.EMAIL:
    case QuestionType.PHONE:
      return <TextLikeInput {...props} {...props.question} />;

    case QuestionType.NUMBER:
      return <NumericInput {...props} {...props.question} />;

    case QuestionType.DATE:
      return <DateInput {...props} {...props.question} />;

    case QuestionType.TEXTAREA:
      return <TextAreaInput {...props} {...props.question} />;

    case QuestionType.SELECT:
      return <SelectInput {...props} {...props.question} />;

    case QuestionType.RADIO:
      return <RadioInput {...props} {...props.question} />;
    case QuestionType.CARD:
      return <CardInput {...props} {...props.question} />;
    case QuestionType.CHECKBOX:
      return <CheckboxInput {...props} {...props.question} />;

    case QuestionType.MULTI_CHECKBOX:
      return <MulticheckboxInput {...props} {...props.question} />;

    case QuestionType.ADDRESS:
      return (
        <AddressInput
          {...props}
          {...props.question}
          setAddress={setAddress}
          address={address}
        />
      );
    case QuestionType.MULTI_ADDRESS:
      return <MultiAddressInput {...props} {...props.question} />;
    case QuestionType.FILE:
      return (
        <FileInput
          {...props}
          {...props.question}
          setFileError={setFileError}
          fileError={fileError}
        />
      );

    case QuestionType.SELECT_MULTI:
      return (
        <SelectMultiInput
          {...props}
          {...props.question}
          searchInput={searchInput}
          setSearchInput={setSearchInput}
        />
      );

    case QuestionType.AVAILABILITIES:
      return <AvailabilitiesInput {...props} {...props.question} />;

    default:
      return (
        <div className="text-red-500">
          Unsupported question type: {props.question.type}
        </div>
      );
  }
};

export default QuestionRenderer;
