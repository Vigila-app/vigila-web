import { ErrorI } from "@/src/types/error.types";
import { ErrorMessages } from "@/src/constants/errorMessages.constants";

const getErrorByCode = (error: ErrorI) => {
  if (!error.show) return;
  switch (error.code) {
    case "required":
      return ErrorMessages.FORM.FIELD_REQUIRED;
    case "minLength":
      return ErrorMessages.FORM.VALUE_TOO_SHORT;
    case "maxLength":
      return ErrorMessages.FORM.VALUE_TOO_LONG;
    case "custom":
      return error.message || ErrorMessages.GENERIC.DEFAULT;
    default:
      return ErrorMessages.GENERIC.DEFAULT;
  }
};

export const ErrorUtils = {
  getErrorByCode,
};
