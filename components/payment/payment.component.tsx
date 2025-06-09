"use client";
import { AddressElement, Elements } from "@stripe/react-stripe-js";
import { PaymentForm } from "@/components/payment";
import { StripeUtils } from "@/src/utils/stripe.utils";
import { StripeElementsOptionsMode } from "@stripe/stripe-js";
import { Divider } from "@/components";
import { CartItem } from "@/src/types/cart.types";

type PaymentComponentI = {
  collectAddress?: boolean;
  description?: string;
  items: CartItem[];
  options: StripeElementsOptionsMode;
  metadata?: { [key: string]: string };
};

const stripe = StripeUtils.init();

const PaymentComponent = (props: PaymentComponentI) => {
  const {
    collectAddress = true,
    description,
    items,
    metadata,
    options,
  } = props;

  if (!stripe || !options || !items?.length) return;

  return (
    <Elements stripe={stripe} options={options}>
      <div className="w-full flex flex-wrap">
        {collectAddress ? (
          <div className="w-full">
            <h4 className="mb-4 font-medium text-lg">Billing</h4>
            <AddressElement className="w-full" options={{ mode: "billing" }} />
            <Divider />
          </div>
        ) : null}
        <PaymentForm
          description={description}
          metadata={metadata}
          options={options}
          items={items}
        />
      </div>
    </Elements>
  );
};

export default PaymentComponent;
