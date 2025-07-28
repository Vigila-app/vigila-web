import { EmailConfigI } from "@/src/types/email.types";

export const EmailConstants: EmailConfigI = {
  // Sender di default (sostituisci con il tuo dominio verificato)
  defaultFrom: 'Vigila <noreply@tuodominio.com>',
  
  // Subject prefixes per diversi tipi di email
  subjectPrefixes: {
    booking: '[Vigila] Prenotazione',
    notification: '[Vigila] Notifica',
    welcome: '[Vigila] Benvenuto',
    reset: '[Vigila] Reset Password',
    verification: '[Vigila] Verifica Account',
  },
} as const;
