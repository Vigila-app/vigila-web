import { Input } from "@/components/form"
import { QuestionRendererProps } from "@/src/types/multiStepOnboard.types"

export const DateInput = ({
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
    type="date"
    required={question.validation?.required}
    role={role}
    error={error}
    autoFocus={question.autoFocus}
  />
)
