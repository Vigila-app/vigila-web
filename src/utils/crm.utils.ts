import { UserService } from "@/src/services";
import { GuestI } from "@/src/types/crm.types";
import { capitalize } from "@/src/utils/common.utils";

export const CrmUtils = {
  createNewGuest: async (newGuest: GuestI) =>
    new Promise<GuestI>(async (resolve, reject) => {
      try {
        let host_id = newGuest.host_id;
        if (!host_id) {
          const { id } = (await UserService.getUser()) || {};
          if (id) host_id = id;
        }
        resolve({
          ...newGuest,
          active: newGuest.active != null ? Boolean(newGuest.active) : true,
          name: capitalize(newGuest.name),
          surname: capitalize(newGuest.surname),
          host_id,
        });
      } catch (error) {
        reject(error);
      }
    }),
};
