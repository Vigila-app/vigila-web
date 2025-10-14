import { ResendService } from './resend.service';
import { EmailConstants } from '@/src/constants/email.constants';
import { WelcomeEmailTemplate, BookingConfirmationEmailTemplate } from '@/components/email';
import {
  WelcomeEmailDataI,
  BookingConfirmationEmailDataI,
  EmailNotificationDataI,
  EmailResponseI,
} from '@/src/types/email.types';
import { AppConstants } from '@/src/constants';

export const EmailService = {
  sendWelcomeEmail: async (data: WelcomeEmailDataI) =>
    new Promise<EmailResponseI>(async (resolve, reject) => {
      try {
        const result = await ResendService.sendEmailWithTemplate({
          to: data.to,
          subject: `${EmailConstants.subjectPrefixes.welcome} - ${data.firstName}!`,
          react: WelcomeEmailTemplate({
            firstName: data.firstName,
            appUrl: data.appUrl || 'https://vigila.app'
          }),
        });
        resolve(result);
      } catch (error) {
        console.error('EmailService sendWelcomeEmail error:', error);
        reject(error);
      }
    }),

  sendBookingConfirmationEmail: async (data: BookingConfirmationEmailDataI) =>
    new Promise<EmailResponseI>(async (resolve, reject) => {
      try {
        const result = await ResendService.sendEmailWithTemplate({
          to: data.to,
          subject: `${EmailConstants.subjectPrefixes.booking} #${data.bookingId} confermata`,
          react: BookingConfirmationEmailTemplate({
            customerName: data.customerName,
            bookingId: data.bookingId,
            serviceName: data.serviceName,
            bookingDate: data.bookingDate,
            bookingTime: data.bookingTime,
            vigilName: data.vigilName,
            location: data.location,
            totalAmount: data.totalAmount,
            appUrl: data.appUrl || AppConstants.hostUrl
          }),
        });
        resolve(result);
      } catch (error) {
        console.error('EmailService sendBookingConfirmationEmail error:', error);
        reject(error);
      }
    }),

  sendNotificationEmail: async (data: EmailNotificationDataI) =>
    new Promise<EmailResponseI>(async (resolve, reject) => {
      try {
        const htmlContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background-color: #f8f9fa; padding: 40px 20px; text-align: center;">
              <h1 style="color: #333; font-size: 24px; margin-bottom: 10px;">
                Vigila
              </h1>
            </div>
            
            <div style="padding: 40px 20px; background-color: #ffffff;">
              <div style="color: #666; font-size: 16px; line-height: 1.6;">
                ${data.content}
              </div>
            </div>
            
            <div style="background-color: #f8f9fa; padding: 20px; text-align: center;">
              <p style="color: #888; font-size: 14px; margin: 0;">
                © 2025 Vigila. Tutti i diritti riservati.
              </p>
            </div>
          </div>
        `;

        const result = await ResendService.sendEmailWithHtml({
          to: data.to,
          subject: `${EmailConstants.subjectPrefixes.notification} ${data.subject}`,
          html: htmlContent,
        });
        resolve(result);
      } catch (error) {
        console.error('EmailService sendNotificationEmail error:', error);
        reject(error);
      }
    }),
};
