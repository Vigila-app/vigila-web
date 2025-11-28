
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