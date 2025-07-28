"use client";

import { useEffect } from "react";
import { useAppStore } from "@/src/store/app/app.store";
import { ErrorUtils } from "@/src/utils/error.utils";
import { SentryUtils } from "@/src/utils/sentry.utils";

const ErrorManagerComponent = () => {
  const { error } = useAppStore();

  useEffect(() => {
    if (error?.code) {
      // Gestione degli errori con Sentry
      console.log(ErrorUtils.getErrorByCode(error));
      
      // Invia l'errore a Sentry con il contesto appropriato
      SentryUtils.captureError(error, {
        component: "ErrorManagerComponent",
        timestamp: new Date().toISOString(),
      });
      
      // Aggiungi un breadcrumb per tracciare il flusso
      SentryUtils.addBreadcrumb(
        `Error handled: ${error.code}`,
        "error",
        "error"
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error?.code]);

  return;
};

export default ErrorManagerComponent;
