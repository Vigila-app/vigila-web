"use client";

import { Avatar, Button, Undraw } from "@/components";
import { Input } from "@/components/form";
import { ToastStatusEnum } from "@/src/enums/toast.enum";
import { UserService } from "@/src/services";
import { OnboardService } from "@/src/services/onboard.service";
import { useAppStore } from "@/src/store/app/app.store";
import { useUserStore } from "@/src/store/user/user.store";
import { StorageUtils } from "@/src/utils/storage.utils";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

type OnboardFormI = {
  birthdate: string;
  city: string;
  CAP: string;
  // TODO add other detail fields
};

const OnboardComponent = () => {
  const { showLoader, hideLoader, showToast } = useAppStore();

  const {
    control,
    formState: { errors, isValid },
    handleSubmit,
    setError,
    reset,
  } = useForm<OnboardFormI>();

  const onSubmit = async (formData: OnboardFormI) => {
    if (!isValid) return;
    try {
      const { birthdate, city, CAP } = formData;
      {
        await OnboardService.update({ birthdate, city, CAP });
        //TODO {qui aggiungi i campi modificati } );
        showToast({
          message: "Informazioni registrate con successo",
          type: ToastStatusEnum.SUCCESS,
        });
        //TODO reindirizzamento
        // router.push(Routes.profileConsumer.url)
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
            rules={{ required: true, minLength: 6, maxLength: 10 }}
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
            name="CAP"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <Input
                {...field}
                label="CAP"
                placeholder="Inserisci il CAP della tua città"
                type="text"
                required
                error={errors.CAP}
              />
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
