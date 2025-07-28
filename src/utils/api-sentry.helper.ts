import { SentryUtils } from "@/src/utils/sentry.utils";

/**
 * Helper utility per integrare Sentry nell'ApiService
 * Centralizza la logica di error tracking per evitare duplicazione
 */
export const ApiSentryHelper = {
  /**
   * Cattura errori HTTP con context standardizzato
   */
  captureHttpError: async (
    res: Response,
    method: string,
    url: string,
    errorResponse?: any
  ): Promise<void> => {
    try {
      SentryUtils.captureError(
        new Error(`HTTP ${res.status}: ${res.statusText}`),
        {
          apiError: true,
          url,
          method,
          status: res.status,
          statusText: res.statusText,
          errorResponse,
          timestamp: new Date().toISOString(),
        }
      );

      SentryUtils.addBreadcrumb(
        `API call failed: ${method} ${url} (${res.status})`,
        'http',
        'error'
      );
    } catch (sentryError) {
      console.warn("Failed to send HTTP error to Sentry:", sentryError);
    }
  },

  /**
   * Cattura errori di parsing con context standardizzato
   */
  captureParsingError: async (
    error: Error,
    res: Response,
    method: string,
    url: string
  ): Promise<void> => {
    try {
      SentryUtils.captureError(error, {
        apiParsingError: true,
        url,
        method,
        status: res.status,
        timestamp: new Date().toISOString(),
      });
    } catch (sentryError) {
      console.warn("Failed to send parsing error to Sentry:", sentryError);
    }
  },

  /**
   * Cattura errori di rete con context standardizzato
   */
  captureNetworkError: async (
    error: string,
    method: string,
    url: string
  ): Promise<void> => {
    try {
      SentryUtils.captureError(new Error(error), {
        networkError: true,
        method,
        url,
        timestamp: new Date().toISOString(),
      });

      SentryUtils.addBreadcrumb(
        `Network error: ${method} ${url} - ${error}`,
        'http',
        'error'
      );
    } catch (sentryError) {
      console.warn("Failed to send network error to Sentry:", sentryError);
    }
  },

  /**
   * Cattura errori generici dell'ApiService
   */
  captureApiServiceError: async (
    error: Error,
    method: string,
    url: string,
    additionalContext?: Record<string, any>
  ): Promise<void> => {
    try {
      SentryUtils.captureError(error, {
        apiServiceError: true,
        method,
        url,
        timestamp: new Date().toISOString(),
        ...additionalContext,
      });
    } catch (sentryError) {
      console.warn("Failed to send ApiService error to Sentry:", sentryError);
    }
  },

  /**
   * Aggiunge breadcrumb per chiamate API di successo (solo per operazioni critiche)
   */
  addSuccessBreadcrumb: async (
    method: string,
    url: string,
    status: number
  ): Promise<void> => {
    // Solo per operazioni critiche
    if (status === 201 || url.includes('/payment/') || url.includes('/booking/')) {
      try {
        SentryUtils.addBreadcrumb(
          `API call successful: ${method} ${url} (${status})`,
          'http',
          'info'
        );
      } catch (sentryError) {
        // Silently fail - non-critical operation
      }
    }
  },

  /**
   * Wrapper per import dinamico di SentryUtils
   * Evita di importare Sentry se non necessario
   */
  withSentryErrorHandling: async <T>(
    operation: () => Promise<T>,
    method: string,
    url: string,
    additionalContext?: Record<string, any>
  ): Promise<T | undefined> => {
    try {
      return await operation();
    } catch (error) {
      // Evita import circolare chiamando direttamente i metodi dell'helper
      await ApiSentryHelper.captureApiServiceError(
        error as Error,
        method,
        url,
        additionalContext
      );
      console.error(error);
      return undefined;
    }
  },
};
