import { ApiService } from "@/src/services/api.service";
import { apiOnboard } from "@/src/constants/api.constants";

import type { RoleBasedFormData } from "@/src/types/form.types";
import { RolesEnum } from "@/src/enums/roles.enums";
import { ServiceI } from "@/src/types/services.types";
import { UserService } from "@/src/services/user.service";
import { ServicesService } from "@/src/services/services.service";

export const OnboardService = {
  update: (formInput: RoleBasedFormData, services?: ServiceI[]): Promise<any> =>
    new Promise(async (res, rej) => {
      try {
        const { role, data } = formInput;

        const user = await UserService.getUser();
        console.log(data)
        if (user?.id) {
          const response = await ApiService.post(
            apiOnboard.ONBOARD(user?.id, role),
            data
          );

          if (role === RolesEnum.VIGIL) {
            if (services?.length) {
              await Promise.all(
                services.map((service) =>
                  ServicesService.createService(service)
                )
              );
            }
          }

          res(response);
        } else {
          throw new Error("User not authenticated");
        }
      } catch (error) {
        console.error("Update of profile error", error);
        rej(error);
      }
    }),
};
