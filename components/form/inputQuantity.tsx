"use client";

import { RolesEnum } from "@/src/enums/roles.enums";
import { FormUtils } from "@/src/utils/form.utils";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { FieldError } from "react-hook-form";

type InputI = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: FieldError;
  onChange?: (value: number) => void;
  min?: number;
  role?: string;
  max?: number;
};

const InputQuantity = (props: InputI) => {
  const {
    disabled,
    error,
    id,
    label,
    name,
    role,
    min = 1,
    max = 99,
    onChange,
    required = false,
  } = props;
  const [qty, setQty] = useState<number>(Number(props.value || min));

  const handleChange = (newQty: number = min) => {
    setQty(Math.min(Math.max(min, newQty), max));
  };

  useEffect(() => {
    onChange?.(qty);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qty]);

  return (
    <div className="flex flex-col">
      <span
        className={clsx(
          "pointer-events-none  start-2.5  p-0.5 text-xs text-gray-700 ",
          role === RolesEnum.VIGIL && "  text-vigil-orange ",
          error && "text-red-500",
          disabled && "!bg-gray-100"
        )}>
        {label}
        {required && <>*</>}
      </span>
      <label
        htmlFor={name || label}
        className={clsx(
          " block inline-flex w-fit items-center gap-2 p-3 rounded-md border border-gray-200 bg-white shadow-sm focus-within:border-primary-600 focus-within:ring-1 focus-within:ring-blue-600",
          error && "border-red-500",
          role === RolesEnum.VIGIL &&
            " border-vigil-orange bg-vigil-light-orange text-vigil-orange focus-within:border-vigil-orange  focus-within:ring-vigil-orange ",
          disabled && "!bg-gray-100 cursor-not-allowed"
        )}>
        <button
          disabled={qty <= min}
          type="button"
          className={clsx(
            "text-gray-600 transition hover:opacity-75",
            role === RolesEnum.VIGIL && "  text-vigil-orange ",

            qty <= min && "cursor-not-allowed"
          )}
          onClick={() => handleChange(qty - 1)}>
          -
        </button>
        <input
          {...{
            ...props,
            type: "number",
            value: qty,
            error: undefined,
            icon: undefined,
          }}
          id={id || name || label}
          className={clsx(
            "w-full min-w-16 text-center peer border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0",
            "[-moz-appearance:_textfield] sm:text-sm [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none",
            disabled && "cursor-not-allowed"
          )}
          onChange={({ currentTarget: { value } }) =>
            handleChange?.(Number(value))
          }
          max={max}
          min={min}
        />
        <button
          disabled={qty >= max}
          type="button"
          className={clsx(
            "text-gray-600 transition hover:opacity-75",
            role === RolesEnum.VIGIL && " text-vigil-orange  ",

            qty >= max && "cursor-not-allowed"
          )}
          onClick={() => handleChange(qty + 1)}>
          +
        </button>

        {error ? (
          <p
            role="alert"
            className="absolute start-2.5 top-12 text-xs text-red-500">
            {FormUtils.getErrorByType(error)}
          </p>
        ) : null}
      </label>
    </div>
  );
};

export default InputQuantity;
