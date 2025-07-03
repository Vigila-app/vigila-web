import { ApiService } from "@/src/services/api.service";
import { apiOnboard } from "@/src/constants/api.constants";

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

