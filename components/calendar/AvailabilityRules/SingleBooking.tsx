import React, { useCallback, useMemo } from "react";
import { BookingFormComponent } from "@/components/bookings";
import { BookingFormI } from "@/src/types/booking.types";
import { AddressI } from "@/src/types/maps.types";
import {
  ServiceCatalogTypeEnum,
  ServiceCatalogTypeLabels,
} from "@/src/enums/services.enums";

type SingleBookingProps = {
  answers?: Record<string, any>;
  setAnswers?: (
    updater:
      | Record<string, any>
      | ((prev: Record<string, any>) => Record<string, any>),
  ) => void;
  isLastStep?: boolean;
};

const toValidDate = (value: unknown) => {
  if (!value) return null;
  const d = new Date(String(value));
  if (isNaN(d.getTime())) return null;
  return d;
};

const toDateOnly = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate(),
  ).padStart(2, "0")}`;

const toTimeLocal = (date: Date) =>
  `${String(date.getHours()).padStart(2, "0")}:${String(
    date.getMinutes(),
  ).padStart(2, "0")}`;

const addHoursLocal = (date: Date, hours: number) => {
  const next = new Date(date);
  next.setHours(next.getHours() + hours);
  return next;
};

const toMinutes = (time: string) => {
  const [h, m] = time.split(":").map((v) => Number(v));
  return h * 60 + m;
};

const resolveAddressLabel = (address: any) => {
  if (!address) return "";
  if (typeof address === "string") return address;
  return (
    address.display_name ||
    address?.address?.road ||
    address?.address?.postcode ||
    ""
  );
};

const getAddressKey = (address: any) => {
  if (!address) return "";
  if (typeof address === "string") return address.trim();
  const nested = address.address || {};
  return [
    address.display_name,
    nested.display_name,
    address.postcode,
    address.postCode,
    nested.postcode,
    nested.postCode,
    address.road,
    nested.road,
    address.city,
    nested.city,
    address.town,
    nested.town,
  ]
    .filter(Boolean)
    .join("|");
};

const isSameAvailabilityRule = (
  rule: any,
  weekday: number,
  startTime: string,
  endTime: string,
  startDateStr: string,
  endDateStr: string,
) => {
  if (!rule) return false;
  return (
    rule.weekday === weekday &&
    rule.start_time === `${startTime}:00` &&
    rule.end_time === `${endTime}:00` &&
    rule.valid_from === startDateStr &&
    rule.valid_to === endDateStr
  );
};

export const SingleBooking = ({ answers, setAnswers }: SingleBookingProps) => {
  const addressAnswer = answers?.address;
  const startDateAnswer = answers?.["start-date"];
  const startDateDirect = answers?.startDate;
  const startDateFromDates = answers?.dates?.startDate;
  const catalogServiceType = answers?.service_type as
    | ServiceCatalogTypeEnum
    | undefined;
  const bookingPrefill = useMemo(
    () => ({
      // map onboarding question ids to booking fields used by BookingFormComponent
      address: resolveAddressLabel(addressAnswer),
      startDate: startDateDirect || startDateAnswer || startDateFromDates,
    }),
    [addressAnswer, startDateFromDates, startDateDirect, startDateAnswer],
  );

  const updateAnswersFromForm = useCallback(
    (
      form: Partial<BookingFormI> & {
        address_object?: AddressI | null;
        service_type?: ServiceCatalogTypeEnum;
      },
    ) => {
      if (!setAnswers) return;

      setAnswers((prev: Record<string, any>) => {
        let changed = false;
        let next: Record<string, any> = prev || {};
        const ensureNext = () => {
          if (!changed) {
            next = { ...(prev || {}) };
            changed = true;
          }
        };

        const addressObj =
          form?.address_object ||
          (typeof form?.address === "object"
            ? (form.address as AddressI)
            : null) ||
          (typeof next.address === "object"
            ? (next.address as AddressI)
            : null);
        const addressString =
          typeof form?.address === "string" ? form.address : "";
        const nextAddressKey = getAddressKey(addressObj || addressString);
        const prevAddressKey = getAddressKey(prev?.address);

        if (nextAddressKey && nextAddressKey !== prevAddressKey) {
          ensureNext();
          next.address = addressObj || addressString;
        }

        const startDateObj = toValidDate(form?.startDate);
        if (startDateObj) {
          const fallbackEnd = addHoursLocal(
            startDateObj,
            Math.max(1, Number(form?.quantity || 1)),
          );
          const endDateObj = toValidDate(form?.endDate) || fallbackEnd;

          const startDateStr = toDateOnly(startDateObj);
          const endDateStr = toDateOnly(endDateObj);
          const weekday = startDateObj.getDay();
          const startTime = toTimeLocal(startDateObj);
          const endTime = toTimeLocal(endDateObj);
          let safeEndTime = endTime;
          if (
            endDateStr !== startDateStr &&
            toMinutes(endTime) <= toMinutes(startTime)
          ) {
            safeEndTime = "24:00";
          }

          const nextStartValue = form?.startDate || startDateStr;
          if (prev?.["start-date"] !== startDateStr) {
            ensureNext();
            next["start-date"] = startDateStr;
          }
          if (String(prev?.startDate || "") !== String(nextStartValue || "")) {
            ensureNext();
            next.startDate = nextStartValue;
          }
          if (prev?.["end-date"] !== endDateStr) {
            ensureNext();
            next["end-date"] = endDateStr;
          }
          if (
            prev?.dates?.startDate !== startDateStr ||
            prev?.dates?.endDate !== endDateStr
          ) {
            ensureNext();
            next.dates = { startDate: startDateStr, endDate: endDateStr };
          }

          const prevRule = Array.isArray(prev?.availabilityRules)
            ? prev.availabilityRules[0]
            : null;
          if (
            !isSameAvailabilityRule(
              prevRule,
              weekday,
              startTime,
              safeEndTime,
              startDateStr,
              endDateStr,
            )
          ) {
            ensureNext();
            next.availabilityRules = [
              {
                id: `single-${weekday}-${startDateStr}`,
                created_at: startDateStr,
                updated_at: startDateStr,
                vigil_id: "",
                weekday,
                start_time: `${startTime}:00`,
                end_time: `${safeEndTime}:00`,
                valid_from: startDateStr,
                valid_to: endDateStr,
              },
            ];
          }

          const serviceType =
            (prev?.service_type as ServiceCatalogTypeEnum | undefined) ||
            form?.service_type ||
            (form as any)?.service?.type ||
            (form as any)?.serviceType;
          const serviceLabel = serviceType
            ? ServiceCatalogTypeLabels[serviceType as ServiceCatalogTypeEnum]
            : undefined;

          if (form?.service_id && form.service_id !== prev?.service_id) {
            ensureNext();
            next.service_id = form.service_id;
          }
          if (serviceType && serviceType !== prev?.service_type) {
            ensureNext();
            next.service_type = serviceType;
          }

          if (serviceLabel) {
            const prevDay = prev?.services?.[weekday];
            const prevCar = prevDay?.car ?? prev?.car ?? false;
            const prevNotes = prevDay?.notes ?? prev?.notes ?? "";
            if (
              prevDay?.services !== serviceLabel ||
              prevDay?.car !== prevCar ||
              prevDay?.notes !== prevNotes
            ) {
              ensureNext();
              next.services = {
                ...(prev?.services || {}),
                [weekday]: {
                  weekday,
                  services: serviceLabel,
                  car: prevCar,
                  notes: prevNotes,
                },
              };
            }
          }
        }

        if ((form as any)?.id) {
          const bookingId = (form as any).id as string;
          if (
            prev?.bookingId !== bookingId ||
            !Array.isArray(prev?.bookingIds) ||
            prev.bookingIds[0] !== bookingId
          ) {
            ensureNext();
            next.bookingId = bookingId;
            next.bookingIds = [bookingId];
          }
        }

        return changed ? next : prev;
      });
    },
    [setAnswers],
  );

  const handleOnSubmit = useCallback(
    (newBooking: any) => {
      updateAnswersFromForm(newBooking);
    },
    [updateAnswersFromForm],
  );

  return (
    <BookingFormComponent
      booking={bookingPrefill as any}
      catalogServiceType={catalogServiceType}
      onSubmit={handleOnSubmit}
      onFormChange={updateAnswersFromForm}
    />
  );
};
