"use client";

import { RolesEnum } from "@/src/enums/roles.enums";
import { FormUtils } from "@/src/utils/form.utils";
import clsx from "clsx";
import { FieldError } from "react-hook-form";

type InputI = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  icon?: React.ReactElement;
  error?: FieldError;
  onChange?: (value: string | number) => void;
  role?: RolesEnum;
};

const Input = (props: InputI) => {
  const {
    disabled,
    error,
    icon,
    id,
    label,
    name,
    role,
    onChange,
    required = false,
    type = "text",
  } = props;

  return (
    <div>
      <span
        className={clsx(
          "pointer-events-none start-2.5 rounded bg-white p-0.5 ",

          role === RolesEnum.CONSUMER && "text-consumer-blue",
          role === RolesEnum.VIGIL && " text-vigil-orange",
          error && "text-red-500",
          disabled && "!bg-gray-100"
        )}>
        {label}
        {required && <>*</>}
      </span>

      {icon ? (
        <span className="pointer-events-none absolute inset-y-0 end-0 grid w-10 place-content-center text-gray-500">
          {icon}
        </span>
      ) : null}

      <label
        htmlFor={name || label}
        className={clsx(
          "relative w-full block p-3 rounded-4xl border bg-white shadow-sm focus-within:border-gray focus-within:ring-1 focus-within:ring-gray-200",
          icon && "pr-10",
          role === RolesEnum.CONSUMER &&
            "text-consumer-blue   border-consumer-blue focus-within:border-consumer-blue focus-within:ring-consumer-blue  focus-within:bg-consumer-light-blue",
          role === RolesEnum.VIGIL &&
            " text-vigil-orange  focus-within:border-vigil-orange  focus-within:ring-vigil-orange border-vigil-orange focus-within:bg-vigil-light-orange",
          error && "border-red-500",
          disabled && "!bg-gray-100 cursor-not-allowed"
        )}>
        <input
          {...{ ...props, type, error: undefined, icon: undefined }}
          id={id || name || label}
          className={clsx(
            "w-full peer border-none bg-transparent focus:placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0",
            disabled && "cursor-not-allowed"
          )}
          onChange={({ currentTarget: { value } }) => onChange?.(value)}
        />

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

export default Input;
