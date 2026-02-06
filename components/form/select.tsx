"use client";

import { useState, useRef, useEffect } from "react";
import clsx from "clsx";
import { RolesEnum } from "@/src/enums/roles.enums";
import { FormUtils } from "@/src/utils/form.utils";
import { FieldError } from "react-hook-form";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

type Option = {
  label: string;
  value: string | number;
  disabled?: boolean;
};

type SelectProps = {
  label?: string;
  id?: string;
  placeholder?: string;
  error?: FieldError;
  options: Option[];
  onChange?: (value: string) => void;
  value?: string;
  role?: RolesEnum;
  required?: boolean;
  disabled?: boolean;
};

const Select = ({
  label,
  id,
  placeholder,
  error,
  options,
  onChange,
  value,
  role,
  required = false,
  disabled = false,
}: SelectProps) => {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const selected = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={wrapperRef} className="relative w-full">
      {/* Label */}
      {label ? (
        <label
          className={clsx(
            "pointer-events-none start-2.5 rounded bg-white p-0.5",
            role === RolesEnum.CONSUMER && "text-consumer-blue",
            role === RolesEnum.VIGIL && "text-vigil-orange",
            error && "text-red-500",
            disabled && "!bg-gray-100",
          )}>
          {label}
          {required && <>*</>}
        </label>
      ) : null}

      {/* Trigger Button */}
      <button
        type="button"
        role="select"
        id={id || label?.toLowerCase().replace(/\s+/g, "-")}
        disabled={disabled}
        onClick={() => setOpen((prev) => !prev)}
        className={clsx(
          "w-full p-3 text-left rounded-4xl border bg-white shadow-sm",
          "focus:outline-none",
          role === RolesEnum.CONSUMER &&
            "border-consumer-blue focus:ring-1 focus:ring-consumer-blue",
          role === RolesEnum.VIGIL &&
            "border-vigil-orange focus:ring-1 focus:ring-vigil-orange",
          error && "border-red-500",
          disabled && "!bg-gray-100 cursor-not-allowed",
          "scroll-m-12",
        )}>
        {/* {selected ? selected.label : placeholder || "Seleziona..."} */}
        <span className={clsx(!selected && "text-gray-500")}>
          {selected ? selected.label : placeholder || "Seleziona..."}
        </span>
        <ChevronDownIcon
          className={clsx(
            "w-5 h-5 transition-transform duration-200 float-right",
            role === RolesEnum.CONSUMER && "text-consumer-blue",
            role === RolesEnum.VIGIL && "text-vigil-orange",
            open && "rotate-180"
          )}
        />
      </button>

      {/* Dropdown Options */}
      {open && (
        <ul
          className={clsx(
            "absolute z-10 mt-2 w-full rounded-2xl border bg-white shadow-md max-h-64 overflow-auto",
            role === RolesEnum.CONSUMER && "border-consumer-blue ",
            role === RolesEnum.VIGIL && "border-vigil-orange ",
          )}>
          {options.map((option) => (
            <li
              key={option.value}
              className={clsx(
                " flex justify-between cursor-pointer px-4 py-2 text-sm hover:bg-gray-100",
                option.disabled && "text-gray-400 cursor-not-allowed",
              )}
              onClick={() => {
                if (option.disabled) return;
                onChange?.(String(option.value));
                setOpen(false);
              }}>
              {option.label}
              <div
                className={clsx(
                  "w-5 h-5 rounded-full border flex items-center justify-center transition-all duration-200",

                  option.value === value
                    ? ` border-2 ${role === RolesEnum.CONSUMER ? "border-consumer-blue" : "border-vigil-orange"}`
                    : "border-gray-300 border-1",
                )}>
                <div
                  className={clsx(
                    "w-2.5 h-2.5 rounded-full  transition-transform duration-200",

                    option.value === value
                      ? `scale-100 ${role === RolesEnum.CONSUMER ? "bg-consumer-blue" : "bg-vigil-orange"}`
                      : "scale-0",
                  )}
                />
              </div>
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

export default Select;
