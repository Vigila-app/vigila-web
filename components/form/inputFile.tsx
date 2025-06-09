"use client";

import { FormUtils } from "@/src/utils/form.utils";
import clsx from "clsx";
import { useState } from "react";
import { FieldError } from "react-hook-form";

type InputFileI = React.InputHTMLAttributes<HTMLInputElement> & {
  error?: FieldError;
  hidden?: boolean;
  label: string;
  maxSize?: number;
  type?: "image" | "file";
  onFileUpload?: (
    file: string | ArrayBuffer | File,
    metadata: { contentType: string; name: string }
  ) => void;
};

const InputFileExtension = {
  image: "image/png, image/jpg, image/jpeg",
  file: "",
};

const InputFile = (props: InputFileI) => {
  const {
    error: extError,
    hidden = false,
    id,
    maxSize = 500000,
    name,
    label,
    type = "file",
    onFileUpload = () => ({}),
    required = false,
  } = props;
  const [error, setError] = useState<FieldError | undefined>(extError);

  const checkFile = (file?: File) => {
    if (file) {
      if (!InputFileExtension[type].includes(file.type)) {
        setError({ type: "custom", message: "File type not supported" });
        return false;
      }
      if (file.size > maxSize) {
        setError({ type: "custom", message: "File size too big" });
        return false;
      }
      return true;
    }

    return false;
  };

  const handleReadFile = (file: File) => {
    const fileReader = new FileReader();
    fileReader.onload = async () => {
      if (fileReader?.result)
        onFileUpload(file, {
          contentType: file.type,
          name: file.name,
        });
    };
    fileReader.readAsDataURL(file);
  };

  const onSelectedFile = (e: React.FormEvent<HTMLInputElement>) => {
    const file = e?.currentTarget?.files?.[0];
    if (file && checkFile(file)) {
      handleReadFile(file);
    }
  };

  return (
    <label
      htmlFor={name || label}
      className={clsx(
        "relative block p-3 rounded-md border border-gray-200 bg-white shadow-sm focus-within:border-primary-600 focus-within:ring-1 focus-within:ring-primary-600",
        error && "border-red-500",
        hidden && "sr-only p-8 opacity-0 cursor-pointer"
      )}
    >
      <input
        {...{
          ...props,
          error: undefined,
          hidden: undefined,
          onFileUpload: undefined,
        }}
        type="file"
        accept={InputFileExtension[type]}
        id={id || name || label}
        className={clsx(
          "w-full peer border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0",
          hidden && "sr-only"
        )}
        onChange={onSelectedFile}
      />

      <span
        className={clsx(
          "pointer-events-none absolute start-2.5 top-0 -translate-y-1/2 rounded bg-white p-0.5 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs",
          error && "text-red-500",
          hidden && "sr-only"
        )}
      >
        {label}
        {required && <>*</>}
      </span>

      {error ? (
        <p
          role="alert"
          className={clsx(
            "absolute start-2.5 top-12 text-xs text-red-500",
            hidden && "sr-only"
          )}
        >
          {FormUtils.getErrorByType(error)}
        </p>
      ) : null}
    </label>
  );
};

export default InputFile;
