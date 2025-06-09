import { GenderEnum } from "@/src/enums/common.enums";
import { DocumentI } from "@/src/types/checkin.types";

export type GuestI = {
  active: boolean;
  id: string;
  created_at: Date;
  updated_at: Date;
  name: string;
  surname: string;
  birthday?: Date;
  gender?: GenderEnum
  fiscal_id?: string;
  host_id: string;
  documents?: DocumentI[];
  email?: string;
  phone?: string;
  whatsapp?: string;
};

export type CrmStoreType = {
  onLogout: () => void;
  customers: GuestI[];
  lastUpdate?: Date;
  getCustomers: (force?: boolean) => void;
  getCustomerDetails: (guestId: GuestI["id"], force?: boolean) => void;
  deleteCustomer: (guestId: GuestI["id"]) => void; 
  resetLastUpdate: () => void;
};
