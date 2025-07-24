import { FrequencyEnum } from "@/src/enums/common.enums";
import { UserService } from "@/src/services";
import {
  UserDetailsType,
  UserDevicesType,
  UserStoreType,
  UserTermsType,
} from "@/src/types/user.types";
import { dateDiff } from "@/src/utils/date.utils";
import { isDev } from "@/src/utils/envs.utils";
import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

const initUserStore: {
  lastUpdate?: UserStoreType["lastUpdate"];
  user?: UserStoreType["user"];
  userDetails?: UserStoreType["userDetails"];
  userDevices?: UserStoreType["userDevices"];
  userTerms?: UserStoreType["userTerms"];
} = {
  lastUpdate: undefined,
  user: undefined,
  userDetails: undefined,
  userDevices: undefined,
  userTerms: undefined,
};

export const useUserStore = create<UserStoreType>()(
  devtools(
    persist(
      (set, get) => ({
        ...initUserStore,
        setUser: ({
          user,
          userDetails,
          userDevices,
          userTerms,
        }: {
          user?: UserStoreType["user"];
          userDetails?: UserStoreType["userDetails"];
          userDevices?: UserStoreType["userDevices"];
          userTerms?: UserStoreType["userTerms"];
        }) => {
          set(
            () => ({
              user: user || get().user,
              userDetails: userDetails || get().userDetails,
              userDevices: userDevices || get().userDevices,
              userTerms: userTerms || get().userTerms,
            }),
            false,
            { type: "setUser", user, userDetails, userDevices, userTerms }
          );
        },
        getUserDetails: async (force = false) =>
          new Promise(async (resolve, reject) => {
            try {
              const getUserDetailsBE = async () => {
                try {
                  const userDetailsStoreBE = await UserService.getUserDetails();
                  set(
                    () => ({
                      userDetails: userDetailsStoreBE,
                      lastUpdate: new Date(),
                    }),
                    false,
                    { type: "getUserDetails" }
                  );
                  resolve(userDetailsStoreBE);
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
                // TODO retrieve user details from BE
                const userDetailsStoreBE =
                  (await getUserDetailsBE()) as unknown as UserDetailsType;
                if (userDetailsStoreBE) {
                  resolve(userDetailsStoreBE);
                }
                reject();
              } else {
                const userDetailsStore = get().userDetails;
                if (userDetailsStore) {
                  resolve(userDetailsStore);
                } else {
                  // TODO retrieve user details from BE
                  const userDetailsStoreBE =
                    (await getUserDetailsBE()) as unknown as UserDetailsType;
                  if (userDetailsStoreBE) {
                    resolve(userDetailsStoreBE);
                  }
                  reject();
                }
              }
            } catch (error) {
              reject(error);
            }
          }),
        getUserTerms: async (force = false) =>
          new Promise(async (resolve, reject) => {
            try {
              const getUserTermsBE = async () => {
                try {
                  const userTermsStoreBE = await UserService.getTerms();
                  set(
                    () => ({
                      userTerms: userTermsStoreBE,
                      lastUpdate: new Date(),
                    }),
                    false,
                    { type: "getUserTerms" }
                  );
                  resolve(userTermsStoreBE);
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
                // TODO retrieve user terms from BE
                const userTermsStoreBE =
                  (await getUserTermsBE()) as unknown as UserTermsType;
                if (userTermsStoreBE) {
                  resolve(userTermsStoreBE);
                }
                reject();
              } else {
                const userTermsStore = get().userTerms;
                if (userTermsStore) {
                  resolve(userTermsStore);
                } else {
                  // TODO retrieve user terms from BE
                  const userTermsStoreBE =
                    (await getUserTermsBE()) as unknown as UserTermsType;
                  if (userTermsStoreBE) {
                    resolve(userTermsStoreBE);
                  }
                  reject();
                }
              }
            } catch (error) {
              reject(error);
            }
          }),
        getUserDevices: async (force = false) =>
          new Promise(async (resolve, reject) => {
            try {
              const getUserDevicesBE = async () => {
                try {
                  const userDevicesStoreBE = await UserService.getDevices();
                  set(
                    () => ({
                      userDevices: userDevicesStoreBE,
                      lastUpdate: new Date(),
                    }),
                    false,
                    { type: "getUserDevices" }
                  );
                  resolve(userDevicesStoreBE);
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
                // TODO retrieve user devices from BE
                const userDevicesStoreBE =
                  (await getUserDevicesBE()) as unknown as UserDevicesType;
                if (userDevicesStoreBE) {
                  resolve(userDevicesStoreBE);
                }
                reject();
              } else {
                const userDevicesStore = get().userDevices;
                if (userDevicesStore) {
                  resolve(userDevicesStore);
                } else {
                  // TODO retrieve user devices from BE
                  const userDevicesStoreBE =
                    (await getUserDevicesBE()) as unknown as UserDevicesType;
                  if (userDevicesStoreBE) {
                    resolve(userDevicesStoreBE);
                  }
                  reject();
                }
              }
            } catch (error) {
              reject(error);
            }
          }),
        forceUpdate: () => {
          set({ ...get(), lastUpdate: undefined }, false, {
            type: "forceUpdate",
          });
        },
        onLogout: () => {
          set(initUserStore, false, { type: "onLogout" });
        },
      }),
      {
        name: "user",
        storage: createJSONStorage(() => sessionStorage),
      }
    ),
    { enabled: isDev, anonymousActionType: "user" }
  )
);
