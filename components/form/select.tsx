"use client";

import { useState, useRef, useEffect } from "react";
import clsx from "clsx";
import { RolesEnum } from "@/src/enums/roles.enums";
import { FormUtils } from "@/src/utils/form.utils";
import { FieldError } from "react-hook-form";

type Option = {
  label: string;
  value: string | number;
  disabled?: boolean;
};

type CustomSelectProps = {
  label: string;
  placeholder?: string;
  error?: FieldError;
  options: Option[];
  onChange?: (value: string) => void;
  value?: string;
  role?: RolesEnum;
  required?: boolean;
  disabled?: boolean;
};

const CustomSelect = ({
  label,
  placeholder,
  error,
  options,
  onChange,
  value,
  role,
  required = false,
  disabled = false,
}: CustomSelectProps) => {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const selected = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={wrapperRef} className="relative">
      {/* Label */}
      <span
        className={clsx(
          "pointer-events-none start-2.5 rounded bg-white p-0.5",
          role === RolesEnum.CONSUMER && "text-consumer-blue",
          role === RolesEnum.VIGIL && "text-vigil-orange",
          error && "text-red-500",
          disabled && "!bg-gray-100"
        )}
      >
        {label}
        {required && <>*</>}
      </span>

      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((prev) => !prev)}
        className={clsx(
          "w-full p-3 text-left rounded-4xl border bg-white shadow-sm",
          "focus:outline-none",
          role === RolesEnum.CONSUMER &&
            "text-consumer-blue border-consumer-blue focus:ring-1 focus:ring-consumer-blue",
          role === RolesEnum.VIGIL &&
            "text-vigil-orange border-vigil-orange focus:ring-1 focus:ring-vigil-orange",
          error && "border-red-500",
          disabled && "!bg-gray-100 cursor-not-allowed"
        )}
      >
        {selected ? selected.label : placeholder || "Seleziona..."}
      </button>

      {/* Dropdown Options */}
      {open && (
        <ul
          className="absolute z-10 mt-2 w-full rounded-md border bg-white shadow-md max-h-60 overflow-auto"
        >
          {options.map((option) => (
            <li
              key={option.value}
              className={clsx(
                "cursor-pointer px-4 py-2 text-sm text-vigil-orange hover:bg-gray-100",
                option.disabled && "text-gray-400 cursor-not-allowed",
               
              )}
              onClick={() => {
                if (option.disabled) return;
                onChange?.(String(option.value));
                setOpen(false);
              }}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}

      {/* Error */}
      {error ? (
        <p role="alert" className="mt-1 text-xs text-red-500">
          {FormUtils.getErrorByType(error)}
        </p>
      ) : null}
    </div>
  );
};

export default CustomSelect;
