"use client";

import { Input, TextArea } from "@/components/form";
import Checkbox from "@/components/form/checkbox";
import Select from "@/components/form/select";
import SearchAddress from "@/components/maps/searchAddress.component";
import { RolesEnum } from "@/src/enums/roles.enums";
import {
  QuestionRendererProps,
  QuestionType,
} from "@/src/types/multiStepOnboard.types";
import { AddressI } from "@/src/types/maps.types";
import { useState, useEffect } from "react";
import clsx from "clsx";
import {
  ExclamationTriangleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

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
  const [address, setAddress] = useState<AddressI | null>(value || null);

  useEffect(() => {
    if (question.type === QuestionType.ADDRESS && address) {
      onChange(address);
    }
  }, [address, onChange, question.type]);

  // Helper to get HTML input type from question type
  const getInputType = (questionType: QuestionType): string => {
    switch (questionType) {
      case QuestionType.EMAIL:
        return "email";
      case QuestionType.PHONE:
        return "tel";
      default:
        return "text";
    }
  };

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
      );

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
      );

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
      );

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
      );

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
      );

    case QuestionType.RADIO:
      return (
        <div>
          <label
            className={clsx(
              "block font-medium mb-2 text-center text-xl",
              role === RolesEnum.VIGIL && "text-vigil-orange",
              role === RolesEnum.CONSUMER && "text-consumer-blue"
            )}>
            {question.label}
          </label>

          <div className="  flex flex-col gap-4 mt-2">
            {question.options?.map((option) => {
              const isChecked = value === option.value;
              return (
                <div
                  key={option.value}
                  className={`cursor-pointer p-2 border-2 border-grey-200  rounded-3xl py-3 ${
                    isChecked
                      ? clsx(
                          role === RolesEnum.VIGIL &&
                            "border-vigil-orange bg-vigil-light-orange text-vigil-orange",
                          role === RolesEnum.CONSUMER &&
                            "border-consumer-blue bg-consumer-light-blue text-consumer-blue"
                        )
                      : ""
                  }`}>
                  <label
                    key={option.value}
                    htmlFor={option.label}
                    className=" cursor-pointer flex flex-col items-center gap-2">
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
              );
            })}
          </div>
        </div>
      );
    case QuestionType.CARD:
      return (
        <div>
          <label
            className={clsx(
              "block font-medium mb-2 text-center text-xl",
              role === RolesEnum.VIGIL && "text-vigil-orange",
              role === RolesEnum.CONSUMER && "text-consumer-blue"
            )}>
            {question.label}
          </label>

          <div className="flex flex-col gap-4 mt-2">
            {" "}
            {question.options?.map((option) => {
              const isChecked = value === option.value;

              return (
                <div
                  key={option.value}
                  onClick={() => onChange(option.value)}
                  className={clsx(
                    "cursor-pointer relative w-full p-4 rounded-2xl border-2 transition-all duration-200 flex flex-col items-center justify-center gap-2 min-h-[100px]",

                    !isChecked &&
                      "bg-white border-gray-200  hover:border-gray-300",

                    isChecked &&
                      role === RolesEnum.VIGIL &&
                      "border-vigil-orange bg-vigil-light-orange ",
                    isChecked &&
                      role === RolesEnum.CONSUMER &&
                      "border-consumer-blue bg-consumer-light-blue "
                  )}>
                  {option.icon && (
                    <option.icon
                      className={clsx(
                        "w-8 h-8",
                        isChecked ? "text-current" : "text-gray-400"
                      )}
                    />
                  )}

                  <span className="font-medium text-lg ">{option.label}</span>
                  {option.description && (
                    <span className="text-sm text-center">
                      {option.description}
                    </span>
                  )}

                  <input
                    type="radio"
                    name={question.id}
                    value={option.value}
                    checked={isChecked}
                    onChange={() => onChange(option.value)}
                    className="hidden"
                  />
                </div>
              );
            })}
          </div>
        </div>
      );
    case QuestionType.CHECKBOX:
      return (
        <Checkbox
          label={question.label}
          role={role}
          checked={!!value}
          onChange={(checked) => onChange(checked)}
          error={error}
        />
      );

    case QuestionType.MULTI_CHECKBOX:
      return (
        <div>
          <label
            className={clsx(
              "block font-medium mb-2",
              role === RolesEnum.VIGIL && "text-vigil-orange",
              role === RolesEnum.CONSUMER && "text-consumer-blue"
            )}>
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
            )}>
            {question.options?.map((option) => {
              const isChecked =
                Array.isArray(value) && value.includes(option.value);
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
                  )}>
                  <label
                    key={option.value}
                    htmlFor={option.label}
                    className="flex flex-col items-center gap-2">
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
                            : [];
                          if (checked) {
                            onChange([...currentValues, option.value]);
                          } else {
                            onChange(
                              currentValues.filter((v) => v !== option.value)
                            );
                          }
                        }}
                        error={error}
                      />
                    </div>
                  </label>
                </div>
              );
            })}
          </div>
        </div>
      );

    case QuestionType.ADDRESS:
      return (
        <div>
          <SearchAddress
            role={role}
            onSubmit={(selectedAddress) => {
              setAddress(selectedAddress);
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
      );
    case QuestionType.MULTI_ADDRESS:
      const selectedAddresses = (value as AddressI[]) || [];

      const formatAddressDisplay = (addr: AddressI) => {
        if (!addr.address) return addr.display_name;
        const { neighbourhood, suburb, city, town, village, county, postcode } =
          addr.address;

        const mainLocation = city || town || village || "";
        const district =
          neighbourhood || suburb ? `${neighbourhood || suburb}, ` : "";
        const province = city !== county ? ` (${county})` : "";

        return `${district}${mainLocation}${province}, ${postcode || ""}`;
      };

      return (
        <div
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              e.stopPropagation();
            }
          }}>
          <label
            className={clsx(
              "block font-medium mb-2",
              role === RolesEnum.VIGIL && "text-vigil-orange",
              role === RolesEnum.CONSUMER && "text-consumer-blue"
            )}>
            {question.label}
            {question.validation?.required && "*"}
          </label>

          <SearchAddress
            role={role}
            placeholder={question.placeholder}
            label=""
            autoFocus={question.autoFocus}
            resetOnSubmit={true}
            onSubmit={(newAddress) => {
              const exists = selectedAddresses.some(
                (a) => a.display_name === newAddress.display_name
              );

              if (!exists) {
                onChange([...selectedAddresses, newAddress]);
              }
            }}
          />

          <div className="mt-4">
            {selectedAddresses.length > 0 ? (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Aree selezionate:
                </h4>
                <ul className="flex flex-col gap-2">
                  {selectedAddresses.map((addr, index) => (
                    <li
                      key={addr.display_name || index}
                      className={clsx(
                        "w-fit inline-flex items-center gap-2 text-sm border rounded-full px-3 py-1.5",
                        role === RolesEnum.VIGIL
                          ? "bg-orange-50 border-orange-200 text-orange-800"
                          : "bg-blue-50 border-blue-200 text-blue-800"
                      )}>
                      <span className="max-w-[250px] truncate">
                        {formatAddressDisplay(addr)}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          const newDetails = selectedAddresses.filter(
                            (_, i) => i !== index
                          );
                          onChange(newDetails);
                        }}
                        className="text-red-500 hover:text-red-700 ml-1"
                        aria-label="Rimuovi zona">
                        <XCircleIcon className="w-5 h-5" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2 py-4 text-sm text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                <ExclamationTriangleIcon className="w-5 h-5 text-gray-400" />
                <span>Nessuna area selezionata</span>
              </div>
            )}
          </div>

          {error && (
            <p className="text-red-500 text-sm mt-2">
              {question.validation?.required && selectedAddresses.length === 0
                ? "Seleziona almeno un'area operativa"
                : "Errore nella selezione delle aree"}
            </p>
          )}
        </div>
      );
    default:
      return (
        <div className="text-red-500">
          Unsupported question type: {question.type}
        </div>
      );
  }
};

export default QuestionRenderer;
