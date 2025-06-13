import { ApiService } from "@/src/services";
import { apiProva } from "@/src/constants/api.constants";

export const ProvaService = {
  getData: async () => {
    try {
      const response = await ApiService.get(apiProva.PROVA());
      return response;
    } catch (error) {
      console.error("ProvaService getData error", error);
      throw error;
    }
  },
};