"use client";

import { useEffect, useState } from "react";
import { useBookingsStore } from "@/src/store/bookings/bookings.store";
import { BookingI } from "@/src/types/booking.types";
import { Button, Badge, LastUpdate, Table } from "@/components";
import { ReviewButtonComponent } from "@/components/reviews";
import { TableColsI } from "@/components/table/table.components";
import { useModalStore } from "@/src/store/modal/modal.store";
import {
  BookingStatusEnum,
  PaymentStatusEnum,
} from "@/src/enums/booking.enums";
import { amountDisplay, capitalize } from "@/src/utils/common.utils";
import { dateDisplay } from "@/src/utils/date.utils";
import { useUserStore } from "@/src/store/user/user.store";
import { RolesEnum } from "@/src/enums/roles.enums";
import { Routes } from "@/src/routes";
import { useRouter } from "next/navigation";
import { useConsumerStore } from "@/src/store/consumer/consumer.store";
import { useVigilStore } from "@/src/store/vigil/vigil.store";
import { useServicesStore } from "@/src/store/services/services.store";

const BookingListComponent = () => {
  const router = useRouter();
  const { bookings, getBookings, lastUpdate } = useBookingsStore();
  const { consumers, getConsumersDetails } = useConsumerStore();
  const { vigils, getVigilsDetails } = useVigilStore();
  const { services, getServiceDetails } = useServicesStore();
  const { openModal } = useModalStore();
  const { user } = useUserStore();
  const [loading, setLoading] = useState(false);

  const isConsumer = user?.user_metadata?.role === RolesEnum.CONSUMER;
  const isVigil = user?.user_metadata?.role === RolesEnum.VIGIL;

  useEffect(() => {
    handleGetBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (bookings?.length) {
      if (user?.user_metadata?.role === RolesEnum.VIGIL) {
        const uniqueConsumerIds = Array.from(
          new Set(bookings.map((b) => b.consumer_id))
        );
        getConsumersDetails(uniqueConsumerIds);
      }

      if (user?.user_metadata?.role === RolesEnum.CONSUMER) {
        const uniqueVigilIds = Array.from(
          new Set(bookings.map((b) => b.vigil_id))
        );
        getVigilsDetails(uniqueVigilIds);
      }

      Array.from(new Set(bookings.map((b) => b.service_id))).forEach(
        (serviceId) => getServiceDetails(serviceId)
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookings]);

  const getService = (serviceId: string) =>
    services.find((s) => s.id === serviceId);
  const getConsumer = (consumerId: string) =>
    user?.user_metadata?.role === RolesEnum.CONSUMER
      ? user.user_metadata
      : consumers.find((c) => c.id === consumerId);
  const getVigil = (vigilId: string) =>
    user?.user_metadata?.role === RolesEnum.VIGIL
      ? user.user_metadata
      : vigils.find((v) => v.id === vigilId);

  const handleGetBookings = async (force = false) => {
    setLoading(true);
    try {
      await getBookings(force);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: BookingStatusEnum) => {
    switch (status) {
      case BookingStatusEnum.PENDING:
        return "yellow";
      case BookingStatusEnum.CONFIRMED:
        return "blue";
      case BookingStatusEnum.IN_PROGRESS:
        return "purple";
      case BookingStatusEnum.COMPLETED:
        return "green";
      case BookingStatusEnum.CANCELLED:
      case BookingStatusEnum.REFUNDED:
        return "red";
      default:
        return "gray";
    }
  };

  const cols: TableColsI[] = [
    {
      field: "service_name",
      label: "Service",
      sortable: true,
      size: "lg",
    },
    {
      field: "service_date",
      label: "Date",
      sortable: true,
      size: "md",
    },
    {
      field: "duration_hours",
      label: "Duration",
      sortable: true,
      size: "sm",
    },
    {
      field: "total_amount",
      label: "Amount",
      sortable: true,
      size: "sm",
    },
    {
      field: "status",
      label: "Status",
      sortable: true,
      size: "sm",
    },
    ...(isConsumer
      ? [
          {
            field: "vigil_name",
            label: "Vigil",
            sortable: true,
            size: "md" as const,
          },
        ]
      : []),
    ...(isVigil
      ? [
          {
            field: "consumer_name",
            label: "Consumer",
            sortable: true,
            size: "md" as const,
          },
        ]
      : []),
    {
      field: "actions",
      label: "Actions",
      sortable: false,
      size: "sm",
    },
  ];

  const rows = bookings.map((booking: BookingI) => ({
    id: booking.id,
    service_name: getService(booking.service_id)?.name || "Unknown Service",
    service_date: dateDisplay(booking.startDate, "date"),
    service_dateValue: new Date(booking.startDate).getTime(),
    duration_hours: booking.quantity,
    duration_hoursValue: booking.quantity,
    total_amount: `${getService(booking.service_id)?.currency} ${amountDisplay(
      booking.price
    )}`,
    total_amountValue: booking.price,
    status: (
      <Badge
        label={capitalize(booking.status as string)}
        color={getStatusColor(booking.status as BookingStatusEnum)}
      />
    ),
    statusValue: booking.status,
    vigil_name: getVigil(booking.vigil_id)?.displayName || "Unknown",
    consumer_name: getConsumer(booking.consumer_id)?.displayName || "Unknown",
    actions: (
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <Button
            text
            label="Dettagli"
            action={() =>
              openModal("booking-details", { bookingId: booking.id })
            }
          />
          {booking.payment_status === PaymentStatusEnum.PENDING &&
            isConsumer && (
              <Button
                text
                label="Paga ora"
                action={() =>
                  router.push(
                    `${Routes.paymentBooking.url}?bookingId=${booking.id}`
                  )
                }
              />
            )}
          {booking.status === BookingStatusEnum.PENDING && isConsumer && (
            <Button
              text
              label="Edit"
              action={() => openModal("booking-form", { booking })}
            />
          )}
        </div>
        {/* Review button for completed bookings */}
        {booking.status === BookingStatusEnum.COMPLETED && isConsumer && (
          <ReviewButtonComponent
            booking={booking}
            vigilName={getVigil(booking.vigil_id)?.displayName}
            onReviewCreated={() => handleGetBookings(true)}
          />
        )}
      </div>
    ),
  }));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Prenotazioni</h2>
          <p className="text-gray-600">
            {isConsumer ? "Le tue prenotazioni" : "Prenotazioni ricevute"}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <LastUpdate
            lastUpdate={lastUpdate || new Date()}
            onUpdate={() => handleGetBookings(true)}
          />
        </div>
      </div>

      {loading && !bookings.length ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Recupero le prenotazioni...</p>
        </div>
      ) : (
        <Table cols={cols} rows={rows} />
      )}
    </div>
  );
};

export default BookingListComponent;
