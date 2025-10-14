// Types per il servizio Email
export interface EmailI {
  id?: string;
  to: string | string[];
  subject: string;
  from?: string;
  replyTo?: string;
}

export interface EmailWithTemplateI extends EmailI {
  react: React.ReactElement;
  text?: string;
}

export interface EmailWithHtmlI extends EmailI {
  html: string;
  text?: string;
}

export interface WelcomeEmailDataI {
  to: string;
  firstName: string;
  appUrl?: string;
}

export interface BookingConfirmationEmailDataI {
  to: string;
  customerName: string;
  bookingId: string;
  serviceName: string;
  bookingDate: string | Date;
  bookingTime: string | Date;
  vigilName?: string;
  location: string;
  totalAmount: string;
  appUrl?: string;
}

export interface EmailNotificationDataI {
  to: string | string[];
  subject: string;
  content: string;
}

export interface EmailResponseI {
  success: boolean;
  data: { id?: string } | null;
  error: string | null;
}

export interface EmailConfigI {
  defaultFrom: string;
  devEmail: string;
  subjectPrefixes: {
    booking: string;
    notification: string;
    welcome: string;
    reset: string;
    verification: string;
  };
}
