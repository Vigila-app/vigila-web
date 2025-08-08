import { ApiService } from "@/src/services";
import { apiServices } from "@/src/constants/api.constants";
import { ServiceI, ServiceCatalogItem } from "@/src/types/services.types";
import { ServiceCatalogTypeEnum } from "@/src/enums/services.enums";
import servicesCatalogJson from "@/mock/cms/services-catalog.json";

const convertCatalogData = (jsonData: any): ServiceCatalogItem[] => {
  return jsonData.services_catalog.map((item: any) => ({
    ...item,
    type: item.type as ServiceCatalogTypeEnum,
  }));
};

const servicesCatalogData: ServiceCatalogItem[] =
  convertCatalogData(servicesCatalogJson);

export const ServicesService = {
  createService: (newService: ServiceI) =>
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
  editService: (service: ServiceI) =>
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
  deleteService: (serviceId: ServiceI["id"]) =>
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
  getServices: (
    vigil_id: ServiceI["vigil_id"],
    filters: Record<string, any> = {}
  ) =>
    new Promise<ServiceI[]>(async (resolve, reject) => {
      try {
        const { data: response = [] } = (await ApiService.get(
          apiServices.LIST(),
          { vigil_id, ...filters }
        )) as { data: ServiceI[] };
        resolve(response);
      } catch (error) {
        console.error("ServicesService getServices error", error);
        reject(error);
      }
    }),
  getServiceDetails: (serviceId: ServiceI["id"]) =>
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

  getServicesCatalog: (): ServiceCatalogItem[] => {
    return servicesCatalogData;
  },

  getServiceCatalogById: (id: number): ServiceCatalogItem | undefined => {
    return servicesCatalogData.find((service) => service.id === id);
  },

  getServicesByType: (type: ServiceCatalogTypeEnum): ServiceCatalogItem[] => {
    return servicesCatalogData.filter((service) => service.type === type);
  },

  searchServicesByTag: (tag: string): ServiceCatalogItem[] => {
    const lowerCaseTag = tag.toLowerCase();
    return servicesCatalogData.filter((service) =>
      service.tags.some((serviceTag) =>
        serviceTag.toLowerCase().includes(lowerCaseTag)
      )
    );
  },
};
