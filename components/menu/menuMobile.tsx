"use client";

import { Routes } from "@/src/routes";
import { useUserStore } from "@/src/store/user/user.store";
import { RouteI } from "@/src/types/route.types";
import { NavigationUtils } from "@/src/utils/navigation.utils";
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Avatar, ButtonLink } from "@/components";
import {
  ArrowLeftStartOnRectangleIcon,
  Bars3Icon,
  CalendarDaysIcon,
  BriefcaseIcon,
  UserGroupIcon,
  StarIcon,
  HomeIcon,
  UserIcon,
  XMarkIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/outline";
import { AuthService } from "@/src/services";
import { RolesEnum } from "@/src/enums/roles.enums";

const MenuMobile = () => {
  const pathname = usePathname();
  const { user, userDetails } = useUserStore();
  const [isOpen, setIsOpen] = useState(false);
  const role: RolesEnum = user?.user_metadata?.role as RolesEnum;
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const isUserLogged = !!user?.id;

  const MenuLinkItem = (
    route: RouteI,
    Icon?: React.ElementType,
    internal = true
  ) => {
    const className = clsx(
      "flex items-center gap-4 rounded px-4 py-2 text-lg font-medium  transition hover:bg-gray-200 hover:text-gray-700",
      pathname === route?.url &&
        "active bg-gray-100 text-primary-500 hover:text-primary-600"
    );
    return internal ? (
      <Link className={className} href={route?.url || ""}>
        {Icon && <Icon className=" w-6 h-6 text-current" />}
        {route?.label}
      </Link>
    ) : (
      <a className={className} href={route?.url || ""}>
        {" "}
        {Icon && <Icon className=" w-6 h-6 text-current" />}
        {route?.label}
      </a>
    );
  };

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isOpen]);

  return (
    <>
      <button
        onClick={() => {
          setIsOpen(!isOpen);
        }}
        className="rounded bg-transparent p-2">
        {isOpen ? (
          <XMarkIcon className="h-6 w-6 text-consumer-blue transition hover:text-gray-600/75" />
        ) : (
          <Bars3Icon className="h-6 w-6 text-consumer-blue transition hover:text-gray-600/75" />
        )}
      </button>
      <nav
        aria-label="menu mobile"
        id="MenuMobile"
        style={!isOpen ? { right: "-100vw" } : {}}
        className={clsx(
          "absolute flex flex-col gap-8  transition-all mt-2 w-full h-screen p-4 bg-white z-40 shadow",
          isOpen ? "block right-0" : "hidden"
        )}>
        {isUserLogged ? (
          <>
            <section className=" flex flex-col gap-2 justify-center items-center mb-12 mt-12">
              <Avatar
                userId={user.id}
                value={
                  userDetails?.displayName ||
                  userDetails?.user_metadata?.displayName
                }
                size="xxl"
              />
              <span className="font-semibold text-lg">
                {userDetails?.displayName ||
                  userDetails?.user_metadata?.displayName}
              </span>
              {role === RolesEnum.VIGIL && (
                <span className="font-medium text-sm">
                  {user?.user_metadata?.role}
                </span>
              )}
            </section>
            <ul className="flex flex-col gap-8  flex-1 overflow-y-auto ">
              {user?.user_metadata?.role === RolesEnum.CONSUMER && (
                <li className="block py-2">
                  {MenuLinkItem(Routes.homeConsumer, HomeIcon)}
                </li>
              )}
              <li className="block py-2">
                {MenuLinkItem(
                  user.user_metadata?.role === RolesEnum.CONSUMER
                    ? Routes.profileConsumer
                    : user.user_metadata?.role === RolesEnum.VIGIL
                      ? Routes.profileVigil
                      : Routes.admin,
                  UserIcon
                )}
              </li>
              <li className="block py-2">
                {MenuLinkItem(
                  {
                    ...(user.user_metadata?.role === RolesEnum.CONSUMER
                      ? {
                          ...Routes.profileConsumer,
                          url: `${Routes.profileConsumer.url}?tab=prenotazioni`,
                          label: "Prenotazioni",
                        }
                      : {
                          ...Routes.profileVigil,
                          url: `${Routes.profileVigil.url}?tab=prenotazioni`,
                          label: "Prenotazioni",
                        }),
                  },
                  CalendarDaysIcon,
                  false
                )}
              </li>
              <li className="block py-2">
                {MenuLinkItem(
                  {
                    ...(user.user_metadata?.role === RolesEnum.CONSUMER
                      ? {
                          ...Routes.profileConsumer,
                          url: `${Routes.profileConsumer.url}?tab=famiglia`,
                          label: "Famiglia",
                        }
                      : {
                          ...Routes.profileVigil,
                          url: `${Routes.profileVigil.url}?tab=servizi`,
                          label: "Servizi",
                        }),
                  },
                  user.user_metadata?.role === RolesEnum.CONSUMER
                    ? UserGroupIcon
                    : BriefcaseIcon,
                  false
                )}
              </li>
              {user?.user_metadata?.role === RolesEnum.VIGIL ? (
                <li className="block py-2">
                  {MenuLinkItem(
                    {
                      ...Routes.profileConsumer,
                      url: `${Routes.profileConsumer.url}?tab=recensioni`,
                      label: "Recensioni",
                    },
                    StarIcon,
                    false
                  )}
                </li>
              ) : null}
              <li className="block py-2">
                {MenuLinkItem(Routes.customerCare, QuestionMarkCircleIcon)}
              </li>
              {/* {user?.user_metadata?.role === RolesEnum.VIGIL && (
                <li className="block py-2">
                  {MenuLinkItem(Routes.services, WrenchScrewdriverIcon)}
                </li>
              )} */}

              {/* <li className="block py-2">
                {MenuLinkItem(Routes.bookings, CalendarDaysIcon)}
              </li> */}
            </ul>
          </>
        ) : null}
        <div className="sticky bottom-0 py-2 w-full mt-auto ">
          <ul className="relative  header-menu">
            {NavigationUtils.getHeaderMenu()
              .filter((route) => route?.menu?.mobile)
              .map((route) => (
                <li key={route.label} className="block py-2">
                  {MenuLinkItem(route)}
                </li>
              ))}
            {isUserLogged ? (
              <button
                onClick={() => {
                  AuthService.logout();
                  setIsOpen(false);
                }}
                className="flex items-center gap-4 w-full rounded mb-12 px-4 py-2 text-lg font-medium text-red-500 [text-align:_inherit] transition hover:bg-red-100 hover:text-blue-700">
                <ArrowLeftStartOnRectangleIcon className="w-6 h-6" />
                Logout
              </button>
            ) : (
              <ButtonLink
                label={Routes.registration.label}
                href={Routes.registration.url}
              />
            )}
          </ul>
        </div>
      </nav>
    </>
  );
};

export default MenuMobile;
