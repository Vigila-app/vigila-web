"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/src/store/user/user.store";
import { Routes } from "@/src/routes";
import { RolesEnum } from "@/src/enums/roles.enums";

export default function RedirectHandler() {
  const router = useRouter();
  const { user } = useUserStore();

  useEffect(() => {
    if (user?.user_metadata?.role === RolesEnum.CONSUMER) {
      router.replace(Routes.homeConsumer.url);
    }
  }, [user, router]);

  return null;
}
