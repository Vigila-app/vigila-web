import { Timestamp } from "firebase/firestore";
import { UnitI } from "@/src/types/unit.types";
import { CurrencyEnum } from "@/src/enums/common.enums";
import { ServiceI } from "@/src/types/services.types";
import { User } from "firebase/auth";
import { GuestI } from "@/src/types/crm.types";

export type SaleI = {
  id: string;
  amount: number;
  currency: CurrencyEnum;
  customer?: string;
  guestId?: GuestI["id"];
  description?: string;
  metadata?: { [key: string]: string };
  receipt_email?: string;
  status: string;
  shipping?: any;
  creationDate: Date | Timestamp;
  payment_intent: string;
  serviceId?: ServiceI["id"];
  unitId?: UnitI["id"];
  ownerId?: User["uid"];
};

export type SalesStoreType = {
  onLogout: () => void;
  sales: SaleI[];
  lastUpdate?: Date;
  getSales: (force?: boolean) => void;
  getSaleDetails: (
    saleId: SaleI["id"],
    force?: boolean
  ) => Promise<SaleI>;
  resetLastUpdate: () => void;
};
