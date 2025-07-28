"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { SentryUtils } from "@/src/utils/sentry.utils";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
}

/**
 * ErrorBoundary per catturare errori JavaScript non gestiti nei componenti React
 * Integrato con Sentry per il monitoring automatico degli errori
 */
class SentryErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Aggiorna lo state per mostrare l'UI di fallback
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log dell'errore per debugging locale
    console.error("ErrorBoundary caught an error:", error, errorInfo);

    // Invia l'errore a Sentry con informazioni aggiuntive
    SentryUtils.captureError(error, {
      component: "SentryErrorBoundary",
      errorInfo: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
    });

    // Aggiungi un breadcrumb per tracciare l'errore
    SentryUtils.addBreadcrumb(
      `Error boundary triggered: ${error.message}`,
      "error",
      "error"
    );

    // Chiama la callback personalizzata se fornita
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      // UI di fallback personalizzata o di default
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // UI di fallback di default
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8 text-center">
            <div>
              <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                Ops! Si è verificato un errore
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Si è verificato un errore imprevisto. Il team è stato notificato.
              </p>
            </div>
            <div className="mt-5">
              <button
                onClick={() => {
                  this.setState({ hasError: false, error: undefined });
                  window.location.reload();
                }}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Ricarica la pagina
              </button>
            </div>
            {process.env.NODE_ENV === "development" && this.state.error && (
              <details className="mt-4 text-left">
                <summary className="cursor-pointer text-sm font-medium text-gray-600">
                  Dettagli errore (sviluppo)
                </summary>
                <pre className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded overflow-auto">
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default SentryErrorBoundary;
