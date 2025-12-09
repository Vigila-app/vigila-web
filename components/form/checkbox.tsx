"use client";

import { RolesEnum } from "@/src/enums/roles.enums";
import { FormUtils } from "@/src/utils/form.utils";
import clsx from "clsx";
import { FieldError } from "react-hook-form";

type CheckboxI = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: FieldError;
  onChange?: (checked: boolean) => void;
  role?: RolesEnum;
};

const Checkbox = (props: CheckboxI) => {
  const {
    disabled,
    error,
    id,
    label,
    role,
    name,
    required = false,
    onChange,
  } = props;

  return (
    <label
      htmlFor={name || label}
      className={clsx(
        "relative flex cursor-pointer items-start gap-2",
        role === RolesEnum.VIGIL && "text-vigil-orange",
        role === RolesEnum.CONSUMER && "text-consumer-blue",
        error && "!border-red-500",
        disabled && "opacity-75 !cursor-not-allowed"
      )}>
      <div
        className={clsx("flex items-center", disabled && "cursor-not-allowed")}>
        &#8203;
        <input
          {...{ ...props, type: "checkbox", error: undefined, icon: undefined }}
          className={clsx(
            "appearance-none  size-4 rounded-sm border border-gray-400 ",
            role === RolesEnum.VIGIL && "checked:bg-vigil-orange ",
            role === RolesEnum.CONSUMER && "checked:bg-consumer-blue ",

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
              "text-sm",
              role === RolesEnum.VIGIL && "checked:bg-vigil-orange",
              role === RolesEnum.CONSUMER && "checked:bg-consumer-blue",
              error && "text-red-500",
              disabled && "!opacity-75 cursor-not-allowed"
            )}>
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
