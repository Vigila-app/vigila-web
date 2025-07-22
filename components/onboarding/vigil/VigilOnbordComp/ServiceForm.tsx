"use client";
import Button from "@/components/button/button";
import { Input, TextArea } from "@/components/form";
import { Service } from "@/src/types/offeredService";
import { Controller, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useUserStore } from "@/src/store/user/user.store";
import { RolesEnum } from "@/src/enums/roles.enums";

type ServiceFormProps = {
  isOpen?: boolean;
  onClose?: () => void;
  onSave?: (service: Service) => void;
  initialData?: Service | null;
};
type FormValues = {
  name: string;
  description: string;
  price: string;
  duration: string;
};

const DURATIONS = ["1-2 ore", "2-4 ore", "4+ ore"];

export default function ServiceForm({
  isOpen,
  onClose,
  onSave,
  initialData,
}: ServiceFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      price: initialData?.price || "0",
      duration: initialData?.duration || "",
    },
  });
  const { user } = useUserStore();

  const role: RolesEnum = user?.user_metadata?.role as RolesEnum;
  useEffect(() => {
    if (initialData) {
      setValue("name", initialData.name);
      setValue("description", initialData.description);
      setValue("price", initialData.price);
      setValue("duration", initialData.duration);
    }
  }, [initialData, setValue]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const onSubmit = (data: FormValues) => {
    const newService: Service = {
      id: initialData?.id, // aggiungere id al momento è undefined
      name: data.name,
      description: data.description,
      price: data.price,
      duration: data.duration,
    };
    console.log(newService);
    onSave?.(newService);
    onClose?.();
  };

  return (
    <div
      className={`fixed inset-0 bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50
      ${!isOpen ? "hidden" : ""}`}>
      <div className="bg-background-default m-4 rounded-2xl">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="sm:max-w-[425px] md:max-w-[600px] p-6">
          <div>
            <h2 className="text-lg font-semibold ">
              {initialData ? "Modifica Servizio" : "Aggiungi un nuovo servizio"}
            </h2>
            <p className="text-sm text-gray-600">
              Compila i dettagli del servizio che desideri offrire.
            </p>
          </div>

          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Controller
                name="name"
                control={control}
                rules={{ required: "Il nome è obbligatorio" }}
                render={({ field }) => (
                  <Input
                    {...field}
                    role={role}
                    label="Nome servizio"
                    placeholder="Es. Compagnia e conversazione"
                    error={errors.name}
                  />
                )}
              />
            </div>

            <Controller
              name="description"
              control={control}
              rules={{ required: "La descrizione è obbligatoria" }}
              render={({ field }) => (
                <TextArea
                  {...field}
                  label="Descrizione"
                  role={role}
                  placeholder="Es. Tempo di qualità insieme, chiacchiere e ascolto"
                  className="min-h-[80px]"
                  error={errors.description}
                />
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 relative">
              <span className="absolute left-3 top-9 text-gray-400">€</span>
              <Controller
                name="price"
                control={control}
                rules={{
                  required: "Il prezzo è obbligatorio",
                  min: { value: 0, message: "Il prezzo deve essere positivo" },
                }}
                render={({ field }) => (
                  <Input
                    {...field}
                    label="Prezzo"
                    type="number"
                    role={role}
                    placeholder="15"
                    className="pl-8"
                    min="0"
                    step="0.5"
                    error={errors.price}
                  />
                )}
              />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex gap-2 flex-wrap">
              <Controller
                name="duration"
                control={control}
                rules={{ required: "La durata è obbligatoria" }}
                render={({ field }) => (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Durata del servizio
                    </label>
                    <select
                      {...field}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="">Seleziona una durata</option>
                      {DURATIONS.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                    {errors.duration && (
                      <p className="text-red-500 text-xs">
                        {errors.duration.message}
                      </p>
                    )}
                  </div>
                )}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2 mt-4">
            <Button
              label="Annulla"
              role={role}
              action={onClose}
              type="button"
            />
            <Button label="Salva" role={role} type="submit" />
          </div>
        </form>
      </div>
    </div>
  );
}
