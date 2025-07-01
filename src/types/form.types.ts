import { RolesEnum } from "../enums/roles.enums";

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
export type AddressData={
 label:string;
  city:string;
  region?:string;
  province?:string;
  quarter?:string;
  cap:string;
  lat:number;
  lng:number;
}

export interface VigilFormData {
  birthdate: string;
  occupation?: string;
  transportation?: string;
  addresses:AddressData[];
  // cap: string;
}
export type RoleBasedFormData =
  | { role: RolesEnum.VIGIL; data: VigilFormData }
  | { role: RolesEnum.CONSUMER; data: ConsumerFormData };
