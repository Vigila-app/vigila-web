import { RolesEnum } from "@/src/enums/roles.enums"
import { QuestionRendererProps } from "@/src/types/multiStepOnboard.types"
import clsx from "clsx"

export const CardInput = ({
  question,
  onChange,
  role,
  value,
}: QuestionRendererProps) => {
  return (
    <div>
      <label
        className={clsx(
          "block font-medium mb-2 text-center text-xl",
          role === RolesEnum.VIGIL && "text-vigil-orange",
          role === RolesEnum.CONSUMER && "text-consumer-blue",
        )}
      >
        {question.label}
      </label>

      <div className="flex flex-col gap-4 mt-2">
        {" "}
        {question.options?.map((option) => {
          const isChecked = value === option.value

          return (
            <div
              key={option.value}
              onClick={() => onChange(option.value)}
              className={clsx(
                "cursor-pointer relative w-full p-4 rounded-2xl border-2 transition-all duration-200 flex flex-col items-center justify-center gap-2 min-h-[100px]",

                !isChecked && "bg-white border-gray-200  hover:border-gray-300",

                isChecked &&
                  role === RolesEnum.VIGIL &&
                  "border-vigil-orange bg-vigil-light-orange ",
                isChecked &&
                  role === RolesEnum.CONSUMER &&
                  "border-consumer-blue bg-consumer-light-blue ",
              )}
            >
              {option.icon && (
                <option.icon
                  className={clsx(
                    "w-8 h-8",
                    isChecked ? "text-current" : "text-gray-400",
                  )}
                />
              )}

              <span className="font-medium text-lg ">{option.label}</span>
              {option.description && (
                <span className="text-sm text-center">
                  {option.description}
                </span>
              )}

              <input
                type="radio"
                name={question.id}
                value={option.value}
                checked={isChecked}
                onChange={() => onChange(option.value)}
                className="hidden"
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}
