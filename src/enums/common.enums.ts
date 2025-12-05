export enum GenderEnum {
  FEMALE = "female",
  MALE = "male",
  OTHER = "other",
  NOT_PROVIDED = "not-provided",
}

export enum FrequencyEnum {
  SECONDS = "seconds",
  MINUTES = "minutes",
  HOURS = "hours",
  DAYS = "days",
  MONTHS = "months",
  YEARS = "years",
}

export enum ProviderEnum {
  GOOGLE = "google",
  APPLE = "apple",
}

export enum RecaptchaActionEnum {
  LOGIN = "login",
  SIGNUP = "signup",
  RESET_PASSWORD = "password_reset",
}

export enum CurrencyEnum {
  EURO = "€",
  US_DOLLAR = "$",
  GB_POUND = "£",
}

export enum OccupationEnum {
  STUDENT = "studente",
  UNEMPLOYED = "disoccupato",
  OSS = "oss",
  NURSE = "infermiere",
  EMPLOYEE = "impiegato",
  OTHER = "altro",
}

export const OccupationLabels: Record<OccupationEnum, string> = {
  [OccupationEnum.STUDENT]: "Studente",
  [OccupationEnum.UNEMPLOYED]: "Disoccupato",
  [OccupationEnum.OSS]: "Operatore Socio Sanitario (OSS)",
  [OccupationEnum.NURSE]: "Infermiere",
  [OccupationEnum.EMPLOYEE]: "Impiegato",
  [OccupationEnum.OTHER]: "Altro",
};
