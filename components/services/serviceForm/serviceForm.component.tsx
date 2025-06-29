import { Controller, useForm } from "react-hook-form";
import { useAppStore } from "@/src/store/app/app.store";
import { ToastStatusEnum } from "@/src/enums/toast.enum";
import { useModalStore } from "@/src/store/modal/modal.store";
import clsx from "clsx";
import { FormFieldType } from "@/src/constants/form.constants";
import { Input, Select, TextArea, Toggle } from "@/components/form";
import { Button, Tooltip } from "@/components";
import { CurrencyEnum } from "@/src/enums/common.enums";
import { ServiceI } from "@/src/types/services.types";
import { ServicesUtils } from "@/src/utils/services.utils";
import { ServicesService } from "@/src/services";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { useUserStore } from "@/src/store/user/user.store";
import { RolesEnum } from "@/src/enums/roles.enums";

export type ServiceFormI = {
  isModal?: boolean;
  onSubmit?: (newService: ServiceI) => void;
  service?: ServiceI;
  text?: string;
  title?: string;
};

const ServiceFormComponent = (props: ServiceFormI) => {
  const {
    isModal = false,
    onSubmit = () => ({}),
    service,
    text,
    title,
  } = props;
  const {
    loader: { isLoading },
    hideLoader,
    showLoader,
    showToast,
  } = useAppStore();
  const { user } = useUserStore();
  const { closeModal } = useModalStore();
  const {
    control,
    formState: { errors, isValid },
    handleSubmit,
    reset,
  } = useForm<ServiceI & {}>({
    defaultValues: {
      active: true,
      id: service?.id,
      name: "",
      description: "",
      currency: CurrencyEnum.EURO,
      ...(service || {}),
    },
  });

  const handleOnSubmit = async (formData: ServiceI) => {
    try {
      if (isValid) {
        showLoader();
        const newService = await ServicesUtils.createNewService(formData);
        let result: ServiceI;
        if (service?.id) {
          // Edit service
          result = await ServicesService.editService(newService);
        } else {
          // Create new service
          result = await ServicesService.createService(newService);
        }
        if (result) {
          onSubmit?.(result);
          showToast({
            message: `Servizio ${service?.id ? "aggiornato" : "creato"}!`,
            type: ToastStatusEnum.SUCCESS,
          });
          reset();
          if (isModal) closeModal();
        }
      }
    } catch (error) {
      console.error("ServiceForm error", error);
    } finally {
      hideLoader();
    }
  };

  if (user?.user_metadata?.role !== RolesEnum.VIGIL) return null;

  console.log("errors", errors);

  return (
    <div
      className={clsx(
        "bg-white w-full mx-auto rounded-lg",
        isModal ? "!p-0 mb-0" : /*"shadow-lg"*/ ""
      )}
    >
      <form
        onSubmit={handleSubmit(handleOnSubmit)}
        className="space-y-6 text-black"
      >
        {title || text ? (
          <div>
            {title ? (
              <h2 className="text-center font-medium">{title}</h2>
            ) : null}
            {text ? (
              <p className="text-center text-sm text-gray-500 mt-2">{text}</p>
            ) : null}
          </div>
        ) : null}

        <Controller
          name="name"
          control={control}
          rules={{ required: true, ...FormFieldType.NAME }}
          render={({ field }) => (
            <Input
              {...field}
              label="Nome"
              placeholder="Nome del servizio"
              type="text"
              required
              aria-invalid={!!errors.name}
              error={errors.name}
            />
          )}
        />

        <Controller
          name="description"
          control={control}
          rules={{ required: false, ...FormFieldType.NOTE }}
          render={({ field }) => (
            <TextArea
              {...field}
              label="Descrizione"
              placeholder="Descrivi il servizio che vuoi offrire"
              aria-invalid={!!errors.description}
              error={errors.description}
            />
          )}
        />

        <Controller
          name="unit_price"
          control={control}
          rules={{ required: true, ...FormFieldType.PRICE }}
          render={({ field }) => (
            <Input
              {...field}
              {...{ ...FormFieldType.PRICE, pattern: undefined }}
              label="Prezzo unitario"
              placeholder="Inserisci il prezzo unitario"
              type="number"
              required
              step=".01"
              aria-invalid={!!errors.unit_price}
              error={errors.unit_price}
              onChange={(v) => field.onChange(Number(v))}
            />
          )}
        />

        <Controller
          name="unit_type"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <Select
              {...field}
              label="Unità"
              placeholder="Seleziona unità"
              required
              error={errors.unit_type}
              options={[
                { label: "Minuti", value: "minutes" },
                { label: "Ore", value: "hours" },
                { label: "Giorni", value: "days" },
              ]}
            />
          )}
        />

        {service?.id ? (
          <div className="w-full inline-flex justify-between">
            <label className="inline-flex items-center gap-2">
              <span>Attivo</span>
              <Tooltip content="When a service is not active, it can't be sold">
                <InformationCircleIcon className="size-4 cursor-pointer" />
              </Tooltip>
            </label>
            <Controller
              name="active"
              control={control}
              render={({ field }) => (
                <Toggle
                  {...field}
                  label="Active"
                  withIcon
                  aria-invalid={!!errors.active}
                  value="active"
                  checked={field.value}
                />
              )}
            />
          </div>
        ) : null}

        <div className="mx-auto max-w-xs">
          <Button
            full
            type="submit"
            primary
            label={`${service?.id ? "Aggiorna" : "Crea"} servizio`}
            isLoading={isLoading}
          />
        </div>
      </form>
    </div>
  );
};

export default ServiceFormComponent;
