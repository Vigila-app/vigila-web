import { apiVigil } from "@/src/constants/api.constants";
import { FrequencyEnum } from "@/src/enums/common.enums";
import { ApiService, UserService } from "@/src/services";
import { VigilDetailsType, ViglStoreType } from "@/src/types/vigil.types";
import { dateDiff } from "@/src/utils/date.utils";
import { isDev } from "@/src/utils/envs.utils";
import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

const initVigilStore: {
  lastUpdate?: ViglStoreType["lastUpdate"];
  vigils: VigilDetailsType[];
} = {
  lastUpdate: undefined,
  vigils: [],
};

export const useVigilStore = create<ViglStoreType>()(
  devtools(
    persist(
      (set, get) => ({
        ...initVigilStore,
        getVigilsDetails: async (vigils, force = false) =>
          new Promise(async (resolve, reject) => {
            try {
              const getVigilsDetailsBE = async () => {
                try {
                  const promises = vigils
                    .filter((vigilId) =>
                      !force
                        ? vigilId
                        : !get().vigils.find((vigil) => vigil.id === vigilId)
                    )
                    .map((vigilId) =>
                      ApiService.get<{ data: VigilDetailsType }>(
                        apiVigil.DETAILS(vigilId)
                      )
                    );
                  if (!promises?.length) {
                    throw new Error("No vigils to fetch details for");
                  }
                  const vigilsDetailsStoreBE = await Promise.all(promises);
                  if (!vigilsDetailsStoreBE?.length) {
                    throw new Error("No vigils details found");
                  } else {
                    set(
                      () => ({
                        vigils: Array.from(
                          new Set([
                            ...get().vigils,
                            ...vigilsDetailsStoreBE
                              .filter(
                                (item): item is { data: VigilDetailsType } =>
                                  item !== undefined
                              )
                              .map(({ data }) => data),
                          ])
                        ),
                        lastUpdate: new Date(),
                      }),
                      false,
                      { type: "getVigilsDetails" }
                    );
                    resolve(
                      vigilsDetailsStoreBE
                        .filter(
                          (item): item is { data: VigilDetailsType } =>
                            item !== undefined
                        )
                        .map(({ data }) => data)
                    );
                  }
                } catch (error) {
                  reject(error);
                }
              };

              if (
                force ||
                !get().lastUpdate ||
                dateDiff(new Date(), get().lastUpdate, FrequencyEnum.MINUTES) >
                  15
              ) {
                // TODO retrieve vigils details from BE
                const vigilsDetailsStoreBE =
                  (await getVigilsDetailsBE()) as unknown as VigilDetailsType[];
                if (vigilsDetailsStoreBE) {
                  resolve(vigilsDetailsStoreBE);
                }
                reject();
              } else {
                const vigilsDetailsStore = get().vigils;
                if (vigilsDetailsStore) {
                  resolve(vigilsDetailsStore);
                } else {
                  // TODO retrieve vigils details from BE
                  const vigilsDetailsStoreBE =
                    (await getVigilsDetailsBE()) as unknown as VigilDetailsType[];
                  if (vigilsDetailsStoreBE) {
                    resolve(vigilsDetailsStoreBE);
                  }
                  reject();
                }
              }
            } catch (error) {
              reject(error);
            }
          }),
        onLogout: () => {
          set(initVigilStore, false, { type: "onLogout" });
        },
      }),
      {
        name: "vigil",
        storage: createJSONStorage(() => sessionStorage),
      }
    ),
    { enabled: isDev, anonymousActionType: "vigil" }
  )
);
