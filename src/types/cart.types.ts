import { CurrencyEnum } from "@/src/enums/common.enums";
import { UnitI } from "@/src/types/unit.types";

export type CartItem = {
  id: string;
  name: string;
  qty: number;
  unitPrice: number;
  currency: CurrencyEnum;
  unitId?: UnitI["id"]; 
  ownerId?: UnitI["userId"]; 
};

export type CartStoreType = {
  onLogout: () => void;

  // region Toast
  items: CartItem[];
  addItem: (item: CartItem) => void;
  updateItem: (item: CartItem) => void;
  removeItem: (id: CartItem["id"]) => void;
  // endregion Toast
};
