import { FrequencyEnum } from "@/src/enums/common.enums";
import { SalesService } from "@/src/services/sales.service";
import { SaleI, SalesStoreType } from "@/src/types/sales.types";
import { dateDiff } from "@/src/utils/date.utils";
import { isDev } from "@/src/utils/envs.utils";
import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

const initSalesStore: {
  sales: SalesStoreType["sales"];
  lastUpdate: SalesStoreType["lastUpdate"];
} = {
  sales: [],
  lastUpdate: undefined,
};

export const useSalesStore = create<SalesStoreType>()(
  devtools(
    persist(
      (set, get) => ({
        ...initSalesStore,
        getSales: async (force: boolean = false) => {
          try {
            const lastUpdate = get().lastUpdate;
            if (
              force ||
              !lastUpdate ||
              dateDiff(new Date(), lastUpdate, FrequencyEnum.MINUTES) > 5
            ) {
              const response = await SalesService.getSales();
              if (response) {
                set(
                  () => ({
                    sales: Object.values(response),
                    lastUpdate: new Date(),
                  }),
                  false,
                  { type: "getSales" }
                );
              }
            }
          } catch (error) {
            console.error("useSalesStore getSales error:", error);
          }
        },
        getSaleDetails: async (saleId: SaleI["id"], force = false) =>
          new Promise<SaleI>(async (resolve, reject) => {
            try {
              const getSaleDetailsBE = async () => {
                try {
                  const saleStoreBE = await SalesService.getSaleDetails(
                    saleId
                  );
                  if (get().sales?.length) {
                    set(
                      () => ({
                        sales: get().sales.map((sale) => {
                          if (sale.id === saleId) {
                            return saleStoreBE;
                          }
                          return sale;
                        }),
                      }),
                      false,
                      { type: "getSaleDetails", saleId }
                    );
                  } else {
                    set(
                      () => ({
                        sales: [...get().sales, saleStoreBE],
                      }),
                      false,
                      { type: "getSaleDetails", saleId }
                    );
                  }
                  resolve(saleStoreBE);
                } catch (error) {
                  reject(error);
                }
              };

              if (
                force ||
                !get().lastUpdate ||
                dateDiff(new Date(), get().lastUpdate, FrequencyEnum.MINUTES) >
                  5
              ) {
                // TODO retrieve sale details from BE
                const saleStoreBE =
                  (await getSaleDetailsBE()) as unknown as SaleI;
                if (saleStoreBE?.id) {
                  resolve(saleStoreBE);
                }
                reject();
              } else {
                const saleStore = get().sales.find(
                  (sale) => sale.id === saleId
                );
                if (saleStore?.id) {
                  resolve(saleStore);
                } else {
                  // TODO retrieve sale details from BE
                  const saleStoreBE =
                    (await getSaleDetailsBE()) as unknown as SaleI;
                  if (saleStoreBE?.id) {
                    resolve(saleStoreBE);
                  }
                  reject();
                }
              }
            } catch (error) {
              console.error("useSalesStore getSaleDetails error:", error);
              reject(error);
            }
          }),
        resetLastUpdate: async () => {
          try {
            set({ lastUpdate: undefined }, false, { type: "resetLastUpdate" });
          } catch (error) {
            console.error("useSalesStore resetLastUpdate error:", error);
          }
        },
        onLogout: () => {
          set(initSalesStore, false, { type: "onLogout" });
        },
      }),
      {
        name: "sales",
        storage: createJSONStorage(() => sessionStorage),
      }
    ),
    { enabled: isDev, anonymousActionType: "sales" }
  )
);
