enum TRANSACTION_TYPE {
  TOP_UP = "TOP_UP",
  CREDIT = "CREDIT",
  DEBIT = "DEBIT",
  BONUS = "BONUS",
  REFUND = "REFUND",
}

//helper function - check that string exists inside of enum
export const isValidTransactionType = function (
  str: string
): str is TRANSACTION_TYPE {
  return Object.values(TRANSACTION_TYPE).includes(str as TRANSACTION_TYPE);
};

export enum TRANSACTION_STATUS {
  "PENDING",
  "COMPLETED",
  "FAILED",
  "CANCELLED",
}

export enum EXPENSE_TYPE {
  PAYMENT = "PAYMENT",
  DEBIT = "DEBIT",
}

export const isValidExpenseType = function (str: string): str is EXPENSE_TYPE {
  return Object.values(EXPENSE_TYPE).includes(str as EXPENSE_TYPE);
};

export interface TransactionI {
  id: string;
  wallet_id: string;
  stripe_payment_id?: string;
  amount: number;
  currency: string;
  status: TRANSACTION_STATUS;
  type: TRANSACTION_TYPE;
  description?: string;
  created_at: string;
}

export interface WalletDataI {
  balance: number;
  totalDeposited: number;
  totalSpent: number;
  transactions: TransactionI[];
  pagination: {
    page: number;
    pages: number;
    itemPerPage: number;
    count: number;
  };
}

export interface TransactionStoreType {
  transactions: TransactionI[];
  balance: number;
  totalDeposited: number;
  totalSpent: number;
  pagination?: WalletDataI["pagination"];
  lastUpdate: Date | undefined;
  currentUserId?: string;

  getTransactions: (userId: string, force?: boolean) => Promise<WalletDataI>;
  resetLastUpdate: () => void;
  onLogout: () => void;
}
