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
  // APPLE = "apple",
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

// export enum OccupationEnum {
//   STUDENT = "studente",
//   UNEMPLOYED = "disoccupato",
//   OSA = "osa",
//   OSS = "oss",
//   NURSE = "infermiere",
//   EMPLOYEE = "impiegato",
//   PART_TIME_EMPLOYEE = "impiegato-part-time",
//   FAMILY_CAREGIVER = "assistente-familiare",
//   OTHER = "altro",
// }

export enum OccupationEnum {
  FULLTIME_CAREGIVER = "badante",
  PROFESSIONAL = "oss_ota_osa",
  NURSE = "infermiere",
  FAMILY_CAREGIVER = "assistente-familiare",
  COMPANY = "compagnia-e-supporto",
}

export const OccupationLabels: Record<OccupationEnum, string> = {
  [OccupationEnum.FULLTIME_CAREGIVER]: "Badante convivente",
  [OccupationEnum.PROFESSIONAL]: "OSS/OTA/OSA",
  [OccupationEnum.NURSE]: "Infermiere",
  [OccupationEnum.FAMILY_CAREGIVER]: "Assistente familiare a ore",
  [OccupationEnum.COMPANY]: "Operatore/trice per compagnia e supporto leggero",
}
