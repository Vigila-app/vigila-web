import { RouteI } from "@/src/types/route.types";
import { UserType } from "@/src/types/user.types";
import { UserService } from "@/src/services";

export const PermitGuardUtils = {
  isAuthorized: async (route: RouteI, user?: UserType) =>
    new Promise(async (resolve) => {
      try {
        const { private: isPrivate, roles = [] } = route;
        let sessionUser = user;
        let valid = true;
      

        if (isPrivate) {
          if (!sessionUser?.id) {
            sessionUser = await UserService.getUser() as UserType;
          }
          valid = valid && !!sessionUser?.id;

          if (roles.length && sessionUser?.user_metadata?.role) {
            valid = valid && roles.includes(sessionUser?.user_metadata?.role);
          } else if (roles.length) {
            valid = false;
          }
        }

        // TODO other check

        resolve(valid);
      } catch (error) {
        console.error("PermitGuardUtils isAuthorized error", error);
        resolve(false);
      }
    }),
};
