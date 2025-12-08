export type BundleCatalogType = {
  id: number;
  name: string;
  price: number;
  credit_amount: number;
  bonus_percentage: number;
  savings: number;
  features: string[];
  is_active: boolean;
  is_popular: boolean;
};

export type BundleCatalog = {
  bundles_catalog: BundleCatalogType[];
};

export type TransactionType = {
  id: string;
  title: string;
  date: string;
  amount: number;
  type: "credit" | "debit";
  status: string;
};
export interface TopUpOption {
  id: string;
  payAmount: number; 
  creditAmount: number; 
  validity?: string;
}

