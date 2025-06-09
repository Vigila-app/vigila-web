import { ModalStoreType } from "@/src/types/modal.types";
import { isDev } from "@/src/utils/envs.utils";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

const initModalStore: {
  isOpen: ModalStoreType["isOpen"];
  payload: ModalStoreType["payload"];
} = {
  isOpen: false,
  payload: {},
};

export const useModalStore = create<ModalStoreType>()(
  devtools(
    (set) => ({
      ...initModalStore,
      openModal: (
        modalId: ModalStoreType["modalId"],
        payload: ModalStoreType["payload"] = {}
      ) => {
        set(
          () => ({
            isOpen: true,
            modalId,
            payload,
          }),
          false,
          { type: "openModal", modalId, payload }
        );
      },
      closeModal: () => {
        set(() => ({ isOpen: false, modalId: undefined, payload: {} }), false, {
          type: "closeModal",
        });
      },

      onLogout: () => {
        set(initModalStore, false, { type: "onLogout" });
      },
    }),
    { enabled: isDev, anonymousActionType: "modal" }
  )
);
