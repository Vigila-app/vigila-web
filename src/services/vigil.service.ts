import { ApiService } from "@/src/services";
import { apiVigil } from "@/src/constants/api.constants";
import { VigilDetailsType } from "@/src/types/vigil.types";

export const VigilService = {
  getVigilDetails: async (vigilId: VigilDetailsType["id"]) => {
    try {
      const { data: response } = (await ApiService.get(
        apiVigil.DETAILS(vigilId),
      )) as { data: VigilDetailsType };
      return response;
    } catch (error) {
      console.error("VigilService getVigilDetails error", error);
      throw error;
    }
  },
};
