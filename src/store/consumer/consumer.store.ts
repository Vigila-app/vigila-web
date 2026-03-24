import { apiConsumer } from "@/src/constants/api.constants";
import { FrequencyEnum } from "@/src/enums/common.enums";
import { ApiService } from "@/src/services";
import {
  ConsumerDataType,
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
  consumersData: ConsumerDataType[];
} = {
  lastUpdate: undefined,
  consumers: [],
  consumersData: [],
};

// Crea il debouncer per lo store consumer
const { createDebouncedAction } = createStoreDebouncer("consumer-store");

export const useConsumerStore = create<ConsumerStoreType>()(
  devtools(
    persist(
      (set, get) => ({
        ...initConsumerStore,
        getConsumersDetails: async (consumers: string[], force = false) => {
          const action = async () => {
            try {
              // decide which consumer ids actually need to be fetched
              const lastUpdate = get().lastUpdate;
              const idsToFetch = consumers.filter((consumerId) => {
                if (force) return true;
                if (!lastUpdate) return true;
                if (dateDiff(new Date(), lastUpdate, FrequencyEnum.MINUTES) > 1)
                  return true;
                // otherwise fetch only if not already present
                return !get().consumers.find((c) => c.id === consumerId);
              });

              if (!idsToFetch.length) {
                // Return existing consumers in requested order
                return get().consumers.filter((c) => consumers.includes(c.id));
              }

              const promises = idsToFetch.map((consumerId) =>
                ApiService.get<{ data: ConsumerDetailsType }>(
                  apiConsumer.DETAILS(consumerId),
                ),
              );

              const consumersDetailsStoreBE = await Promise.all(promises);
              if (!consumersDetailsStoreBE?.length) {
                throw new Error("No consumer details found");
              }

              const newConsumers = consumersDetailsStoreBE
                .filter((item): item is { data: ConsumerDetailsType } =>
                  Boolean(item),
                )
                .map(({ data }) => data);

              // Merge existing and new consumers, deduplicating by id and
              // ensuring the newly fetched items replace older ones
              const existing = get().consumers || [];
              const mergedMap = new Map<string, ConsumerDetailsType>();
              existing.forEach((c) => mergedMap.set(c.id, c));
              newConsumers.forEach((c) => mergedMap.set(c.id, c));

              const mergedArray = Array.from(mergedMap.values());

              set(
                () => ({ consumers: mergedArray, lastUpdate: new Date() }),
                false,
                { type: "getConsumersDetails" },
              );

              return newConsumers;
            } catch (error) {
              console.error(
                "useConsumerStore getConsumersDetails error:",
                error,
              );
              throw error;
            }
          };

          const uniqueKey = consumers.slice().sort().join(",");
          return createDebouncedAction(
            "getConsumersDetails",
            action,
            force,
            uniqueKey,
          );
        },
        onLogout: () => {
          set(initConsumerStore, false, { type: "onLogout" });
        },
        getConsumerData: async (consumerId: string, force = false) => {
          const action = async () => {
            try {
              const lastUpdate = get().lastUpdate;
              if (!force && lastUpdate) {
                const existing = get().consumersData.find(
                  (cd) => cd.consumer_id === consumerId,
                );
                if (
                  existing &&
                  dateDiff(new Date(), lastUpdate, FrequencyEnum.MINUTES) <= 1
                ) {
                  return existing;
                }
              }

              const result = await ApiService.get<{ data: ConsumerDataType }>(
                apiConsumer.DATA(consumerId),
              );

              if (!result?.data) return null;

              const newData = result.data;
              const existingData = get().consumersData || [];
              const mergedMap = new Map<string, ConsumerDataType>();
              existingData.forEach((cd) => mergedMap.set(cd.consumer_id, cd));
              mergedMap.set(newData.consumer_id, newData);

              set(
                () => ({
                  consumersData: Array.from(mergedMap.values()),
                  lastUpdate: new Date(),
                }),
                false,
                { type: "getConsumerData" },
              );

              return newData;
            } catch (error) {
              console.error("useConsumerStore getConsumerData error:", error);
              throw error;
            }
          };

          return createDebouncedAction(
            "getConsumerData",
            action,
            force,
            consumerId,
          );
        },
      }),
      {
        name: "consumer",
        storage: createJSONStorage(() => sessionStorage),
      },
    ),
    { enabled: isDev, anonymousActionType: "consumer" },
  ),
);
