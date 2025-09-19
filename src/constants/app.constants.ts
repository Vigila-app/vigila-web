import { AccessLevelsEnum, RolesEnum } from "@/src/enums/roles.enums";
import { isMocked } from "@/src/utils/envs.utils";

export const AppConstants = {
  title: "Vigila App",
  description: "Is a simple base-app based on Next.js and Supabase",
  hostUrl: isMocked
    ? "http://localhost:3000"
    : "https://todo-define-url.vercel.app",
  defaultUserRole: RolesEnum.CONSUMER,
  defaultUserLevel: AccessLevelsEnum.BASE,
  cs_id: process.env.NEXT_PUBLIC_CONTENTSQUARE_ID,
};
