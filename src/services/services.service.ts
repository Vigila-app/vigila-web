import { ApiService } from "@/src/services";
import { apiServices } from "@/src/constants/api.constants";
import { ServiceI } from "@/src/types/services.types";

export const ServicesService = {
  createService: async (newService: ServiceI) =>
    new Promise<ServiceI>(async (resolve, reject) => {
      try {
        const { data: service } = (await ApiService.post(
          apiServices.CREATE(),
          newService
        )) as { data: ServiceI };
        resolve(service);
      } catch (error) {
        console.error("ServicesService createService error", error);
        reject(error);
      }
    }),
  editService: async (service: ServiceI) =>
    new Promise<ServiceI>(async (resolve, reject) => {
      try {
        if (!service.id) reject();
        const { data: result } = (await ApiService.put(
          apiServices.DETAILS(service.id),
          { ...service, lastUpdateDate: new Date() }
        )) as { data: ServiceI };
        resolve(result);
      } catch (error) {
        console.error("ServicesService editService error", error);
        reject(error);
      }
    }),
  deleteService: async (serviceId: ServiceI["id"]) =>
    new Promise<boolean>(async (resolve, reject) => {
      try {
        if (!serviceId) reject();
        await ApiService.delete(apiServices.DETAILS(serviceId));
        resolve(true);
      } catch (error) {
        console.error("ServicesService deleteService error", error);
        reject(error);
      }
    }),
  getServices: async (vigil_id: ServiceI["vigil_id"]) =>
    new Promise<ServiceI[]>(async (resolve, reject) => {
      try {
        const { data: response = [] } = (await ApiService.get(
          apiServices.LIST(),
          { vigil_id }
        )) as { data: ServiceI[] };
        resolve(response);
      } catch (error) {
        console.error("ServicesService getServices error", error);
        reject(error);
      }
    }),
  getServiceDetails: async (serviceId: ServiceI["id"]) =>
    new Promise<ServiceI>(async (resolve, reject) => {
      try {
        const { data: serviceDetails } = (await ApiService.get(
          apiServices.DETAILS(serviceId)
        )) as { data: ServiceI };
        resolve(serviceDetails);
      } catch (error) {
        console.error("ServicesService getServiceDetails error", error);
        reject(error);
      }
    }),
};
