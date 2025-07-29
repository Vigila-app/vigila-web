import { FrequencyEnum } from "@/src/enums/common.enums";
import { AdminService } from "@/src/services/admin.service";
import { AdminStoreType } from "@/src/types/admin.types";
import { dateDiff } from "@/src/utils/date.utils";
import { isDev } from "@/src/utils/envs.utils";
import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

const initAdminStore: {
  dashboardStats: AdminStoreType["dashboardStats"];
  analytics: AdminStoreType["analytics"];
  bookings: AdminStoreType["bookings"];
  vigils: AdminStoreType["vigils"];
  consumers: AdminStoreType["consumers"];
  services: AdminStoreType["services"];
  payments: AdminStoreType["payments"];
  lastUpdate: AdminStoreType["lastUpdate"];
  dashboardLoading: AdminStoreType["dashboardLoading"];
  analyticsLoading: AdminStoreType["analyticsLoading"];
  bookingsLoading: AdminStoreType["bookingsLoading"];
  vigilsLoading: AdminStoreType["vigilsLoading"];
  consumersLoading: AdminStoreType["consumersLoading"];
  servicesLoading: AdminStoreType["servicesLoading"];
  paymentsLoading: AdminStoreType["paymentsLoading"];
} = {
  dashboardStats: null,
  analytics: null,
  bookings: [],
  vigils: [],
  consumers: [],
  services: [],
  payments: [],
  lastUpdate: {
    dashboardStats: undefined,
    analytics: undefined,
    bookings: undefined,
    vigils: undefined,
    consumers: undefined,
    services: undefined,
    payments: undefined,
  },
  dashboardLoading: false,
  analyticsLoading: false,
  bookingsLoading: false,
  vigilsLoading: false,
  consumersLoading: false,
  servicesLoading: false,
  paymentsLoading: false,
};

export const useAdminStore = create<AdminStoreType>()(
  devtools(
    persist(
      (set, get) => ({
        ...initAdminStore,
        
        getDashboardStats: async (force: boolean = false) => {
          try {
            const lastUpdate = get().lastUpdate.dashboardStats;
            if (
              force ||
              !lastUpdate ||
              dateDiff(new Date(), lastUpdate, FrequencyEnum.MINUTES) > 5 ||
              !get().dashboardStats
            ) {
              set({ dashboardLoading: true });
              const stats = await AdminService.getDashboardStats();
              if (stats) {
                set({
                  dashboardStats: stats,
                  lastUpdate: {
                    ...get().lastUpdate,
                    dashboardStats: new Date(),
                  },
                  dashboardLoading: false,
                });
              }
            }
          } catch (error) {
            console.error("useAdminStore getDashboardStats error:", error);
            set({ dashboardLoading: false });
          }
        },

        getAnalytics: async (dateRange?: string, force: boolean = false) => {
          try {
            const lastUpdate = get().lastUpdate.analytics;
            if (
              force ||
              !lastUpdate ||
              dateDiff(new Date(), lastUpdate, FrequencyEnum.MINUTES) > 5 ||
              !get().analytics
            ) {
              set({ analyticsLoading: true });
              const analytics = await AdminService.getAnalytics(dateRange);
              if (analytics) {
                set({
                  analytics,
                  lastUpdate: {
                    ...get().lastUpdate,
                    analytics: new Date(),
                  },
                  analyticsLoading: false,
                });
              }
            }
          } catch (error) {
            console.error("useAdminStore getAnalytics error:", error);
            set({ analyticsLoading: false });
          }
        },

        getBookings: async (filters?: Record<string, string>, force: boolean = false) => {
          try {
            const lastUpdate = get().lastUpdate.bookings;
            if (
              force ||
              !lastUpdate ||
              dateDiff(new Date(), lastUpdate, FrequencyEnum.MINUTES) > 5
            ) {
              set({ bookingsLoading: true });
              const bookings = await AdminService.getBookings(filters);
              if (bookings) {
                set({
                  bookings,
                  lastUpdate: {
                    ...get().lastUpdate,
                    bookings: new Date(),
                  },
                  bookingsLoading: false,
                });
              }
            }
          } catch (error) {
            console.error("useAdminStore getBookings error:", error);
            set({ bookingsLoading: false });
          }
        },

        updateBookingStatus: async (bookingId: string, status: string) => {
          try {
            const updatedBooking = await AdminService.updateBookingStatus(bookingId, status);
            if (updatedBooking) {
              set({
                bookings: get().bookings.map((booking) =>
                  booking.id === bookingId ? updatedBooking : booking
                ),
              });
            }
          } catch (error) {
            console.error("useAdminStore updateBookingStatus error:", error);
          }
        },

        getVigils: async (filters?: Record<string, string>, force: boolean = false) => {
          try {
            const lastUpdate = get().lastUpdate.vigils;
            if (
              force ||
              !lastUpdate ||
              dateDiff(new Date(), lastUpdate, FrequencyEnum.MINUTES) > 5
            ) {
              set({ vigilsLoading: true });
              const vigils = await AdminService.getVigils(filters);
              if (vigils) {
                set({
                  vigils,
                  lastUpdate: {
                    ...get().lastUpdate,
                    vigils: new Date(),
                  },
                  vigilsLoading: false,
                });
              }
            }
          } catch (error) {
            console.error("useAdminStore getVigils error:", error);
            set({ vigilsLoading: false });
          }
        },

        updateVigilStatus: async (vigilId: string, status: string) => {
          try {
            const updatedVigil = await AdminService.updateVigilStatus(vigilId, status);
            if (updatedVigil) {
              set({
                vigils: get().vigils.map((vigil) =>
                  vigil.id === vigilId ? updatedVigil : vigil
                ),
              });
            }
          } catch (error) {
            console.error("useAdminStore updateVigilStatus error:", error);
          }
        },

        getConsumers: async (filters?: Record<string, string>, force: boolean = false) => {
          try {
            const lastUpdate = get().lastUpdate.consumers;
            if (
              force ||
              !lastUpdate ||
              dateDiff(new Date(), lastUpdate, FrequencyEnum.MINUTES) > 5
            ) {
              set({ consumersLoading: true });
              const consumers = await AdminService.getConsumers(filters);
              if (consumers) {
                set({
                  consumers,
                  lastUpdate: {
                    ...get().lastUpdate,
                    consumers: new Date(),
                  },
                  consumersLoading: false,
                });
              }
            }
          } catch (error) {
            console.error("useAdminStore getConsumers error:", error);
            set({ consumersLoading: false });
          }
        },

        getServices: async (filters?: Record<string, string>, force: boolean = false) => {
          try {
            const lastUpdate = get().lastUpdate.services;
            if (
              force ||
              !lastUpdate ||
              dateDiff(new Date(), lastUpdate, FrequencyEnum.MINUTES) > 5
            ) {
              set({ servicesLoading: true });
              const services = await AdminService.getServices(filters);
              if (services) {
                set({
                  services,
                  lastUpdate: {
                    ...get().lastUpdate,
                    services: new Date(),
                  },
                  servicesLoading: false,
                });
              }
            }
          } catch (error) {
            console.error("useAdminStore getServices error:", error);
            set({ servicesLoading: false });
          }
        },

        updateServiceStatus: async (serviceId: string, status: string) => {
          try {
            const updatedService = await AdminService.updateServiceStatus(serviceId, status);
            if (updatedService) {
              set({
                services: get().services.map((service) =>
                  service.id === serviceId ? updatedService : service
                ),
              });
            }
          } catch (error) {
            console.error("useAdminStore updateServiceStatus error:", error);
          }
        },

        getPayments: async (filters?: Record<string, string>, force: boolean = false) => {
          try {
            const lastUpdate = get().lastUpdate.payments;
            if (
              force ||
              !lastUpdate ||
              dateDiff(new Date(), lastUpdate, FrequencyEnum.MINUTES) > 5
            ) {
              set({ paymentsLoading: true });
              const payments = await AdminService.getPayments(filters);
              if (payments) {
                set({
                  payments,
                  lastUpdate: {
                    ...get().lastUpdate,
                    payments: new Date(),
                  },
                  paymentsLoading: false,
                });
              }
            }
          } catch (error) {
            console.error("useAdminStore getPayments error:", error);
            set({ paymentsLoading: false });
          }
        },

        promoteUser: async (userId: string) => {
          try {
            return await AdminService.promoteUser(userId);
          } catch (error) {
            console.error("useAdminStore promoteUser error:", error);
            throw error;
          }
        },

        clearCache: (cacheKey?: keyof AdminStoreType["lastUpdate"]) => {
          if (cacheKey) {
            set({
              lastUpdate: {
                ...get().lastUpdate,
                [cacheKey]: undefined,
              },
            });
          } else {
            set({
              lastUpdate: {
                dashboardStats: undefined,
                analytics: undefined,
                bookings: undefined,
                vigils: undefined,
                consumers: undefined,
                services: undefined,
                payments: undefined,
              },
            });
          }
        },

        resetStore: () => {
          set(initAdminStore);
        },
      }),
      {
        name: "admin-store",
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          dashboardStats: state.dashboardStats,
          analytics: state.analytics,
          bookings: state.bookings,
          vigils: state.vigils,
          consumers: state.consumers,
          services: state.services,
          payments: state.payments,
          lastUpdate: state.lastUpdate,
        }),
      }
    ),
    {
      enabled: isDev,
      name: "admin-store",
    }
  )
);
