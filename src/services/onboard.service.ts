import { ApiService } from ".";
import { apiOnboard } from "../constants/api.constants";
import { RolesEnum } from "../enums/roles.enums";
import type {
  VigilFormData,
  ConsumerFormData,
  RoleBasedFormData,
} from "@/src/types/form.types";

export const OnboardService = {
  update: async (userID: string, formInput: RoleBasedFormData): Promise<any> =>
    new Promise(async (res, rej) => {
      try {
        const { role, data } = formInput;

        const response = await ApiService.post(
          apiOnboard.ONBOARD(userID, role),
          data
        );

        res(response);
      } catch (error) {
        console.error("Update of profile error", error);
        rej(error);
      }
    }),
};
// export const OnboardService = {
//   update: async (
//     userID: string,
//     role: RolesEnum,
//     formData:Partial< FormData>

//   ) =>
//     new Promise(async (res, rej) => {
//       try {

//         const response = await ApiService.post(
//           apiOnboard.ONBOARD(userID, role),
//           formData
//         );

//         res(response);
//       } catch (error) {
//         console.error("Update of profile error", error);
//         rej(error);
//       }
//     }),
// };
