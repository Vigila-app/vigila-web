import {
  BookingStatusEnum,
  PaymentStatusEnum,
} from "@/src/enums/booking.enums";
import { ServiceI } from "@/src/types/services.types";
import { UserType } from "@/src/types/user.types";

export type BookingI = {
  id: string;
  service_id: ServiceI["id"];
  consumer_id: UserType["id"];
  vigil_id: UserType["id"];
  startDate: Date;
  endDate: Date;
  quantity: number;
  price: number;
  currency: string;
  status?: BookingStatusEnum;
  payment_status?: PaymentStatusEnum;
  payment_id?: string;
  note?: string;
  created_at: Date;
  updated_at?: Date;
  address: string;
};

export type BookingFormI = BookingI & {};

export type BookingStoreType = {
  onLogout: () => void;
  bookings: BookingI[];
  lastUpdate?: Date;
  getBookings: (force?: boolean) => void;
  getBookingDetails: (
    bookingId: BookingI["id"],
    force?: boolean
  ) => Promise<BookingI>;
  createBooking: (booking: BookingFormI) => Promise<BookingI>;
  updateBookingStatus: (
    bookingId: BookingI["id"],
    status: BookingStatusEnum
  ) => Promise<BookingI>;
  cancelBooking: (bookingId: BookingI["id"]) => Promise<boolean>;
  resetLastUpdate: () => void;
};
