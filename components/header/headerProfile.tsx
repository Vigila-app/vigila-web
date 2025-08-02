"use client";

import { Routes } from "@/src/routes";
import { useUserStore } from "@/src/store/user/user.store";
import { isServer } from "@/src/utils/common.utils";
import Link from "next/link";
import { Avatar } from "@/components";
import { RolesEnum } from "@/src/enums/roles.enums";

const HeaderProfile = () => {
  const { user, userDetails } = useUserStore();
  const role = user?.user_metadata?.role;

  if (isServer) return;

  const UrlByRole = () => {
    switch (role) {
      case RolesEnum.VIGIL:
        return Routes.profileVigil.url;
      case RolesEnum.CONSUMER:
        return Routes.profileConsumer.url;
      case RolesEnum.ADMIN:
        return Routes.admin.url;
      default:
        return Routes.home.url;
    }
  };

  if (user?.id) {
    return (
      <div
        aria-label="user"
        id="User"
        className="hidden md:inline-flex items-center border-gray-200 md:border-l pl-4 text-gray-500 transition hover:text-gray-700"
      >
        <Link
          href={UrlByRole()}
          className="inline-flex items-center text-sm font-medium"
        >
          <span className="sr-only">User</span>
          {userDetails?.role !== RolesEnum.ADMIN ? (
            <Avatar
              inline
              label={userDetails?.displayName || Routes.profileConsumer.label}
              value={userDetails?.displayName || ""}
            />
          ) : (
            "Admin"
          )}
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <div className="sm:flex sm:gap-4">
        <Link
          className="rounded bg-primary-600 px-5 py-2.5 text-sm font-medium text-white shadow transition hover:bg-primary-700"
          href={Routes.login.url}
        >
          {Routes.login.label}
        </Link>

        <div className="hidden sm:flex">
          <Link
            className="rounded bg-secondary-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-secondary-700"
            href={Routes.registration.url}
          >
            {Routes.registration.label}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HeaderProfile;
