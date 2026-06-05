import { apiVigil } from "@/src/constants/api.constants";
import { FrequencyEnum } from "@/src/enums/common.enums";
import { ApiService } from "@/src/services";
import {
  VigilDataType,
  VigilDetailsType,
  ViglStoreType,
} from "@/src/types/vigil.types";
import { dateDiff } from "@/src/utils/date.utils";
import { isDev } from "@/src/utils/envs.utils";
import { createStoreDebouncer } from "@/src/utils/store-debounce.utils";
import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

const initVigilStore: {
  lastUpdateDetails?: Date;
  lastUpdateData?: Date;
  vigils: VigilDetailsType[];
  vigilsData: VigilDataType[];
} = {
  lastUpdateDetails: undefined,
  lastUpdateData: undefined,
  vigils: [],
  vigilsData: [],
};

// Crea il debouncer per lo store dei vigil
const { createDebouncedAction } = createStoreDebouncer("vigil-store");

export const useVigilStore = create<ViglStoreType>()(
  devtools(
    persist(
      (set, get) => ({
        ...initVigilStore,
        getVigilsDetails: async (vigils: string[], force = false) => {
          const action = async () => {
            try {
              const getVigilsDetailsBE = async () => {
                try {
                  const promises = vigils
                    .filter((vigilId) =>
                      force ||
                      !get().lastUpdateDetails ||
                      dateDiff(
                        new Date(),
                        get().lastUpdateDetails,
                        FrequencyEnum.MINUTES,
                      ) > 15
                        ? vigilId
                        : !get().vigils.find((vigil) => vigil.id === vigilId),
                    )
                    .map((vigilId) =>
                      ApiService.get<{ data: VigilDetailsType }>(
                        apiVigil.DETAILS(vigilId),
                      ),
                    );
                  if (!promises?.length) {
                    return get().vigils.filter((v) => vigils.includes(v.id));
                  }
                  const vigilsDetailsStoreBE = await Promise.all(promises);
                  if (!vigilsDetailsStoreBE?.length) {
                    throw new Error("No vigils details found");
                  } else {
                    const newVigils = vigilsDetailsStoreBE
                      .filter(
                        (item): item is { data: VigilDetailsType } =>
                          item !== undefined,
                      )
                      .map(({ data }) => data);

                    {
                      const mergedMap = new Map<string, VigilDetailsType>(
                        get().vigils.map((v) => [v.id, v]),
                      );
                      newVigils.forEach((v) => mergedMap.set(v.id, v));
                      const mergedVigils = Array.from(mergedMap.values());

                      set(
                        () => ({
                          vigils: mergedVigils,
                          lastUpdateDetails: new Date(),
                        }),
                        false,
                        { type: "getVigilsDetails" },
                      );
                      return newVigils;
                    }
                  }
                } catch (error) {
                  throw error;
                }
              };

              return await getVigilsDetailsBE();
            } catch (error) {
              console.error("useVigilStore getVigilsDetails error:", error);
              throw error;
            }
          };

          const uniqueKey = vigils.slice().sort().join(",");
          return createDebouncedAction(
            "getVigilsDetails",
            action,
            force,
            uniqueKey,
          );
        },
        onLogout: () => {
          set(initVigilStore, false, { type: "onLogout" });
        },
        getVigilData: async (vigilId: string, force = false) => {
          const action = async () => {
            try {
              const lastUpdateData = get().lastUpdateData;
              if (!force && lastUpdateData) {
                const existing = get().vigilsData.find(
                  (vd) => vd.vigil_id === vigilId,
                );
                if (
                  existing &&
                  dateDiff(new Date(), lastUpdateData, FrequencyEnum.MINUTES) <=
                    15
                ) {
                  return existing;
                }
              }

              const result = await ApiService.get<{ data: VigilDataType }>(
                apiVigil.DATA(vigilId),
              );

              if (!result?.data) return null;

              const newData = result.data;
              const existingData = get().vigilsData || [];
              const mergedMap = new Map<string, VigilDataType>();
              existingData.forEach((vd) => mergedMap.set(vd.vigil_id, vd));
              mergedMap.set(newData.vigil_id, newData);

              set(
                () => ({
                  vigilsData: Array.from(mergedMap.values()),
                  lastUpdateData: new Date(),
                }),
                false,
                { type: "getVigilData" },
              );

              return newData;
            } catch (error) {
              console.error("useVigilStore getVigilData error:", error);
              throw error;
            }
          };

          return createDebouncedAction("getVigilData", action, force, vigilId);
        },
      }),
      {
        name: "vigil",
        storage: createJSONStorage(() => sessionStorage),
      },
    ),
    { enabled: isDev, anonymousActionType: "vigil" },
  ),
);
