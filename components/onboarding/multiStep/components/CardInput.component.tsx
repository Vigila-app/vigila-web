import { RolesEnum } from "@/src/enums/roles.enums";
import { QuestionRendererProps } from "@/src/types/multiStepOnboard.types";
import clsx from "clsx";

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
          "block font-medium mb-2 text-center text-xl ",
          role === RolesEnum.VIGIL && "text-vigil-orange",
          role === RolesEnum.CONSUMER && "text-consumer-blue",
        )}
      >
        {question.label}
      </label>

      <div className="flex flex-col gap-2 md:gap-4 mt-2">
        {" "}
        {question.options?.map((option) => {
          const isChecked = value === option.value;

          return (
            <div
              key={option.value}
              onClick={() => onChange(option.value)}
              className={clsx(
                "cursor-pointer relative w-full px-4 py-2 md:p-4 rounded-4xl border-1 transition-all duration-200 flex flex-col items-center justify-center gap-2 ",

                !isChecked && "bg-white border-gray-300  hover:border-gray-400",

                isChecked &&
                  role === RolesEnum.VIGIL &&
                  "border-vigil-orange bg-vigil-light-orange text-vigil-orange ",
                isChecked &&
                  role === RolesEnum.CONSUMER &&
                  "border-consumer-blue bg-consumer-light-blue text-consumer-blue ",
              )}
            >
              {option.icon && (
                <option.icon
                  className={clsx(
                    "w-7 h-7",
                    !isChecked && "text-gray-400",
                    isChecked &&
                      role === RolesEnum.VIGIL &&
                      "text-vigil-orange ",
                    isChecked &&
                      role === RolesEnum.CONSUMER &&
                      "text-consumer-blue ",
                  )}
                />
              )}

              <span
                className={clsx(
                  option.description ? "font-medium" : "font-normal",
                  " text-xl text-center ",
                )}
              >
                {option.label}
              </span>
              {option.description && (
                <span className={clsx("text-base text-center font-normal")}>
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
          );
        })}
      </div>
    </div>
  );
};
