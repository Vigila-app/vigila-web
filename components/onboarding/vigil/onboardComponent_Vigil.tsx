"use client";

import { Button } from "@/components";
import { Input, TextArea } from "@/components/form";
import { ToastStatusEnum } from "@/src/enums/toast.enum";
import { OnboardService } from "@/src/services/onboard.service";
import { useAppStore } from "@/src/store/app/app.store";
import { useUserStore } from "@/src/store/user/user.store";
import SearchAddress from "@/components/maps/searchAddress.component";
import { Controller, useForm } from "react-hook-form";
import { RolesEnum } from "@/src/enums/roles.enums";
import { useRouter } from "next/navigation";
import { Routes } from "@/src/routes";
import Checkbox from "@/components/form/checkbox";
import { useEffect, useState } from "react";
import { AddressI } from "@/src/types/maps.types";
import clsx from "clsx";
import Card from "@/components/card/card";
import ServiceOboard from "./VigilOnbordComp/ServiceOnboard";
import { ServiceI } from "@/src/types/services.types";
import { FormFieldType } from "@/src/constants/form.constants";
import { XCircleIcon } from "@heroicons/react/24/outline";

type OnboardFormI = {
  birthday: string;
  city: string;
  addresses: AddressI[];
  occupation: string;
  information: string;
  phone: string;
  transportation: string;
  cap: string;
  services: ServiceI[]; // Ora è un array di oggetti Service
  // TODO add other detail fields
};

const transportationOptions = [
  { label: "Auto", value: "auto" },
  { label: "Moto", value: "moto" },
  { label: "Bicicletta", value: "bike" },
  { label: "Trasporto pubblico", value: "public" },
];

const OnboardComponent = () => {
  const { showToast } = useAppStore();
  const { user } = useUserStore();

  const role: RolesEnum = user?.user_metadata?.role as RolesEnum;
  const router = useRouter();
  const {
    control,
    formState: { errors, isValid },
    handleSubmit,
    setValue,
  } = useForm<OnboardFormI>();
  const redirectHome = () => {
    router.replace(Routes.home.url);
  };

  const [addresses, setAddresses] = useState<AddressI[]>([]);

  useEffect(() => {
    setValue("addresses", addresses);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        services,
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
            services,
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
            <h1 className="font-semibold text-xl">Iniziamo a conoscerti</h1>
            <span className="font-normal text-lg break-normal whitespace-normal">
              Raccontaci qualcosa di te per iniziare questa bella avventura
            </span>
          </section>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full mx-auto max-w-lg space-y-8 p-4"
          >
            <Controller
              name="birthday"
              control={control}
              rules={{
                required: true,
                min: new Date(
                  new Date().setFullYear(new Date().getFullYear() - 80)
                )
                  .toISOString()
                  .split("T")[0],
                max: new Date(
                  new Date().setFullYear(new Date().getFullYear() - 18)
                )
                  .toISOString()
                  .split("T")[0],
              }}
              render={({ field }) => (
                <Input
                  {...field}
                  label="Data di nascita"
                  type="date"
                  min={
                    new Date(
                      new Date().setFullYear(new Date().getFullYear() - 80)
                    )
                      .toISOString()
                      .split("T")[0]
                  }
                  max={
                    new Date(
                      new Date().setFullYear(new Date().getFullYear() - 18)
                    )
                      .toISOString()
                      .split("T")[0]
                  }
                  required
                  role={role}
                  autoComplete="given-date"
                  error={errors.birthday}
                  aria-invalid={!!errors.birthday}
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
                  label="Telefono"
                  placeholder="Inserisci il tuo numero di telefono"
                  type="text"
                  required
                  role={role}
                  aria-invalid={!!errors.phone}
                  error={errors.phone}
                />
              )}
            />

            {/* TODO change into Select */}
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
                  aria-invalid={!!errors.occupation}
                />
              )}
            />

            <Controller
              name="cap"
              control={control}
              rules={{ required: true, ...FormFieldType.CAP }}
              render={({ field }) => (
                <Input
                  {...field}
                  label="CAP"
                  role={role}
                  placeholder="Inserisci il tuo CAP di residenza"
                  required
                  error={errors.cap}
                  minLength={FormFieldType.CAP.minLength}
                  maxLength={FormFieldType.CAP.maxLength}
                  aria-invalid={!!errors.cap}
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
                    role={RolesEnum.VIGIL}
                    onSubmit={(address) => {
                      console.log("testo", address);
                      setAddresses((prev) => {
                        if (
                          prev.some(
                            (a) => a.display_name === address.display_name
                          )
                        )
                          return prev;
                        return [...prev, address];
                      });
                    }}
                    placeholder="Inserisci la città con il CAP"
                    label="Scegli le zone in cui vorresti offrire i tuoi servizi"
                  />
                  {addresses.length ? (
                    <ul className="mt-2 pl-4 text-sm text-gray-700 space-y-1">
                      {addresses.map((addr, i) => (
                        <li
                          key={i}
                          className="w-full inline-flex items-center gap-2 text-black text-xs"
                        >
                          <span>
                            {(addr?.address
                              ? `${addr.address.city || addr.address.town || addr.address.village}${addr.address.city !== addr.address.county ? ` (${addr.address.county})` : ""}, ${addr.address.postcode}`
                              : null) || addr.display_name}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setAddresses((prev) =>
                                prev.filter((_, index) => index !== i)
                              );
                            }}
                            className="text-red-500 hover:text-red-700 font-bold"
                            aria-label="Rimuovi indirizzo"
                          >
                            <XCircleIcon className="size-3" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : null}

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
                    )}
                  >
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
                        Seleziona un&apos;opzione
                      </p>
                    )}
                  </div>
                </div>
              )}
            />
            <Controller
              name="information"
              control={control}
              rules={{ required: true, maxLength: 400 }}
              render={({ field }) => (
                <TextArea
                  {...field}
                  label="La tua esperienza"
                  placeholder="Raccontaci se hai mai avuto nonni, parenti anziani, o se è la tua prima volta..."
                  type="text"
                  required
                  role={role}
                  error={errors.information}
                />
              )}
            />
            {/* TODO chiedere se si deve collegare il field e aggiornare il form con onchange  */}
            <Controller
              name="services"
              control={control}
              render={({}) => <ServiceOboard />}
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
