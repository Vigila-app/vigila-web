import { apiConsumer } from "@/src/constants/api.constants";
import { FrequencyEnum } from "@/src/enums/common.enums";
import { ApiService } from "@/src/services";
import {
  ConsumerDetailsType,
  ConsumerStoreType,
} from "@/src/types/consumer.types";
import { dateDiff } from "@/src/utils/date.utils";
import { isDev } from "@/src/utils/envs.utils";
import { createStoreDebouncer } from "@/src/utils/store-debounce.utils";
import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

const initConsumerStore: {
  lastUpdate?: ConsumerStoreType["lastUpdate"];
  consumers: ConsumerDetailsType[];
} = {
  lastUpdate: undefined,
  consumers: [],
};

// Crea il debouncer per lo store consumer
const { createDebouncedAction } = createStoreDebouncer('consumer-store');

export const useConsumerStore = create<ConsumerStoreType>()(
  devtools(
    persist(
      (set, get) => ({
        ...initConsumerStore,
        getConsumersDetails: async (consumers: string[], force = false) => {
          const action = async () => {
            try {
              const getConsumersDetailsBE = async () => {
                try {
                  const promises = consumers
                    .filter((consumerId) =>
                      force ||
                      !get().lastUpdate ||
                      dateDiff(
                        new Date(),
                        get().lastUpdate,
                        FrequencyEnum.MINUTES
                      ) > 15
                        ? consumerId
                        : !get().consumers.find(
                            (consumer) => consumer.id === consumerId
                          )
                    )
                    .map((consumerId) =>
                      ApiService.get<{ data: ConsumerDetailsType }>(
                        apiConsumer.DETAILS(consumerId)
                      )
                    );
                  if (!promises?.length) {
                    return get().consumers.filter(c => consumers.includes(c.id));
                  }
                  const consumersDetailsStoreBE = await Promise.all(promises);
                  if (!consumersDetailsStoreBE?.length) {
                    throw new Error("No consumer details found");
                  } else {
                    const newConsumers = consumersDetailsStoreBE
                      .filter(
                        (item): item is { data: ConsumerDetailsType } =>
                          item !== undefined
                      )
                      .map(({ data }) => data);
                    
                    set(
                      () => ({
                        consumers: Array.from(
                          new Set([
                            ...get().consumers,
                            ...newConsumers,
                          ])
                        ),
                        lastUpdate: new Date(),
                      }),
                      false,
                      { type: "getConsumersDetails" }
                    );
                    return newConsumers;
                  }
                } catch (error) {
                  throw error;
                }
              };
              
              return await getConsumersDetailsBE();
            } catch (error) {
              console.error("useConsumerStore getConsumersDetails error:", error);
              throw error;
            }
          };

          const uniqueKey = consumers.sort().join(',');
          return createDebouncedAction('getConsumersDetails', action, force, uniqueKey);
        },
        onLogout: () => {
          set(initConsumerStore, false, { type: "onLogout" });
        },
      }),
      {
        name: "consumer",
        storage: createJSONStorage(() => sessionStorage),
      }
    ),
    { enabled: isDev, anonymousActionType: "consumer" }
  )
);
