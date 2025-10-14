import { BookingStatusEnum } from "@/src/enums/booking.enums";
import { isServer, amountDisplay } from "@/src/utils/common.utils";
import { dateDisplay } from "@/src/utils/date.utils";
import { EmailService } from "@/server/email.service";
import { BookingI } from "@/src/types/booking.types";
import { User } from "@supabase/supabase-js";

export const BookingUtilsServer = {
  sendConsumerBookingStatusUpdateNotification: async (
    booking: BookingI,
    consumer: User,
    vigil?: User
  ) => {
    try {
      if (!isServer) {
        throw new Error("This function can only be called on the server side.");
      }

      if (!booking?.id || !consumer?.email) {
        throw new Error("Booking and consumer details are required.");
      }

      let statusText = "";
      let content = "";

      switch (booking.status) {
        case BookingStatusEnum.CONFIRMED: {
          try {
            // Invia email di conferma prenotazione
            await EmailService.sendBookingConfirmationEmail({
              to: consumer.email,
              customerName:
                (consumer as any)?.user_metadata?.name ||
                (consumer as any)?.user_metadata?.firstName ||
                (consumer as any)?.name,
              bookingId: booking.id,
              serviceName: booking.service?.name || "",
              bookingDate: booking.startDate,
              bookingTime: booking.startDate,
              vigilName:
                booking.vigil?.name ||
                booking.vigil?.displayName ||
                booking.vigil?.surname ||
                (vigil as any)?.user_metadata?.name ||
                (vigil as any)?.user_metadata?.firstName ||
                "",
              location: booking.address || "",
              totalAmount:
                typeof booking.price === "number"
                  ? amountDisplay(booking.price, booking.currency as any)
                  : String(booking.price || ""),
            });
            return; // Esci dalla funzione dopo aver inviato l'email di conferma
          } catch (error) {
            statusText = "confermata";
            content = `
                    <p>La tua prenotazione <strong>#${booking.id}</strong> è stata confermata.</p>
                    <p>Il Vigil ti contatterà a breve per i dettagli finali.</p>
                  `;
          }
          break;
        }
        case BookingStatusEnum.CANCELLED:
          statusText = "cancellata";
          content = `
                    <p>La tua prenotazione <strong>#${booking.id}</strong> è stata cancellata.</p>
                    <p>Se hai domande, contattaci tramite l&apos;app.</p>
                  `;
          break;
        case BookingStatusEnum.COMPLETED:
          statusText = "completata";
          content = `
                    <p>La tua prenotazione <strong>#${booking.id}</strong> è stata completata con successo.</p>
                    <p>Grazie per aver scelto Vigila! Ti invitiamo a lasciare una recensione.</p>
                  `;
          break;
        case BookingStatusEnum.IN_PROGRESS:
          statusText = "in corso";
          content = `
                    <p>La tua prenotazione <strong>#${booking.id}</strong> è ora in corso.</p>
                    <p>Il servizio di vigilanza è attivo.</p>
                  `;
          break;
        default:
          statusText = "aggiornata";
          content = `
                    <p>La tua prenotazione <strong>#${booking.id}</strong> è stata aggiornata.</p>
                    <p><strong>Nuovo stato:</strong> ${booking.status}</p>
                  `;
      }

      // Invia email di notifica
      await EmailService.sendNotificationEmail({
        to: consumer.email,
        subject: `Prenotazione ${statusText}`,
        content,
      });

      console.log(
        `Email di aggiornamento stato inviata per prenotazione ${booking?.id}`
      );
    } catch (emailError) {
      // Log dell'errore ma non interrompe l'aggiornamento della prenotazione
      console.error("Errore invio email di aggiornamento stato:", emailError);
    }
  },
  sendVigilBookingStatusUpdateNotification: async (
    booking: BookingI,
    vigil: User
  ) => {
    try {
      if (!isServer) {
        throw new Error("This function can only be called on the server side.");
      }

      if (!booking?.id || !vigil?.email) {
        throw new Error("Booking and vigil details are required.");
      }

      let statusText = "";
      let content = "";

      switch (booking.status) {
        case BookingStatusEnum.CONFIRMED: {
          try {
            // Invia email di conferma prenotazione al Vigil (simile al consumer)
            await EmailService.sendBookingConfirmationEmail(
              {
                to: vigil.email,
                // customerName è il nome del consumer associato alla prenotazione
                customerName:
                  booking.consumer?.name ||
                  booking.consumer?.displayName ||
                  booking.consumer?.surname ||
                  booking.consumer?.username ||
                  "",
                bookingId: booking.id,
                serviceName: booking.service?.name || "",
                bookingDate: booking.startDate,
                bookingTime: booking.startDate,
                // vigilName è il nome del vigil (destinatario)
                vigilName:
                  booking.vigil?.name ||
                  booking.vigil?.displayName ||
                  booking.vigil?.surname ||
                  (vigil as any)?.user_metadata?.name ||
                  (vigil as any)?.user_metadata?.firstName ||
                  (vigil as any)?.name ||
                  (vigil as any)?.displayName ||
                  "",
                location: booking.address || "",
                totalAmount:
                  typeof booking.price === "number"
                    ? amountDisplay(
                        booking.price - booking.fee,
                        booking.currency as any
                      )
                    : String(booking.price - booking.fee || ""),
              },
              true
            );
            return; // Esci dopo aver inviato l'email di conferma al vigil
          } catch (error) {
            statusText = "confermata";
            content = `
                    <p>Hai ricevuto una nuova prenotazione <strong>#${booking.id}</strong>.</p>
                    <p>Contatta l'utente a breve per i dettagli finali.</p>
                  `;
          }
          break;
        }
        case BookingStatusEnum.CANCELLED:
          statusText = "cancellata";
          content = `
                    <p>La prenotazione <strong>#${booking.id}</strong> è stata cancellata.</p>
                    <p>Se hai domande, contattaci tramite l&apos;app.</p>
                  `;
          break;
        case BookingStatusEnum.COMPLETED:
          statusText = "completata";
          content = `
                    <p>La prenotazione <strong>#${booking.id}</strong> è stata completata con successo.</p>
                    <p>Grazie per aver collaborato con Vigila!</p>
                  `;
          break;
        case BookingStatusEnum.IN_PROGRESS:
          statusText = "in corso";
          content = `
                    <p>La prenotazione <strong>#${booking.id}</strong> è ora in corso.</p>
                  `;
          break;
        default:
          statusText = "aggiornata";
          content = `
                    <p>La prenotazione <strong>#${booking.id}</strong> è stata aggiornata.</p>
                    <p><strong>Nuovo stato:</strong> ${booking.status}</p>
                  `;
      }

      // Invia email di notifica
      await EmailService.sendNotificationEmail({
        to: vigil.email,
        subject: `Prenotazione ${statusText}`,
        content,
      });

      console.log(
        `Email di aggiornamento stato inviata per prenotazione ${booking?.id}`
      );
    } catch (emailError) {
      // Log dell'errore ma non interrompe l'aggiornamento della prenotazione
      console.error("Errore invio email di aggiornamento stato:", emailError);
    }
  },
};
