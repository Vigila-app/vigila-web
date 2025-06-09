import { Timestamp } from "firebase/firestore";
import { CurrencyEnum } from "@/src/enums/common.enums";
import { User } from "firebase/auth";

export type ServiceI = {
  active: boolean;
  id: string;
  creationDate: Date | Timestamp;
  lastUpdateDate: Date | Timestamp;
  name: string;
  description: string;
  price: number;
  currency: CurrencyEnum;
  ownerId: User["uid"];
};

export type ServicesStoreType = {
  onLogout: () => void;
  services: ServiceI[];
  lastUpdate?: Date;
  getServices: (force?: boolean) => void;
  getServiceDetails: (serviceId: ServiceI["id"], force?: boolean) => void;
  deleteService: (serviceId: ServiceI["id"]) => void; 
  resetLastUpdate: () => void;
};
