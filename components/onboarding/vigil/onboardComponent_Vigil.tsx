"use client";

import { Button, Undraw } from "@/components";
import { Input } from "@/components/form";
import { ToastStatusEnum } from "@/src/enums/toast.enum";

import { OnboardService } from "@/src/services/onboard.service";
import { useAppStore } from "@/src/store/app/app.store";
import { useUserStore } from "@/src/store/user/user.store";
import SearchAddress from "@/components/maps/searchAddress.component";
import { Controller, useForm } from "react-hook-form";
import { RolesEnum } from "@/src/enums/roles.enums";
import { redirect, useRouter } from "next/navigation";
import { Routes } from "@/src/routes";
import Checkbox from "@/components/form/checkbox";
import { useEffect, useState } from "react";
import { AddressI } from "@/src/types/maps.types";
import MapsComponent from "@/components/maps/maps.component";

type OnboardFormI = {
  birthday: string;
  city: string;
  addresses: AddressI[];
  occupation: string;
  transportation: string;
  cap: string;
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

  const role: RolesEnum = user?.user_metadata?.role as RolesEnum;
  const router = useRouter();
  const {
    control,
    formState: { errors, isValid },
    handleSubmit,
    setError,
    reset,
    setValue,
  } = useForm<OnboardFormI>();
  const redirectHome = () => {
    router.replace(Routes.home.url);
  };

  const [addresses, setAddresses] = useState<AddressI[]>([]);

  useEffect(() => {
    setValue("addresses", addresses);
  }, [addresses]);

  const onSubmit = async (formData: OnboardFormI) => {
    if (!isValid) return;
    try {
      const { birthday, addresses, occupation, transportation, cap } = formData;

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
          data: {
            birthday,
            addresses,
            cap: [cap],
            occupation,
            transportation,
          },
        });
        //TODO {qui aggiungi i campi modificati } );
        showToast({
          message: "Informazioni registrate con successo",
          type: ToastStatusEnum.SUCCESS,
        });

        redirectHome();
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
            name="birthday"
            control={control}
            rules={{ required: true, minLength: 6, maxLength: 10 }} //TODO controllo migliore
            render={({ field }) => (
              <Input
                {...field}
                label="birthday"
                placeholder="15/06/2000"
                type="date"
                required
                role={role}
                autoComplete="given-date" //chiedere
                error={errors.birthday}
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
                role={role}
                label="Occupazione"
                placeholder="Es. Studente, Impiegato..."
                required
                error={errors.occupation}
              />
            )}
          />
          <Controller
            name="cap"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <Input
                {...field}
                label="cap"
                role={role}
                placeholder="00000"
                required
                error={errors.cap}
              />
            )}
          />
          {/* TODO controller per il campo adresses con l'auto completamento tramite il compoenente mappe */}
          <Controller
            name="addresses"
            control={control}
            defaultValue={[]}
            
            render={() => (
              <div>
                <label className="block font-medium mb-1">Indirizzi</label>
                <SearchAddress
                  onSubmit={(address) => {
                    setAddresses((prev) => [...prev, address]);
                  }}
                  label="Cerca un indirizzo"
                />
                {addresses.length > 0 && (
                  <ul className="mt-2 list-disc pl-5 text-sm text-gray-700">
                    {addresses.map((addr, i) => (
                      <li key={i} className="text-black text-xs">
                        {`${addr.display_name} `}
                      </li>
                    ))}
                  </ul>
                )}
                {addresses.length > 0 &&
                  addresses[addresses.length - 1]?.lat &&
                  addresses[addresses.length - 1]?.lon && (
                    <div className="mt-4">
                      <MapsComponent
                        center={[
                          +addresses[addresses.length - 1].lat!,
                          +addresses[addresses.length - 1].lon!,
                        ]}
                        marker={[
                          +addresses[addresses.length - 1].lat!,
                          +addresses[addresses.length - 1].lon!,
                        ]}
                        markerName={
                          addresses[addresses.length - 1]?.extended ||
                          addresses[addresses.length - 1]?.city
                        }
                      />
                    </div>
                  )}

                {errors.addresses && (
                  <p className="text-red-500 text-sm">
                    Seleziona almeno un indirizzo
                  </p>
                )}
              </div>
            )}
          />

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
                      role={role}
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
