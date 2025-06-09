import { ApiService } from "@/src/services";
import { apiSales } from "@/src/constants/api.constants";
import { SaleI } from "@/src/types/sales.types";

export const SalesService = {
  getSales: async () =>
    new Promise<SaleI[]>(async (resolve, reject) => {
      try {
        const { data: response = [] } = (await ApiService.get(
          apiSales.LIST()
        )) as { data: SaleI[] };
        resolve(response);
      } catch (error) {
        console.error("SalesService getSales error", error);
        reject(error);
      }
    }),
  getSaleDetails: async (saleId: SaleI["id"]) =>
    new Promise<SaleI>(async (resolve, reject) => {
      try {
        const { data: saleDetails } = (await ApiService.get(
          apiSales.DETAILS(saleId)
        )) as { data: SaleI };
        resolve(saleDetails);
      } catch (error) {
        console.error("SalesService getSaleDetails error", error);
        reject(error);
      }
    }),
};
