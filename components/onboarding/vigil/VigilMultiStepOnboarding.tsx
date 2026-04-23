"use client";

import { useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { OnboardService } from "@/src/services/onboard.service";
import { useAppStore } from "@/src/store/app/app.store";
import { useUserStore } from "@/src/store/user/user.store";
import { RolesEnum } from "@/src/enums/roles.enums";
import { ToastStatusEnum } from "@/src/enums/toast.enum";
import { Routes } from "@/src/routes";
import { AuthService, CalendarService, ServicesService } from "@/src/services";
import MultiStepOnboarding from "../multiStep/MultiStepOnboarding";
import { createVigilOnboardingConfig } from "../multiStep/vigilOnboardingConfig";
import { StorageUtils } from "@/src/utils/storage.utils";
import services_catalog from "@/mock/cms/services-catalog.json" with { type: "json" };
import activities_catalog from "@/mock/cms/activities-catalog.json" with { type: "json" };
import { ServiceI } from "@/src/types/services.types";
import {
  trackQuestionnaireCompleted,
  trackQuestionnaireStarted,
} from "@/lib/tracking";
/**
 * New multi-step onboarding component for VIGIL users
 */
const VigilMultiStepOnboarding = () => {
  const { showToast } = useAppStore();
  const { getUserDetails, user } = useUserStore();
  const router = useRouter();

  useEffect(() => {
    if (user?.id) trackQuestionnaireStarted(user?.id, RolesEnum.VIGIL);
  }, [user?.id]);

  const handleComplete = useCallback(
    async (data: Record<string, any>) => {
      try {
        const { addresses, propic } = data;
        const ps = [];
        // Support availability demo which writes rules under `availabilityRules`
        if (data.availabilityRules && !data.availabilities) {
          data.availabilities = data.availabilityRules;
        }

        // Extract postal code from address
        const caps = addresses?.map(
          (a: { address: { postcode: string } }) => a.address.postcode,
        );

        // Prepare addresses array (for now, single address)

        // Prepare data for API
        const onboardData: any = {
          addresses,
          cap: caps,
          ...data,
        };

        delete onboardData.language_confirmation;
        delete onboardData.understandsDocRequirement;
        if (propic && user?.id) {
          ps.push(
            StorageUtils.uploadFile("profile-pics", propic, user.id, {
              contentType: propic.type || "image/png",
            }),
          );
        }
        if (data.availabilities) {
          for (const rule of data.availabilities) {
            ps.push(CalendarService.createVigilAvailabilityRule(rule));
          }
        }

        const activityKeys = [
          "hygene_services",
          "outdoor_services",
          "services",
        ];
        const selectedActivity = Object.keys(data)
          .flatMap((k) => (activityKeys.includes(k) ? data[k] : null))
          .filter(Boolean);
        console.log(selectedActivity);
        const selectedActivitiesRaw = selectedActivity
          .map((type) =>
            activities_catalog.activities_catalog.find((a) => a.type === type),
          )
          .filter(Boolean);
        const uniqueParentServiceIds = Array.from(
          new Set(selectedActivitiesRaw.map((a) => a!.service_id)),
        );
        for (const parentId of uniqueParentServiceIds) {
          const parentServiceRaw = services_catalog.services_catalog.find(
            (s) => s.id === parentId,
          );

          if (parentServiceRaw) {
            const srv = {
              active: true,
              postalCode: caps,
              type: parentServiceRaw.type, // Il tipo del genitore (es: "specialized_care")
              name: parentServiceRaw.name,
              description: parentServiceRaw.description,
              min_unit: parentServiceRaw.minimum_duration_hours,
              unit_price: parentServiceRaw.recommended_hourly_rate,
              currency: "€",
              unit_type: "hours",
              vigil_id: user?.id,
              created_at: new Date(),
              updated_at: new Date(),
            } as ServiceI;

            ps.push(ServicesService.createService(srv));
          }
        }
        delete onboardData.propic;
        delete onboardData.availabilities;
        // remove temporary availabilityRules key if present
        delete onboardData.availabilityRules;

        ps.push(
          OnboardService.update({
            role: RolesEnum.VIGIL,
            data: onboardData,
          }),
        );

        await Promise.all(ps);

        if (user?.id) trackQuestionnaireCompleted(user?.id, RolesEnum.VIGIL);

        showToast({
          message: "Profilo aggiornato con successo",
          type: ToastStatusEnum.SUCCESS,
        });

        await AuthService.renewAuthentication();
        await getUserDetails(true);
        router.replace(Routes.onBoardVigilComplete.url);
      } catch (err) {
        console.error("Errore durante la registrazione dei dati", err);
        showToast({
          message: "Qualcosa è andato storto",
          type: ToastStatusEnum.ERROR,
        });
        throw err;
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [showToast, getUserDetails, router],
  );

  const config = createVigilOnboardingConfig(handleComplete);

  return <MultiStepOnboarding config={config} />;
};

export default VigilMultiStepOnboarding;
