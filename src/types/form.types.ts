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
// export type FormData = {
//   birthdate: string;
//   city: string;
//   CAP: string;
//   yourName: string;
//   lovedOneName: string;
//   lovedOneAge: string;
//   relationship: string;
//   occupation: string;
//   transportation: string;
// };
export interface ConsumerFormData {
  lovedOneName: string;
  lovedOneAge: string;
  relationship: string;
  city: string;
  CAP: string;
  yourName: string;
}

export interface VigilFormData {
  birthdate: string;
  occupation?: string;
  transportation?: string;
  city: string;
  CAP: string;
}
export type RoleBasedFormData =
  | { role: RolesEnum.VIGIL; data: VigilFormData }
  | { role: RolesEnum.CONSUMER; data: ConsumerFormData };
