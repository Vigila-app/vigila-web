import { FieldError } from "react-hook-form";
import { ErrorMessages } from "@/src/constants/errorMessages.constants";

const getErrorByType = (error: FieldError) => {
  switch (error.type) {
    case "required":
      return ErrorMessages.FORM.FIELD_REQUIRED;
    case "minLength":
      return ErrorMessages.FORM.VALUE_TOO_SHORT;
    case "maxLength":
      return ErrorMessages.FORM.VALUE_TOO_LONG;
    case "pattern":
      return ErrorMessages.FORM.FORMAT_INVALID;
    case "custom":
      return error.message || ErrorMessages.FORM.VALUE_INCORRECT;
    default:
      return ErrorMessages.FORM.VALUE_INCORRECT;
  }
};

export const FormUtils = { getErrorByType };
