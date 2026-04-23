"use client";

import { SupabaseConstants } from "@/src/constants/supabase.constants";
import { Routes } from "@/src/routes";
import { useUserStore } from "@/src/store/user/user.store";
import { isServer } from "@/src/utils/common.utils";
import { isDev } from "@/src/utils/envs.utils";
import { StorageUtils } from "@/src/utils/storage.utils";
import { redirect, usePathname } from "next/navigation";
import Script from "next/script";
import { useEffect, useMemo } from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useUserStore();
  const pathname = usePathname();
  const params = useMemo(() => new URLSearchParams(isServer ? "" : window.location.search), []);

  const allowedAuthRoutes = [Routes.registrationRole.url];

  useEffect(() => {
    if (params.get("redirectAuthTo")) {
      StorageUtils.setSessionValues("redirectAuthTo", params.get("redirectAuthTo") as string);
    }
  }, [params]);

  useEffect(() => {
    const isOnboardingPage = allowedAuthRoutes.some((route) =>
      pathname?.includes(route)
    );
    if (user?.id) {
      const hasRole = !!user.user_metadata?.role;

      if (hasRole) {
        redirect(Routes.home.url);
      }

      if (!isOnboardingPage) {
        redirect(Routes.home.url);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, pathname]);

  return (
    <>
      {!isDev ? (
        <Script
          src={`https://www.google.com/recaptcha/enterprise.js?render=${SupabaseConstants.appCheckPublicKey}&badge=bottomleft`}
        ></Script>
      ) : null}
      {children}
    </>
  );
}
