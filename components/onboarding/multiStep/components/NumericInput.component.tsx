import { Input } from "@/components/form";
import { QuestionRendererProps } from "@/src/types/multiStepOnboard.types";

export const NumericInput = ({
  question,
  onChange,
  role,
  error,
  value,
}: QuestionRendererProps) => (
  <Input
    label={question.label}
    placeholder={question.placeholder}
    value={value || ""}
    onChange={(val) => onChange(val)}
    type="number"
    required={question.validation?.required}
    min={question.validation?.min}
    max={question.validation?.max}
    role={role}
    error={error}
    autoFocus={question.autoFocus}
  />
);
