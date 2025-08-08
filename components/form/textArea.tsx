"use client";

import { RolesEnum } from "@/src/enums/roles.enums";
import { FormUtils } from "@/src/utils/form.utils";
import clsx from "clsx";
import { FieldError } from "react-hook-form";

type TextAreaI = React.InputHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  error?: FieldError;
  resize?: boolean;
  rows?: number;
  role?: RolesEnum;
};

const TextArea = (props: TextAreaI) => {
  const {
    disabled,
    error,
    id,
    role,
    label,
    name,
    required = false,
    resize = false,
    rows = 8,
  } = props;

  return (
    <div>
      <span
        className={clsx(
          "pointer-events-none start-2.5  rounded bg-white p-0.5  ",
          role === RolesEnum.CONSUMER && " text-consumer-blue",
          role === RolesEnum.VIGIL && " text-vigil-orange",
          error && "text-red-500",
          disabled && "!bg-gray-100"
        )}>
        {label}
        {required && <>*</>}
      </span>
      <label
        htmlFor={name || label}
        className={clsx(
          "relative block p-3 rounded-md border border-gray-200 bg-white shadow-sm focus-within:border-gray focus-within:ring-1 focus-within:ring-gray-200",
          role === RolesEnum.CONSUMER &&
            "text-gray-700 placeholder:text-consumer-orange  border-consumer-blue focus-within:border-consumer-blue focus-within:ring-consumer-blue ",
          role === RolesEnum.VIGIL &&
            " text-gray-700 placeholder:text-vigil-orange focus-within:border-vigil-orange  focus-within:ring-vigil-orange border-vigil-orange",
          error && "border-red-500",
          disabled && "!bg-gray-100 cursor-not-allowed"
        )}>
        <textarea
          {...{
            ...props,
            error: undefined,
            icon: undefined,
            resize: undefined,
            role,
            rows,
          }}
          id={id || name || label}
          className={clsx(
            "w-full whitespace-pre-wrap  border-none bg-transparent focus:border-transparent focus:outline-none focus:ring-0",
            disabled && "cursor-not-allowed",
            role === RolesEnum.CONSUMER && " border-consumer-blue",
            role === RolesEnum.VIGIL && " border-vigil-orange"
          )}
          style={{ resize: resize ? "block" : "none" }}
        />

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

export default TextArea;
