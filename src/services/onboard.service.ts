import { ApiService } from ".";
import { apiOnboard } from "../constants/api.constants";

export const OnboardService = {
  update: async (formData: { birthdate: string; city: string; CAP: string }) =>
    new Promise(async (res, rej) => {
      try {
        const { birthdate, city, CAP } = formData;
        const response = await ApiService.post(apiOnboard.UPDATE(), {
          birthdate,
          city,
          CAP,
        });
        res(response);
      } catch (error) {
        console.error("Update of profile error", error);
        rej(error);
      }
    }),
};
