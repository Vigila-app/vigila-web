"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/src/store/user/user.store";
import { Routes } from "@/src/routes";
import { RolesEnum } from "@/src/enums/roles.enums";

export default function VigilRedirectHandler() {
  const router = useRouter();
  const { user } = useUserStore();

  useEffect(() => {
    if (user?.user_metadata?.role === RolesEnum.VIGIL) {
      switch (user?.user_metadata?.status) {
        case "active":
        default:
          break;
        case "pending":
          router.replace(Routes.onBoardVigil.url);
          break;
      }
    }
  }, [user, router]);

  return null;
}
