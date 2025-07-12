"use client";

import { Button, Undraw } from "@/components";
import { Input, TextArea } from "@/components/form";
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
import clsx from "clsx";
import Card from "@/components/card/card";

type OnboardFormI = {
  birthday: string;
  city: string;
  addresses: AddressI[];
  occupation: string;
  information: string;
  phone: string;
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
      const {
        birthday,
        addresses,
        occupation,
        transportation,
        cap,
        information,
        phone,
      } = formData;

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
            information,
            phone,
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
console.log(addresses);
  return (
    <div className="w-full p-6">
      <Card>
        <div className="p-4 ">
          <section className="flex flex-col items-center gap-1">
            <h1 className="font-semibold text-[26px]">Iniziamo a conoscerci</h1>
            <span className="font-normal text-[15px] break-normal whitespace-normal">
              Raccontaci tutto di te per iniziare questa bella avventura insieme
            </span>
          </section>
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
                  label="Data di nascita"
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
              name="phone"
              control={control}
              rules={{ required: true, minLength: 2, maxLength: 30 }}
              render={({ field }) => (
                <Input
                  {...field}
                  label="Cellulare"
                  placeholder="cellulare"
                  type="text"
                  required
                  role={role}
                  aria-invalid={!!errors.phone}
                  error={errors.phone}
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
                  label="Cap"
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
                  <SearchAddress
                  
                    onSubmit={(address) => {
                      console.log("testo", address);
                      setAddresses((prev) => [...prev, address]);
                    }}
                    label="Cerca gli indirizzi dove vuoi lavorare"
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
                  <label
                    className={clsx(
                      "block font-medium mb-1",
                      role === RolesEnum.VIGIL && "text-vigil-orange",
                      role === RolesEnum.CONSUMER && "text-consumer-blue"
                    )}>
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
                      <p className="text-red-500 text-sm">
                        Seleziona un'opzione
                      </p>
                    )}
                  </div>
                </div>
              )}
            />
            <Controller
              name="information"
              control={control}
              rules={{ required: true, maxLength: 600 }} //TODO controllo migliore
              render={({ field }) => (
                <TextArea
                  {...field}
                  label="Informazioni"
                  placeholder="Scrivi qualcosa per farti conoscere..."
                  type="text"
                  required
                  role={role}
                  error={errors.information}
                />
              )}
            />
            <div className="flex items-center justify-end">
              <Button
                type="submit"
                primary
                role={role}
                label="Update profile"
              />
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default OnboardComponent;
