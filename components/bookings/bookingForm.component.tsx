"use client";

import { Controller, Form, useForm } from "react-hook-form";
import { useAppStore } from "@/src/store/app/app.store";
import { ToastStatusEnum } from "@/src/enums/toast.enum";
import { useModalStore } from "@/src/store/modal/modal.store";
import { Input, Select, TextArea, InputQuantity } from "@/components/form";
import { Avatar, Button } from "@/components";
import { BookingI, BookingFormI } from "@/src/types/booking.types";
import { BookingsService, ServicesService } from "@/src/services";
import { useServicesStore } from "@/src/store/services/services.store";
import { useEffect, useMemo, useState } from "react";
import { ServiceI } from "@/src/types/services.types";
import { amountDisplay } from "@/src/utils/common.utils";
import { useUserStore } from "@/src/store/user/user.store";
import { ServicesUtils } from "@/src/utils/services.utils";
import { useVigilStore } from "@/src/store/vigil/vigil.store";
import { FormFieldType } from "@/src/constants/form.constants";
import { SearchAddress } from "../maps";
import { useRouter } from "next/navigation";
import { Routes } from "@/src/routes";
import { RolesEnum } from "@/src/enums/roles.enums";

type BookingFormComponentI = {
  isModal?: boolean;
  onSubmit?: (newBooking: BookingI) => void;
  booking?: BookingI;
  text?: string;
  title?: string;
  serviceId?: ServiceI["id"];
  vigilId?: ServiceI["vigil_id"];
};

const BookingFormComponent = (props: BookingFormComponentI) => {
  const {
    isModal = false,
    onSubmit = () => ({}),
    booking,
    text,
    title,
    serviceId,
    vigilId,
  } = props;

  const router = useRouter();

  const {
    loader: { isLoading },
    hideLoader,
    showLoader,
    showToast,
  } = useAppStore();
  const { closeModal } = useModalStore();
  const { services, getServiceDetails } = useServicesStore();
  const { user } = useUserStore();
  const { vigils, getVigilsDetails } = useVigilStore();
  const vigilDetails = vigils.find((vigil) => vigil.id === vigilId);

  const [selectedService, setSelectedService] = useState<ServiceI | null>(null);
  const [totalAmount, setTotalAmount] = useState(0);

  const {
    control,
    formState: { errors, isValid },
    handleSubmit,
    watch,
    setValue,
  } = useForm<BookingFormI>({
    defaultValues: {
      ...booking,
      address: booking?.address || user?.user_metadata?.address || "",
      service_id: booking?.service_id || serviceId,
      consumer_id: booking?.consumer_id || user?.id,
      quantity: booking?.quantity || 1,
    },
  });

  const watchedServiceId = watch("service_id");
  const watchedDuration = watch("quantity");
  const watchedAddress = watch("address");

  // useEffect(() => {
    // if (serviceId) {
    //   // prova a trovare nel su service id uguali 
    //   const existing = services.find((s) => s.id === serviceId);
    //   if (existing) {
    //     setSelectedService(existing);
    //     setValue("service_id", existing.id as never);
    //   
  //   }
  // }, [serviceId, services]);
  // useEffect(() => {
  //   if (serviceId) {
  //     getServiceDetails(serviceId);
  //     setValue("service_id", serviceId as never);
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [serviceId]);

  useEffect(() => {
    if (vigilId) getVigilsDetails([vigilId], true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vigilId]);

  useEffect(() => {
    if (watchedServiceId && services.length) {
      const service = services.find((s) => s.id === watchedServiceId);
      if (!service) {
        getServiceDetails(watchedServiceId as string);
      } else {
        setSelectedService(service || null);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchedServiceId, services?.length]);

  useEffect(() => {
    if (selectedService && watchedDuration) {
      setTotalAmount(selectedService.unit_price * watchedDuration);
    }
  }, [selectedService, watchedDuration]);

  useEffect(() => {
    if (services?.length === 1) {
      setSelectedService(services[0]);
    }
  }, [services]);

  useEffect(() => {
    setValue("service_id", selectedService?.id as never);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedService]);

  useEffect(() => {
    if (selectedService && selectedService.id !== serviceId) {
      console.log("⚠️ selectedService non corrisponde a serviceId");
    }
  }, [selectedService, serviceId]);

  const submitForm = async (formData: BookingFormI) => {
    if (isValid) {
      try {
        showLoader();
        const newBooking = await BookingsService.createBooking(formData);

        showToast({
          message: "Prenotazione creata!",
          type: ToastStatusEnum.SUCCESS,
        });

        onSubmit(newBooking);

        if (isModal) {
          closeModal();
        } else {
          router.push(
            `${Routes.paymentBooking.url}?bookingId=${newBooking.id}`
          );
        }
      } catch (error) {
        console.error("Error creating booking", error);
        showToast({
          message:
            "Si è verificato un errore durante la creazione della prenotazione.",
          type: ToastStatusEnum.ERROR,
        });
      } finally {
        hideLoader();
      }
    }
  };

  const serviceOptions = useMemo(
    () =>
      services.map((service) => ({
        label: `${service.name} - ${service.currency} ${amountDisplay(
          service.unit_price
        )}/${service.unit_type}`,
        value: service.id,
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [services, serviceId]
  );

  return (
    <div className="bg-white w-full mx-auto p-6 rounded-lg shadow-lg">
      <form onSubmit={handleSubmit(submitForm)} className="space-y-6">
        <div className="mb-4">
          <h2 className="text-center font-medium text-xl">
            {title || `Prenota con ${vigilDetails?.displayName}`}
          </h2>
          <p className="text-center text-sm text-gray-500 mt-2">
            {text || "Compila i dettagli per la tua prenotazione"}
          </p>
        </div>

        <div className="w-full inline-flex flex-nowrap items-center gap-2 my-4 rounded-full bg-vigil-light-orange border border-vigil-light-orange p-3">
          <Avatar
            size="big"
            userId={vigilDetails?.id}
            value={vigilDetails?.displayName}
          />
          <div className="flex-1">
            <span>{vigilDetails?.displayName}</span>
          </div>
        </div>

        <Controller
          name="service_id"
          control={control}
          rules={{ required: true }}
          render={({ field }) =>
            serviceOptions.length > 1 ? (
              <Select
                {...field}
                label="Servizio richiesto"
                placeholder="Seleziona un servizio"
                required
                error={errors.service_id}
                options={serviceOptions}
                disabled={!!selectedService?.id}
              />
            ) : (
              <Input
                {...field}
                label="Servizio"
                type="text"
                disabled
                required
                role={RolesEnum.VIGIL}
                error={errors.service_id}
                value={selectedService?.name || ""}
              />
            )
          }
        />

        <Controller
          name="startDate"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <Input
              {...field}
              label="Data"
              type="datetime-local"
              required
              role={RolesEnum.VIGIL}
              error={errors.startDate}
              value={
                field.value
                  ? new Date(field.value).toISOString().slice(0, 16)
                  : ""
              }
              onChange={(value) => {
                const local = new Date(value as string);
                const utc = new Date(
                  Date.UTC(
                    local.getFullYear(),
                    local.getMonth(),
                    local.getDate(),
                    local.getHours(),
                    local.getMinutes()
                  )
                );
                field.onChange(utc.toISOString()); // salva in UTC
              }}
              // set min to today and max to 3 months from today
              min={new Date(
                new Date(
                  new Date().setUTCHours(new Date().getUTCHours() + 1)
                ).setUTCMinutes(0)
              )
                .toISOString()
                .slice(0, 16)}
              max={new Date(
                new Date().setUTCMonth(new Date().getUTCMonth() + 3)
              )
                .toISOString()
                .slice(0, 16)}
              step={1800} // 30 minutes
            />
          )}
        />

        <Controller
          name="quantity"
          control={control}
          rules={{
            required: true,
            min: selectedService?.min_unit || 1,
            max: selectedService?.max_unit,
          }}
          render={({ field }) => (
            <InputQuantity
              {...field}
              role={RolesEnum.VIGIL}
              label={`Durata (${ServicesUtils.getServiceUnitType(
                selectedService?.unit_type as string
              )})`}
              min={selectedService?.min_unit || 1}
              max={selectedService?.max_unit || undefined}
              required
              error={errors.quantity}
            />
          )}
        />

        <SearchAddress
          location
          isForm={true}
          onSubmit={(address) =>
            address?.display_name
              ? setValue("address", address.display_name)
              : ""
          }
          label="Indirizzo"
          placeholder="Inserisci l'indirizzo per il Vigil"
        />

        <Controller
          name="note"
          control={control}
          render={({ field }) => (
            <TextArea
              {...field}
              label="Note"
              placeholder="Aggiungi eventuali note per il Vigil"
              rows={3}
              role={RolesEnum.VIGIL}
              error={errors.note}
            />
          )}
        />

        {selectedService && (
          <div className="p-4 bg-vigil-light-orange rounded-lg border border-vigil-orange">
            <h3 className="font-medium">Riepilogo Prenotazione</h3>
            <div className="mt-2 space-y-1 text-sm text-gray-600">
              <p>
                Servizio: {selectedService.name}
                {watchedAddress && ` presso ${watchedAddress}`}
              </p>
              <p>
                Prezzo per&nbsp;
                {ServicesUtils.getServiceUnitType(selectedService.unit_type)}
                :&nbsp;
                {selectedService.currency}
                {amountDisplay(selectedService.unit_price)}
              </p>
              <p>
                Quantità: {watchedDuration}&nbsp;
                {ServicesUtils.getServiceUnitType(selectedService.unit_type)}
              </p>
              <p className="font-medium">
                Totale: {selectedService.currency} {amountDisplay(totalAmount)}
              </p>
            </div>
          </div>
        )}

        <div className="flex gap-4">
          {isModal && (
            <Button
              type="button"
              secondary
              full
              label="Annulla"
              action={closeModal}
            />
          )}
          <Button
            type="submit"
            primary
            full
            label={
              booking ? "Aggiorna Prenotazione" : "Conferma e vai al pagamento"
            }
            isLoading={isLoading}
          />
        </div>
      </form>
    </div>
  );
};

export default BookingFormComponent;
