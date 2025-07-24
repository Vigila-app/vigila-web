/* eslint-disable @next/next/no-sync-scripts */
import "@/app/globals.css";
import dynamic from "next/dynamic";
import {
  PermitGuardComponent,
  SessionManagerComponent,
} from "@/components/@core";
import { Metadata } from "next";
import { AppConstants } from "@/src/constants";
import HtmlDocument from "@/components/@core/htmlDocument/htmlDocument.component";
import { AdminHeader } from "@/components/admin";

const GlobalLoaderManager = dynamic(
  () => import("@/components/@core/globalLoaderManager/globalLoaderManager"),
  { ssr: !!false }
);
const ToastManagerComponent = dynamic(
  () => import("@/components/@core/toastManager/toastManager.component"),
  { ssr: !!false }
);
const ModalManagerComponent = dynamic(
  () => import("@/components/@core/modalManager/modalManager.component"),
  { ssr: !!false }
);

export const metadata: Metadata = {
  title: {
    template: `%s | ${AppConstants.title} - Admin`,
    default: `${AppConstants.title} - Admin Dashboard`,
  },
  description: `${AppConstants.description} - Pannello Amministrativo`,
  openGraph: {
    title: {
      template: `%s | ${AppConstants.title} - Admin`,
      default: `${AppConstants.title} - Admin Dashboard`,
    },
    description: `${AppConstants.description} - Pannello Amministrativo`,
  },
};

// cache revalidation - 4 hours
export const revalidate = 14400;

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  console.log("AdminLayout - rendering admin layout");
  return (
    <HtmlDocument
      otherBody={
        <>
          <PermitGuardComponent />
          <SessionManagerComponent />
          <GlobalLoaderManager />
          <ToastManagerComponent />
          <ModalManagerComponent />
        </>
      }
    >
      <AdminHeader>{children}</AdminHeader>
    </HtmlDocument>
  );
}
