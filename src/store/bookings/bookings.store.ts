import { FrequencyEnum } from "@/src/enums/common.enums";
import { BookingsService } from "@/src/services";
import { BookingI, BookingStoreType, BookingFormI } from "@/src/types/booking.types";
import { BookingStatusEnum } from "@/src/enums/booking.enums";
import { dateDiff } from "@/src/utils/date.utils";
import { isDev } from "@/src/utils/envs.utils";
import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

const initBookingsStore: {
  bookings: BookingStoreType["bookings"];
  lastUpdate: BookingStoreType["lastUpdate"];
} = {
  bookings: [],
  lastUpdate: undefined,
};

export const useBookingsStore = create<BookingStoreType>()(
  devtools(
    persist(
      (set, get) => ({
        ...initBookingsStore,
        
        getBookings: async (force: boolean = false) => {
          try {
            const lastUpdate = get().lastUpdate;
            if (
              force ||
              !lastUpdate ||
              dateDiff(new Date(), lastUpdate, FrequencyEnum.MINUTES) > 5
            ) {
              const response = await BookingsService.getBookings();
              if (response) {
                set(
                  () => ({
                    bookings: response,
                    lastUpdate: new Date(),
                  }),
                  false,
                  { type: "getBookings" }
                );
              }
            }
          } catch (error) {
            console.error("useBookingsStore getBookings error:", error);
          }
        },

        getBookingDetails: async (bookingId: BookingI["id"], force = false) =>
          new Promise<BookingI>(async (resolve, reject) => {
            try {
              const getBookingDetailsBE = async () => {
                try {
                  const bookingStoreBE = await BookingsService.getBookingDetails(bookingId);
                  if (get().bookings?.length) {
                    set(
                      () => ({
                        bookings: get().bookings.map((booking) => {
                          if (booking.id === bookingId) {
                            return bookingStoreBE;
                          }
                          return booking;
                        }),
                        lastUpdate: new Date(),
                      }),
                      false,
                      { type: "getBookingDetails", bookingId }
                    );
                  } else {
                    set(
                      () => ({
                        bookings: [...get().bookings, bookingStoreBE],
                        lastUpdate: new Date(),
                      }),
                      false,
                      { type: "getBookingDetails", bookingId }
                    );
                  }
                  resolve(bookingStoreBE);
                } catch (error) {
                  reject(error);
                }
              };

              if (
                force ||
                !get().lastUpdate ||
                dateDiff(new Date(), get().lastUpdate, FrequencyEnum.MINUTES) > 5
              ) {
                const bookingStoreBE = await getBookingDetailsBE() as unknown as BookingI;
                if (bookingStoreBE?.id) {
                  resolve(bookingStoreBE);
                }
                reject();
              } else {
                const bookingStore = get().bookings.find(
                  (booking) => booking.id === bookingId
                );
                if (bookingStore?.id) {
                  resolve(bookingStore);
                } else {
                  const bookingStoreBE = await getBookingDetailsBE() as unknown as BookingI;
                  if (bookingStoreBE?.id) {
                    resolve(bookingStoreBE);
                  }
                  reject();
                }
              }
            } catch (error) {
              console.error("useBookingsStore getBookingDetails error:", error);
              reject(error);
            }
          }),

        createBooking: async (booking: BookingFormI) =>
          new Promise<BookingI>(async (resolve, reject) => {
            try {
              const newBooking = await BookingsService.createBooking(booking);
              set(
                () => ({
                  bookings: [newBooking, ...get().bookings],
                  lastUpdate: new Date(),
                }),
                false,
                { type: "createBooking", booking }
              );
              resolve(newBooking);
            } catch (error) {
              console.error("useBookingsStore createBooking error:", error);
              reject(error);
            }
          }),

        updateBookingStatus: async (bookingId: BookingI["id"], status: BookingStatusEnum) =>
          new Promise<BookingI>(async (resolve, reject) => {
            try {
              const updatedBooking = await BookingsService.updateBookingStatus(bookingId, status);
              set(
                () => ({
                  bookings: get().bookings.map((booking) => {
                    if (booking.id === bookingId) {
                      return updatedBooking;
                    }
                    return booking;
                  }),
                  lastUpdate: new Date(),
                }),
                false,
                { type: "updateBookingStatus", bookingId, status }
              );
              resolve(updatedBooking);
            } catch (error) {
              console.error("useBookingsStore updateBookingStatus error:", error);
              reject(error);
            }
          }),

        cancelBooking: async (bookingId: BookingI["id"]) =>
          new Promise<boolean>(async (resolve, reject) => {
            try {
              await BookingsService.cancelBooking(bookingId);
              set(
                () => ({
                  bookings: get().bookings.filter((booking) => booking.id !== bookingId),
                  lastUpdate: new Date(),
                }),
                false,
                { type: "cancelBooking", bookingId }
              );
              resolve(true);
            } catch (error) {
              console.error("useBookingsStore cancelBooking error:", error);
              reject(error);
            }
          }),

        resetLastUpdate: async () => {
          try {
            set({ lastUpdate: undefined }, false, { type: "resetLastUpdate" });
          } catch (error) {
            console.error("useBookingsStore resetLastUpdate error:", error);
          }
        },

        onLogout: () => {
          set(initBookingsStore, false, { type: "onLogout" });
        },
      }),
      {
        name: "bookings",
        storage: createJSONStorage(() => sessionStorage),
      }
    ),
    { enabled: isDev, anonymousActionType: "bookings" }
  )
);