import { Resend } from 'resend';
import { EmailConstants } from '@/src/constants/email.constants';
import {
  EmailWithTemplateI,
  EmailWithHtmlI,
  EmailResponseI,
} from '@/src/types/email.types';

// Verifica che la API key sia configurata
if (!process.env.RESEND_API_KEY) {
  throw new Error('RESEND_API_KEY è richiesta ma non è stata configurata nelle variabili d\'ambiente');
}

// Istanza globale di Resend
const ResendInstance = new Resend(process.env.RESEND_API_KEY);

export const ResendService = {
  sendEmailWithTemplate: async (options: EmailWithTemplateI) =>
    new Promise<EmailResponseI>(async (resolve, reject) => {
      try {
        const result = await ResendInstance.emails.send({
          from: options.from || EmailConstants.defaultFrom,
          to: options.to,
          subject: options.subject,
          react: options.react,
          replyTo: options.replyTo,
        });

        resolve({ 
          success: true, 
          data: result.data || null, 
          error: null 
        });
      } catch (error) {
        console.error('ResendService sendEmailWithTemplate error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Errore sconosciuto';
        resolve({ 
          success: false, 
          data: null, 
          error: errorMessage 
        });
      }
    }),

  sendEmailWithHtml: async (options: EmailWithHtmlI) =>
    new Promise<EmailResponseI>(async (resolve, reject) => {
      try {
        const result = await ResendInstance.emails.send({
          from: options.from || EmailConstants.defaultFrom,
          to: options.to,
          subject: options.subject,
          html: options.html,
          text: options.text,
          replyTo: options.replyTo,
        });

        resolve({ 
          success: true, 
          data: result.data || null, 
          error: null 
        });
      } catch (error) {
        console.error('ResendService sendEmailWithHtml error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Errore sconosciuto';
        resolve({ 
          success: false, 
          data: null, 
          error: errorMessage 
        });
      }
    }),
};
