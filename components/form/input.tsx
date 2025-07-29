"use client";

import { RolesEnum } from "@/src/enums/roles.enums";
import { FormUtils } from "@/src/utils/form.utils";
import { CogIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { FieldError } from "react-hook-form";

type InputI = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  icon?: React.ReactElement;
  error?: FieldError;
  onChange?: (value: string | number) => void;
  role?: RolesEnum;
  isForm?: boolean;
  isLoading?: boolean;
};

const Input = (props: InputI) => {
  const {
    disabled,
    error,
    icon,
    id,
    label,
    name,
    isForm = false,
    role,
    onChange,
    required = false,
    type = "text",
    isLoading = false,
  } = props;

  return (
    <div className="relative w-full">
      <label
        htmlFor={name || label}
        className={clsx(
          "pointer-events-none start-2.5  bg-white my-4",
          isForm && "text-vigil-orange",
          role === RolesEnum.CONSUMER && "text-consumer-blue",
          role === RolesEnum.VIGIL && " text-vigil-orange",
          error && "text-red-500",
          disabled && "cursor-not-allowed"
        )}
      >
        {label}
        {required && <>*</>}
      </label>

      <div
        className={clsx(
          "relative w-full inline-flex items-center p-3 rounded-4xl border-1 bg-white shadow-sm focus-within:border-gray focus-within:ring-1 focus-within:ring-gray-200",
          isForm &&
            "text-vigil-orange  focus-within:border-vigil-orange  focus-within:ring-vigil-orange border-vigil-orange focus-within:bg-vigil-light-orange",
          role === RolesEnum.CONSUMER &&
            "text-consumer-blue   border-consumer-blue focus-within:border-consumer-blue focus-within:ring-consumer-blue  focus-within:bg-consumer-light-blue",
          role === RolesEnum.VIGIL &&
            " text-vigil-orange  focus-within:border-vigil-orange  focus-within:ring-vigil-orange border-vigil-orange focus-within:bg-vigil-light-orange",
          error && "border-red-500 mb-4",
          disabled && "!bg-gray-100 cursor-not-allowed"
        )}
      >
        <input
          {...{ ...props, type, error: undefined, icon: undefined }}
          id={id || name || label}
          className={clsx(
            "w-full flex-1 border-none bg-transparent focus:placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0",
            disabled && "cursor-not-allowed"
          )}
          onChange={({ currentTarget: { value } }) => onChange?.(value)}
        />

        {icon && !isLoading ? (
          <span className="min-w-10 inline-flex items-center justify-end text-gray-500">
            {icon}
          </span>
        ) : isLoading ? (
          <span className="min-w-10 inline-flex items-center justify-end text-gray-500">
            <CogIcon className="size-4 animate-spin text-gray-500" />
          </span>
        ) : null}

        {error ? (
          <p
            role="alert"
            className="absolute start-2.5 top-12 text-xs text-red-500"
          >
            {FormUtils.getErrorByType(error)}
          </p>
        ) : null}
      </div>
    </div>
  );
};

export default Input;
