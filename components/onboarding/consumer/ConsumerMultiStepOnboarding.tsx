"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { OnboardService } from "@/src/services/onboard.service";
import { MatchingService, UserService } from "@/src/services";
import { useAppStore } from "@/src/store/app/app.store";
import { useUserStore } from "@/src/store/user/user.store";
import { RolesEnum } from "@/src/enums/roles.enums";
import { ToastStatusEnum } from "@/src/enums/toast.enum";
import { Routes } from "@/src/routes";
import { AuthService } from "@/src/services";
import MultiStepOnboarding from "../multiStep/MultiStepOnboarding";
import { createConsumerOnboardingConfig } from "../multiStep/consumerOnboardingConfig";

/**
 * New multi-step onboarding component for CONSUMER users
 */
const ConsumerMultiStepOnboarding = () => {
  const { showToast } = useAppStore();
  const { getUserDetails } = useUserStore();
  const router = useRouter();

  const handleComplete = useCallback(
    async (data: Record<string, any>) => {
      try {
        const {
          lovedOneName,
            // lovedOneAge,
          birthday,
          // lovedOnePhone,
          relationship,
          address,
          information,
          experience,
        } = data;

        // Extract city and postal code from address
        const cap =
          address?.address?.postcode ||
          address?.address?.postalCode ||
          address?.address?.cap ||
          "";

        // Prepare data for API
        const onboardData: any = {
          ...data,
          lovedOneName,
          // lovedOneAge,
          birthday,
          // lovedOnePhone,
          relationship,
          address,
          cap,
          information,
        };


        await OnboardService.update({
          role: RolesEnum.CONSUMER,
          data: onboardData,
        });

        try {
          const user = await UserService.getUser();
          if (user?.id) {
            // Fire-and-forget matching call; do not block onboarding completion
            MatchingService.match(user.id, { role: RolesEnum.CONSUMER, data: onboardData }).catch((e) =>
              console.warn("Matching API failed (non-blocking)", e),
            );
          }
        } catch (e) {
          console.warn("Unable to call matching API: could not retrieve user", e);
        }

        showToast({
          message: "Profilo aggiornato con successo",
          type: ToastStatusEnum.SUCCESS,
        });

        await AuthService.renewAuthentication();
        await getUserDetails(true);
        router.replace(Routes.onBoardConsumerComplete.url);
      } catch (err) {
        console.error("Errore durante la registrazione dei dati", err);
        showToast({
          message: "Si è verificato un errore",
          type: ToastStatusEnum.ERROR,
        });
        throw err;
      }
    },
    [showToast, getUserDetails, router],
  );

  const config = createConsumerOnboardingConfig(handleComplete);

  return <MultiStepOnboarding config={config} />;
};

export default ConsumerMultiStepOnboarding;
