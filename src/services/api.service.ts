import { HeadersEnum } from "@/src/enums/headers.enums";
import { useAppStore } from "@/src/store/app/app.store";
import { isServer } from "@/src/utils/common.utils";
import { AuthService, UserService } from "@/src/services";

export class ApiService {
  private static init: RequestInit = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  /**
   * Helper per gestire errori con Sentry in modo centralizzato
   */
  private static async handleApiError(
    error: Error,
    method: string,
    url: string,
    additionalContext?: Record<string, any>
  ): Promise<void> {
    try {
      const { ApiSentryHelper } = await import("@/src/utils/api-sentry.helper");
      await ApiSentryHelper.captureApiServiceError(error, method, url, additionalContext);
    } catch (sentryError) {
      // Silently fail - non bloccare mai l'app per errori di Sentry
    }
    console.error(error);
  }

  /**
   * Wrapper generico per le chiamate HTTP con error handling centralizzato
   */
  private static async executeHttpRequest<T>(
    method: string,
    url: string,
    optInit?: RequestInit,
    body?: Record<string, any>,
    queryParams?: Record<string, string>
  ): Promise<T | undefined> {
    try {
      optInit = await ApiService.requestMiddlewares(url, optInit);

      const urlWithQuery = new URL(
        url,
        !isServer ? window.location.origin : undefined
      );

      if (queryParams) {
        urlWithQuery.search = new URLSearchParams(queryParams).toString();
      }

      if (body) {
        optInit.body = JSON.stringify(body);
      }

      return ApiService.responseMiddlewares<T>(
        fetch(urlWithQuery.href, {
          ...ApiService.init,
          ...optInit,
          method,
        }),
        method,
        urlWithQuery.href
      );
    } catch (error) {
      await ApiService.handleApiError(
        error as Error,
        method,
        url,
        {
          hasBody: !!body,
          queryParams,
        }
      );
    }
  }

  public static delete = async <T>(
    url: string,
    optInit?: RequestInit
  ): Promise<T | undefined> => {
    return ApiService.executeHttpRequest<T>("DELETE", url, optInit);
  };

  public static get = async <T>(
    url: string,
    queryParams?: Record<string, string>,
    optInit?: RequestInit
  ): Promise<T | undefined> => {
    return ApiService.executeHttpRequest<T>("GET", url, optInit, undefined, queryParams);
  };

  public static put = async <T>(
    url: string,
    body?: Record<string, any>,
    optInit?: RequestInit
  ): Promise<T | undefined> => {
    return ApiService.executeHttpRequest<T>("PUT", url, optInit, body);
  };

  public static post = async <T>(
    url: string,
    body?: Record<string, any>,
    optInit?: RequestInit
  ): Promise<T | undefined> => {
    return ApiService.executeHttpRequest<T>("POST", url, optInit, body);
  };

  private static requestMiddlewares = async (
    url: string,
    optInit: RequestInit = {}
  ) => {
    const { id: user = "" } = (await UserService.getUser()) || {};
    let authToken: any = "";
    let appToken: any = "";

    if (user) {
      // region AUTH HEADERS
      const results = await Promise.allSettled([AuthService.getAuthToken()]);
      const fulfilledValues = results
        .filter(
          <T>(p: PromiseSettledResult<T>): p is PromiseFulfilledResult<T> =>
            p.status === "fulfilled"
        )
        .map((p) => p.value);

      authToken = fulfilledValues[0] || "";
      appToken = fulfilledValues[1] || "";
      // endregion AUTH HEADERS
    }

    const basicHeaders = {
      ...ApiService.init.headers,
      ...{ ...(optInit.headers || {}) },
      [HeadersEnum.USER]: user?.toString(),
      [HeadersEnum.AUTH_TOKEN]: authToken.toString(),
      [HeadersEnum.APP_TOKEN]: appToken.toString(),
    };
    const headers = new Headers(basicHeaders);

    return { ...optInit, headers };
  };

  private static responseMiddlewares = <T>(
    response: Promise<Response>,
    method?: string,
    url?: string
  ): Promise<T> =>
    response
      .then(async (res: Response) => {
        try {
          if (!res.ok || Number(res.status) < 200 || Number(res.status) > 299) {
            const error = await res?.json();
            useAppStore.getState().setError(error);
            
            // Integrazione Sentry per errori HTTP usando helper
            const { ApiSentryHelper } = await import("@/src/utils/api-sentry.helper");
            await ApiSentryHelper.captureHttpError(
              res,
              method || 'UNKNOWN',
              url || res.url,
              error
            );
            
            throw new Error(`${res.status} ${res.statusText}`);
          } else {
            const parsed = await res?.json();
            
            // Breadcrumb per API call di successo usando helper
            const { ApiSentryHelper } = await import("@/src/utils/api-sentry.helper");
            await ApiSentryHelper.addSuccessBreadcrumb(
              method || 'UNKNOWN',
              url || res.url,
              res.status
            );
            
            return parsed;
          }
        } catch (error) {
          // Cattura errori di parsing usando helper
          if (!(error instanceof Error && error.message.includes('HTTP'))) {
            const { ApiSentryHelper } = await import("@/src/utils/api-sentry.helper");
            await ApiSentryHelper.captureParsingError(
              error as Error,
              res,
              method || 'UNKNOWN',
              url || res.url
            );
          }
          
          throw new Error(error?.toString());
        }
      })
      .catch(async (error: string) => {
        console.error(error);
        
        // Cattura errori di rete usando helper
        const { ApiSentryHelper } = await import("@/src/utils/api-sentry.helper");
        await ApiSentryHelper.captureNetworkError(
          error,
          method || 'UNKNOWN',
          url || 'unknown'
        );
        
        throw new Error(error);
      });
}
