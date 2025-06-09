"use client";

import { Routes } from "@/src/routes";
import { useUserStore } from "@/src/store/user/user.store";
import { RouteI } from "@/src/types/route.types";
import { NavigationUtils } from "@/src/utils/navigation.utils";
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ButtonLink, Divider } from "@/components";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { AuthService } from "@/src/services";

const MenuMobile = () => {
  const pathname = usePathname();
  const { user } = useUserStore();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const isUserLogged = !!user?.uid;

  const MenuLinkItem = (route: RouteI) => (
    <Link
      className={clsx(
        "block rounded px-4 py-2 text-sm font-medium text-gray-500 transition hover:bg-gray-100 hover:text-gray-700",
        pathname === route?.url &&
          "active bg-gray-100 text-primary-500 hover:text-primary-600"
      )}
      href={route?.url}
    >
      {route?.label}
    </Link>
  );

  return (
    <>
      <button
        onClick={() => {
          setIsOpen(!isOpen);
        }}
        className="rounded bg-transparent p-2"
      >
        {isOpen ? (
          <XMarkIcon className="h-6 w-6 text-gray-600 transition hover:text-gray-600/75" />
        ) : (
          <Bars3Icon className="h-6 w-6 text-primary-600 transition hover:text-primary-600/75" />
        )}
      </button>
      <nav
        aria-label="menu mobile"
        id="MenuMobile"
        style={!isOpen ? { right: "-100vw" } : {}}
        className={clsx(
          "absolute md:hidden transition-all mt-2 w-full h-screen p-4 bg-white z-40 shadow",
          isOpen ? "block right-0" : "hidden"
        )}
      >
        {isUserLogged ? (
          <>
            <ul className="relative divide-y divide-gray-100">
              <li className="block py-2">{MenuLinkItem(Routes.dashboard)}</li>
              <li className="block py-2">{MenuLinkItem(Routes.crm)}</li>
              <li className="block py-2">{MenuLinkItem(Routes.checkins)}</li>
              <li className="block py-2">{MenuLinkItem(Routes.services)}</li>
              <li className="block py-2">{MenuLinkItem(Routes.tickets)}</li>
              <li className="block py-2">{MenuLinkItem(Routes.units)}</li>
            </ul>
            <Divider />
            <ul className="relative divide-y divide-gray-100">
              <li className="block py-2">{MenuLinkItem(Routes.profile)}</li>
              <li className="block py-2">{MenuLinkItem(Routes.account)}</li>
            </ul>
            <Divider />
          </>
        ) : null}
        <ul className="relative divide-y divide-gray-100">
          {NavigationUtils.getHeaderMenu()
            .filter((route) => route?.menu?.mobile)
            .map((route) => (
              <li key={route.label} className="block py-2">
                {MenuLinkItem(route)}
              </li>
            ))}
          <div className="sticky bottom-0 py-2 w-full">
            {isUserLogged ? (
              <button
                onClick={() => {
                  AuthService.logout();
                  setIsOpen(false);
                }}
                className="block w-full rounded px-4 py-2 text-sm font-medium text-gray-500 [text-align:_inherit] transition hover:bg-red-100 hover:text-red-700"
              >
                Logout
              </button>
            ) : (
              <ButtonLink
                label={Routes.registration.label}
                href={Routes.registration.url}
              />
            )}
          </div>
        </ul>
      </nav>
    </>
  );
};

export default MenuMobile;
