"use client";
import "@/app/globals.css";
import HtmlDocument from "@/components/@core/htmlDocument/htmlDocument.component";
import dynamic from "next/dynamic";
import {
  PermitGuardComponent,
  SessionManagerComponent,
} from "@/components/@core";
import { DashboardHeader, DashboardShoulder } from "@/components/dashboard";
import clsx from "clsx";

const CookieBannerComponent = dynamic(
  () => import("@/components/@core/cookieBanner/cookie-banner.component"),
  { ssr: !!false }
);
const InitOneSignal = dynamic(
  () => import("@/components/@core/oneSignal/initOneSignal"),
  { ssr: !!false }
);
const GlobalLoaderManager = dynamic(
  () => import("@/components/@core/globalLoaderManager/globalLoaderManager"),
  { ssr: !!false }
);
const ToastManagerComponent = dynamic(
  () => import("@/components/@core/toastManager/toastManager.component"),
  { ssr: !!false }
);

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <HtmlDocument
      otherHead={
        <>
          <InitOneSignal />
        </>
      }
      otherBody={
        <>
          <PermitGuardComponent />
          <SessionManagerComponent />
          <GlobalLoaderManager />
          <ToastManagerComponent />
          <CookieBannerComponent />
        </>
      }
    >
      <div className="w-full flex flex-nowrap h-screen overflow-hidden">
        <DashboardShoulder />
        <div className="flex-1 bg-gray-100" style={{ maxWidth: "100vw" }}>
          <DashboardHeader />
          <div
            className={clsx(
              "mx-auto w-full max-w-full p-4 pb-8 overflow-y-scroll mt-16 sm:mt-0",
              "sm:max-w-screen-xl"
            )}
            style={{
              maxHeight: "calc(100vh - 4rem)",
              minHeight: "calc(100vh - 4rem)",
            }}
          >
            {children}
          </div>
        </div>
      </div>
    </HtmlDocument>
  );
}
