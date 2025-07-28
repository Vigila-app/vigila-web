import { apiAltcha } from "@/src/constants/api.constants";
import { ApiService } from "@/src/services/api.service";

export const AltchaService = {
  verifyChallenge: async (captcha: string) =>
    new Promise(async (resolve, reject) => {
      try {
        const result = await ApiService.post(apiAltcha.VALIDATE(), { captcha });
        if (result) {
          resolve(result);
        } else {
          reject();
        }
      } catch (error) {
        console.error("AltchaService verifyChallenge error", error);
        reject(error);
      }
    }),
};
