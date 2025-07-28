export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // Server-side instrumentation
    await import('./sentry.server.config');
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    // Edge runtime instrumentation
    await import('./sentry.edge.config');
  }
}

// Hook for request errors (required for Next.js 15)
export async function onRequestError(error: unknown, request: {
  path: string;
  method: string;
  headers: Record<string, string>;
}) {
  // Import Sentry dynamically to avoid issues during build
  const { captureException } = await import('@sentry/nextjs');
  
  captureException(error, {
    tags: {
      method: request.method,
      path: request.path,
    },
    contexts: {
      request: {
        url: request.path,
        method: request.method,
        headers: request.headers,
      },
    },
  });
}
