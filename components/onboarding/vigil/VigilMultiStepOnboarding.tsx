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
import { createVigilOnboardingConfig } from "../multiStep/vigilOnboardingConfig";

/**
 * New multi-step onboarding component for VIGIL users
 */
const VigilMultiStepOnboarding = () => {
  const { showToast } = useAppStore();
  const { getUserDetails } = useUserStore();
  const router = useRouter();

  const handleComplete = useCallback(
    async (data: Record<string, any>) => {
      try {
        const {
          birthday,
          phone,
          occupation,
          information,
          transportation,
          address,
          wideAreaCoverage,
          understandsDocRequirement,
        } = data;

        // Extract postal code from address
        const cap = address?.address?.postcode || address?.address?.postalCode || "";
        
        // Prepare addresses array (for now, single address)
        const addresses = address ? [address] : [];
        const caps = address?.address?.postcode ? [address.address.postcode] : [];

        // Prepare data for API
        const onboardData: any = {
          birthday,
          addresses: [address],
          cap: [cap],
          occupation: data.occupation,
          transportation: data.transportation,
          information: data.information || "",
          phone,
        };

        // Add optional fields
        if (data.understandsDocRequirement !== undefined) {
          onboardData.understandsDocRequirement = data.understandsDocRequirement;
        }
        if (data.wideAreaCoverage !== undefined) {
          onboardData.wideAreaCoverage = data.wideAreaCoverage;
        }

        await OnboardService.update({
          role: RolesEnum.VIGIL,
          data: onboardData,
        });

        showToast({
          message: "Profilo aggiornato con successo",
          type: ToastStatusEnum.SUCCESS,
        });

        await AuthService.renewAuthentication();
        await getUserDetails(true);
        router.replace(Routes.profileVigil.url);
      } catch (err) {
        console.error("Errore durante la registrazione dei dati", err);
        showToast({
          message: "Qualcosa è andato storto",
          type: ToastStatusEnum.ERROR,
        });
        throw err;
      }
    },
    [showToast, getUserDetails, router]
  );

  const config = createVigilOnboardingConfig(handleComplete);

  return <MultiStepOnboarding config={config} />;
};

export default VigilMultiStepOnboarding;
