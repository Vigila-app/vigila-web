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
import { useEffect, useState, useCallback } from "react";
import { AddressI } from "@/src/types/maps.types";
import clsx from "clsx";
import Card from "@/components/card/card";
import { ServicesCatalog } from "@/components";
import { ServiceI } from "@/src/types/services.types";
import { XCircleIcon } from "@heroicons/react/24/outline";
import { AuthService } from "@/src/services";

type OnboardFormI = {
  birthday: string;
  city: string;
  addresses: AddressI[];
  occupation: string;
  information: string;
  phone: string;
  transportation: string;
  // cap: string;
  services: ServiceI[];
};

const transportationOptions = [
  { label: "Auto", value: "auto" },
  { label: "Moto", value: "moto" },
  { label: "Bicicletta", value: "bike" },
  { label: "Trasporto pubblico", value: "public" },
];

const VigilOnboardComponent = () => {
  const {
    showToast,
    showLoader,
    hideLoader,
    loader: { isLoading },
  } = useAppStore();
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
    router.replace(Routes.profileVigil.url);
  };

  const [addresses, setAddresses] = useState<AddressI[]>([]);

  const handleServicesChange = useCallback(
    (services: ServiceI[]) => {
      setValue("services", services);
    },
    [setValue]
  );

  useEffect(() => {
    setValue("addresses", addresses);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addresses]);

  const onSubmit = async (formData: OnboardFormI) => {
    if (!isValid) return;
    try {
      showLoader();
      const {
        birthday,
        addresses,
        occupation,
        transportation,
        information,
        phone,
        services,
      } = formData;

      const caps = Array.from(
        new Set(addresses.map((addr) => addr.address?.postcode).filter(Boolean))
      );

      const servicesWithCaps = services.map((service) => ({
        ...service,
        postalCode: caps,
        id: undefined,
        vigil_id: undefined,
      }));

      await OnboardService.update(
        {
          role: RolesEnum.VIGIL,
          data: {
            birthday,
            addresses,
            cap: caps as string[],
            occupation,
            transportation,
            information,
            phone,
          },
        },
        servicesWithCaps as unknown as ServiceI[]
      );
      showToast({
        message: "Profilo aggiornato con successo",
        type: ToastStatusEnum.SUCCESS,
      });
      AuthService.renewAuthentication();
      redirectHome();
    } catch (err) {
      console.error("Errore durante la registrazione dei dati", err);
      showToast({
        message: "Sorry, something went wrong",
        type: ToastStatusEnum.ERROR,
      });
    } finally {
      hideLoader();
    }
  };

  return (
    <div className="w-full max-w-full mx-auto px-4 pt-8 pb-4">
      <Card>
        <div className="">
          <section className="flex flex-col items-center gap-2">
            <p className="font-semibold text-[28px] text-vigil-orange">
              Iniziamo a conoscerti
            </p>
            <span className="font-normal text-center text-lg break-normal whitespace-normal">
              Raccontaci qualcosa di te per iniziare questa bella avventura
            </span>
          </section>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full mx-auto max-w-lg space-y-10 py-8 px-2 ">
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
                  autoFocus
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
                    label="Scegli tutte le zone in cui vorresti offrire i tuoi servizi"
                  />
                  {addresses.length ? (
                    <ul className="mt-2 pl-4 text-sm text-gray-700 space-y-1">
                      {addresses.map((addr, i) => (
                        <li
                          key={i}
                          className="w-full inline-flex items-center gap-2 text-black text-xs">
                          <span>
                            {(addr?.address
                              ? `${addr.address.city || addr.address.town || addr.address.village || addr.address.suburb}${addr.address.city !== addr.address.county ? ` (${addr.address.county})` : ""}, ${addr.address.postcode || ""}`
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
                            aria-label="Rimuovi indirizzo">
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
              rules={{ required: true, maxLength: 650 }}
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
              defaultValue={[]}
              render={({ field }) => (
                <ServicesCatalog
                  role={role}
                  selectedServices={field.value || []}
                  onServicesChange={handleServicesChange}
                />
              )}
            />

            <div className="flex items-center justify-center">
              <Button
                type="submit"
                primary
                role={role}
                isLoading={isLoading}
                disabled={isLoading}
                label="Completa la registrazione"
              />
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default VigilOnboardComponent;
