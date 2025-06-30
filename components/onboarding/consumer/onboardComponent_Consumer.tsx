"use client";

import { Button, Undraw } from "@/components";
import { Input } from "@/components/form";
import Checkbox from "@/components/form/checkbox";
import { ToastStatusEnum } from "@/src/enums/toast.enum";
import { OnboardService } from "@/src/services/onboard.service";
import { useAppStore } from "@/src/store/app/app.store";
import { useUserStore } from "@/src/store/user/user.store";
import { RolesEnum } from "@/src/enums/roles.enums";
import { useRouter } from "next/navigation";
import { Routes } from "@/src/routes";
import { Controller, useForm } from "react-hook-form";

type OnboardFormI = {
  yourName: string;
  lovedOneName: string;
  lovedOneAge: string;
  relationship: string;
  city: string;
  cap: string;
};

const relationships = ["Figlio/a", "Nipote", "Parente", "Amico/a", "Badante"];

const OnboardComponent = () => {
  const { showToast } = useAppStore();
  const { user } = useUserStore();
  const router = useRouter();

  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm<OnboardFormI>();

  const onSubmit = async (formdata: OnboardFormI) => {
    try {
      debugger;
      const { yourName, lovedOneName, lovedOneAge, relationship, city, cap } =
        formdata;
      const role = user?.user_metadata?.role as RolesEnum;
      const userId = user?.id;
console.log(formdata);
      if (!userId || !role) {
        showToast({
          message: "Utente non identificato. Fai login e riprova.",
          type: ToastStatusEnum.ERROR,
        });
        return;
      }

      await OnboardService.update(userId, {
        role: RolesEnum.CONSUMER,
        data: {
          yourName,
          lovedOneName,
          lovedOneAge,
          relationship,
          city,
          cap,
        },
      });

      showToast({
        message: "Profilo aggiornato con successo",
        type: ToastStatusEnum.SUCCESS,
      });

      router.replace(Routes.home.url);
    } catch (err) {
      console.error("Errore durante la registrazione dei dati", err);
      showToast({
        message: "Si è verificato un errore",
        type: ToastStatusEnum.ERROR,
      });
    }
  };

  return (
    <section id="onboard-profile" aria-label="onboard profile">
      <h1 className="text-lg font-medium mb-2 p-4">
        Benvenuto! Completa il profilo
      </h1>
      <Undraw graphic="profile" />
      <div className="p-4">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="max-w-lg mx-auto space-y-8">
          <Controller
            name="yourName"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <Input
                {...field}
                label="Il tuo nome"
                placeholder="Es. Mario Rossi"
                required
                error={errors.yourName}
              />
            )}
          />

          <Controller
            name="lovedOneName"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <Input
                {...field}
                label="Nome della persona cara"
                placeholder="Es. Giovanni Bianchi"
                required
                error={errors.lovedOneName}
              />
            )}
          />

          <Controller
            name="lovedOneAge"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <Input
                {...field}
                label="Età della persona cara"
                placeholder="Es. 85"
                type="number"
                required
                error={errors.lovedOneAge}
              />
            )}
          />

          <div>
            <p className="font-medium mb-2">
              Che rapporto hai con la persona cara?
            </p>
            <div className="space-y-2">
              {relationships.map((rel) => (
                <Controller
                  key={rel}
                  name="relationship"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Checkbox
                      label={rel}
                      checked={field.value === rel}
                      onChange={() => field.onChange(rel)}
                      error={errors.relationship}
                    />
                  )}
                />
              ))}
            </div>
          </div>

          <Controller
            name="city"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <Input
                {...field}
                label="Città della persona cara"
                placeholder="Es. Milano"
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
                label="CAP della città"
                placeholder="Es. 20100"
                required
                error={errors.cap}
              />
            )}
          />

          <div className="flex justify-end">
            <Button type="submit" primary label="Salva" />
          </div>
        </form>
      </div>
    </section>
  );
};

export default OnboardComponent;
