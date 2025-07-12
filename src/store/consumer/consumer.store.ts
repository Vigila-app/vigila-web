import { apiConsumer } from "@/src/constants/api.constants";
import { FrequencyEnum } from "@/src/enums/common.enums";
import { ApiService } from "@/src/services";
import {
  ConsumerDetailsType,
  ConsumerStoreType,
} from "@/src/types/consumer.types";
import { dateDiff } from "@/src/utils/date.utils";
import { isDev } from "@/src/utils/envs.utils";
import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

const initConsumerStore: {
  lastUpdate?: ConsumerStoreType["lastUpdate"];
  consumers: ConsumerDetailsType[];
} = {
  lastUpdate: undefined,
  consumers: [],
};

export const useConsumerStore = create<ConsumerStoreType>()(
  devtools(
    persist(
      (set, get) => ({
        ...initConsumerStore,
        getConsumersDetails: async (consumers, force = false) =>
          new Promise(async (resolve, reject) => {
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
                    throw new Error("No consumers to fetch details for");
                  }
                  const consumersDetailsStoreBE = await Promise.all(promises);
                  if (!consumersDetailsStoreBE?.length) {
                    throw new Error("No consumer details found");
                  } else {
                    set(
                      () => ({
                        consumers: Array.from(
                          new Set([
                            ...get().consumers,
                            ...consumersDetailsStoreBE
                              .filter(
                                (item): item is { data: ConsumerDetailsType } =>
                                  item !== undefined
                              )
                              .map(({ data }) => data),
                          ])
                        ),
                        lastUpdate: new Date(),
                      }),
                      false,
                      { type: "getConsumersDetails" }
                    );
                    resolve(
                      consumersDetailsStoreBE
                        .filter(
                          (item): item is { data: ConsumerDetailsType } =>
                            item !== undefined
                        )
                        .map(({ data }) => data)
                    );
                  }
                } catch (error) {
                  reject(error);
                }
              };
              // TODO retrieve consumers details from BE
              const consumersDetailsStoreBE =
                (await getConsumersDetailsBE()) as unknown as ConsumerDetailsType[];
              if (consumersDetailsStoreBE) {
                resolve(consumersDetailsStoreBE);
              }
              reject();
            } catch (error) {
              reject(error);
            }
          }),
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
