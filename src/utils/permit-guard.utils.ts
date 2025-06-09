import { RouteI } from "@/src/types/route.types";
import { UserType } from "@/src/types/user.types";
import { UserService } from "@/src/services";

export const PermitGuardUtils = {
  isAuthorized: async (route: RouteI, user?: UserType) =>
    new Promise(async (resolve) => {
      try {
        const { private: isPrivate } = route;
        let { id } = user || {};
        let valid = true;

        if (isPrivate) {
          // checking private routes & authentication
          if (!id) {
            const user = await UserService.getUser();
            id = user?.id;
          }
          valid = valid && !!id;
        }

        // TODO other check

        resolve(valid);
      } catch (error) {
        console.error("PermitGuardUtils isAuthorized error", error);
        resolve(false);
      }
    }),
};
