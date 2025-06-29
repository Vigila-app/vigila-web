"use client";

import { Controller, useForm } from "react-hook-form";
import { useAppStore } from "@/src/store/app/app.store";
import { ToastStatusEnum } from "@/src/enums/toast.enum";
import { useModalStore } from "@/src/store/modal/modal.store";
import { Input, Select, TextArea, InputQuantity } from "@/components/form";
import { Button } from "@/components";
import { BookingI, BookingFormI } from "@/src/types/booking.types";
import { BookingsService } from "@/src/services";
import { useServicesStore } from "@/src/store/services/services.store";
import { useEffect, useMemo, useState } from "react";
import { ServiceI } from "@/src/types/services.types";
import { amountDisplay } from "@/src/utils/common.utils";
import { CurrencyEnum } from "@/src/enums/common.enums";
import { useUserStore } from "@/src/store/user/user.store";

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

  const {
    loader: { isLoading },
    hideLoader,
    showLoader,
    showToast,
  } = useAppStore();

  const { closeModal } = useModalStore();
  const { services, getServiceDetails, getServices } = useServicesStore();
  const { user } = useUserStore();

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
      service_id: booking?.service_id || serviceId,
      consumer_id: booking?.consumer_id || user?.id,
      quantity: booking?.quantity || 1,
    },
  });

  const watchedServiceId = watch("service_id");
  const watchedDuration = watch("quantity");

  useEffect(() => {
    if (serviceId) getServiceDetails(serviceId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serviceId]);

  useEffect(() => {
    if (vigilId) getServices(true, vigilId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vigilId]);

  useEffect(() => {
    if (serviceId) {
      setValue("service_id", serviceId as never);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serviceId]);

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

  const submitForm = async (formData: BookingFormI) => {
    if (isValid) {
      try {
        showLoader();
        const newBooking = await BookingsService.createBooking(formData);

        showToast({
          message: "Booking created successfully!",
          type: ToastStatusEnum.SUCCESS,
        });

        onSubmit(newBooking);

        if (isModal) {
          closeModal();
        }
      } catch (error) {
        console.error("Error creating booking", error);
        showToast({
          message: "Error creating booking. Please try again.",
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
        {title || text ? (
          <div>
            {title ? (
              <h2 className="text-center font-medium text-xl">{title}</h2>
            ) : null}
            {text ? (
              <p className="text-center text-sm text-gray-500 mt-2">{text}</p>
            ) : null}
          </div>
        ) : null}

        <Controller
          name="service_id"
          control={control}
          rules={{ required: true }}
          render={({ field }) =>
            serviceOptions.length > 1 ? (
              <Select
                {...field}
                label="Servizio"
                placeholder="Seleziona un servizio"
                required
                error={errors.service_id}
                options={serviceOptions}
                disabled={!!serviceId}
              />
            ) : (
              <Input
                {...field}
                label="Servizio"
                type="text"
                disabled
                required
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
              error={errors.startDate}
              value={
                field.value
                  ? new Date(field.value).toISOString().slice(0, 16)
                  : ""
              }
              onChange={(value) => field.onChange(new Date(value as string))}
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
              label="Quantità"
              min={selectedService?.min_unit || 1}
              max={selectedService?.max_unit || undefined}
              required
              error={errors.quantity}
            />
          )}
        />

        {selectedService && (
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-900">Booking Summary</h3>
            <div className="mt-2 space-y-1 text-sm text-gray-600">
              <p>Service: {selectedService.name}</p>
              <p>
                Prezzo per {selectedService.unit_type}:{" "}
                {selectedService.currency}{" "}
                {amountDisplay(selectedService.unit_price)}
              </p>
              <p>
                Quantità: {watchedDuration} {selectedService.unit_type}
              </p>
              <p className="font-medium text-gray-900">
                Totale: {selectedService.currency} {amountDisplay(totalAmount)}
              </p>
            </div>
          </div>
        )}

        <Controller
          name="note"
          control={control}
          render={({ field }) => (
            <TextArea
              {...field}
              label="Note"
              placeholder="Aggiungi eventuali note per il Vigil"
              rows={3}
              error={errors.note}
            />
          )}
        />

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
            label={booking ? "Aggiorna Prenotazione" : "Prenota"}
            isLoading={isLoading}
          />
        </div>
      </form>
    </div>
  );
};

export default BookingFormComponent;
