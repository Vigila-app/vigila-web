import { FrequencyEnum } from "@/src/enums/common.enums";
import { ServicesService } from "@/src/services";
import { ServiceI, ServicesStoreType } from "@/src/types/services.types";
import { dateDiff } from "@/src/utils/date.utils";
import { isDev } from "@/src/utils/envs.utils";
import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

const initServicesStore: {
  services: ServicesStoreType["services"];
  lastUpdate: ServicesStoreType["lastUpdate"];
} = {
  services: [],
  lastUpdate: undefined,
};

export const useServicesStore = create<ServicesStoreType>()(
  devtools(
    persist(
      (set, get) => ({
        ...initServicesStore,
        getServices: async (force: boolean = false) => {
          try {
            const lastUpdate = get().lastUpdate;
            if (
              force ||
              !lastUpdate ||
              dateDiff(new Date(), lastUpdate, FrequencyEnum.MINUTES) > 5
            ) {
              const response = await ServicesService.getServices();
              if (response) {
                set(
                  () => ({
                    services: Object.values(response),
                    lastUpdate: new Date(),
                  }),
                  false,
                  { type: "getServices" }
                );
              }
            }
          } catch (error) {
            console.error("useServicesStore getServices error:", error);
          }
        },
        getServiceDetails: async (serviceId: ServiceI["id"], force = false) => {
          try {
            const getServiceDetailsBE = async () => {
              try {
                const serviceStoreBE = await ServicesService.getServiceDetails(
                  serviceId
                );
                if (get().services?.length) {
                  set(
                    () => ({
                      services: get().services.map((service) => {
                        if (service.id === serviceId) {
                          return serviceStoreBE;
                        }
                        return service;
                      }),
                      lastUpdate: new Date(),
                    }),
                    false,
                    { type: "getServiceDetails", serviceId }
                  );
                } else {
                  set(
                    () => ({
                      services: [...get().services, serviceStoreBE],
                      lastUpdate: new Date(),
                    }),
                    false,
                    { type: "getServiceDetails", serviceId }
                  );
                }
                return serviceStoreBE;
              } catch (error) {
                return;
              }
            };

            if (
              force ||
              !get().lastUpdate ||
              dateDiff(new Date(), get().lastUpdate, FrequencyEnum.MINUTES) > 5
            ) {
              // TODO retrieve service details from BE
              const serviceStoreBE = await getServiceDetailsBE();
              if (serviceStoreBE?.id) {
                return serviceStoreBE;
              }
              return;
            } else {
              const serviceStore = get().services.find(
                (service) => service.id === serviceId
              );
              if (serviceStore?.id) {
                return serviceStore;
              } else {
                // TODO retrieve service details from BE
                const serviceStoreBE = await getServiceDetailsBE();
                if (serviceStoreBE?.id) {
                  return serviceStoreBE;
                }
                return;
              }
            }
          } catch (error) {
            console.error("useServicesStore getServiceDetails error:", error);
          }
        },
        deleteService: async (serviceId: ServiceI["id"]) => {
          try {
            await ServicesService.deleteService(serviceId);
            get().getServices(true);
          } catch (error) {
            console.error("useServicesStore deleteService error:", error);
          }
        },
        resetLastUpdate: async () => {
          try {
            set({ lastUpdate: undefined }, false, { type: "resetLastUpdate" });
          } catch (error) {
            console.error("useServicesStore resetLastUpdate error:", error);
          }
        },
        onLogout: () => {
          set(initServicesStore, false, { type: "onLogout" });
        },
      }),
      {
        name: "services",
        storage: createJSONStorage(() => sessionStorage),
      }
    ),
    { enabled: isDev, anonymousActionType: "services" }
  )
);
