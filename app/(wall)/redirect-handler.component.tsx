"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/src/store/user/user.store";
import { Routes } from "@/src/routes";
import { RolesEnum, UserStatusEnum } from "@/src/enums/roles.enums";

export default function RedirectHandler() {
  const router = useRouter();
  const { user } = useUserStore();

  useEffect(() => {
    if (user?.user_metadata?.role === RolesEnum.CONSUMER) {
      router.replace(Routes.homeConsumer.url);
    } else if (user?.user_metadata?.role === RolesEnum.VIGIL) {
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
