"use client";

import { useEffect, useState } from "react";
import { useBookingsStore } from "@/src/store/bookings/bookings.store";
import { BookingI } from "@/src/types/booking.types";
import { Table, TableColsI, Button, Badge, LastUpdate } from "@/components";
import { useModalStore } from "@/src/store/modal/modal.store";
import { BookingStatusEnum } from "@/src/enums/booking.enums";
import { amountDisplay, capitalize } from "@/src/utils/common.utils";
import { dateDisplay } from "@/src/utils/date.utils";
import { useUserStore } from "@/src/store/user/user.store";
import { RolesEnum } from "@/src/enums/roles.enums";

const BookingListComponent = () => {
  const { bookings, getBookings, lastUpdate } = useBookingsStore();
  const { openModal } = useModalStore();
  const { user } = useUserStore();
  const [loading, setLoading] = useState(false);

  const isConsumer = user?.user_metadata?.role === RolesEnum.CONSUMER;
  const isVigil = user?.user_metadata?.role === RolesEnum.VIGIL;

  useEffect(() => {
    handleGetBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    service_name: booking.service?.name || "Unknown Service",
    service_date: dateDisplay(booking.service_date, "date"),
    service_dateValue: new Date(booking.service_date).getTime(),
    duration_hours: `${booking.duration_hours}h`,
    duration_hoursValue: booking.duration_hours,
    total_amount: `${booking.currency} ${amountDisplay(booking.total_amount)}`,
    total_amountValue: booking.total_amount,
    status: (
      <Badge
        label={capitalize(booking.status)}
        color={getStatusColor(booking.status)}
      />
    ),
    statusValue: booking.status,
    vigil_name: booking.vigil?.user_metadata?.displayName || "Unknown",
    consumer_name: booking.consumer?.user_metadata?.displayName || "Unknown",
    actions: (
      <div className="flex gap-2">
        <Button
          text
          label="View"
          action={() => openModal("booking-details", { bookingId: booking.id })}
        />
        {booking.status === BookingStatusEnum.PENDING && isConsumer && (
          <Button
            text
            label="Edit"
            action={() => openModal("booking-form", { booking })}
          />
        )}
      </div>
    ),
  }));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Bookings</h2>
          <p className="text-gray-600">
            {isConsumer ? "Your bookings" : "Bookings for your services"}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <LastUpdate
            lastUpdate={lastUpdate || new Date()}
            onUpdate={() => handleGetBookings(true)}
          />
          {isConsumer && (
            <Button
              primary
              label="New Booking"
              action={() => openModal("booking-form", { vigilId: "b21de488-b143-443d-920f-a8668d895162" })}
            />
          )}
        </div>
      </div>

      {loading && !bookings.length ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Loading bookings...</p>
        </div>
      ) : (
        <Table cols={cols} rows={rows} />
      )}
    </div>
  );
};

export default BookingListComponent;