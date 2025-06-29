import { BookingStatusEnum, PaymentStatusEnum } from "@/src/enums/booking.enums";
import { ServiceI } from "@/src/types/services.types";
import { GuestI } from "@/src/types/crm.types";
import { UserType } from "@/src/types/user.types";

export type BookingI = {
  id: string;
  service_id: ServiceI["id"];
  consumer_id: UserType["id"];
  vigil_id: UserType["id"];
  guest_id?: GuestI["id"];
  booking_date: Date;
  service_date: Date;
  duration_hours: number;
  total_amount: number;
  currency: string;
  status: BookingStatusEnum;
  payment_status: PaymentStatusEnum;
  payment_intent_id?: string;
  notes?: string;
  created_at: Date;
  updated_at: Date;
  
  // Populated fields
  service?: ServiceI;
  consumer?: UserType;
  vigil?: UserType;
  guest?: GuestI;
};

export type BookingFormI = {
  service_id: ServiceI["id"];
  guest_id?: GuestI["id"];
  service_date: Date;
  duration_hours: number;
  notes?: string;
};

export type BookingStoreType = {
  onLogout: () => void;
  bookings: BookingI[];
  lastUpdate?: Date;
  getBookings: (force?: boolean) => void;
  getBookingDetails: (bookingId: BookingI["id"], force?: boolean) => Promise<BookingI>;
  createBooking: (booking: BookingFormI) => Promise<BookingI>;
  updateBookingStatus: (bookingId: BookingI["id"], status: BookingStatusEnum) => Promise<BookingI>;
  cancelBooking: (bookingId: BookingI["id"]) => Promise<boolean>;
  resetLastUpdate: () => void;
};