"use client";

import { SupabaseConstants } from "@/src/constants/supabase.constants";
import { Routes } from "@/src/routes";
import { useUserStore } from "@/src/store/user/user.store";
import { isDev } from "@/src/utils/envs.utils";
import { redirect } from "next/navigation";
import Script from "next/script";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useUserStore();

  if (!(user?.id || user?.uid)) redirect(Routes.home.url);

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
