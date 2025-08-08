import { ErrorI } from "@/src/types/error.types";
import { ToastI } from "@/src/types/toast.type";

export type LoaderI = {
  counter: number;
  isLoading: boolean;
};

export type PaginationI = {
  from: number;
  to: number;
  page: number;
  itemPerPage: number;
  count?: number;
};

export enum OrderDirectionEnum {
  ASC = "ASC",
  DESC = "DESC"
};

export type AppStoreType = {
  onLogout: () => void;

  // region Error
  error?: ErrorI;
  setError: (error?: ErrorI) => void;
  resetError: () => void;
  // endregion Error

  // region Loader
  loader: LoaderI;
  showLoader: () => void;
  hideLoader: (reset?: boolean) => void;
  localLoaders?: {
    [localLoaderId: string]: LoaderI;
  };
  showLocalLoader: (localLoaderId: string) => void;
  hideLocalLoader: (localLoaderId: string) => void;
  // endregion Loader

  // region Toast
  toastList: ToastI[];
  showToast: (toast: ToastI) => void;
  hideToast: (toast: ToastI) => void;
  // endregion Toast
};
