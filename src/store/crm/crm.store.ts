import { FrequencyEnum } from "@/src/enums/common.enums";
import { CrmService } from "@/src/services";
import { CrmStoreType, GuestI } from "@/src/types/crm.types";
import { dateDiff } from "@/src/utils/date.utils";
import { isDev } from "@/src/utils/envs.utils";
import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

const initCrmStore: {
  customers: CrmStoreType["customers"];
  lastUpdate: CrmStoreType["lastUpdate"];
} = {
  customers: [],
  lastUpdate: undefined,
};

export const useCrmStore = create<CrmStoreType>()(
  devtools(
    persist(
      (set, get) => ({
        ...initCrmStore,
        getCustomers: async (force: boolean = false) => {
          try {
            const lastUpdate = get().lastUpdate;
            if (
              force ||
              !lastUpdate ||
              dateDiff(new Date(), lastUpdate, FrequencyEnum.MINUTES) > 5
            ) {
              const response = await CrmService.getCustomers();
              if (response) {
                set(
                  () => ({
                    customers: Object.values(response),
                    lastUpdate: new Date(),
                  }),
                  false,
                  { type: "getCustomers" }
                );
              }
            }
          } catch (error) {
            console.error("useCrmStore getCustomers error:", error);
          }
        },
        getCustomerDetails: async (
          guestId: GuestI["id"],
          force = false
        ) => {
          try {
            const getCustomerDetailsBE = async () => {
              try {
                const customerStoreBE = await CrmService.getCustomerDetails(
                  guestId
                );
                if (get().customers?.length) {
                  set(
                    () => ({
                      customers: get().customers.map((customer) => {
                        if (customer.id === guestId) {
                          return customerStoreBE;
                        }
                        return customer;
                      }),
                      lastUpdate: new Date(),
                    }),
                    false,
                    { type: "getCustomerDetails", guestId }
                  );
                } else {
                  set(
                    () => ({
                      customers: [...get().customers, customerStoreBE],
                      lastUpdate: new Date(),
                    }),
                    false,
                    { type: "getCustomerDetails", guestId }
                  );
                }
                return customerStoreBE;
              } catch (error) {
                return;
              }
            };

            if (
              force ||
              !get().lastUpdate ||
              dateDiff(new Date(), get().lastUpdate, FrequencyEnum.MINUTES) > 5
            ) {
              // TODO retrieve customer details from BE
              const customerStoreBE = await getCustomerDetailsBE();
              if (customerStoreBE?.id) {
                return customerStoreBE;
              }
              return;
            } else {
              const customerStore = get().customers.find(
                (customer) => customer.id === guestId
              );
              if (customerStore?.id) {
                return customerStore;
              } else {
                // TODO retrieve customer details from BE
                const customerStoreBE = await getCustomerDetailsBE();
                if (customerStoreBE?.id) {
                  return customerStoreBE;
                }
                return;
              }
            }
          } catch (error) {
            console.error("useCrmStore getCustomerDetails error:", error);
          }
        },
        deleteCustomer: async (guestId: GuestI["id"]) => {
          try {
            await CrmService.deleteCustomer(guestId);
            get().getCustomers(true);
          } catch (error) {
            console.error("useCrmStore deleteCustomer error:", error);
          }
        },
        resetLastUpdate: async () => {
          try {
            set({ lastUpdate: undefined }, false, { type: "resetLastUpdate" });
          } catch (error) {
            console.error("useCrmStore resetLastUpdate error:", error);
          }
        },
        onLogout: () => {
          set(initCrmStore, false, { type: "onLogout" });
        },
      }),
      {
        name: "crm",
        storage: createJSONStorage(() => sessionStorage),
      }
    ),
    { enabled: isDev, anonymousActionType: "crm" }
  )
);
