import * as Sentry from "@sentry/nextjs";
import { SentryConstants } from "@/src/constants";
import { isServer } from "@/src/utils/common.utils";
import { UserType } from "@/src/types/user.types";
import { ErrorI } from "@/src/types/error.types";

/**
 * Utility per gestire Sentry - Error Monitoring e Performance Tracking
 * Fornisce metodi per inizializzare Sentry, catturare errori, tracciare performance e gestire utenti
 */
export const SentryUtils = {
  /**
   * Inizializza Sentry con la configurazione del progetto
   */
  init: (): void => {
    if (!SentryConstants.dsn) {
      console.warn("Sentry DSN non configurato. Sentry non verrà inizializzato.");
      return;
    }

    Sentry.init({
      dsn: SentryConstants.dsn,
      environment: SentryConstants.environment,
      release: SentryConstants.release,
      
      // Performance Monitoring
      tracesSampleRate: parseFloat(SentryConstants.tracesSampleRate),
      
      // Session Replay
      replaysSessionSampleRate: parseFloat(SentryConstants.replaysSessionSampleRate),
      replaysOnErrorSampleRate: parseFloat(SentryConstants.replaysOnErrorSampleRate),
      
      integrations: [
        Sentry.replayIntegration({
          // Solo se siamo nel browser
          maskAllText: true,
          blockAllMedia: true,
        }),
      ],

      // Non catturare errori in development per evitare rumore
      enabled: SentryConstants.environment !== "development",

      beforeSend(event, hint) {
        // Filtriamo alcuni errori non critici
        const error = hint.originalException;
        
        // Ignora errori di rete comuni
        if (error instanceof Error) {
          if (
            error.message.includes("Network Error") ||
            error.message.includes("fetch") ||
            error.message.includes("AbortError")
          ) {
            return null;
          }
        }

        return event;
      },
    });
  },

  /**
   * Cattura un errore e lo invia a Sentry
   */
  captureError: (error: Error | ErrorI | string, context?: Record<string, any>): void => {
    try {
      if (typeof error === "string") {
        Sentry.captureMessage(error, "error");
      } else if ("code" in error) {
        // Errore personalizzato del progetto
        Sentry.captureException(new Error(error.message || `Error code: ${error.code}`), {
          tags: {
            errorCode: error.code,
            customError: true,
          },
          contexts: {
            errorDetails: error,
            ...context,
          },
        });
      } else {
        // Errore JavaScript standard
        Sentry.captureException(error, {
          contexts: context ? { additionalContext: context } : undefined,
        });
      }
    } catch (sentryError) {
      console.error("Errore durante l'invio a Sentry:", sentryError);
    }
  },

  /**
   * Cattura un messaggio informativo
   */
  captureMessage: (message: string, level: "info" | "warning" | "error" = "info"): void => {
    try {
      Sentry.captureMessage(message, level);
    } catch (sentryError) {
      console.error("Errore durante l'invio del messaggio a Sentry:", sentryError);
    }
  },

  /**
   * Imposta l'utente corrente nel contesto di Sentry
   */
  setUser: (user: UserType | null): void => {
    try {
      Sentry.setUser(
        user
          ? {
              id: user.id,
              email: user.email,
              username: user.user_metadata?.displayName || user.email,
              role: user.user_metadata?.role,
            }
          : null
      );
    } catch (sentryError) {
      console.error("Errore durante l'impostazione dell'utente in Sentry:", sentryError);
    }
  },

  /**
   * Aggiunge tag personalizzati al contesto
   */
  setTag: (key: string, value: string): void => {
    try {
      Sentry.setTag(key, value);
    } catch (sentryError) {
      console.error("Errore durante l'impostazione del tag in Sentry:", sentryError);
    }
  },

  /**
   * Aggiunge contesto extra
   */
  setContext: (key: string, context: Record<string, any>): void => {
    try {
      Sentry.setContext(key, context);
    } catch (sentryError) {
      console.error("Errore durante l'impostazione del contesto in Sentry:", sentryError);
    }
  },

  /**
   * Crea uno span per il performance monitoring
   */
  startSpan: (name: string, operation: string) => {
    try {
      return Sentry.startInactiveSpan({
        name,
        op: operation,
      });
    } catch (sentryError) {
      console.error("Errore durante l'avvio dello span Sentry:", sentryError);
      return null;
    }
  },

  /**
   * Wrapper per async operations con error handling automatico
   */
  withErrorHandling: async <T>(
    operation: () => Promise<T>,
    operationName: string,
    context?: Record<string, any>
  ): Promise<T | null> => {
    return Sentry.startSpan(
      {
        name: operationName,
        op: "async_operation",
      },
      async (span) => {
        try {
          const result = await operation();
          span?.setStatus({ code: 1 }); // OK
          return result;
        } catch (error) {
          span?.setStatus({ code: 2 }); // ERROR
          SentryUtils.captureError(error as Error, {
            operation: operationName,
            ...context,
          });
          throw error;
        }
      }
    );
  },

  /**
   * Wrapper per funzioni sincrone con error handling automatico
   */
  withSyncErrorHandling: <T>(
    operation: () => T,
    operationName: string,
    context?: Record<string, any>
  ): T | null => {
    try {
      return operation();
    } catch (error) {
      SentryUtils.captureError(error as Error, {
        operation: operationName,
        ...context,
      });
      throw error;
    }
  },

  /**
   * Aggiunge breadcrumb per tracciare il flusso dell'applicazione
   */
  addBreadcrumb: (message: string, category: string, level: "info" | "warning" | "error" = "info"): void => {
    try {
      Sentry.addBreadcrumb({
        message,
        category,
        level,
        timestamp: Date.now() / 1000,
      });
    } catch (sentryError) {
      console.error("Errore durante l'aggiunta del breadcrumb in Sentry:", sentryError);
    }
  },
};
