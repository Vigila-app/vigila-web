import { RolesEnum } from "@/src/enums/roles.enums"
import { QuestionRendererProps } from "@/src/types/multiStepOnboard.types"
import {
  ExclamationTriangleIcon,
  PlusIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline"
import clsx from "clsx"
import { Input } from "@/components/form"
import { ChangeEvent, useEffect, useRef, useState } from "react"
interface FileInputI {
  setFileError: (str: string | null) => void
  fileError: string | null
}
export const FileInput = ({
  question,
  onChange,
  role,
  error,
  value: file,
  setFileError,
  fileError,
}: QuestionRendererProps & FileInputI) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const maxSize = question.validation?.file?.maxSize || 5 * 1024 * 1024 // 5MB default
  const allowedMimes = question.validation?.file?.allowedMimes || [
    "image/jpeg",
    "image/png",
  ]
  useEffect(() => {
    if (!file) {
      setPreviewUrl(null)
      onChange(null)
      return
    }
    // Validate file size
    if (file.size > maxSize) {
      const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(1)
      setFileError(`File size must not exceed ${maxSizeMB}MB`)
      setPreviewUrl(null)
      onChange(null)
      return
    }
    // Validate file type
    if (!allowedMimes.includes(file.type)) {
      setFileError(
        `Only ${allowedMimes.map((m) => m.split("/")[1].toUpperCase()).join(", ")} files are allowed`,
      )
      setPreviewUrl(null)
      onChange(null)
      return
    }
    // Set preview for images
    if (file && file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
      return () => URL.revokeObjectURL(url)
    } else {
      setPreviewUrl(null)
    }
    onChange(file)
  }, [file])

  return (
    <div>
      <label
        className={clsx(
          "block font-medium mb-2",
          role === RolesEnum.VIGIL && "text-vigil-orange",
          role === RolesEnum.CONSUMER && "text-consumer-blue",
        )}
      >
        {question.label}
        {question.validation?.required && "*"}
      </label>

      <div className="flex flex-col gap-3 items-center">
        <div
          className={clsx(
            "relative flex flex-col items-center justify-center w-32 h-32 rounded-full border-2 border-dashed cursor-pointer transition-colors duration-150",
            error || fileError
              ? "border-red-400 bg-red-50"
              : role === RolesEnum.VIGIL
              ? "border-vigil-orange/60 hover:border-vigil-orange/90 bg-vigil-light-orange/30"
              : "border-consumer-blue/60 hover:border-consumer-blue/90 bg-consumer-light-blue/30"
          )}
          onClick={() => inputRef.current?.click()}
        >
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Preview"
              className="object-cover w-full h-full rounded-full"
            />
          ) : (
            <span className="text-gray-400 text-sm flex flex-col items-center justify-center px-2"><PlusIcon className="w-1/2"/></span>
          )}
          <input
            ref={inputRef}
            type="file"
            accept={allowedMimes.join(",")}
            onChange={e => {
              setFileError(null)
              const file = e.target.files?.[0]
              if (file) onChange(file)
            }}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            autoFocus={question.autoFocus}
            tabIndex={-1}
          />
        </div>
          <div className="text-sm text-gray-400">JPG, PNG, max 5mb</div>
        {file && (
          <div className="flex items-center justify-between w-full max-w-xs p-3 rounded-lg border-2 mt-2"
            style={{
              borderColor: role === RolesEnum.VIGIL ? '#ff9800' : '#3b82f6',
              background: role === RolesEnum.VIGIL ? '#fff7ed' : '#e0f2fe',
            }}
          >
            <span className="text-sm font-medium truncate">{file.name}</span>
            <button
              type="button"
              onClick={() => {
                onChange(null)
                setFileError(null)
                setPreviewUrl(null)
                if (inputRef.current) inputRef.current.value = ""
              }}
              className="text-red-500 hover:text-red-700 ml-2"
              aria-label="Remove file"
            >
              <XCircleIcon className="w-5 h-5" />
            </button>
          </div>
        )}

        <div className="min-h-[1.5em] w-full">
          {(error || fileError) && (
            <p className="text-red-500 text-sm flex items-center gap-1 mt-1">
              <ExclamationTriangleIcon className="w-4 h-4" />
              {fileError || error?.message}
            </p>
          )}
        </div>

        {question.placeholder && (
          <p className="text-xs text-gray-500 text-center">{question.placeholder}</p>
        )}
      </div>
    </div>
  )
}
