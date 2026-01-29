import { Checkbox } from "@/components/form";
import { RolesEnum } from "@/src/enums/roles.enums";
import { QuestionRendererProps } from "@/src/types/multiStepOnboard.types";
import clsx from "clsx";

export const RadioInput = ({
  question,
  onChange,
  role,
  error,
  value,
}: QuestionRendererProps) => {
  return (
    <div>
      <label
        className={clsx(
          "block font-medium mb-2 text-center text-xl",
          role === RolesEnum.VIGIL && "text-vigil-orange",
          role === RolesEnum.CONSUMER && "text-consumer-blue",
        )}>
        {question.label}
      </label>

      <div className="flex flex-wrap  gap-4 mt-2 items-center justify-center">
        {question.options?.map((option, idx) => {
          const isChecked = value === option.value;
          if (!question.options) return;
          // If last item and odd number, make it flex-basis full
          const isLastOdd =
            question.options.length % 2 === 1 &&
            idx === question.options.length - 1;
          return (
            <div
              key={option.value}
              className={clsx(
                "cursor-pointer p-2 w-full border-2 border-grey-200 rounded-3xl py-3 flex-1 min-w-[45%] ]",
                isLastOdd && "max-w-full flex-[0_0_100%]",
                isChecked &&
                  role === RolesEnum.VIGIL &&
                  "border-vigil-orange bg-vigil-light-orange text-vigil-orange",
                isChecked &&
                  role === RolesEnum.CONSUMER &&
                  "border-consumer-blue bg-consumer-light-blue text-consumer-blue",
              )}>
              <label
                key={option.value}
                htmlFor={option.label}
                className="cursor-pointer flex flex-col items-center gap-2 w-full">
                {option.icon && (
                  <option.icon
                    className={`text-gray-400 max-w-1/15 ${
                      isChecked
                        ? clsx(
                            role === RolesEnum.VIGIL && "text-vigil-orange",
                            role === RolesEnum.CONSUMER && "text-consumer-blue",
                          )
                        : ""
                    }`}
                  />
                )}
                {option.label}
                <div className="hidden">
                  <Checkbox
                    id={option.label}
                    label={option.label}
                    role={role}
                    checked={isChecked}
                    onChange={() => onChange(option.value)}
                    error={error}
                  />
                </div>
              </label>
            </div>
          );
        })}
      </div>
    </div>
  );
};
