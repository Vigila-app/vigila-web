import { FieldError } from "react-hook-form";

const defaultError = "The value is not correct";
const getErrorByType = (error: FieldError) => {
  switch (error.type) {
    case "required":
      return "This field is required";
    case "minLength":
      return "The value is too short";
    case "maxLength":
      return "The value is too long";
    case "pattern":
      return "The format is not valid";
    case "custom":
      return error.message || defaultError;
    default:
      return defaultError;
  }
};

export const FormUtils = { getErrorByType };
