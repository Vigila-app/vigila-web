"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { OnboardService } from "@/src/services/onboard.service";
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
          lovedOneAge,
          lovedOneBirthday,
          lovedOnePhone,
          relationship,
          address,
          information,
          professionalExperience,
        } = data;

        // Extract city and postal code from address
        const cap =
          address?.address?.postcode ||
          address?.address?.postalCode ||
          address?.address?.cap ||
          "";

        // Prepare data for API
        const onboardData: any = {
          lovedOneName,
          lovedOneAge,
          lovedOneBirthday,
          lovedOnePhone,
          relationship,
          address,
          cap,
          information: information || "",
        };

        // Add professional experience if provided (for badante)
        if (professionalExperience !== undefined) {
          onboardData.professionalExperience = professionalExperience;
        }

        await OnboardService.update({
          role: RolesEnum.CONSUMER,
          data: onboardData,
        });

        showToast({
          message: "Profilo aggiornato con successo",
          type: ToastStatusEnum.SUCCESS,
        });

        await AuthService.renewAuthentication();
        await getUserDetails(true);
        router.replace(Routes.home.url);
      } catch (err) {
        console.error("Errore durante la registrazione dei dati", err);
        showToast({
          message: "Si è verificato un errore",
          type: ToastStatusEnum.ERROR,
        });
        throw err;
      }
    },
    [showToast, getUserDetails, router]
  );

  const config = createConsumerOnboardingConfig(handleComplete);

  return <MultiStepOnboarding config={config} />;
};

export default ConsumerMultiStepOnboarding;
