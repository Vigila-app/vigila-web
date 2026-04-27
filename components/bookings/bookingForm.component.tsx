"use client";

import { Controller, useForm } from "react-hook-form";
import { useAppStore } from "@/src/store/app/app.store";
import { ToastStatusEnum } from "@/src/enums/toast.enum";
import { useModalStore } from "@/src/store/modal/modal.store";
import { Input, Select, TextArea, InputQuantity } from "@/components/form";
import { Avatar, Button } from "@/components";
import { BookingI, BookingFormI } from "@/src/types/booking.types";
import { BookingsService, ServicesService } from "@/src/services";
import { useServicesStore } from "@/src/store/services/services.store";
import React, { useEffect, useMemo, useState } from "react";
import { ServiceCatalogItem, ServiceI } from "@/src/types/services.types";
import { AddressI } from "@/src/types/maps.types";
import { amountDisplay } from "@/src/utils/common.utils";
import { useUserStore } from "@/src/store/user/user.store";
import { ServicesUtils } from "@/src/utils/services.utils";
import { useVigilStore } from "@/src/store/vigil/vigil.store";
import { useRouter } from "next/navigation";
import { Routes } from "@/src/routes";
import dynamic from "next/dynamic";

const SearchAddress = dynamic(
  () => import("@/components/maps/searchAddress.component"),
  {
    ssr: false,
    loading: () => (
      <div className="h-12 bg-gray-100 rounded-lg animate-pulse" />
    ),
  },
);
import { RolesEnum } from "@/src/enums/roles.enums";
import { dateDiff, dateDisplay } from "@/src/utils/date.utils";
import { CurrencyEnum, FrequencyEnum } from "@/src/enums/common.enums";
import { StarIcon } from "@heroicons/react/24/solid";
import { ReviewsUtils } from "@/src/utils/reviews.utils";
import clsx from "clsx";
import { useBookingsStore } from "@/src/store/bookings/bookings.store";
import { NoticeBoardService } from "@/src/services/notice-board.service";
import { NoticeBoardI } from "@/src/types/notice-board.types";
import { ServiceCatalogTypeEnum } from "@/src/enums/services.enums";

const calcStartDate = (startDate?: Date | string, delta = 0) => {
  const base = startDate ? new Date(startDate) : new Date();

  // Guard against invalid dates
  if (isNaN(base.getTime())) {
    const fallback = new Date();
    fallback.setMinutes(Math.round(fallback.getMinutes() / 5) * 5, 0, 0);
    return fallback.toISOString() as unknown as Date;
  }

  const date = new Date(
    Date.UTC(
      base.getFullYear(),
      base.getMonth(),
      base.getDate(),
      base.getHours() + delta,
      base.getMinutes(),
    ),
  );
  const minutes = date.getMinutes();
  const roundedMinutes = Math.round(minutes / 5) * 5;
  date.setMinutes(roundedMinutes);
  return date.toISOString() as unknown as Date;
};
type BookingFormComponentI = {
  isModal?: boolean;
  onSubmit?: (newBooking: BookingI) => void;
  onAddressSelect?: (address: AddressI) => void;
  onFormChange?: (
    values: Partial<BookingFormI> & { address_object?: AddressI | null },
  ) => void;
  booking?: BookingI;
  bookingId?: BookingI["id"];
  text?: string;
  title?: string;
  serviceId?: ServiceI["id"];
  vigilId?: ServiceI["vigil_id"];
  edit?: boolean;
};

const BookingFormComponent = (props: BookingFormComponentI) => {
  const {
    isModal = false,
    onSubmit = () => ({}),
    onAddressSelect,
    onFormChange,
    booking: eBooking,
    text,
    title,
    serviceId,
    vigilId,
    bookingId,
    edit = false,
  } = props;

  const router = useRouter();
  const {
    loader: { isLoading },
    hideLoader,
    showLoader,
    showToast,
  } = useAppStore();
  const { closeModal } = useModalStore();
  const { services, getServiceDetails, getServices } = useServicesStore();
  const { bookings, getBookingDetails } = useBookingsStore();
  const { user } = useUserStore();
  const role = useMemo(
    () => user?.user_metadata?.role,
    [user?.user_metadata?.role],
  );
  const [totalAmount, setTotalAmount] = useState(0);
  const booking = useMemo(() => {
    if (eBooking) return eBooking;
    if (bookingId) {
      const found = bookings.find((b) => b.id === bookingId);
      if (found) return found;
      getBookingDetails(bookingId, true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eBooking, bookingId, bookings]);

  const [noticeProposal, setNoticeProposal] = useState<NoticeBoardI>();
  const [selectedAddressObj, setSelectedAddressObj] = useState<AddressI | null>(
    null,
  );

  useEffect(() => {
    if (booking?.notice_id) {
      const getNoticeDetails = async () => {
        const notice = await NoticeBoardService.getNoticeDetails(
          booking.notice_id as string,
        );
        if (notice) {
          setNoticeProposal(notice);
        }
      };
      getNoticeDetails();
    }
  }, [booking?.notice_id]);

  const { vigils, getVigilsDetails } = useVigilStore();
  const vigilDetails = useMemo(() => {
    const found = vigils.find(
      (vigil) => vigil.id === (vigilId || booking?.vigil_id),
    );
    if (found) return found;
    if (vigilId || booking?.vigil_id)
      getVigilsDetails([(vigilId || booking?.vigil_id) as string], true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vigils, vigilId, booking?.vigil_id]);

  const averageRating = useMemo(() => {
    return (
      vigilDetails?.averageRating ||
      ReviewsUtils.calculateAverageRating(vigilDetails?.reviews || [])
    );
  }, [vigilDetails?.averageRating, vigilDetails?.reviews]);

  const {
    control,
    formState: { errors, isValid },
    handleSubmit,
    watch,
    setValue,
    setError,
    clearErrors,
  } = useForm<BookingFormI>({
    defaultValues: {
      ...booking,
      address: booking?.address || user?.user_metadata?.address || "",
      service_id: booking?.service_id || serviceId,
      consumer_id: booking?.consumer_id || user?.id,
      quantity: booking?.quantity || booking?.min_unit || 1,
      startDate: calcStartDate(booking?.startDate),
      endDate: calcStartDate(
        calcStartDate(booking?.startDate),
        booking?.quantity || booking?.min_unit || 1,
      ),
    },
  });

  const watchedServiceId = watch("service_id");
  const watchedDuration = watch("quantity");
  const watchedAddress = watch("address");
  const watchedExtras = watch("extras");
  const watchedStartDate = watch("startDate");
  const watchedEndDate = watch("endDate");

  const selectedService = useMemo(() => {
    if (noticeProposal?.service_type) {
      const service = ServicesService.getServicesByType(
        noticeProposal.service_type as ServiceCatalogTypeEnum,
      );
      if (service) return service;
    }
    if (!(watchedServiceId || serviceId || booking?.service_id)) return;
    if (services?.length && (serviceId || booking?.service_id)) {
      const found =
        services.find((s) => s.id === (serviceId || booking?.service_id)) ||
        null;
      if (found) return found;
    }
    if (watchedServiceId && services.length) {
      const service = services.find((s) => s.id === watchedServiceId);
      if (!service) {
        getServiceDetails(watchedServiceId as string, true);
      } else {
        return service;
      }
    } else {
      if (watchedServiceId || serviceId) {
        getServiceDetails((watchedServiceId || serviceId) as string, true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    watchedServiceId,
    services,
    serviceId,
    vigilId,
    booking,
    noticeProposal?.service_type,
  ]);

  useEffect(() => {
    if (!onFormChange) return;
    const selectedServiceType =
      (selectedService as ServiceI)?.type ||
      (selectedService as ServiceCatalogItem)?.type;
    onFormChange({
      service_id: watchedServiceId,
      service_type: selectedServiceType,
      quantity: watchedDuration,
      address: watchedAddress,
      extras: watchedExtras,
      startDate: watchedStartDate,
      endDate: watchedEndDate,
      address_object: selectedAddressObj,
    });
  }, [
    onFormChange,
    selectedAddressObj,
    selectedService,
    watchedAddress,
    watchedDuration,
    watchedEndDate,
    watchedExtras,
    watchedServiceId,
    watchedStartDate,
  ]);

  useEffect(() => {
    if (vigilId || booking?.vigil_id) {
      getServices(true, vigilId || booking?.vigil_id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vigilId, booking?.vigil_id]);

  const serviceCatalog: ServiceCatalogItem | undefined = useMemo(() => {
    const service = selectedService as
      | (ServiceI & { catalog_id?: number })
      | ServiceCatalogItem
      | undefined;

    if (!service) return undefined;

    if (service.type) {
      const foundByType = ServicesService.getServicesByType(
        service.type as ServiceCatalogTypeEnum,
      );
      if (foundByType) return foundByType;
    }

    const catId =
      (service as ServiceI).info?.catalog_id ??
      (service as { catalog_id?: number }).catalog_id;
    if (catId) {
      const foundById = ServicesService.getServiceCatalogById(Number(catId));
      if (foundById) return foundById;
    }

    return undefined;
  }, [selectedService]);
  useEffect(() => {
    if (
      ((selectedService as ServiceI)?.min_unit ||
        (selectedService as ServiceCatalogItem)?.minimum_duration_hours) &&
      watchedDuration &&
      (watchedDuration < (selectedService as ServiceI).min_unit ||
        watchedDuration <
          (selectedService as ServiceCatalogItem).minimum_duration_hours)
    ) {
      setValue(
        "quantity",
        (selectedService as ServiceI).min_unit ||
          (selectedService as ServiceCatalogItem).minimum_duration_hours,
      );
    }
    if (selectedService && watchedDuration) {
      const unitPrice =
        (selectedService as ServiceI)?.unit_price ||
        (selectedService as ServiceCatalogItem)?.min_hourly_rate;
      const consumerFee =
        role === RolesEnum.CONSUMER ? (serviceCatalog?.fee ?? 0) : 0;
      setTotalAmount((unitPrice + consumerFee) * watchedDuration);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedService, watchedDuration, serviceCatalog, role]);

  // useEffect(() => {
  //   if (services?.length === 1) {
  //     setSelectedService(services[0]);
  //   }
  // }, [services]);

  // useEffect(() => {
  //   setValue("service_id", selectedService?.id as never);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [selectedService]);

  const age = Math.floor(
    dateDiff(
      new Date(),
      new Date(vigilDetails?.birthday || ""),
      FrequencyEnum.DAYS,
    ) / 365.25,
  );

  const submitForm = async (formData: BookingFormI) => {
    if (!watchedAddress) {
      document?.getElementById("address")?.focus();
      setError("address", {
        type: "manual",
        message: "L'indirizzo non è valido. Inserisci un indirizzo corretto.",
      });
      showToast({
        message: "L'indirizzo non è valido. Inserisci un indirizzo corretto.",
        type: ToastStatusEnum.ERROR,
      });
      return;
    }
    if (!selectedService) {
      setError("service_id", {
        type: "manual",
        message: "Seleziona un servizio valido.",
      });
      return;
    }

    if (isValid) {
      try {
        showLoader();

        const extras = serviceCatalog?.extra
          .filter(
            (extra) =>
              Object.keys(formData.extras || {}).includes(extra.id) &&
              (formData.extras || {})[extra.id],
          )
          .map((extra) => extra.id);

        let newBooking: BookingI;

        if (edit && booking?.id) {
          newBooking = await BookingsService.updateBooking({
            ...booking,
            ...formData,
            service_type: (selectedService as ServiceI)?.type,
            extras,
            id: booking.id,
          });
        } else {
          newBooking = await BookingsService.createBooking({
            ...formData,
            extras,
            service_type: (selectedService as ServiceI)?.type,
          });
        }

        showToast({
          message: "Prenotazione creata!",
          type: ToastStatusEnum.SUCCESS,
        });

        onSubmit(newBooking);

        if (isModal) {
          closeModal();
        } else {
          router.push(
            `${Routes.paymentBooking.url}?bookingId=${newBooking.id}`,
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
      !serviceId &&
      services.map((service) => ({
        label: `${service.name} - ${service.currency} ${amountDisplay(
          service.unit_price,
        )}/${service.unit_type}`,
        value: service.id,
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [services?.length, serviceId],
  );

  const extraOptions = useMemo(() => {
    if (
      (selectedService as ServiceI)?.info?.extras?.length ||
      (selectedService as ServiceCatalogItem)?.extra?.length
    ) {
      return serviceCatalog?.extra.filter((extra) =>
        (
          (selectedService as ServiceI).info?.extras ||
          (selectedService as ServiceCatalogItem)?.extra
        )?.find((e: string) => e === extra.id),
      );
    }
    return undefined;
  }, [selectedService, serviceCatalog]);
  return (
    <div className="bg-white w-full mx-auto p-6 rounded-lg shadow-lg">
      <form onSubmit={handleSubmit(submitForm)} className="space-y-6">
        <div className="mb-4">
          {vigilDetails ? (
            <h2 className="text-center font-medium text-xl">
              {title || `Prenota con ${vigilDetails?.displayName}`}
            </h2>
          ) : (
            <h2 className="text-center font-medium text-xl">
              {title || `Prenota`}
            </h2>
          )}

          <p className="text-center text-sm text-gray-500 mt-2">
            {text || "Compila i dettagli per la tua prenotazione"}
          </p>
        </div>
        {vigilDetails && (
          <div className="w-full inline-flex flex-nowrap items-center gap-2 my-4 rounded-full bg-vigil-light-orange/60  p-3">
            <Avatar
              size="big"
              userId={vigilDetails?.id}
              value={vigilDetails?.displayName}
            />
            <div className="flex-1 flex flex-col">
              <div className="flex items-center gap-2">
                <p className="font-semibold text-[15px] text-gray-800">
                  {vigilDetails?.displayName}
                </p>
                <p className="font-medium text-xs text-gray-600">
                  ({age} anni)
                </p>
              </div>
              <div className="font-medium text-[12px] text-gray-600">
                <span>
                  🗓️ Su Vigila da:&nbsp;
                  <span className="capitalize">
                    {dateDisplay(
                      vigilDetails?.created_at || "",
                      "monthYearLiteral",
                    )}
                  </span>
                </span>
              </div>
              {averageRating ? (
                <div className="flex items-center gap-1">
                  <StarIcon className="w-4 h-4 text-yellow-300" />
                  <p className="text-xs font-medium text-gray-600">
                    Valutazione media: {averageRating}
                  </p>
                </div>
              ) : null}
            </div>
          </div>
        )}

        <Controller
          name="service_id"
          control={control}
          rules={{ required: !(edit && booking?.notice_id && noticeProposal) }}
          render={({ field }) =>
            serviceOptions && serviceOptions?.length > 1 ? (
              <Select
                {...field}
                label="Servizio richiesto"
                placeholder="Seleziona un servizio"
                required={!(edit && booking?.notice_id && noticeProposal)}
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
                required={!(edit && booking?.notice_id && noticeProposal)}
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
                    local.getMinutes(),
                  ),
                );
                field.onChange(utc.toISOString()); // salva in UTC
                // aggiorna endDate in base alla nuova startDate
                setValue(
                  "endDate",
                  calcStartDate(
                    utc.toISOString(),
                    Math.max(1, Number(watchedDuration)),
                  ),
                );
              }}
              // set min to today and max to 3 months from today
              min={new Date(
                new Date(
                  new Date().setUTCHours(new Date().getUTCHours() + 1),
                ).setUTCMinutes(0),
              )
                .toISOString()
                .slice(0, 16)}
              max={new Date(
                new Date().setUTCMonth(new Date().getUTCMonth() + 3),
              )
                .toISOString()
                .slice(0, 16)}
              step={300} // 5 minutes
            />
          )}
        />

        <Controller
          name="quantity"
          control={control}
          rules={{
            required: true,
            min:
              (selectedService as ServiceI)?.min_unit ||
              (selectedService as ServiceCatalogItem)?.minimum_duration_hours ||
              1,
            max: (selectedService as ServiceI)?.max_unit || 24,
          }}
          render={({ field }) => (
            <InputQuantity
              {...field}
              role={RolesEnum.VIGIL}
              label={`Durata (${ServicesUtils.getServiceUnitType(
                ((selectedService as ServiceI)?.unit_type ||
                  (selectedService as ServiceCatalogItem)?.type) as string,
              )})`}
              min={
                (selectedService as ServiceI)?.min_unit ||
                (selectedService as ServiceCatalogItem)
                  ?.minimum_duration_hours ||
                1
              }
              onChange={(newQty) => {
                field.onChange(newQty);
                // aggiorna endDate in base alla nuova quantity
                setValue(
                  "endDate",
                  calcStartDate(watchedStartDate, Math.max(1, Number(newQty))),
                );
              }}
              max={(selectedService as ServiceI)?.max_unit || 24}
              required
              error={errors.quantity}
            />
          )}
        />

        <Controller
          name="address"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <SearchAddress
              location
              role={RolesEnum.VIGIL}
              onSubmit={(address) => {
                if (
                  edit &&
                  booking?.notice_id &&
                  noticeProposal?.postal_code &&
                  address.address?.postcode !== noticeProposal.postal_code
                ) {
                  setError("address", {
                    type: "manual",
                    message:
                      "Non è possibile modificare l'indirizzo in quanto diverso da quello indicato nella proposta di servizio.",
                  });
                  return;
                } else {
                  clearErrors("address");
                }
                setSelectedAddressObj(address);
                onAddressSelect?.(address);
                field.onChange(address?.display_name || "");
              }}
              label="Indirizzo"
              placeholder="Inserisci l'indirizzo per il Vigil"
              autoFocus={false}
              id="address"
              name="address"
              error={errors.address}
            />
          )}
        />

        <Controller
          name="note"
          control={control}
          rules={{ maxLength: 650 }}
          render={({ field }) => (
            <TextArea
              {...field}
              label="Note"
              placeholder="Aggiungi eventuali note per il Vigil"
              rows={6}
              role={RolesEnum.VIGIL}
              error={errors.note}
            />
          )}
        />

        {extraOptions?.length ? (
          <>
            <div className="space-y-2">
              <h3 className="text-vigil-orange">Extra disponibili</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {extraOptions.map((extra) => (
                  <React.Fragment key={extra.id}>
                    <Controller
                      name={`extras.${extra.id}` as const}
                      control={control}
                      render={({ field }) => (
                        <div
                          className={clsx(
                            "flex flex-col border border-gray-200 rounded-lg p-3 transition",
                            "hover:bg-gray-100 hover:border-vigil-orange cursor-pointer",
                            field.value &&
                              "border-vigil-orange bg-vigil-light-orange/60",
                          )}
                          onClick={() => {
                            setValue(
                              `extras.${extra.id}` as const,
                              !field.value,
                            );
                          }}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <p className="font-medium">{extra.name}</p>
                            <p className="font-medium text-consumer-blue">
                              {(selectedService as ServiceI)?.currency ||
                                CurrencyEnum.EURO}
                              {amountDisplay(extra.fixed_price)}
                            </p>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            {extra.description}
                          </p>

                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              {...field}
                              checked={field.value || false}
                              className="h-4 w-4 text-consumer-blue border-gray-300 rounded focus:ring-consumer-blue"
                            />
                            <label
                              htmlFor={extra.id}
                              className="text-sm font-medium text-gray-700"
                            >
                              {field.value ? "Aggiunto" : "Aggiungi"}
                            </label>
                          </div>
                        </div>
                      )}
                    />
                  </React.Fragment>
                ))}
              </div>
            </div>
          </>
        ) : null}

        {selectedService && (
          <div className="mt-8 pt-8 border-t border-gray-200">
            <div className="p-4 rounded-lg border border-vigil-orange">
              <h3 className="font-medium text-vigil-orange">
                Riepilogo Prenotazione
              </h3>
              <div className="mt-2 space-y-1 text-[16px] text-gray-700">
                <p>
                  Servizio:&nbsp;{selectedService.name}
                  {watchedAddress && ` presso ${watchedAddress}`}
                </p>
                <p>
                  Prezzo per&nbsp;
                  {ServicesUtils.getServiceUnitType(
                    (selectedService as ServiceI)?.unit_type ||
                      (selectedService as ServiceCatalogItem)?.type,
                  )}
                  :&nbsp;
                  {(selectedService as ServiceI)?.currency || CurrencyEnum.EURO}
                  {amountDisplay(
                    ((selectedService as ServiceI)?.unit_price ||
                      (selectedService as ServiceCatalogItem)
                        ?.min_hourly_rate) +
                      (role === RolesEnum.CONSUMER
                        ? (serviceCatalog?.fee ?? 0)
                        : 0),
                  )}
                </p>
                <p>
                  Quantità:&nbsp;{watchedDuration}&nbsp;
                  {ServicesUtils.getServiceUnitType(
                    (selectedService as ServiceI)?.unit_type ||
                      (selectedService as ServiceCatalogItem)?.type,
                  )}
                </p>
                {extraOptions?.length ? (
                  <div>
                    Extra:&nbsp;
                    {(serviceCatalog?.extra ?? [])
                      .filter(
                        (extra) =>
                          Object.keys(watchedExtras || {}).includes(extra.id) &&
                          (watchedExtras || {})[extra.id],
                      )
                      .map(
                        (extra) =>
                          `${extra.name} (${(selectedService as ServiceI)?.currency || CurrencyEnum.EURO}${amountDisplay(extra.fixed_price)})`,
                      )
                      .join(", ")}
                    {Object.values(watchedExtras || {}).filter((v) => v)
                      .length === 0 && "-"}
                  </div>
                ) : null}
                <p className="font-medium pt-2 mt-2 border-t border-gray-200">
                  Totale:&nbsp;
                  {(selectedService as ServiceI)?.currency || CurrencyEnum.EURO}
                  &nbsp;
                  {amountDisplay(
                    totalAmount +
                      (extraOptions?.length
                        ? (serviceCatalog?.extra ?? [])
                            .filter(
                              (extra) =>
                                Object.keys(watchedExtras || {}).includes(
                                  extra.id,
                                ) && (watchedExtras || {})[extra.id],
                            )
                            .map((extra) => extra.fixed_price)
                            .reduce((acc, price) => acc + price, 0)
                        : 0),
                  )}
                </p>
              </div>
            </div>
          </div>
        )}
        {vigilDetails && (
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
              role={RolesEnum.CONSUMER}
              full
              label={
                booking
                  ? "Aggiorna Prenotazione"
                  : "Conferma e vai al pagamento"
              }
              isLoading={isLoading}
            />
          </div>
        )}
      </form>
    </div>
  );
};

export default BookingFormComponent;
