import { CurrencyEnum } from "@/src/enums/common.enums";
import { UserType } from "@/src/types/user.types";
import { VigilDetailsType } from "@/src/types/vigil.types";
import { ServiceCatalogTypeEnum } from "@/src/enums/services.enums";

export type ServiceCatalogExtraOption = {
  id: string;
  name: string;
  description: string;
  fixed_price: number;
  note?: string;
};

export type ServiceCatalogItem = {
  id: number;
  name: string;
  description: string;
  long_description?: string;
  type: ServiceCatalogTypeEnum;
  recommended_hourly_rate: number;
  min_hourly_rate: number;
  max_hourly_rate: number;
  minimum_duration_hours: number;
  extra: ServiceCatalogExtraOption[];
  tags: string[];
};

export type ServiceCatalog = {
  services_catalog: ServiceCatalogItem[];
};

// Existing Service Types
export type ServiceI = {
  active: boolean;
  id: string;
  created_at: Date;
  updated_at?: Date;
  vigil_id: UserType["id"];
  name: string;
  description?: string;
  unit_price: number;
  currency: CurrencyEnum;
  unit_type: string;
  min_unit: number;
  max_unit?: number;
  info?: Record<string, any>;
  postalCode: string[];
  vigil?: Partial<VigilDetailsType>;
  duration?: string;
};

export type ServicesStoreType = {
  onLogout: () => void;
  services: ServiceI[];
  lastUpdate?: Date;
  getServices: (force?: boolean, vigilId?: ServiceI["vigil_id"]) => void;
  getServiceDetails: (serviceId: ServiceI["id"], force?: boolean) => void;
  deleteService: (serviceId: ServiceI["id"]) => void;
  resetLastUpdate: () => void;
};
