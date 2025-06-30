"use client";

import { Avatar, Button, Undraw } from "@/components";
import { Input } from "@/components/form";
import { ToastStatusEnum } from "@/src/enums/toast.enum";
import { UserService } from "@/src/services";
import { OnboardService } from "@/src/services/onboard.service";
import { useAppStore } from "@/src/store/app/app.store";
import { useUserStore } from "@/src/store/user/user.store";
import { StorageUtils } from "@/src/utils/storage.utils";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { RolesEnum } from "@/src/enums/roles.enums";
import { useRouter } from "next/navigation";
import { Routes } from "@/src/routes";
import Checkbox from "@/components/form/checkbox";

type OnboardFormI = {
  birthdate: string;
  city: string;
  cap: string;
  occupation: string;
  transportation: string;
  // TODO add other detail fields
};

const transportationOptions = [
  { label: "Auto", value: "auto" },
  { label: "Moto", value: "moto" },
  { label: "Bicicletta", value: "bike" },
  { label: "Trasporto pubblico", value: "public" },
];

const OnboardComponent = () => {
  
  const { showLoader, hideLoader, showToast } = useAppStore();
  const { user } = useUserStore();
  const router = useRouter();
  const {
    control,
    formState: { errors, isValid },
    handleSubmit,
    setError,
    reset,
  } = useForm<OnboardFormI>();
  const redirectHome = () => {
    router.replace(Routes.home.url);
  };
  const onSubmit = async (formData: OnboardFormI) => {
    if (!isValid) return;
    try {
      const { birthdate, city, cap, occupation, transportation } = formData;
      {
        const role = user?.user_metadata?.role as RolesEnum;

        const userId = user?.id;

        if (!userId || !role) {
          showToast({
            message: "Utente non identificato. Fai login e riprova.",
            type: ToastStatusEnum.ERROR,
          });
          return;
        }
        await OnboardService.update(userId, {
          role: RolesEnum.VIGIL,
          data: { birthdate, city, cap, occupation, transportation },
        });
        //TODO {qui aggiungi i campi modificati } );
        showToast({
          message: "Informazioni registrate con successo",
          type: ToastStatusEnum.SUCCESS,
        });

        // router.replace(Routes.home.url);
      }
    } catch (err) {
      console.error("Errore durante la registrazione dei dati", err);
      showToast({
        message: "Sorry, something went wrong",
        type: ToastStatusEnum.ERROR,
      });
    }
  };

  return (
    <section id="update-profile" aria-label="update profile">
      <h1 className="text-lg font-medium mb-2 leading-none sticky top-0 p-4 pb-2 z-40">
        Update profile
      </h1>
      <Undraw graphic="profile" />
      <div className="p-4">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full mx-auto max-w-lg space-y-8 p-4">
          <Controller
            name="birthdate"
            control={control}
            rules={{ required: true, minLength: 6, maxLength: 10 }} //TODO controllo migliore
            render={({ field }) => (
              <Input
                {...field}
                label="birthday"
                placeholder="15/06/2000"
                type="date"
                required
                autoComplete="given-date" //chiedere
                error={errors.birthdate}
              />
            )}
          />
          <Controller
            name="city"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <Input
                {...field}
                label="City"
                placeholder="Inserisci la tua città"
                type="text"
                required
                error={errors.city}
              />
            )}
          />
          <Controller
            name="cap"
            control={control}
            rules={{ required: true, minLength: 5, maxLength: 5 }}
            render={({ field }) => (
              <Input
                {...field}
                label="CAP"
                placeholder="Inserisci il CAP della tua città"
                type="text"
                required
                error={errors.cap}
              />
            )}
          />

          <Controller
            name="occupation"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <Input
                {...field}
                label="Occupazione"
                placeholder="Es. Studente, Impiegato..."
                required
                error={errors.occupation}
              />
            )}
          />

          {/* Trasporti: solo uno selezionabile */}
          <Controller
            name="transportation"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <div>
                <label className="block font-medium mb-1">
                  Mezzo di trasporto
                </label>
                <div className="space-y-2">
                  {transportationOptions.map((option) => (
                    <Checkbox
                      key={option.value}
                      label={option.label}
                      checked={field.value === option.value}
                      onChange={() => field.onChange(option.value)}
                    />
                  ))}
                  {errors.transportation && (
                    <p className="text-red-500 text-sm">Seleziona un'opzione</p>
                  )}
                </div>
              </div>
            )}
          />
          <div className="flex items-center justify-end">
            <Button type="submit" primary label="Update profile" />
          </div>
        </form>
      </div>
    </section>
  );
};

export default OnboardComponent;
