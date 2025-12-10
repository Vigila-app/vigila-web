enum TRANSACTION_TYPE {
  TOP_UP = "TOP_UP",
  CREDIT = "CREDIT",
  DEBIT = "DEBIT",
  BONUS = "BONUS",
  REFUND = "REFUND",
}

/**
 * Checks if the provided string matches any value in the `TRANSACTION_TYPE` enum.
 * 
 * @param str - The string to validate against the enum values.
 * @returns `true` if the string is a valid `TRANSACTION_TYPE` enum value, `false` otherwise.
 *          Narrows the type of `str` to `TRANSACTION_TYPE` when `true`.
 * 
 * @example
 * if (isValidTransactionType(input)) {
 *   // TypeScript now knows `input` is TRANSACTION_TYPE
 *   processTransaction(input);
 * }
 * 
 * console.log(isValidTransactionType('deposit')); // true (if exists in enum)
 * console.log(isValidTransactionType('invalid')); // false
 */
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

/**
 * Checks if the provided string matches any value in the `EXPENSE_TYPE` enum.
 * 
 * @param str - The string to validate against the enum values.
 * @returns `true` if the string is a valid `EXPENSE_TYPE` enum value, `false` otherwise.
 *          Narrows the type of `str` to `EXPENSE_TYPE` when `true`.
 * 
 * @example
 * if (isValidExpenseType(input)) {
 *   // TypeScript now knows `input` is EXPENSE_TYPE
 *   processTransaction(input);
 * }
 * 
 * console.log(isValidExpenseType('deposit')); // true (if exists in enum)
 * console.log(isValidExpenseType('invalid')); // false
 */
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
