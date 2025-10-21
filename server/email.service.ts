import { ResendService } from "./resend.service";
import { EmailConstants } from "@/src/constants/email.constants";
import {
  WelcomeEmailTemplate,
  BookingCreationEmailTemplate,
  BookingConfirmationEmailTemplate,
  NotificationEmailTemplate,
} from "@/components/email";
import {
  WelcomeEmailDataI,
  BookingConfirmationEmailDataI,
  EmailNotificationDataI,
  EmailResponseI,
  EmailI,
} from "@/src/types/email.types";
import { AppConstants } from "@/src/constants";
import { UserDetailsType } from "@/src/types/user.types";
import { ProfileActiveEmailTemplate } from "@/components/email/ProfileActiveEmailTemplate";
import { isReleased } from "@/src/utils/envs.utils";
import { BookingCancellationEmailTemplate } from "@/components/email/BookingCancellationEmailTemplate";
import { BookingRejectEmailTemplate } from "@/components/email/BookingRejectEmailTemplate";

const SEND_EMAIL_ACTIVE = isReleased;

export const EmailService = {
  sendWelcomeEmail: async (data: WelcomeEmailDataI) =>
    new Promise<EmailResponseI>(async (resolve, reject) => {
      try {
        if (!SEND_EMAIL_ACTIVE) {
          resolve(true as any);
        }
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
  
    sendProfileActiveEmail: async (data: EmailI, user: UserDetailsType) =>
    new Promise<EmailResponseI>(async (resolve, reject) => {
      try {
        if (!SEND_EMAIL_ACTIVE) {
          resolve(true as any);
        }
        const result = await ResendService.sendEmailWithTemplate({
          to: data.to,
          subject: data.subject,
          react: ProfileActiveEmailTemplate({
            user,
            appUrl: AppConstants.hostUrl,
          }),
        });
        resolve(result);
      } catch (error) {
        console.error("EmailService sendProfileActiveEmail error:", error);
        reject(error);
      }
    }),

  sendBookingCreationEmail: async (
    data: BookingConfirmationEmailDataI,
    isVigil = false
  ) =>
    new Promise<EmailResponseI>(async (resolve, reject) => {
      if (!SEND_EMAIL_ACTIVE) {
          resolve(true as any);
        }
      try {
        const result = await ResendService.sendEmailWithTemplate({
          to: data.to,
          subject: data.subject,
          react: BookingCreationEmailTemplate(
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
              quantity: data.quantity,
              unitType: data.unitType,
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

  sendBookingConfirmationEmail: async (
    data: BookingConfirmationEmailDataI,
    isVigil = false
  ) =>
    new Promise<EmailResponseI>(async (resolve, reject) => {
      try {
        if (!SEND_EMAIL_ACTIVE) {
          resolve(true as any);
        }
        const result = await ResendService.sendEmailWithTemplate({
          to: data.to,
          subject: data.subject,
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
              quantity: data.quantity,
              unitType: data.unitType,
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

    sendBookingRejectEmail: async (
    data: BookingConfirmationEmailDataI,
    isVigil = false
  ) =>
    new Promise<EmailResponseI>(async (resolve, reject) => {
      try {
        if (!SEND_EMAIL_ACTIVE) {
          resolve(true as any);
        }
        const result = await ResendService.sendEmailWithTemplate({
          to: data.to,
          subject: data.subject,
          react: BookingRejectEmailTemplate(
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
              quantity: data.quantity,
              unitType: data.unitType,
            },
            isVigil
          ),
        });
        resolve(result);
      } catch (error) {
        console.error(
          "EmailService sendBookingRejectEmail error:",
          error
        );
        reject(error);
      }
    }),

    sendBookingCancellationEmail: async (
    data: BookingConfirmationEmailDataI,
    isVigil = false
  ) =>
    new Promise<EmailResponseI>(async (resolve, reject) => {
      try {
        if (!SEND_EMAIL_ACTIVE) {
          resolve(true as any);
        }
        const result = await ResendService.sendEmailWithTemplate({
          to: data.to,
          subject: data.subject,
          react: BookingCancellationEmailTemplate(
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
              quantity: data.quantity,
              unitType: data.unitType,
            },
            isVigil
          ),
        });
        resolve(result);
      } catch (error) {
        console.error(
          "EmailService sendBookingCancellationEmail error:",
          error
        );
        reject(error);
      }
    }),

  sendNotificationEmail: async (data: EmailNotificationDataI) =>
    new Promise<EmailResponseI>(async (resolve, reject) => {
      try {
        if (!SEND_EMAIL_ACTIVE) {
          resolve(true as any);
        }
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
