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
import { useCrmStore } from "@/src/store/crm/crm.store";
import { useEffect, useState } from "react";
import { ServiceI } from "@/src/types/services.types";
import { GuestI } from "@/src/types/crm.types";
import { amountDisplay } from "@/src/utils/common.utils";

export type BookingFormComponentI = {
  isModal?: boolean;
  onSubmit?: (newBooking: BookingI) => void;
  booking?: BookingI;
  text?: string;
  title?: string;
  serviceId?: ServiceI["id"];
};

const BookingFormComponent = (props: BookingFormComponentI) => {
  const {
    isModal = false,
    onSubmit = () => ({}),
    booking,
    text,
    title,
    serviceId,
  } = props;
  
  const {
    loader: { isLoading },
    hideLoader,
    showLoader,
    showToast,
  } = useAppStore();
  
  const { closeModal } = useModalStore();
  const { services, getServices } = useServicesStore();
  const { customers, getCustomers } = useCrmStore();
  
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
      service_id: serviceId || booking?.service_id || "",
      guest_id: booking?.guest_id || "",
      service_date: booking?.service_date || new Date(),
      duration_hours: booking?.duration_hours || 1,
      notes: booking?.notes || "",
    },
  });

  const watchedServiceId = watch("service_id");
  const watchedDuration = watch("duration_hours");

  useEffect(() => {
    getServices();
    getCustomers();
  }, []);

  useEffect(() => {
    if (serviceId && services.length) {
      setValue("service_id", serviceId);
    }
  }, [serviceId, services, setValue]);

  useEffect(() => {
    if (watchedServiceId && services.length) {
      const service = services.find(s => s.id === watchedServiceId);
      setSelectedService(service || null);
    }
  }, [watchedServiceId, services]);

  useEffect(() => {
    if (selectedService && watchedDuration) {
      setTotalAmount(selectedService.price * watchedDuration);
    }
  }, [selectedService, watchedDuration]);

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

  const serviceOptions = services.map(service => ({
    label: `${service.name} - ${service.currency} ${amountDisplay(service.price)}/hour`,
    value: service.id,
  }));

  const guestOptions = [
    { label: "No guest", value: "" },
    ...customers.map(guest => ({
      label: `${guest.name} ${guest.surname}`,
      value: guest.id,
    })),
  ];

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
          render={({ field }) => (
            <Select
              {...field}
              label="Service"
              placeholder="Select a service"
              required
              error={errors.service_id}
              options={serviceOptions}
              disabled={!!serviceId}
            />
          )}
        />

        <Controller
          name="guest_id"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              label="Guest (Optional)"
              placeholder="Select a guest"
              error={errors.guest_id}
              options={guestOptions}
            />
          )}
        />

        <Controller
          name="service_date"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <Input
              {...field}
              label="Service Date"
              type="datetime-local"
              required
              error={errors.service_date}
              value={field.value ? new Date(field.value).toISOString().slice(0, 16) : ""}
              onChange={(value) => field.onChange(new Date(value as string))}
            />
          )}
        />

        <Controller
          name="duration_hours"
          control={control}
          rules={{ required: true, min: 1 }}
          render={({ field }) => (
            <InputQuantity
              {...field}
              label="Duration (Hours)"
              min={1}
              max={24}
              required
              error={errors.duration_hours}
            />
          )}
        />

        {selectedService && (
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-900">Booking Summary</h3>
            <div className="mt-2 space-y-1 text-sm text-gray-600">
              <p>Service: {selectedService.name}</p>
              <p>Price per hour: {selectedService.currency} {amountDisplay(selectedService.price)}</p>
              <p>Duration: {watchedDuration} hour(s)</p>
              <p className="font-medium text-gray-900">
                Total: {selectedService.currency} {amountDisplay(totalAmount)}
              </p>
            </div>
          </div>
        )}

        <Controller
          name="notes"
          control={control}
          render={({ field }) => (
            <TextArea
              {...field}
              label="Notes (Optional)"
              placeholder="Add any special requirements or notes"
              rows={3}
              error={errors.notes}
            />
          )}
        />

        <div className="flex gap-4">
          {isModal && (
            <Button
              type="button"
              secondary
              full
              label="Cancel"
              action={closeModal}
            />
          )}
          <Button
            type="submit"
            primary
            full
            label={booking ? "Update Booking" : "Create Booking"}
            isLoading={isLoading}
          />
        </div>
      </form>
    </div>
  );
};

export default BookingFormComponent;