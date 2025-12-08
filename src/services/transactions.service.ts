import { ApiService } from "@/src/services";
import { apiWallet } from "@/src/constants/api.constants";
import { TransactionI } from "@/src/types/transactions.types";

export const TransactionsService = {
  getTransactions: async (userId: string) =>
    new Promise<TransactionI[]>(async (resolve, reject) => {
      try {
        const result = (await ApiService.get(
          apiWallet.TRANSACTIONS(userId)
        )) as { data: TransactionI[] };
        const { data: response = [] } = result;
        resolve(response);
      } catch (error) {
        console.error("TransactionsService getTransactions error", error);
        reject(error);
      }
    }),
};
