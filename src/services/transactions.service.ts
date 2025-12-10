import { ApiService } from "@/src/services";
import { apiWallet } from "@/src/constants/api.constants";
import { TransactionI, WalletDataI } from "@/src/types/transactions.types";

export const TransactionsService = {
  getTransactions: async (userId: string) =>
    new Promise<WalletDataI>(async (resolve, reject) => {
      try {
        const result = (await ApiService.get(
          apiWallet.TRANSACTIONS(userId)
        )) as { data: WalletDataI };
        const { data: response } = result;
        resolve(response);
      } catch (error) {
        console.error("TransactionsService getTransactions error", error);
        reject(error);
      }
    }),
};
