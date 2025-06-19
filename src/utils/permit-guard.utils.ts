import { RouteI } from "@/src/types/route.types";
import { UserType } from "@/src/types/user.types";
import { UserService } from "@/src/services";

export const PermitGuardUtils = {
  isAuthorized: async (route: RouteI, user?: UserType) =>
    new Promise(async (resolve) => {
      try {
        const { private: isPrivate, roles = [] } = route;
        let { id } = user || {};
        let valid = true;

        if (isPrivate) {
          if (!id) {
            const sessionUser = await UserService.getUser();
            id = sessionUser?.id;
          }
          valid = valid && !!id;

          if (roles.length && user?.user_metadata?.role) {
            valid = valid && roles.includes(user?.user_metadata?.role);
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
