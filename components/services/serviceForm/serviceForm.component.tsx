import { Controller, useForm } from "react-hook-form";
import { getUUID } from "@/src/utils/common.utils";
import { useAppStore } from "@/src/store/app/app.store";
import { ToastStatusEnum } from "@/src/enums/toast.enum";
import { useModalStore } from "@/src/store/modal/modal.store";
import clsx from "clsx";
import { FormFieldType } from "@/src/constants/form.constants";
import { Input, TextArea, Toggle } from "@/components/form";
import { Button, Tooltip } from "@/components";
import { CurrencyEnum } from "@/src/enums/common.enums";
import { ServiceI } from "@/src/types/services.types";
import { ServicesUtils } from "@/src/utils/services.utils";
import { ServicesService } from "@/src/services";
import { InformationCircleIcon } from "@heroicons/react/24/outline";

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
  const { closeModal } = useModalStore();
  const {
    control,
    formState: { errors, isValid },
    handleSubmit,
    reset,
  } = useForm<ServiceI & {}>({
    defaultValues: {
      active: true,
      id: getUUID("SERVICE"),
      name: "",
      description: "",
      price: 0,
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
            message: `Service succesfully ${
              service?.id ? "updated" : "created"
            }!`,
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
          rules={{ required: true, ...FormFieldType.UNIT_NAME }}
          render={({ field }) => (
            <Input
              {...field}
              label="Name"
              placeholder="Insert the service name"
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
          rules={{ required: true }}
          render={({ field }) => (
            <TextArea
              {...field}
              label="Description"
              placeholder="Describe the service you want to offer"
              required
              aria-invalid={!!errors.description}
              error={errors.description}
            />
          )}
        />

        <Controller
          name="price"
          control={control}
          rules={{ required: true, ...FormFieldType.UNIT_SERVICE_PRICE }}
          render={({ field }) => (
            <Input
              {...field}
              {...{ ...FormFieldType.PRICE, pattern: undefined }}
              label="Price"
              placeholder="Insert the service unit price"
              type="number"
              required
              step=".01"
              aria-invalid={!!errors.price}
              error={errors.price}
              onChange={(v) => field.onChange(Number(v))}
            />
          )}
        />

        {service?.id ? (
          <div className="w-full inline-flex justify-between">
            <label className="inline-flex items-center gap-2">
              <span>Active</span>
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
            label={`${service?.id ? "Edit" : "Create"} service`}
            isLoading={isLoading}
          />
        </div>
      </form>
    </div>
  );
};

export default ServiceFormComponent;
