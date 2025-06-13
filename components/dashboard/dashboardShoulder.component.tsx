"use client";
import { Logo } from "@/components";
import { Routes } from "@/src/routes";
import { AuthService } from "@/src/services";
import { RouteI } from "@/src/types/route.types";
import { ArrowRightStartOnRectangleIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";

const ShoulderMenuItem = (route: RouteI & { active?: boolean }) => (
  <li
    className={clsx(
      "relative w-full mt-4 inline-flex itemc center gap-2 text-gray-600 transition hover:text-gray-200",
      route.active && "!text-gray-100"
    )}
  >
    <Link href={route.url}>{route.label}</Link>
    {route.active ? (
      <span className="absolute h-full w-1 rounded bg-primary-600 -left-3" />
    ) : null}
  </li>
);

const DashboardShoulderComponent = () => {
  const pathname = usePathname();
  return (
    <div className="relative hidden md:block h-screen w-full max-w-52 px-4 py-4 bg-gray-900">
      <Logo />
      <div className="mt-16 flex flex-col gap-8">
        <ul className="text-gray-700 gap-2">
          <h6 className="text-xs font-medium">MAIN MENU</h6>
          <ShoulderMenuItem
            {...Routes.dashboard}
            active={pathname === Routes.dashboard.url}
          />
          <ShoulderMenuItem
            {...Routes.crm}
            active={pathname.includes(Routes.crm.url)}
          />
        </ul>
        <ul className="text-gray-700">
          <h6 className="text-xs font-medium">MANAGE</h6>
          <ShoulderMenuItem
            {...Routes.sales}
            active={pathname.includes(Routes.sales.url)}
          />
          <ShoulderMenuItem
            {...Routes.services}
            active={pathname.includes(Routes.services.url)}
          />
        </ul>
        <ul className="text-gray-700">
          <h6 className="text-xs font-medium">USER</h6>
          <ShoulderMenuItem
            {...Routes.profile}
            active={pathname.includes(Routes.profile.url)}
          />
          <ShoulderMenuItem
            {...Routes.account}
            active={pathname.includes(Routes.account.url)}
          />
        </ul>
      </div>
      <div className="absolute left-0 bottom-0 w-full px-4 py-4">
        <div>
          <button
            onClick={AuthService.logout}
            className="inline-flex gap-2 items-center w-full pt-2 text-sm text-gray-600 [text-align:_inherit] transition hover:text-red-500"
          >
            Logout
            <ArrowRightStartOnRectangleIcon className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardShoulderComponent;
