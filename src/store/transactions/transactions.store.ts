// src/stores/useTransactionsStore.ts
import { TransactionsService } from "@/src/services/transactions.service";
import { TransactionStoreType } from "@/src/types/transactions.types";
import { FrequencyEnum } from "@/src/enums/common.enums";
import { dateDiff } from "@/src/utils/date.utils";
import { isDev } from "@/src/utils/envs.utils";
import { createStoreDebouncer } from "@/src/utils/store-debounce.utils";
import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

const initTransactionsStore = {
  transactions: [],
  lastUpdate: undefined,
  currentUserId: undefined,
};

const { createDebouncedAction } = createStoreDebouncer("transactions", 300);

export const useTransactionsStore = create<TransactionStoreType>()(
  devtools(
    persist(
      (set, get) => ({
        ...initTransactionsStore,

        getTransactions: async (userId: string, force: boolean = false) => {
          // Usiamo il debouncer per evitare ripetizioni di chiamate per user goffo
          return createDebouncedAction(
            "getTransactions",
            async () => {
              try {
                const { lastUpdate, currentUserId } = get();

                const isDifferentUser = currentUserId !== userId;

                if (
                  force ||
                  isDifferentUser ||
                  !lastUpdate ||
                  dateDiff(new Date(), lastUpdate, FrequencyEnum.MINUTES) > 1
                ) {
                  // Se cambia utente, opzionale: svuota subito per evitare "flash" di dati vecchi
                  if (isDifferentUser) {
                    set({ transactions: [] }, false, {
                      type: "clearOldUserTransactions",
                    });
                  }

                  const response =
                    await TransactionsService.getTransactions(userId);

                  if (response) {
                    set(
                      () => ({
                        transactions: response,
                        lastUpdate: new Date(),
                        currentUserId: userId, // Salviamo l'ID corrente
                      }),
                      false,
                      { type: "getTransactions" }
                    );
                    return response;
                  }
                }

                return get().transactions;
              } catch (error) {
                console.error(
                  "useTransactionsStore getTransactions error:",
                  error
                );
                return [];
              }
            },
            force
          );
        },

        resetLastUpdate: () => {
          set({ lastUpdate: undefined }, false, { type: "resetLastUpdate" });
        },

        onLogout: () => {
          set(initTransactionsStore, false, { type: "onLogout" });
        },
      }),
      {
        name: "transactions",
        storage: createJSONStorage(() => sessionStorage),
      }
    ),
    { enabled: isDev, anonymousActionType: "transactions" }
  )
);
