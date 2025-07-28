import { BookingStatusEnum } from "@/src/enums/booking.enums";
import { EmailService } from '@/src/services/email.service';
import { BookingI } from '@/src/types/booking.types';
import { EmailResponseI } from '@/src/types/email.types';

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
   * Invia email di conferma prenotazione
   * Dovrebbe essere chiamata dopo la creazione di una prenotazione
   */
  sendConfirmationEmail: async (
    booking: BookingI,
    customerEmail: string,
    customerName: string,
    vigilName?: string,
    serviceName?: string
  ): Promise<EmailResponseI> => {
    try {
      // Formatta la data di inizio
      const bookingDate = new Date(booking.startDate).toLocaleDateString('it-IT', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      // Formatta l'orario (usando start e end date)
      const startTime = new Date(booking.startDate).toLocaleTimeString('it-IT', {
        hour: '2-digit',
        minute: '2-digit'
      });
      const endTime = new Date(booking.endDate).toLocaleTimeString('it-IT', {
        hour: '2-digit', 
        minute: '2-digit'
      });
      const bookingTime = `${startTime} - ${endTime}`;

      // Formatta l'importo
      const totalAmount = (booking.price * booking.quantity).toFixed(2);

      const result = await EmailService.sendBookingConfirmationEmail({
        to: customerEmail,
        customerName,
        bookingId: booking.id,
        serviceName: serviceName || 'Servizio di Vigilanza',
        bookingDate,
        bookingTime,
        vigilName,
        location: booking.address || 'Da definire',
        totalAmount,
      });

      if (result.success) {
        console.log(`Email di conferma inviata per prenotazione ${booking.id}:`, result.data?.id);
      } else {
        console.error(`Errore invio email per prenotazione ${booking.id}:`, result.error);
      }

      return result;
    } catch (error) {
      console.error('BookingUtils sendConfirmationEmail error:', error);
      return { success: false, data: null, error: 'Errore interno' };
    }
  },

  /**
   * Invia email di aggiornamento stato prenotazione
   */
  sendStatusUpdateEmail: async (
    bookingId: string,
    customerEmail: string,
    customerName: string,
    newStatus: string,
    message?: string
  ): Promise<EmailResponseI> => {
    try {
      let statusText = '';
      let content = '';

      switch (newStatus) {
        case 'confirmed':
          statusText = 'confermata';
          content = `
            <p>La tua prenotazione <strong>#${bookingId}</strong> è stata confermata.</p>
            <p>Un vigile ti contatterà a breve per i dettagli finali.</p>
            ${message ? `<p><strong>Nota:</strong> ${message}</p>` : ''}
          `;
          break;
        case 'cancelled':
          statusText = 'cancellata';
          content = `
            <p>La tua prenotazione <strong>#${bookingId}</strong> è stata cancellata.</p>
            ${message ? `<p><strong>Motivo:</strong> ${message}</p>` : ''}
            <p>Se hai domande, contattaci tramite l&apos;app.</p>
          `;
          break;
        case 'completed':
          statusText = 'completata';
          content = `
            <p>La tua prenotazione <strong>#${bookingId}</strong> è stata completata con successo.</p>
            <p>Grazie per aver scelto Vigila! Ti invitiamo a lasciare una recensione.</p>
            ${message ? `<p><strong>Note finali:</strong> ${message}</p>` : ''}
          `;
          break;
        default:
          statusText = 'aggiornata';
          content = `
            <p>La tua prenotazione <strong>#${bookingId}</strong> è stata aggiornata.</p>
            <p><strong>Nuovo stato:</strong> ${newStatus}</p>
            ${message ? `<p><strong>Dettagli:</strong> ${message}</p>` : ''}
          `;
      }

      const result = await EmailService.sendNotificationEmail({
        to: customerEmail,
        subject: `Prenotazione ${statusText}`,
        content,
      });

      return result;
    } catch (error) {
      console.error('BookingUtils sendStatusUpdateEmail error:', error);
      return { success: false, data: null, error: 'Errore interno' };
    }
  },

  /**
   * Invia email di promemoria prenotazione
   */
  sendReminderEmail: async (
    booking: BookingI,
    customerEmail: string,
    customerName: string,
    hoursBeforeBooking: number = 24,
    serviceName?: string
  ): Promise<EmailResponseI> => {
    try {
      const bookingDate = new Date(booking.startDate).toLocaleDateString('it-IT', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      
      const startTime = new Date(booking.startDate).toLocaleTimeString('it-IT', {
        hour: '2-digit',
        minute: '2-digit'
      });

      const content = `
        <p>Ciao ${customerName},</p>
        <p>Ti ricordiamo che hai una prenotazione tra <strong>${hoursBeforeBooking} ore</strong>:</p>
        <ul>
          <li><strong>Data:</strong> ${bookingDate}</li>
          <li><strong>Orario:</strong> ${startTime}</li>
          <li><strong>Luogo:</strong> ${booking.address || 'Da definire'}</li>
          <li><strong>Servizio:</strong> ${serviceName || 'Servizio di Vigilanza'}</li>
        </ul>
        <p>Assicurati di essere presente all&apos;orario concordato.</p>
        <p>Per qualsiasi necessità, contattaci tramite l&apos;app.</p>
      `;

      const result = await EmailService.sendNotificationEmail({
        to: customerEmail,
        subject: `Promemoria prenotazione tra ${hoursBeforeBooking}h`,
        content,
      });

      return result;
    } catch (error) {
      console.error('BookingUtils sendReminderEmail error:', error);
      return { success: false, data: null, error: 'Errore interno' };
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
