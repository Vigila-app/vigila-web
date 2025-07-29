import { ApiService } from "@/src/services";
import { apiAdmin } from "@/src/constants/api.constants";
import {
  AdminAnalyticsI,
  AdminDashboardStatsI,
  AdminBookingI,
  AdminVigilI,
  AdminConsumerI,
  AdminServiceI,
  AdminPaymentI,
} from "@/src/types/admin.types";

export const AdminService = {
  // Analytics
  getAnalytics: async (dateRange?: string) =>
    new Promise<AdminAnalyticsI>(async (resolve, reject) => {
      try {
        const queryParams = dateRange ? { range: dateRange } : undefined;
        const { data: analytics } = (await ApiService.get(
          apiAdmin.ANALYTICS(),
          queryParams
        )) as { data: AdminAnalyticsI };
        resolve(analytics);
      } catch (error) {
        console.error("AdminService getAnalytics error", error);
        reject(error);
      }
    }),

  // Dashboard Stats
  getDashboardStats: async () =>
    new Promise<AdminDashboardStatsI>(async (resolve, reject) => {
      try {
        const { data: stats } = (await ApiService.get(
          apiAdmin.ANALYTICS()
        )) as { data: AdminDashboardStatsI };
        resolve(stats);
      } catch (error) {
        console.error("AdminService getDashboardStats error", error);
        reject(error);
      }
    }),

  // Bookings
  getBookings: async (filters?: Record<string, string>) =>
    new Promise<AdminBookingI[]>(async (resolve, reject) => {
      try {
        const { data: bookings } = (await ApiService.get(
          apiAdmin.BOOKINGS(),
          filters
        )) as { data: AdminBookingI[] };
        resolve(bookings);
      } catch (error) {
        console.error("AdminService getBookings error", error);
        reject(error);
      }
    }),

  updateBookingStatus: async (bookingId: string, status: string) =>
    new Promise<AdminBookingI>(async (resolve, reject) => {
      try {
        const { data: booking } = (await ApiService.put(
          `${apiAdmin.BOOKINGS()}/${bookingId}`,
          { status }
        )) as { data: AdminBookingI };
        resolve(booking);
      } catch (error) {
        console.error("AdminService updateBookingStatus error", error);
        reject(error);
      }
    }),

  // Vigils
  getVigils: async (filters?: Record<string, string>) =>
    new Promise<AdminVigilI[]>(async (resolve, reject) => {
      try {
        const { data: vigils } = (await ApiService.get(
          apiAdmin.VIGILS(),
          filters
        )) as { data: AdminVigilI[] };
        resolve(vigils);
      } catch (error) {
        console.error("AdminService getVigils error", error);
        reject(error);
      }
    }),

  updateVigilStatus: async (vigilId: string, status: string) =>
    new Promise<AdminVigilI>(async (resolve, reject) => {
      try {
        const { data: vigil } = (await ApiService.put(
          `${apiAdmin.VIGILS()}/${vigilId}`,
          { status }
        )) as { data: AdminVigilI };
        resolve(vigil);
      } catch (error) {
        console.error("AdminService updateVigilStatus error", error);
        reject(error);
      }
    }),

  // Consumers
  getConsumers: async (filters?: Record<string, string>) =>
    new Promise<AdminConsumerI[]>(async (resolve, reject) => {
      try {
        const { data: consumers } = (await ApiService.get(
          apiAdmin.CONSUMERS(),
          filters
        )) as { data: AdminConsumerI[] };
        resolve(consumers);
      } catch (error) {
        console.error("AdminService getConsumers error", error);
        reject(error);
      }
    }),

  // Services
  getServices: async (filters?: Record<string, string>) =>
    new Promise<AdminServiceI[]>(async (resolve, reject) => {
      try {
        const { data: services } = (await ApiService.get(
          apiAdmin.SERVICES(),
          filters
        )) as { data: AdminServiceI[] };
        resolve(services);
      } catch (error) {
        console.error("AdminService getServices error", error);
        reject(error);
      }
    }),

  updateServiceStatus: async (serviceId: string, status: string) =>
    new Promise<AdminServiceI>(async (resolve, reject) => {
      try {
        const { data: service } = (await ApiService.put(
          `${apiAdmin.SERVICES()}/${serviceId}`,
          { status }
        )) as { data: AdminServiceI };
        resolve(service);
      } catch (error) {
        console.error("AdminService updateServiceStatus error", error);
        reject(error);
      }
    }),

  // Payments
  getPayments: async (filters?: Record<string, string>) =>
    new Promise<AdminPaymentI[]>(async (resolve, reject) => {
      try {
        const { data: payments } = (await ApiService.get(
          apiAdmin.PAYMENTS(),
          filters
        )) as { data: AdminPaymentI[] };
        resolve(payments);
      } catch (error) {
        console.error("AdminService getPayments error", error);
        reject(error);
      }
    }),

  // User Promotion
  promoteUser: async (userId: string) =>
    new Promise<{ success: boolean; message: string; data?: any }>(
      async (resolve, reject) => {
        try {
          const response = (await ApiService.post(
            apiAdmin.PROMOTE_USER(userId)
          )) as { success: boolean; message: string; data?: any };
          resolve(response);
        } catch (error) {
          console.error("AdminService promoteUser error", error);
          reject(error);
        }
      }
    ),
};
