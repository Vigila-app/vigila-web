import { ApiService } from "@/src/services";
import { apiPayment } from "@/src/constants/api.constants";
import { BookingI } from "@/src/types/booking.types";
import { BookingsService, UpdateBookingPaymentRequest } from "./bookings.service";

export type CreatePaymentIntentRequest = {
  bookingId: string;
  user: string;
  amount: number;
  currency: string;
};

export type CreatePaymentIntentResponse = {
  success: boolean;
  clientSecret: string;
  code: number;
};

export type VerifyPaymentIntentResponse = {
  success: boolean;
  data: {
    id: string;
    status: string;
    amount: number;
    currency: string;
    bookingId: string;
    userId?:string;
    created: number;
    succeeded: boolean;
  };
  code: number;
};

export const PaymentService = {
  createPaymentIntent: async (request: CreatePaymentIntentRequest) =>
    new Promise<CreatePaymentIntentResponse>(async (resolve, reject) => {
      try {
        const response = (await ApiService.post(
          apiPayment.CREATE_INTENT(),
          request
        )) as CreatePaymentIntentResponse;

        resolve(response);
      } catch (error) {
        console.error("PaymentService createPaymentIntent error", {
          error,
          message: error instanceof Error ? error.message : 'Unknown error',
          stack: error instanceof Error ? error.stack : null,
        });
        reject(error);
      }
    }),

  verifyPaymentIntent: async (paymentIntentId: string) =>
    new Promise<VerifyPaymentIntentResponse>(async (resolve, reject) => {
      try {
        const response = (await ApiService.get(
          `${apiPayment.VERIFY_INTENT()}?payment_intent=${encodeURIComponent(paymentIntentId)}`
        )) as VerifyPaymentIntentResponse;

        resolve(response);
      } catch (error) {
        console.error("PaymentService verifyPaymentIntent error", {
          error,
          message: error instanceof Error ? error.message : 'Unknown error',
        });
        reject(error);
      }
    }),
};
