import { ServiceI } from "@/src/types/services.types";
import { FrequencyEnum } from "@/src/enums/common.enums";
import {
  VigilOutdoorServiceEnum,
  VigilHygieneServiceEnum,
} from "@/src/enums/onboarding.enums";
import { VigilCapabilities, VigilDataType } from "@/src/types/vigil.types";

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
      default:
        return "ore";
      case FrequencyEnum.DAYS:
        return "giorni";
    }
  },
};

export function getVigilCapabilities(vigil: VigilDataType): VigilCapabilities {
  const hasTransport =
    !!vigil.outdoor_services?.length &&
    !vigil.outdoor_services.every((s) => s === VigilOutdoorServiceEnum.NONE);

  const hygieneServices =
    vigil.hygene_services?.filter((s) => s !== VigilHygieneServiceEnum.NONE) ??
    [];

  return { hasTransport, hygieneServices };
}
