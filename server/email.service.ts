import { ResendService } from "./resend.service";
import { EmailConstants } from "@/src/constants/email.constants";
import {
  WelcomeEmailTemplate,
  BookingConfirmationEmailTemplate,
  NotificationEmailTemplate,
} from "@/components/email";
import {
  WelcomeEmailDataI,
  BookingConfirmationEmailDataI,
  EmailNotificationDataI,
  EmailResponseI,
} from "@/src/types/email.types";
import { AppConstants } from "@/src/constants";

export const EmailService = {
  sendWelcomeEmail: async (data: WelcomeEmailDataI) =>
    new Promise<EmailResponseI>(async (resolve, reject) => {
      try {
        const result = await ResendService.sendEmailWithTemplate({
          to: data.to,
          subject: `${EmailConstants.subjectPrefixes.welcome} - ${data.firstName}!`,
          react: WelcomeEmailTemplate({
            firstName: data.firstName,
            appUrl: data.appUrl || AppConstants.hostUrl,
          }),
        });
        resolve(result);
      } catch (error) {
        console.error("EmailService sendWelcomeEmail error:", error);
        reject(error);
      }
    }),

  sendBookingConfirmationEmail: async (
    data: BookingConfirmationEmailDataI,
    isVigil = false
  ) =>
    new Promise<EmailResponseI>(async (resolve, reject) => {
      try {
        const result = await ResendService.sendEmailWithTemplate({
          to: data.to,
          subject: `${EmailConstants.subjectPrefixes.booking} #${data.bookingId} ${isVigil ? "assegnata" : "confermata"}`,
          react: BookingConfirmationEmailTemplate(
            {
              customerName: data.customerName,
              bookingId: data.bookingId,
              serviceName: data.serviceName,
              bookingDate: data.bookingDate,
              bookingTime: data.bookingTime,
              vigilName: data.vigilName,
              location: data.location,
              totalAmount: data.totalAmount,
              appUrl: data.appUrl || AppConstants.hostUrl,
            },
            isVigil
          ),
        });
        resolve(result);
      } catch (error) {
        console.error(
          "EmailService sendBookingConfirmationEmail error:",
          error
        );
        reject(error);
      }
    }),

  sendNotificationEmail: async (data: EmailNotificationDataI) =>
    new Promise<EmailResponseI>(async (resolve, reject) => {
      try {
        const result = await ResendService.sendEmailWithTemplate({
          to: data.to,
          subject: `${EmailConstants.subjectPrefixes.notification} ${data.subject}`,
          react: NotificationEmailTemplate({
            subject: data.subject,
            content: data.content,
          }),
        });
        resolve(result);
      } catch (error) {
        console.error("EmailService sendNotificationEmail error:", error);
        reject(error);
      }
    }),
};
