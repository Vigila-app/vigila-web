import { SupabaseConstants } from "@/src/constants/supabase.constants";
import { RecaptchaActionEnum } from "@/src/enums/common.enums";
import { ApiService } from "@/src/services/api.service";
import { isDev, isMocked } from "@/src/utils/envs.utils";
import { apiRecaptcha } from "@/src/constants/api.constants";

type RecaptchaChallangeI = {
  riskAnalysis: {
    reasons: string[];
    score: number;
  };
  tokenProperties: {
    action: string;
    invalidReason: string;
    valid: boolean;
  };
};

export const RecaptchaService = {
  getAppToken: async (action: RecaptchaActionEnum) =>
    new Promise(async (resolve, reject) => {
      try {
        if (isDev || isMocked) resolve("true");
        // @ts-ignore
        const token = await grecaptcha?.enterprise?.execute?.(
          SupabaseConstants.appCheckPublicKey,
          { action }
        );
        if (token) {
          resolve(token);
        } else {
          reject();
        }
      } catch (error) {
        console.error(error);
        reject(error);
      }
    }),
  evaluateChallange: async (
    challange: RecaptchaChallangeI,
    reqAction: RecaptchaActionEnum
  ) =>
    new Promise(async (resolve, reject) => {
      try {
        const { tokenProperties, riskAnalysis } = challange;
        const { action, valid = false } = tokenProperties;
        const { score = 0 } = riskAnalysis;
        if (valid && action === reqAction) {
          if (score >= 0.7) {
            resolve(challange);
          } else {
            console.error(
              "RecaptchaService evaluateChallange score error",
              `Requested action: ${reqAction}`,
              challange
            );
            reject();
          }
        } else {
          console.error(
            "RecaptchaService evaluateChallange error",
            `Requested action: ${reqAction}`,
            challange
          );
          reject();
        }
      } catch (error) {
        console.error(error);
        reject(error);
      }
    }),
  checkAppToken: async (action: RecaptchaActionEnum, token?: string) =>
    new Promise(async (resolve, reject) => {
      try {
        if (isDev || isMocked) {
          resolve(true);
        } else if (token) {
          const response = (await ApiService.post(apiRecaptcha.VALIDATE(), {
            event: {
              token,
              siteKey: SupabaseConstants.appCheckPublicKey as string,
              expectedAction: action,
            },
          })) as {
            data: RecaptchaChallangeI;
          };
          if (response?.data) {
            try {
              await RecaptchaService.evaluateChallange(response.data, action);
              resolve(response);
            } catch (error) {
              console.error(error);
              reject(error);
            }
          } else {
            reject();
          }
        } else {
          const newToken = (await RecaptchaService.getAppToken(
            action
          )) as string;
          if (newToken) {
            const challange = await RecaptchaService.checkAppToken(
              action,
              newToken
            );
            resolve(challange);
          } else {
            reject();
          }
        }
      } catch (error) {
        console.error(error);
        reject(error);
      }
    }),
};
