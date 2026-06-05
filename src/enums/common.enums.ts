import { Asterisk, Couple, Man, NonBinary, Woman } from "@/components/svg";
import { ComponentType, SVGProps } from "react";

export enum GenderEnum {
  MALE = "male",
  FEMALE = "female",
  NB = "non_binary",
  OTHER = "other",
  NA = "not-specified",
}
export const GenderLabels: Record<GenderEnum, string> = {
  [GenderEnum.FEMALE]: "Donna",
  [GenderEnum.MALE]: "Uomo",
  [GenderEnum.NB]: "Non Binario",
  [GenderEnum.OTHER]: "Altro",
  [GenderEnum.NA]: "Preferisco non specificare",
};

export const GenderDescriptions: Record<GenderEnum, string> = {
  [GenderEnum.FEMALE]: "Preferibilmente una donna",
  [GenderEnum.MALE]: "Preferibilmente un uomo",
  [GenderEnum.NB]: "Preferibilmente non binario",
  [GenderEnum.OTHER]: "Preferibilmente altro",
  [GenderEnum.NA]: "Preferisco non specificare",
};
export const GenderIcons: Record<
  GenderEnum,
  ComponentType<SVGProps<SVGSVGElement>>
> = {
  [GenderEnum.FEMALE]: Woman,
  [GenderEnum.MALE]: Man,
  [GenderEnum.NB]: NonBinary,
  [GenderEnum.OTHER]: Asterisk,
  [GenderEnum.NA]: Couple,
};
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
