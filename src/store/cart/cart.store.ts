import { isDev } from "@/src/utils/envs.utils";
import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import { CartStoreType } from "@/src/types/cart.types";
import { isServer } from "@/src/utils/common.utils";

const initCartStore: {
  items: CartStoreType["items"];
} = {
  items: [],
};

export const useCartStore = create<CartStoreType>()(
  devtools(
    persist(
      (set, get) => ({
        ...initCartStore,

        addItem: (item) => {
          if (!isServer && item) {
            const items = get().items;
            if (items.find((i) => item.id === i.id)) {
              set(
                () => ({
                  items: items.map((i) => {
                    if (item.id === i.id) {
                      return {
                        ...i,
                        qty: i.qty + item.qty,
                      };
                    }
                    return i;
                  }),
                }),
                false,
                { type: "addItem", item }
              );
            } else {
              set(
                (state) => ({
                  items: [
                    ...state.items,
                    {
                      ...item,
                    },
                  ],
                }),
                false,
                { type: "addItem", item }
              );
            }
          }
        },

        updateItem: (item) => {
          if (!isServer && item) {
            const items = get().items;
            if (items.find((i) => item.id === i.id)) {
              set(
                () => ({
                  items: items.map((i) => {
                    if (item.id === i.id) {
                      return {
                        ...i,
                        qty: i.qty + item.qty,
                      };
                    }
                    return i;
                  }),
                }),
                false,
                { type: "updateItem", item }
              );
            }
          }
        },

        removeItem: (id) => {
          if (!isServer && id) {
            const items = get().items;
            if (items.find((i) => id === i.id)) {
              set(
                () => ({
                  items: items.filter((i) => id !== i.id),
                }),
                false,
                { type: "removeItem", id }
              );
            }
          }
        },

        onLogout: () => {
          set(initCartStore, false, { type: "onLogout" });
        },
      }),
      {
        name: "cart",
        storage: createJSONStorage(() => sessionStorage),
      }
    ),
    { enabled: isDev, anonymousActionType: "cart" }
  )
);
