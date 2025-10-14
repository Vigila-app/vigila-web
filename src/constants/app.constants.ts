import { AccessLevelsEnum, RolesEnum } from "@/src/enums/roles.enums";
import { isMocked } from "@/src/utils/envs.utils";

export const AppConstants = {
  title: "Vigila",
  description: "Is a simple base-app based on Next.js and Supabase",
  hostUrl: isMocked ? "http://localhost:3000" : "https://vigila.org",
  defaultUserRole: RolesEnum.CONSUMER,
  defaultUserLevel: AccessLevelsEnum.BASE,
  cs_id: process.env.NEXT_PUBLIC_CONTENTSQUARE_ID,
  instagramUrl: "https://www.instagram.com/vigila.or",
  facebookUrl: "https://www.facebook.com/vigila",
  linkedinUrl: "https://www.linkedin.com/company/vigila",
  youtubeUrl: "https://www.youtube.com/@vigila",
  whatsappUrl:
    "https://wa.me/393292130529?text=Salve%2C%20ho%20bisogno%20di%20assistenza%20cliente%21",
};
