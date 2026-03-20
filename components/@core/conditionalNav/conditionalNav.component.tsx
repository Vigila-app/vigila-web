"use client";

import { usePathname } from "next/navigation";
import { Footer, Header } from "@/components";

const HIDDEN_NAV_ROUTES = ["/onboard"];

const shouldHideNav = (pathname: string) =>
  HIDDEN_NAV_ROUTES.some((route) => pathname.startsWith(route));

export const ConditionalHeader = () => {
  const pathname = usePathname();
  if (shouldHideNav(pathname)) return null;
  return <Header />;
};

export const ConditionalFooter = () => {
  const pathname = usePathname();
  if (shouldHideNav(pathname)) return null;
  return <Footer />;
};
