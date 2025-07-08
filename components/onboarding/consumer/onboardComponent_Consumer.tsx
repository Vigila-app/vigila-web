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
import Card from "@/components/card/card";

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
  const role: RolesEnum = user?.user_metadata?.role as RolesEnum;

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
    <div className="w-full p-6">
      <Card>
        <div className="p-4">
          <section className="flex flex-col items-center gap-1">
            <h1 className="font-semibold text-[26px]">Iniziamo a conoscerci</h1>
            <span className="font-normal text-[15px]">
              Raccontaci tutto sulla tua persona cara
            </span>
            e iniziamo
            <span className="font-normal text-[15px]">
              questa bella avventura insieme
            </span>
          </section>
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
                  role={role}
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
                  role={role}
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
                  role={role}
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
                        role={role}
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
                  role={role}
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
                  role={role}
                  error={errors.cap}
                />
              )}
            />

            <div className="flex justify-end">
              <Button type="submit" primary role={role} label="Salva" />
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default OnboardComponent;
