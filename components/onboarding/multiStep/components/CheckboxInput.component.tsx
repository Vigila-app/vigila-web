import { Checkbox } from "@/components/form"
import { RolesEnum } from "@/src/enums/roles.enums"
import { QuestionRendererProps } from "@/src/types/multiStepOnboard.types"
import clsx from "clsx"

export const CheckboxInput = ({
  question,
  onChange,
  role,
  error,
  value,
}: QuestionRendererProps) => {
  return (
    <Checkbox
      label={question.label}
      role={role}
      checked={!!value}
      onChange={(checked) => onChange(checked)}
      error={error}
    />
  )
}



export const MulticheckboxInput = ({
  question,
  onChange,
  role,
  error,
  value,
  
}: QuestionRendererProps) => {
  const currentValues = Array.isArray(value) ? value : [];
  const reachedMax = question.max && currentValues.length >= question.max;
  console.log(reachedMax)
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
      {question.description && (
        <p className="text-sm text-gray-600 mb-3">{question.description}</p>
      )}
      <div
        className={clsx(
          question.options?.[0].icon
            ? "space-y-2"
            : `grid grid-cols-2 align-center gap-2 justify-center`,
        )}
      >
        {question.options?.map((option) => {
          const isChecked = currentValues.includes(option.value);
          const isDisabled = !!(!isChecked && reachedMax);
          return (
            <div
              key={option.value}
              className={clsx(
                option.icon ? "border-3 rounded-xl" : "border-1 rounded-3xl",
                "p-2 border-grey-200",
                isChecked &&
                  role === RolesEnum.VIGIL &&
                  "border-vigil-orange bg-vigil-light-orange",
                isChecked &&
                  role === RolesEnum.CONSUMER &&
                  "border-consumer-blue bg-vigil-light-blue",
                isDisabled && "opacity-50 pointer-events-none"
              )}
            >
              <label
                key={option.value}
                htmlFor={option.label}
                className="flex flex-col items-center gap-2"
              >
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
                    disabled={isDisabled}
                    onChange={(checked) => {
                      let newValues;
                      if (checked) {
                        if (!reachedMax) {
                          newValues = [...currentValues, option.value];
                          onChange(newValues);
                        } else {
                          newValues = currentValues;
                        }
                      } else {
                        newValues = currentValues.filter((v) => v !== option.value);
                        onChange(newValues);
                      }
                      console.log(newValues);
                    }}
                    error={error}
                  />
                </div>
              </label>
            </div>
          );
        })}
      </div>
      {typeof question.max === 'number' && (
        <p className="text-xs text-gray-500 mt-1">{`Max selezionabili: ${question.max}`}</p>
      )}
    </div>
  );
}
