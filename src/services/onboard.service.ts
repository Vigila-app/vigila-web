import { ApiService } from ".";
import { apiOnboard } from "../constants/api.constants";
import { RolesEnum } from "../enums/roles.enums";

export const OnboardService = {
  update: async (
    userID: string,
    role: RolesEnum,
    formData: { birthdate: string; city: string; CAP: string }
  ) =>
    new Promise(async (res, rej) => {
      try {
        const { birthdate, city, CAP } = formData;
        const response = await ApiService.post(
          apiOnboard.ONBOARD(userID, role),
          {
            birthdate,
            city,
            CAP,
          }
        );

        res(response);
      } catch (error) {
        console.error("Update of profile error", error);
        rej(error);
      }
    }),
};
