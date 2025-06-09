import { PaymentIntent, Stripe, loadStripe } from "@stripe/stripe-js";
import { ApiService } from "@/src/services";
import { apiCheckout } from "@/src/constants/api.constants";
import { CurrencyConst } from "@/src/constants/checkout.constants";

type CurrencyKeys = keyof typeof CurrencyConst;
type CurrencyValues = (typeof CurrencyConst)[CurrencyKeys];

export const StripeUtils = {
  init: async () =>
    new Promise<Stripe>(async (resolve, reject) => {
      try {
        const stripe = await loadStripe(
          process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY as string
        );
        if (stripe) resolve(stripe);
        reject();
      } catch (err) {
        console.error("StripeUtils init error", err);
        reject(err);
      }
    }),
  createPaymentIntent: async (options: {
    amount: number;
    currency: CurrencyValues;
    description?: string;
    metadata?: { [key: string]: string };
    receipt_email?: string;
  }) =>
    new Promise<PaymentIntent>(async (resolve, reject) => {
      try {
        const { data: response } = (await ApiService.post(
          apiCheckout.INTENT(),
          options
        )) as { data: PaymentIntent };
        resolve(response);
      } catch (err) {
        console.error("StripeUtils createPaymentIntent error", err);
        reject(err);
      }
    }),
  getPaymentIntent: async (paymentIntentId: PaymentIntent["id"]) =>
    new Promise<PaymentIntent>(async (resolve, reject) => {
      try {
        if (!paymentIntentId) reject();
        const { data: response } = (await ApiService.get(
          apiCheckout.INTENT(paymentIntentId)
        )) as { data: PaymentIntent };
        resolve(response);
      } catch (err) {
        console.error("StripeUtils getPaymentIntent error", err);
        reject(err);
      }
    }),
};
