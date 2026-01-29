"use client";

import { RolesEnum, UserStatusEnum } from "@/src/enums/roles.enums";
import { Routes } from "@/src/routes";
import { useUserStore } from "@/src/store/user/user.store";
import dynamic from "next/dynamic";
import { Poppins } from "next/font/google";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const VigilMultiStepOnboarding = dynamic(
  () => import("@/components/onboarding/vigil/VigilMultiStepOnboarding"),
  { ssr: false }
);
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600"],
  style: ["normal", "italic"],
})
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
    <section id="vigil-onboard-multi-step" className={poppins.className}>
      <VigilMultiStepOnboarding />
    </section>
  );
}
