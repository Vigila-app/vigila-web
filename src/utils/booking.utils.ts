import { BookingStatusEnum } from "@/src/enums/booking.enums";
import { BookingI } from '@/src/types/booking.types';

export const BookingUtils = {
  getStatusColor: (status: BookingStatusEnum) => {
    switch (status) {
      case BookingStatusEnum.PENDING:
        return "yellow";
      case BookingStatusEnum.CONFIRMED:
        return "blue";
      case BookingStatusEnum.IN_PROGRESS:
        return "purple";
      case BookingStatusEnum.COMPLETED:
        return "green";
      case BookingStatusEnum.CANCELLED:
      case BookingStatusEnum.REFUNDED:
        return "red";
      default:
        return "gray";
    }
  },

  /**
   * Formatta la data di una prenotazione in formato locale italiano
   */
  formatBookingDate: (date: Date): string => {
    return new Date(date).toLocaleDateString('it-IT', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  },

  /**
   * Formatta l'orario di una prenotazione
   */
  formatBookingTime: (startDate: Date, endDate: Date): string => {
    const startTime = new Date(startDate).toLocaleTimeString('it-IT', {
      hour: '2-digit',
      minute: '2-digit'
    });
    const endTime = new Date(endDate).toLocaleTimeString('it-IT', {
      hour: '2-digit', 
      minute: '2-digit'
    });
    return `${startTime} - ${endTime}`;
  },

  /**
   * Calcola l'importo totale di una prenotazione
   */
  calculateTotalAmount: (booking: BookingI): string => {
    return (booking.price * booking.quantity).toFixed(2);
  },
};
