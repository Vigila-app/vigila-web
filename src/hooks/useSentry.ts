import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SentryUtils } from '@/src/utils/sentry.utils';

/**
 * Hook personalizzato per integrare Sentry nel routing e navigazione
 */
export const useSentryNavigation = () => {
  const router = useRouter();

  useEffect(() => {
    // Traccia la navigazione come breadcrumb
    const handleRouteChange = () => {
      SentryUtils.addBreadcrumb(
        `Navigated to ${window.location.pathname}`,
        'navigation',
        'info'
      );
    };

    // Ascolta i cambiamenti di URL
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function(...args) {
      originalPushState.apply(history, args);
      handleRouteChange();
    };

    history.replaceState = function(...args) {
      originalReplaceState.apply(history, args);
      handleRouteChange();
    };

    // Cleanup
    return () => {
      history.pushState = originalPushState;
      history.replaceState = originalReplaceState;
    };
  }, []);

  return {
    /**
     * Traccia un'azione utente manualmente
     */
    trackUserAction: (action: string, data?: Record<string, any>) => {
      SentryUtils.addBreadcrumb(
        `User action: ${action}`,
        'user',
        'info'
      );
      
      if (data) {
        SentryUtils.setContext('userAction', {
          action,
          data,
          timestamp: new Date().toISOString(),
          url: window.location.pathname,
        });
      }
    },

    /**
     * Imposta tag per la sessione corrente
     */
    setSessionTag: (key: string, value: string) => {
      SentryUtils.setTag(key, value);
    },
  };
};

/**
 * Hook per il tracking degli errori in componenti specifici
 */
export const useSentryErrorTracking = (componentName: string) => {
  useEffect(() => {
    SentryUtils.addBreadcrumb(
      `Component mounted: ${componentName}`,
      'component',
      'info'
    );
  }, [componentName]);

  return {
    /**
     * Cattura un errore con il contesto del componente
     */
    captureComponentError: (error: Error, additionalContext?: Record<string, any>) => {
      SentryUtils.captureError(error, {
        component: componentName,
        ...additionalContext,
      });
    },

    /**
     * Traccia un'operazione asincrona con error handling
     */
    trackAsyncOperation: <T>(
      operation: () => Promise<T>,
      operationName: string
    ): Promise<T | null> => {
      return SentryUtils.withErrorHandling(
        operation,
        `${componentName}.${operationName}`
      );
    },
  };
};
