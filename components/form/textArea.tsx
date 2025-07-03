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
    rows = 3,
  } = props;

  return (
    <label
      htmlFor={name || label}
      className={clsx(
        "relative block p-3 rounded-md border border-gray-200 bg-white shadow-sm focus-within:border-primary-600 focus-within:ring-1 focus-within:ring-primary-600",
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
          "w-full peer border-none bg-transparent focus:border-transparent focus:outline-none focus:ring-0",
          disabled && "cursor-not-allowed",
          role === RolesEnum.CONSUMER && " border-consumer-blue",
          role === RolesEnum.VIGIL && " border-vigil-orange"
        )}
        style={{ resize: resize ? "block" : "none" }}
      />

      <span
        className={clsx(
          "pointer-events-none absolute start-2.5 top-0 -translate-y-1/2 rounded bg-white p-0.5 text-xs transition-all peer-placeholder-shown:top-0 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs",
          error && "text-red-500",
          disabled && "!bg-gray-100",
          role === RolesEnum.CONSUMER && " text-consumer-blue",
          role === RolesEnum.VIGIL && " text-vigil-orange"
        )}>
        {label}
        {required && <>*</>}
      </span>

      {error ? (
        <p
          role="alert"
          className="absolute start-2.5 -bottom-4 text-xs text-red-500">
          {FormUtils.getErrorByType(error)}
        </p>
      ) : null}
    </label>
  );
};

export default TextArea;
