"use client";

import { usePathname } from "next/navigation";
import { Footer, Header } from "@/components";
import { Routes } from "@/src/routes";

const HIDDEN_NAV_ROUTES = [Routes.onBoard.url, Routes.onBoardVigil.url];

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
