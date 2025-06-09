"use client";
import dynamic from "next/dynamic";
import { Routes } from "@/src/routes";
import Link from "next/link";
import { BellIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { usePathname } from "next/navigation";
import { NavigationUtils } from "@/src/utils/navigation.utils";
import clsx from "clsx";
import React from "react";

const HeaderProfile = dynamic(
  () => import("@/components/header/headerProfile"),
  { ssr: !!false }
);
const MenuMobile = dynamic(() => import("@/components/menu/menuMobile"), {
  ssr: !!false,
});

const DashboardHeaderComponent = () => {
  const pathname = usePathname();
  const route = NavigationUtils.getRouteByUrl(pathname);
  return (
    <div className="fixed sm:relative w-full top-0 left-0 right-0 bg-white shadow z-50">
      <nav className="relative">
        <div className="mx-auto max-w-screen-xl px-4">
          <div className="flex h-16 md:h-12 items-center justify-between">
            <h1
              className={clsx(
                "font-medium text-lg",
                route?.parents?.length && "flex items-center gap-1"
              )}
            >
              {route ? (
                <>
                  {route.parents
                    ? route.parents.map((parentRoute) => {
                        const parent =
                          NavigationUtils.getRouteByKey(parentRoute);
                          if (!parent?.title) return;
                        return (
                          <React.Fragment key={parent.title}>
                            <Link
                              className="transition hover:text-primary-500"
                              href={parent?.url}
                            >
                              {parent.title}
                            </Link>
                            <ChevronRightIcon className="size-4" />
                          </React.Fragment>
                        );
                      })
                    : null}
                  <span>{route.title}</span>
                </>
              ) : (
                <Link href={Routes.dashboard.url}>
                  {Routes.dashboard.title}
                </Link>
              )}
            </h1>

            <div className="flex items-center gap-4 pl-4">
              <Link className="relative" href={Routes.notifications.url}>
                <BellIcon className="size-6 transition hover:text-primary-600" />
                {pathname === Routes.notifications.url ? (
                  <span className="absolute -bottom-3 h-1 w-full bg-primary-600 rounded" />
                ) : null}
              </Link>
              <HeaderProfile />
              <div className="block md:hidden">
                <MenuMobile />
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default DashboardHeaderComponent;
