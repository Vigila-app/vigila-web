import { ServiceI } from "@/src/types/services.types";
import { FrequencyEnum } from "@/src/enums/common.enums";

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
      case FrequencyEnum.HOURS:
        return "ore";
      case FrequencyEnum.DAYS:
        return "giorni";
      default:
        return unitType;
    }
  },
};
