import { AccessLevelsEnum, RolesEnum } from "@/src/enums/roles.enums";

export const AppConstants = {
    title: "Vigila App",
    description: "Is a simple base-app based on Next.js and Supabase",
    hostUrl: "https://todo-define-url.vercel.app",
    defaultUserRole: RolesEnum.HOST,
    defaultUserLevel: AccessLevelsEnum.BASE,
};