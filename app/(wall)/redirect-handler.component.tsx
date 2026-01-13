"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/src/store/user/user.store";
import { Routes } from "@/src/routes";
import { RolesEnum, UserStatusEnum } from "@/src/enums/roles.enums";
import { usePathname } from "next/navigation";
import { isServer } from "@/src/utils/common.utils";

export default function RedirectHandler() {
  const router = useRouter();
  const { user } = useUserStore();
  // const [isLoading, setIsLoading] = useState(true);
  const role = user?.user_metadata?.role;
  const pathname = usePathname();

  const params = new URLSearchParams(isServer ? "" : window.location.search);
  const queryParams = params.toString()?.length ? `?${params.toString()}` : "";

  useEffect(() => {
    if (!user) return;

    if (!role) {
      if (pathname !== Routes.registrationRole.url) {
        router.replace(`${Routes.registrationRole.url}${queryParams}`);
      }
      return;
    }

    if (role === RolesEnum.CONSUMER) {
      router.replace(`${Routes.homeConsumer.url}${queryParams}`);
    } else if (role === RolesEnum.VIGIL) {
      switch (user?.user_metadata?.status) {
        case UserStatusEnum.ACTIVE:
        default:
          router.replace(`${Routes.profileVigil.url}${queryParams}`);
          break;
        case UserStatusEnum.PENDING:
          router.replace(`${Routes.onBoardVigil.url}${queryParams}`);
          break;
      }
    }
  }, [user, router, queryParams, role, pathname]);

  return null;
}
