import { ApiService } from "@/src/services";
import { apiCostumers } from "@/src/constants/api.constants";
import { getUUID } from "@/src/utils/common.utils";
import { GuestI } from "@/src/types/crm.types";

export const CrmService = {
  createCustomer: async (newCustomer: GuestI) =>
    new Promise<GuestI>(async (resolve, reject) => {
      try {
        const { data: service } = (await ApiService.post(apiCostumers.CREATE(), newCustomer)) as { data: GuestI };
        resolve(service);
      } catch (error) {
        console.error("CrmService createCustomer error", error);
        reject(error);
      }
    }),
  editCustomer: async (customer: GuestI) =>
    new Promise<GuestI>(async (resolve, reject) => {
      try {
        if (!customer.id) reject();
        const { data: result } = (await ApiService.put(
          apiCostumers.DETAILS(customer.id),
          customer
        )) as { data: GuestI };
        resolve(result);
      } catch (error) {
        console.error("CrmService editCustomer error", error);
        reject(error);
      }
    }),
  deleteCustomer: async (guestId: GuestI["id"]) =>
    new Promise<boolean>(async (resolve, reject) => {
      try {
        if (!guestId) reject();
        await ApiService.delete(apiCostumers.DETAILS(guestId));
        resolve(true);
      } catch (error) {
        console.error("CrmService deleteCustomer error", error);
        reject(error);
      }
    }),
  getCustomers: async () =>
    new Promise<GuestI[]>(async (resolve, reject) => {
      try {
        const result = (await ApiService.get(
          apiCostumers.LIST()
        )) as { data: GuestI[] };
        // TODO manage pagination
        const { data: response = [] } = result;
        resolve(response);
      } catch (error) {
        console.error("CrmService getCustomers error", error);
        reject(error);
      }
    }),
  getCustomerDetails: async (guestId: GuestI["id"]) =>
    new Promise<GuestI>(async (resolve, reject) => {
      try {
        const { data: guestDetails } = (await ApiService.get(
          apiCostumers.DETAILS(guestId)
        )) as { data: GuestI };
        resolve(guestDetails);
      } catch (error) {
        console.error("CrmService getCustomerDetails error", error);
        reject(error);
      }
    }),
};
