import { ServiceI } from "@/src/types/services.types";

export const ServicesUtils = {
  createNewService: async (newService: ServiceI) => {
    try {
      return {
        ...newService,
        updated_at: new Date(),
      };
    } catch (error) {
      throw error;
    }
  },
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
