import { ApiService } from "@/src/services";
import { apiBookings } from "@/src/constants/api.constants";
import { BookingI, BookingFormI } from "@/src/types/booking.types";
import { BookingStatusEnum } from "@/src/enums/booking.enums";
import { useBookingsStore } from "@/src/store/bookings/bookings.store";

export const BookingsService = {
  createBooking: async (newBooking: BookingFormI) =>
    new Promise<BookingI>(async (resolve, reject) => {
      try {
        const { data: booking } = (await ApiService.post(
          apiBookings.CREATE(),
          newBooking,
        )) as { data: BookingI };
        resolve(booking);
      } catch (error) {
        console.error("BookingsService createBooking error", error);
        reject(error);
      }
    }),

  getBookings: async () =>
    new Promise<{ data: BookingI[]; count: number }>(
      async (resolve, reject) => {
        try {
          const result = (await ApiService.get(apiBookings.LIST())) as {
            data: BookingI[];
            pagination?: { count?: number };
          };
          const { data: response = [], pagination } = result;
          resolve({
            data: response,
            count: pagination?.count ?? response.length,
          });
        } catch (error) {
          console.error("BookingsService getBookings error", error);
          reject(error);
        }
      },
    ),

  getBookingDetails: async (bookingId: BookingI["id"]) =>
    new Promise<BookingI>(async (resolve, reject) => {
      try {
        const { data: bookingDetails } = (await ApiService.get(
          apiBookings.DETAILS(bookingId),
        )) as { data: BookingI };
        resolve(bookingDetails);
      } catch (error) {
        console.error("BookingsService getBookingDetails error", error);
        reject(error);
      }
    }),

  updateBookingStatus: async (
    bookingId: BookingI["id"],
    status: BookingStatusEnum,
  ) =>
    new Promise<BookingI>(async (resolve, reject) => {
      try {
        if (!bookingId) reject();
        const { data: result } = (await ApiService.put(
          apiBookings.DETAILS(bookingId),
          { id: bookingId, status },
        )) as { data: BookingI };
        useBookingsStore.getState().getBookingDetails(bookingId, true);
        resolve(result);
      } catch (error) {
        console.error("BookingsService updateBookingStatus error", error);
        reject(error);
      }
    }),

  updateBooking: async (booking: BookingI) =>
    new Promise<BookingI>(async (resolve, reject) => {
      try {
        if (!booking.id) reject();
        const { data: result } = (await ApiService.put(
          apiBookings.DETAILS(booking.id),
          booking,
        )) as { data: BookingI };
        useBookingsStore.getState().getBookingDetails(booking.id);
        resolve(result);
      } catch (error) {
        console.error("BookingsService updateBookingConsumer error", error);
        reject(error);
      }
    }),

  cancelBooking: async (bookingId: BookingI["id"]) =>
    new Promise<boolean>(async (resolve, reject) => {
      try {
        if (!bookingId) reject();
        await ApiService.delete(apiBookings.DETAILS(bookingId));
        resolve(true);
      } catch (error) {
        console.error("BookingsService cancelBooking error", error);
        reject(error);
      }
    }),
};
