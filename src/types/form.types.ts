export type FormFieldRegex = {
  [fieldName: string]: {
    min?: number;
    max?: number;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
  };
};
