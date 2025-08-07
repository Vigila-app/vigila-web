"use client";

import { Button } from "@/components";
import { Input, TextArea } from "@/components/form";
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
import { AuthService } from "@/src/services";
import { FormFieldType } from "@/src/constants/form.constants";
import SearchAddress from "@/components/maps/searchAddress.component";
import { AddressI } from "@/src/types/maps.types";
import { useState, useEffect } from "react";

type OnboardFormI = {
  lovedOneName: string;
  lovedOneAge: string;
  lovedOneBirthday: string;
  lovedOnePhone: string;
  relationship: string;
  address: AddressI;
  information: string;
};

const relationships = ["Figlio/a", "Nipote", "Parente", "Amico/a", "Badante"];

const ConsumerOnboardComponent = () => {
  const { showToast } = useAppStore();
  const { user } = useUserStore();
  const role: RolesEnum = user?.user_metadata?.role as RolesEnum;

  const router = useRouter();

  const [address, setAddress] = useState<AddressI | null>(null);

  const {
    control,
    formState: { errors },
    handleSubmit,
    setValue,
  } = useForm<OnboardFormI>();

  useEffect(() => {
    if (address) {
      setValue("address", address);
    }
  }, [address, setValue]);

  const onSubmit = async (formdata: OnboardFormI) => {
    try {
      const {
        lovedOneName,
        lovedOneAge,
        lovedOneBirthday,
        relationship,
        address,
        information,
        lovedOnePhone,
      } = formdata;

      // Estrai city e cap dall'address
      const cap =
        address?.address?.postcode ||
        address?.address?.postalCode ||
        address?.address?.cap ||
        "";

      await OnboardService.update({
        role: RolesEnum.CONSUMER,
        data: {
          lovedOneName,
          lovedOneAge,
          lovedOneBirthday,
          lovedOnePhone,
          relationship,
          address,
          cap,
          information,
        },
      });

      showToast({
        message: "Profilo aggiornato con successo",
        type: ToastStatusEnum.SUCCESS,
      });
      AuthService.renewAuthentication();

      router.replace(Routes.homeConsumer.url);
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
          <section className="flex flex-col items-center gap-1 mb-4">
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
              name="lovedOneName"
              control={control}
              rules={{ required: true, ...FormFieldType.NAME }}
              render={({ field }) => (
                <Input
                  {...field}
                  label="Nome della persona cara"
                  placeholder="Es. Giovanni Bianchi"
                  required
                  minLength={FormFieldType.NAME.minLength}
                  maxLength={FormFieldType.NAME.maxLength}
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
                  min={18}
                  max={120}
                  required
                  role={role}
                  error={errors.lovedOneAge}
                />
              )}
            />
            <Controller
              name="lovedOneBirthday"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Input
                  {...field}
                  label="Data di nascita della persona cara"
                  placeholder="15/06/1960"
                  required
                  type="date"
                  role={role}
                  error={errors.lovedOneBirthday}
                />
              )}
            />
            <Controller
              name="lovedOnePhone"
              control={control}
              rules={{ required: true, ...FormFieldType.PHONE }}
              render={({ field }) => (
                <Input
                  {...field}
                  label="Telefono di contatto"
                  placeholder="es. 3331234567"
                  required
                  minLength={FormFieldType.PHONE.minLength}
                  maxLength={FormFieldType.PHONE.maxLength}
                  type="tel"
                  role={role}
                  error={errors.lovedOnePhone}
                />
              )}
            />
            <div>
              <p className="font-medium mb-2 text-consumer-blue">
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
              name="address"
              control={control}
              rules={{ required: true }}
              render={() => (
                <div>
                  <SearchAddress
                    role={RolesEnum.CONSUMER}
                    onSubmit={(selectedAddress) => {
                      setAddress(selectedAddress);
                    }}
                    placeholder="Inserisci la città e il CAP della persona cara"
                    label="Indirizzo della persona cara"
                  />
                  {address && (
                    <div className="flex flex-col items-start text-start pt-1 mt-2 bg-gray-100 rounded-2xl ">
                      <span className="text-xs font-medium text-start px-2 text-gray-500 ">
                      Se l'indirizzo è sbagliato, ri-effettua la ricerca
                      </span>
                      <span className="text-black mt-2 p-2 rounded text-sm">
                        {(address?.address
                          ? `${address.display_name || address.address.city || address.address.town || address.address.village || address.address.suburb}${address.address.city !== address.address.county ? ` (${address.address.county})` : ""}, ${address.address.postcode || ""}`
                          : null) || address.display_name}
                      </span>
                    </div>
                  )}
                  {errors.address && (
                    <p className="text-red-500 text-sm mt-1">
                      Seleziona un indirizzo
                    </p>
                  )}
                </div>
              )}
            />

            <Controller
              name="information"
              control={control}
              rules={{ required: true, ...FormFieldType.NOTE }}
              render={({ field }) => (
                <TextArea
                  {...field}
                  label="Informazioni aggiuntive"
                  minLength={FormFieldType.NOTE.minLength}
                  maxLength={FormFieldType.NOTE.maxLength}
                  placeholder="Dicci qualcosa sulla tua persona cara"
                  role={role}
                  error={errors.information}
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

export default ConsumerOnboardComponent;
