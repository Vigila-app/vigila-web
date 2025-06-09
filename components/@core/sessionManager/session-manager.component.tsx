"use client";

import { useEffect } from "react";
import { AuthInstance, AuthService } from "@/src/services/auth.service";
import { useUserStore } from "@/src/store/user/user.store";
import { AnalyticsUtils } from "@/src/utils/analytics.utils";
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

        if (event === "INITIAL_SESSION") {
          // handle initial session
        } else if (event === "SIGNED_IN") {
          // handle sign in event
        } else if (event === "SIGNED_OUT") {
          // handle sign out event
        } else if (event === "PASSWORD_RECOVERY") {
          // handle password recovery event
        } else if (event === "TOKEN_REFRESHED") {
          // handle token refreshed event
        } else if (event === "USER_UPDATED") {
          // handle user updated event
        }

        if (session?.user?.id) {
          if (session?.user?.id !== storeUser?.id) {
            setUser({
              user: session?.user as UserType,
              userDetails: session?.user?.user_metadata,
            });
          }
          if (!isValidSession(session)) {
            const newSession = await AuthService.renewAuthentication();
            setUser({
              user: newSession?.user as UserType,
              userDetails: newSession?.user?.user_metadata,
            });
          }
        }
      });
    } catch (error) {
      console.error("listenAuthChanges error", error);
    }
  };

  useEffect(() => {
    listenAuthChanges();
    AnalyticsUtils.init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
};

export default SessionManagerComponent;
