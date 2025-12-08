export interface TransactionI {
  id: string;
  wallet_id: string;
  stripe_payment_id?: string;
  amount: number;
  currency: string;
  status: "PENDING" | "COMPLETED" | "FAILED" | "CANCELLED";
  type: "TOP_UP" | "PAYMENT" | "REFUND" | "BONUS" | "CREDIT" | "DEBIT";
  description?: string;

  created_at: string;
}

export interface TransactionStoreType {
  transactions: TransactionI[];
  lastUpdate: Date | undefined;
  currentUserId?: string;


  getTransactions: (userId: string, force?: boolean) => Promise<TransactionI[]>;
  resetLastUpdate: () => void;
  onLogout: () => void;
}
