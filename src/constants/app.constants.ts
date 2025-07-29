import { AccessLevelsEnum, RolesEnum } from "@/src/enums/roles.enums";
import { isMocked } from "@/src/utils/envs.utils";
import { isServer } from "../utils/common.utils";

export const AppConstants = {
  title: "Vigila App",
  description: "Is a simple base-app based on Next.js and Supabase",
  hostUrl: isMocked
    ? "http://localhost:3000"
    : isServer
      ? "https://todo-define-url.vercel.app"
      : window.location.origin,
  defaultUserRole: RolesEnum.CONSUMER,
  defaultUserLevel: AccessLevelsEnum.BASE,
};
