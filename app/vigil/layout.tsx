/* eslint-disable @next/next/no-sync-scripts */
import "@/app/globals.css";
import dynamic from "next/dynamic";
import { Footer, Header } from "@/components";
import {
  PermitGuardComponent,
  SessionManagerComponent,
} from "@/components/@core";
import { Metadata } from "next";
import { AppConstants } from "@/src/constants";
import HtmlDocument from "@/components/@core/htmlDocument/htmlDocument.component";
import { isMocked } from "@/src/utils/envs.utils";
import { SpeedInsights } from "@vercel/speed-insights/next";

const CookieBannerComponent = dynamic(
  () => import("@/components/@core/cookieBanner/cookie-banner.component"),
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

export const metadata: Metadata = {
  title: {
    template: `%s | ${AppConstants.title}`,
    default: AppConstants.title,
  },
  description: AppConstants.description,
  openGraph: {
    title: {
      template: `%s | ${AppConstants.title}`,
      default: AppConstants.title,
    },
    description: AppConstants.description,
  },
};

// cache revalidation - 4 hours
export const revalidate = 14400;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <HtmlDocument
      otherBody={
        <>
          <PermitGuardComponent />
          <SessionManagerComponent />
          <GlobalLoaderManager />
          <ToastManagerComponent />
          <CookieBannerComponent />
          {!isMocked ? <SpeedInsights /> : null}
        </>
      }
      footer={<Footer />}
      header={<Header />}
    >
      {children}
    </HtmlDocument>
  );
}
