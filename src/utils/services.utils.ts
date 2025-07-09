import { ServiceI } from "@/src/types/services.types";

export const ServicesUtils = {
  createNewService: async (newService: ServiceI) =>
    new Promise<ServiceI>(async (resolve, reject) => {
      try {
        resolve({
          ...newService,
          updated_at: new Date(),
        });
      } catch (error) {
        reject(error);
      }
    }),
  getServiceUnitType: (unitType: string) => {
    switch (unitType) {
      case "hours":
        return "ora";
      case "days":
        return "giorno";
      default:
        return unitType;
    }
  },
};
