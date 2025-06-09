import { ErrorI } from "@/src/types/error.types";

const defaultError = "An error occurred";
const getErrorByCode = (error: ErrorI) => {
  if (!error.show) return;
  switch (error.code) {
    case "required":
      return "The field is required";
    case "minLength":
      return "The value is too short";
    case "maxLength":
      return "The value is too long";
    case "custom":
      return error.message || defaultError;
    default:
      return defaultError;
  }
};

export const ErrorUtils = {
  getErrorByCode,
};
