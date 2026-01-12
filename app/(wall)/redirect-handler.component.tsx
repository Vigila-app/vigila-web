"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/src/store/user/user.store";
import { Routes } from "@/src/routes";
import { RolesEnum, UserStatusEnum } from "@/src/enums/roles.enums";
import { usePathname } from "next/navigation";

export default function RedirectHandler() {
  const router = useRouter();
  const { user } = useUserStore();
  // const [isLoading, setIsLoading] = useState(true);
  const role = user?.user_metadata?.role;
  const pathname = usePathname();

  useEffect(() => {
    if (!user) return;

    if (!role) {
      if (pathname !== Routes.registrationRole.url) {
        router.replace(Routes.registrationRole.url);
      }
      return;
    }

    if (role === RolesEnum.CONSUMER) {
      
        router.replace(Routes.homeConsumer.url);
      
    } else if (role === RolesEnum.VIGIL) {
      switch (user?.user_metadata?.status) {
        case UserStatusEnum.ACTIVE:
        default:
          router.replace(Routes.profileVigil.url);
          break;
        case UserStatusEnum.PENDING:
          router.replace(Routes.onBoardVigil.url);
          break;
      }
    }
  }, [user, router]);

  return null;
}
