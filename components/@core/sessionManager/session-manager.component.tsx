"use client";

import { useEffect } from "react";
import { AuthInstance, AuthService } from "@/src/services/auth.service";
import { useUserStore } from "@/src/store/user/user.store";
import { AnalyticsUtils } from "@/src/utils/analytics.utils";
import { SentryUtils } from "@/src/utils/sentry.utils";
import { UserType } from "@/src/types/user.types";
import { Session } from "@supabase/supabase-js";

const isValidSession = (session: Session) => {
  const { expires_at, expires_in } = session;
  const now = new Date().getTime();

  if (
    !expires_in ||
    (expires_at && expires_at * 1000 < now) ||
    now - expires_in < 180
  ) {
    console.log("Invalid session, please refresh session");
    return false;
  }

  return true;
};

const SessionManagerComponent = () => {
  const { user: storeUser, setUser } = useUserStore();

  const listenAuthChanges = async () => {
    try {
      AuthInstance.auth.onAuthStateChange(async (event, session) => {
        console.log(event, session);

        // Aggiungi breadcrumb per tracciare gli eventi di autenticazione
        SentryUtils.addBreadcrumb(
          `Auth state changed: ${event}`,
          "auth",
          event === "SIGNED_OUT" ? "info" : "info"
        );

        if (event === "INITIAL_SESSION") {
          // handle initial session
        } else if (event === "SIGNED_IN") {
          // handle sign in event
          if (session?.user) {
            SentryUtils.setUser(session.user as UserType);
            SentryUtils.addBreadcrumb("User signed in", "auth", "info");
          }
        } else if (event === "SIGNED_OUT") {
          // handle sign out event
          SentryUtils.setUser(null);
          SentryUtils.addBreadcrumb("User signed out", "auth", "info");
        } else if (event === "PASSWORD_RECOVERY") {
          // handle password recovery event
          SentryUtils.addBreadcrumb("Password recovery initiated", "auth", "info");
        } else if (event === "TOKEN_REFRESHED") {
          // handle token refreshed event
          SentryUtils.addBreadcrumb("Auth token refreshed", "auth", "info");
        } else if (event === "USER_UPDATED") {
          // handle user updated event
          if (session?.user) {
            SentryUtils.setUser(session.user as UserType);
            SentryUtils.addBreadcrumb("User profile updated", "auth", "info");
          }
        }

        if (session?.user?.id) {
          if (session?.user?.id !== storeUser?.id) {
            setUser({
              user: session?.user as UserType,
              userDetails: session?.user?.user_metadata,
            });
            
            // Aggiorna l'utente in Sentry
            SentryUtils.setUser(session.user as UserType);
          }
          if (!isValidSession(session)) {
            const newSession = await AuthService.renewAuthentication();
            setUser({
              user: newSession?.user as UserType,
              userDetails: newSession?.user?.user_metadata,
            });
            
            // Aggiorna l'utente in Sentry dopo il rinnovo
            if (newSession?.user) {
              SentryUtils.setUser(newSession.user as UserType);
            }
          }
        }
      });
    } catch (error) {
      console.error("listenAuthChanges error", error);
      // Cattura l'errore in Sentry
      SentryUtils.captureError(error as Error, {
        component: "SessionManagerComponent",
        operation: "listenAuthChanges",
      });
    }
  };

  useEffect(() => {
    // Inizializza Sentry
    SentryUtils.init();
    
    // Inizializza gli altri servizi
    listenAuthChanges();
    AnalyticsUtils.init();
    
    // Aggiungi breadcrumb per l'inizializzazione dell'app
    SentryUtils.addBreadcrumb("App initialized", "navigation", "info");
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
};

export default SessionManagerComponent;
