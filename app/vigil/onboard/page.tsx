"use client";

import { RolesEnum } from "@/src/enums/roles.enums";
import { Routes } from "@/src/routes";
import { useUserStore } from "@/src/store/user/user.store";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const VigilOnboardComponent = dynamic(
  () => import("@/components/onboarding/vigil/onboardComponent_Vigil"),
  { ssr: !!false }
);

export default function Profile() {
  const router = useRouter();
  const { user } = useUserStore();

  useEffect(() => {
    if (user?.user_metadata?.role === RolesEnum.VIGIL) {
      switch (user?.user_metadata?.status) {
        case "active":
          // router.replace(Routes.profileVigil.url);
          break
        default:
          break
      }
    }
  }, [user, router]);

  return (
    <section id="onboard-vigil">
      <VigilOnboardComponent />
    </section>
  );
}
