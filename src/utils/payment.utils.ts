import { CartItem } from "@/src/types/cart.types";

export const PaymentUtils = {
  calcTotal: (items: CartItem[]) =>
    items
      .map(({ qty, unitPrice }) => qty * unitPrice)
      .reduce((pv, cv) => pv + cv, 0),
};
