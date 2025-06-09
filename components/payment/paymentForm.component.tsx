"use client";
import React, { FormEvent } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
  ExpressCheckoutElement,
} from "@stripe/react-stripe-js";
import {
  StripeElementsOptionsMode,
  StripeError,
  StripeExpressCheckoutElementConfirmEvent,
  StripePaymentElementOptions,
} from "@stripe/stripe-js";
import { Button, Divider } from "@/components";
import { Routes } from "@/src/routes";
import { StripeUtils } from "@/src/utils/stripe.utils";
import { useAppStore } from "@/src/store/app/app.store";
import { ToastStatusEnum } from "@/src/enums/toast.enum";
import { CartItem } from "@/src/types/cart.types";

type PaymentFormI = {
  description?: string;
  express?: boolean;
  items: CartItem[];
  metadata?: { [key: string]: string };
  options: StripeElementsOptionsMode;
};

const PaymentForm = (props: PaymentFormI) => {
  const { description, express = true, items, metadata, options } = props;
  const { amount, currency } = options;
  const {
    showLoader,
    hideLoader,
    showToast,
    loader: { isLoading },
  } = useAppStore();
  const stripe = useStripe();
  const elements = useElements();

  const handleError = (error: StripeError) => {
    hideLoader();
    showToast({
      type: ToastStatusEnum.ERROR,
      message: error?.message || "Generic error",
    });
  };

  if (!(stripe && amount && currency && items?.length)) {
    return;
  }

  const handleSubmit = async (
    e: FormEvent<HTMLFormElement> | StripeExpressCheckoutElementConfirmEvent
  ) => {
    try {
      (e as FormEvent<HTMLFormElement>)?.preventDefault();
      showLoader();
      if (!stripe || !elements) {
        return;
      }

      // Trigger form validation and wallet collection
      const { error: submitError } = await elements.submit();
      if (submitError) {
        handleError(submitError);
        return;
      }

      // Create the PaymentIntent and obtain clientSecret
      const { client_secret: clientSecret } =
        await StripeUtils.createPaymentIntent({
          amount,
          currency,
          description,
          metadata,
        });
      if (!clientSecret) {
        return;
      }

      await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          // Make sure to change this to your payment completion page
          return_url: `${window.location.origin}${Routes.checkoutFeedback.url}`,
        },
      });
    } catch (err) {
      handleError(err as StripeError);
    } finally {
      hideLoader();
    }
  };

  const paymentElementOptions: StripePaymentElementOptions = {
    layout: "tabs",
  };

  return (
    <div className="w-full flex flex-wrap">
      <h4 className="mb-4 font-medium text-lg">Payment</h4>
      <form
        className="w-full flex flex-wrap justify-center gap-4"
        id="payment-form"
        onSubmit={handleSubmit}
      >
        <PaymentElement
          className="w-full"
          id="payment-element"
          options={paymentElementOptions}
        />
        <div className="w-full text-center">
          <Button
            disabled={isLoading || !stripe || !elements}
            isLoading={isLoading}
            id="submit"
            label="Pay now"
          />
        </div>
      </form>
      {express ? (
        <div className="w-full my-2">
          <Divider label="Express Checkout" />
          <ExpressCheckoutElement
            onClick={({ resolve }) => {
              const options = {
                emailRequired: true,
                phoneNumberRequired: false,
                billingAddressRequired: true,
                lineItems: items.map((item) => ({
                  name: item.name,
                  amount: item.unitPrice * 100,
                })),
              };
              resolve(options);
            }}
            onConfirm={handleSubmit}
          />
        </div>
      ) : null}
    </div>
  );
};

export default PaymentForm;
