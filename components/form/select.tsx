"use client";

import { RolesEnum } from "@/src/enums/roles.enums";
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
  role?: RolesEnum;
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
    disabled,
    role,
  } = props;

  return (
    <div className="">
      
      <span
        className={clsx(
          "pointer-events-none start-2.5 rounded bg-white p-0.5",
          role === RolesEnum.CONSUMER && "text-consumer-blue",
          role === RolesEnum.VIGIL && "text-vigil-orange",
          error && "text-red-500",
          disabled && "!bg-gray-100"
        )}>
        {label}
        {required && <>*</>}
      </span>

      <label
        htmlFor={name || label}
        className={clsx(
          "relative block p-3 rounded-4xl border bg-white shadow-sm",
          icon && "pr-10",
          role === RolesEnum.CONSUMER &&
            "text-consumer-blue border-consumer-blue focus-within:border-consumer-blue focus-within:ring-1 focus-within:ring-consumer-blue",
          role === RolesEnum.VIGIL &&
            "text-vigil-orange border-vigil-orange focus-within:border-vigil-orange focus-within:ring-1 focus-within:ring-vigil-orange",
          error && "border-red-500",
          disabled && "!bg-gray-100 cursor-not-allowed"
        )}>
        <section className="w-[100]">
          <select
            {...{ ...props, error: undefined, icon: undefined }}
            id={id || name || label}
            defaultValue=""
            className={clsx(
              "w-full border-none bg-transparent text-black placeholder:text-gray-400  focus:outline-none disabled:cursor-not-allowed",
              role === RolesEnum.CONSUMER &&
                "text-consumer-blue border-consumer-blue ",
              role === RolesEnum.VIGIL &&
                "text-vigil-orange border-vigil-orange "
            )}
            onChange={({ currentTarget: { value } }) => onChange?.(value)}>
            {[
              { label: placeholder || label, value: "", disabled: true },
              ...options,
            ].map((option) => (
              <option
                key={option.label}
                value={option.value}
                disabled={option.disabled}>
                {option.label}
              </option>
            ))}
          </select>
        </section>
        {icon ? (
          <span className="pointer-events-none absolute inset-y-0 end-0 grid w-10 place-content-center text-gray-500">
            {icon}
          </span>
        ) : null}

        {error ? (
          <p
            role="alert"
            className="absolute start-2.5 -bottom-4 text-xs text-red-500">
            {FormUtils.getErrorByType(error)}
          </p>
        ) : null}
      </label>
    </div>
  );
};

export default Select;
