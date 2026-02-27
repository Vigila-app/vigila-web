import {
  BookingStatusEnum,
  PaymentStatusEnum,
} from "@/src/enums/booking.enums";
import { ServiceI } from "@/src/types/services.types";
import { UserType } from "@/src/types/user.types";
import { ConsumerDetailsType } from "@/src/types/consumer.types";
import { VigilDetailsType } from "@/src/types/vigil.types";

export type BookingI = {
  id: string;
  active: boolean;
  service_id: ServiceI["id"];
  consumer_id: UserType["id"];
  vigil_id: UserType["id"];
  startDate: Date;
  endDate: Date;
  quantity: number;
  min_unit: number;
  max_unit?: number;
  postalCode: string[];
  price: number;
  fee: number;
  currency: string;
  status?: BookingStatusEnum;
  payment_status?: PaymentStatusEnum;
  payment_id?: string;
  note?: string;
  created_at: Date;
  updated_at?: Date;
  address: string;
  consumer?: Partial<ConsumerDetailsType>;
  vigil?: Partial<VigilDetailsType>;
  service?: Partial<ServiceI>;
  extras?: Record<string, any>;
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

type BadgeConfig = { color: string; label: string };

export const bookingStatusBadge: Record<BookingStatusEnum, BadgeConfig> = {
  [BookingStatusEnum.PENDING]:          { color: 'yellow', label: 'In attesa' },
  [BookingStatusEnum.CONFIRMED]:        { color: 'green',  label: 'Confermata' },
  [BookingStatusEnum.IN_PROGRESS]:      { color: 'blue',   label: 'In corso' },
  [BookingStatusEnum.COMPLETED]:        { color: 'gray',   label: 'Completata' },
  [BookingStatusEnum.CANCELLED_USER]:   { color: 'red',    label: 'Annullata' },
  [BookingStatusEnum.CANCELLED_VIGIL]:  { color: 'red',    label: 'Annullata da Vigil' },
  [BookingStatusEnum.REJECTED]:         { color: 'red',    label: 'Rifiutata' },
  [BookingStatusEnum.REFUNDED]:         { color: 'purple', label: 'Rimborsata' },
};

export const paymentStatusBadge: Record<PaymentStatusEnum, BadgeConfig> = {
  [PaymentStatusEnum.PENDING]:  { color: 'yellow', label: 'Pagamento in attesa' },
  [PaymentStatusEnum.PAID]:     { color: 'green',  label: 'Pagato' },
  [PaymentStatusEnum.FAILED]:   { color: 'red',    label: 'Pagamento fallito' },
  [PaymentStatusEnum.REFUNDED]: { color: 'purple', label: 'Rimborsato' },
};
