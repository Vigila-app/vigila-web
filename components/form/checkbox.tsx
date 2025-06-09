"use client";

import { FormUtils } from "@/src/utils/form.utils";
import clsx from "clsx";
import { FieldError } from "react-hook-form";

type CheckboxI = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: FieldError;
  onChange?: (checked: boolean) => void;
};

const Checkbox = (props: CheckboxI) => {
  const {
    disabled,
    error,
    id,
    label,
    name,
    required = false,
    onChange,
  } = props;

  return (
    <label
      htmlFor={name || label}
      className={clsx(
        "relative flex cursor-pointer items-start gap-2",
        error && "!border-red-500",
        disabled && "opacity-75 !cursor-not-allowed"
      )}
    >
      <div
        className={clsx("flex items-center", disabled && "cursor-not-allowed")}
      >
        &#8203;
        <input
          {...{ ...props, type: "checkbox", error: undefined, icon: undefined }}
          className={clsx(
            "size-4 rounded border-gray-300",
            error && "!border-red-500",
            disabled && "cursor-not-allowed"
          )}
          id={id || name || label}
          onChange={({ currentTarget: { checked } }) => onChange?.(checked)}
        />
      </div>

      {label ? (
        <div>
          <span
            className={clsx(
              "text-sm text-gray-700",
              error && "text-red-500",
              disabled && "!opacity-75 cursor-not-allowed"
            )}
          >
            {label}
            {required && <>*</>}
          </span>
        </div>
      ) : null}

      {error ? (
        <p role="alert" className="absolute start-6 top-6 text-xs text-red-500">
          {FormUtils.getErrorByType(error)}
        </p>
      ) : null}
    </label>
  );
};

export default Checkbox;
