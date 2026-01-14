"use client";

import { RolesEnum, UserStatusEnum } from "@/src/enums/roles.enums";
import { Routes } from "@/src/routes";
import { useUserStore } from "@/src/store/user/user.store";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const VigilMultiStepOnboarding = dynamic(
  () => import("@/components/onboarding/vigil/VigilMultiStepOnboarding"),
  { ssr: !!false }
);

export default function VigilOnboardPage() {
  const router = useRouter();
  const { user } = useUserStore();

  useEffect(() => {
    if (user?.user_metadata?.role === RolesEnum.VIGIL) {
      switch (user?.user_metadata?.status) {
        case UserStatusEnum.ACTIVE:
          router.replace(Routes.profileVigil.url);
          break;
        default:
          break;
      }
    }
  }, [user, router]);

  return (
    <section id="vigil-onboard-multi-step">
      <VigilMultiStepOnboarding />
    </section>
  );
}
