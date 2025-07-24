import { CurrencyEnum } from "@/src/enums/common.enums";
import { UserType } from "@/src/types/user.types";

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
  vigil?: {
    displayName: string;
  };
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
