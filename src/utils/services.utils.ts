import { UserService } from "@/src/services";
import { ServiceI } from "@/src/types/services.types";
import { capitalize, getUUID } from "@/src/utils/common.utils";

export const ServicesUtils = {
  createNewService: async (newService: ServiceI) =>
    new Promise<ServiceI>(async (resolve, reject) => {
      try {
        let ownerId = newService.ownerId;
        if (!ownerId) {
          const { id } = (await UserService.getUser()) || {};
          if (id) ownerId = id;
        }
        resolve({
          active: newService.active != null ? Boolean(newService.active) : true,
          id: newService.id || getUUID("SERVICE"),
          creationDate: newService.creationDate || new Date(),
          lastUpdateDate: new Date(),
          name: capitalize(newService.name),
          description: capitalize(newService.description),
          price: newService.price,
          currency: newService.currency,
          ownerId,
        });
      } catch (error) {
        reject(error);
      }
    }),
};
