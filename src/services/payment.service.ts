import { ApiService } from "@/src/services";
import { apiPayment, apiWallet } from "@/src/constants/api.constants";
import { BookingI } from "@/src/types/booking.types";
import { BookingsService, UpdateBookingPaymentRequest } from "./bookings.service";
import { TransactionType } from "@/src/types/wallet.types";

export type CreatePaymentIntentRequest = {
  bookingId: string;
  user: string;
  amount: number;
  currency: string;
};

export type CreateWalletTopUpRequest = {
  user: string;
  amount: number;
  currency: string;
  metadata: {
    type: string;
    bundleId: number;
    creditAmount: number;
  };
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
  createPaymentIntent: async (request: CreatePaymentIntentRequest): Promise<CreatePaymentIntentResponse> => {
    try {
      const response = (await ApiService.post(
        apiPayment.CREATE_INTENT(),
        request
      )) as CreatePaymentIntentResponse;
      return response;
    } catch (error) {
      console.error("PaymentService createPaymentIntent error", {
        error,
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : null,
      });
      throw error;
    }
  },

  createWalletTopUpIntent: async (request: CreateWalletTopUpRequest): Promise<CreatePaymentIntentResponse> => {
    try {
      const response = (await ApiService.post(
        apiWallet.TOP_UP(),
        request
      )) as CreatePaymentIntentResponse;
      return response;
    } catch (error) {
      console.error("PaymentService createWalletTopUpIntent error", {
        error,
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : null,
      });
      throw error;
    }
  },

  payBookingWithWallet: async (bookingId: string): Promise<{ success: boolean; data?: any }> => {
    try {
      const response = (await ApiService.post(
        apiWallet.PAY_BOOKING(),
        { bookingId }
      )) as { success: boolean; data?: any };
      return response;
    } catch (error) {
      console.error("PaymentService payBookingWithWallet error", {
        error,
        message: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  },

  verifyPaymentIntent: async (paymentIntentId: string): Promise<VerifyPaymentIntentResponse> => {
    try {
      const response = (await ApiService.get(
        `${apiPayment.VERIFY_INTENT()}?payment_intent=${encodeURIComponent(paymentIntentId)}`
      )) as VerifyPaymentIntentResponse;
      return response;
    } catch (error) {
      console.error("PaymentService verifyPaymentIntent error", {
        error,
        message: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  },

  getWalletTransactions: async (userId: string): Promise<TransactionType[]> => {
    try {
      const response = (await ApiService.get(
        apiWallet.TRANSACTIONS(userId)
      )) as { data: TransactionType[] };
      return response.data || [];
    } catch (error) {
      console.error("PaymentService getWalletTransactions error", {
        error,
        message: error instanceof Error ? error.message : 'Unknown error',
      });
      return [];
    }
  },
};
