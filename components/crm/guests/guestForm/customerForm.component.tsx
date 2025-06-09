import { Controller, useForm } from "react-hook-form";
import { capitalize, getUUID } from "@/src/utils/common.utils";
import { useAppStore } from "@/src/store/app/app.store";
import { ToastStatusEnum } from "@/src/enums/toast.enum";
import { useModalStore } from "@/src/store/modal/modal.store";
import clsx from "clsx";
import { FormFieldType } from "@/src/constants/form.constants";
import { Checkbox, Input, Select, Toggle } from "@/components/form";
import { Button, Divider, Tooltip } from "@/components";
import { GenderEnum } from "@/src/enums/common.enums";
import { GuestI } from "@/src/types/crm.types";
import { CrmUtils } from "@/src/utils/crm.utils";
import { CrmService } from "@/src/services";
import {
  AtSymbolIcon,
  ChatBubbleOvalLeftIcon,
  InformationCircleIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";

export type CustomerFormI = {
  isModal?: boolean;
  onSubmit?: (newCustomer: GuestI) => void;
  customer?: GuestI;
  text?: string;
  title?: string;
};

const CustomerFormComponent = (props: CustomerFormI) => {
  const {
    isModal = false,
    onSubmit = () => ({}),
    customer,
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
    setValue,
    watch,
  } = useForm<GuestI & {}>({
    defaultValues: {
      active: true,
      name: "",
      surname: "",
      ...(customer || {}),
    },
  });

  const watchAll = watch();

  const handleOnSubmit = async (formData: GuestI) => {
    try {
      if (isValid) {
        showLoader();
        const newCustomer = await CrmUtils.createNewGuest(formData);
        let result: GuestI;
        if (customer?.id) {
          // Edit customer
          result = await CrmService.editCustomer(newCustomer);
        } else {
          // Create new customer
          result = await CrmService.createCustomer(newCustomer);
        }
        if (result) {
          showToast({
            message: `Customer succesfully ${
              customer?.id ? "updated" : "created"
            }!`,
            type: ToastStatusEnum.SUCCESS,
          });
          reset();
          if (isModal) closeModal();
          onSubmit?.(result);
        }
      }
    } catch (error) {
      console.error("CustomerForm error", error);
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
      <form onSubmit={handleSubmit(handleOnSubmit)} className="text-black">
        <div className="space-y-6">
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
                label="Name"
                placeholder="Insert the customer name"
                type="text"
                required
                aria-invalid={!!errors.name}
                error={errors.name}
              />
            )}
          />
          <Controller
            name="surname"
            control={control}
            rules={{ required: true, ...FormFieldType.NAME }}
            render={({ field }) => (
              <Input
                {...field}
                label="Surame"
                placeholder="Insert the customer surname"
                type="text"
                required
                aria-invalid={!!errors.surname}
                error={errors.surname}
              />
            )}
          />
          <Controller
            name="birthday"
            control={control}
            rules={{ required: false }}
            render={({ field }) => (
              <Input
                {...field}
                label="Birthday"
                placeholder="Insert the customer birthday"
                type="date"
                aria-invalid={!!errors.birthday}
                value={field.value?.toString()}
              />
            )}
          />
          <Controller
            name="gender"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <Select
                {...field}
                label="Gender"
                placeholder="Select the customer gender"
                options={Object.values(GenderEnum).map((g) => ({
                  label: capitalize(g),
                  value: g,
                }))}
                required
                aria-invalid={!!errors?.gender}
                error={errors?.gender}
              />
            )}
          />
        </div>

        <Divider />

        <div className="space-y-6">
          <Controller
            name="email"
            control={control}
            rules={{ required: false, ...FormFieldType.EMAIL }}
            render={({ field }) => (
              <Input
                {...field}
                label="Email"
                placeholder="Insert customer email"
                type="email"
                autoComplete="email"
                aria-invalid={!!errors.email}
                error={errors.email}
                icon={<AtSymbolIcon className="size-4" />}
              />
            )}
          />

          <Controller
            name="phone"
            control={control}
            rules={{ required: false }}
            render={({ field }) => (
              <Input
                {...field}
                label="Phone number"
                placeholder="Insert the customer phone number"
                aria-invalid={!!errors?.phone}
                error={errors?.phone}
                type="tel"
                icon={<PhoneIcon className="size-4" />}
              />
            )}
          />
          <Checkbox
            label="Use the same number for Whatsapp"
            disabled={!watchAll.phone}
            onChange={(checked) => {
              if (checked && watchAll.phone) {
                setValue("whatsapp", watchAll.phone);
              }
            }}
            checked={watchAll.phone === watchAll.whatsapp}
          />
          <Controller
            name="whatsapp"
            control={control}
            rules={{ required: false }}
            render={({ field }) => (
              <Input
                {...field}
                label="Whatsapp number"
                placeholder="Insert the customer whatsapp number"
                aria-invalid={!!errors?.whatsapp}
                error={errors?.whatsapp}
                type="tel"
                icon={<ChatBubbleOvalLeftIcon className="size-4" />}
              />
            )}
          />

          {customer?.id ? (
            <div className="w-full inline-flex justify-between">
              <label className="inline-flex items-center gap-2">
                <span>Active</span>
                <Tooltip content="Inactive customer info">
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

          <div className="mx-auto max-w-xs !mt-8">
            <Button
              full
              type="submit"
              primary
              label={`${customer?.id ? "Edit" : "Create"} customer`}
              isLoading={isLoading}
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default CustomerFormComponent;
