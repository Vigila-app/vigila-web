import { Input, TextArea } from "@/components/form"
import { getInputType } from "@/src/utils/questionType.utils"
import { QuestionRendererProps } from "@/src/types/multiStepOnboard.types"

export const TextLikeInput = ({
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
    type={getInputType(question.type)}
    required={question.validation?.required}
    minLength={question.validation?.minLength}
    maxLength={question.validation?.maxLength}
    role={role}
    error={error}
    autoFocus={question.autoFocus}
  />
)

export const TextAreaInput = ({
  question,
  onChange,
  role,
  error,
  value,
}: QuestionRendererProps) => (
  <TextArea
    label={question.label}
    placeholder={question.placeholder}
    value={value || ""}
    onChange={(val) => onChange(val)}
    required={question.validation?.required}
    minLength={question.validation?.minLength}
    maxLength={question.validation?.maxLength}
    role={role}
    error={error}
  />
)
