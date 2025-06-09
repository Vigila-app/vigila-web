"use client";

import { FormUtils } from "@/src/utils/form.utils";
import clsx from "clsx";
import { FieldError } from "react-hook-form";

type SelectI = React.SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  placeholder?: string;
  icon?: React.ReactElement;
  error?: FieldError;
  options: { label: string; value: string | number; disabled?: boolean }[];
  onChange?: (value: string) => void;
};

const Select = (props: SelectI) => {
  const {
    error,
    icon,
    id,
    label,
    name,
    onChange,
    options = [],
    placeholder,
    required = false,
  } = props;

  return (
    <label
      htmlFor={name || label}
      className={clsx(
        "relative block p-3 rounded-md border border-gray-200 shadow-sm focus-within:border-primary-600 focus-within:ring-1 focus-within:ring-primary-600",
        icon && "pr-10",
        error && "border-red-500"
      )}
    >
      <select
        {...{ ...props, error: undefined, icon: undefined }}
        id={id || name || label}
        defaultValue=""
        className="w-full peer border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 disabled:cursor-not-allowed"
        onChange={({ currentTarget: { value } }) => onChange?.(value)}
      >
        {[
          { label: placeholder || label, value: "", disabled: true },
          ...options,
        ].map((option) => (
          <option
            key={option.label}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>

      <span
        className={clsx(
          "pointer-events-none absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs",
          error && "text-red-500"
        )}
      >
        {label}
        {required && <>*</>}
      </span>

      {icon ? (
        <span className="pointer-events-none absolute inset-y-0 end-0 grid w-10 place-content-center text-gray-500">
          {icon}
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
    </label>
  );
};

export default Select;
