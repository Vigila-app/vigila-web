import { RolesEnum } from "@/src/enums/roles.enums";
import { AddressI } from "./maps.types";

export type FormFieldRegex = {
  [fieldName: string]: {
    min?: number;
    max?: number;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
  };
};

export interface ConsumerFormData {
  lovedOneName: string;
  lovedOneAge: string;
  relationship: string;
  city: string;
  cap: string;
  yourName: string;
}
export type AddressData = {
  label?: string;
  city: string;
  state?: string;
  region?: string;
  province?: string;
  quarter?: string;
  street?: string;
  cap?: string;
  lat?: number;
  lon?: number;
};

export interface VigilFormData {
  birthday: string;
  occupation?: string;
  transportation?: string;
  phone?: string;
  information?: string;
  addresses: AddressI[];
  cap: string[];
}
export type RoleBasedFormData =
  | { role: RolesEnum.VIGIL; data: VigilFormData }
  | { role: RolesEnum.CONSUMER; data: ConsumerFormData };
