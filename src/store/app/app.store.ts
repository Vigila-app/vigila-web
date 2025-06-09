import { ResponseCodesConstants } from "@/src/constants";
import { ToastPositionEnum, ToastStatusEnum } from "@/src/enums/toast.enum";
import { AppStoreType } from "@/src/types/app.types";
import { ErrorI } from "@/src/types/error.types";
import { isDev } from "@/src/utils/envs.utils";
import { isServer } from "@/src/utils/common.utils";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

const initAppStore: {
  error: AppStoreType["error"];
  loader: AppStoreType["loader"];
  toastList: AppStoreType["toastList"];
} = {
  error: undefined,
  loader: {
    counter: 0,
    isLoading: false,
  },
  toastList: [],
};

export const useAppStore = create<AppStoreType>()(
  devtools(
    (set) => ({
      ...initAppStore,

      // region Error
      setError: (error: ErrorI = ResponseCodesConstants.GENERIC_ERROR) => {
        if (!isServer && error)
          set(
            () => ({
              error,
            }),
            false,
            { type: "setError", error }
          );
      },
      resetError: () => {
        set(
          () => ({
            error: undefined,
          }),
          false,
          { type: "resetError" }
        );
      },
      // endregion Error

      // region Loader
      showLoader: () => {
        if (!isServer)
          set(
            (state) => ({
              loader: {
                counter: Math.max(state.loader.counter + 1, 0),
                isLoading: true,
              },
            }),
            false,
            { type: "showLoader" }
          );
      },
      hideLoader: (reset = false) => {
        if (!isServer)
          set(
            (state) => ({
              loader: {
                counter: Math.max(reset ? 0 : state.loader.counter - 1, 0),
                isLoading: reset
                  ? false
                  : Math.max(state.loader.counter - 1, 0) > 0,
              },
            }),
            false,
            { type: "hideLoader", reset }
          );
      },
      showLocalLoader: (localLoaderId) => {
        if (!isServer)
          set(
            (state) => ({
              localLoaders: {
                ...state.localLoaders,
                [localLoaderId]: {
                  counter: 1,
                  isLoading: true,
                },
              },
            }),
            false,
            { type: "showLocalLoader", localLoaderId }
          );
      },
      hideLocalLoader: (localLoaderId) => {
        if (!isServer)
          set(
            (state) => ({
              localLoaders: {
                ...state.localLoaders,
                [localLoaderId]: {
                  counter: 0,
                  isLoading: false,
                },
              },
            }),
            false,
            { type: "hideLocalLoader", localLoaderId }
          );
      },
      // endregion Loader

      // region Toast
      showToast: (toast) => {
        if (!isServer && toast)
          set(
            (state) => ({
              toastList: [
                ...state.toastList,
                {
                  ...toast,
                  id: toast.id || `toast-${new Date().getTime()}`,
                  type: toast.type || ToastStatusEnum.INFO,
                  position: toast.position || ToastPositionEnum.ASIDE,
                  autoClose: toast.autoClose || true,
                  withIcon: toast.withIcon || true,
                },
              ],
            }),
            false,
            { type: "showToast", toast }
          );
      },
      hideToast: (toast) => {
        if (!isServer && toast)
          set(
            (state) => ({
              toastList: state.toastList.filter(
                (storeToast) => toast.id !== storeToast.id
              ),
            }),
            false,
            { type: "hideToast", toast }
          );
      },
      // endregion Toast

      onLogout: () => {
        set(initAppStore, false, { type: "onLogout" });
      },
    }),
    { enabled: isDev, anonymousActionType: "app" }
  )
);
