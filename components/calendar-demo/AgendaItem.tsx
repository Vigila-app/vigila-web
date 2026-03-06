import React, { useState } from "react";
import Link from "next/link";
import { CalendarEventI } from "@/src/types/calendar.types";
import { BookingStatusEnum } from "@/src/enums/booking.enums";
import Badge from "@/components/badge/badge.component";
import { ChevronRightIcon, ClockIcon, TrashIcon } from "@heroicons/react/24/outline";
import { BookingUtils } from "@/src/utils/booking.utils";
import { CalendarService } from "@/src/services/calendar.service";

interface AgendaItemProps {
  event: CalendarEventI;
  selectedDate?: string;
  onDelete?: (id: string) => void;
  onBookingClick?: (bookingId: string) => void;
}

export const AgendaItem = ({ event, selectedDate, onDelete, onBookingClick }: AgendaItemProps) => {
  const isBooking = event.type === "booking";
  const isUnavailability = event.type === "unavailability";
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isDeleting) return;
    setIsDeleting(true);
    try {
      await CalendarService.deleteVigilUnavailability(event.id);
      onDelete?.(event.id);
    } catch (err) {
      console.error("Delete unavailability error:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  const dateObj = new Date(event.start || "");
  const dayName = dateObj
    .toLocaleDateString("it-IT", { weekday: "short" })
    .toUpperCase();
  const dayNumber = dateObj.getDate();

  const isHighlighted = selectedDate === event.start.split("T")[0];
  const startTime = event.start
    ? new Date(event.start).toLocaleTimeString("it-IT", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "--:--";
  const endTime = event.end
    ? new Date(event.end).toLocaleTimeString("it-IT", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "--:--";

  const status = event.status as BookingStatusEnum;
  const badgeConfig =
    isBooking && status
      ? {
          color: BookingUtils.getStatusColor(status),
          label: BookingUtils.getStatusText(status),
        }
      : null;

  const cardContent = (
    <div className="flex items-stretch gap-0 mb-4 bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
      {/* 1. BLOCCO DATA A SINISTRA */}
      <div
        className={`flex flex-col items-center justify-center min-w-16 py-3 transition-colors ${
          isUnavailability
            ? "bg-gray-300 text-gray-700"
            : isHighlighted
              ? isBooking && "bg-vigil-orange text-white"
              : isBooking && "bg-vigil-light-orange text-vigil-orange"
        } ${!isUnavailability && isBooking && "text-vigil-orange"}`}>
        <span className="text-xs font-bold opacity-80 uppercase leading-none mb-1">
          {dayName}
        </span>
        <span className="text-2xl font-black leading-none">{dayNumber}</span>
      </div>

      {/* 2. CONTENUTO DETTAGLIATO */}
      <div className="flex-1 p-4 flex flex-col justify-between">
        <div className="flex justify-between items-start mb-1">
          {/* Orario e Info Servizio */}
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-gray-400 text-xs font-semibold">
              <ClockIcon className="text-gray-400 w-3 h-3" />
              <span>
                {startTime} - {endTime}
              </span>
            </div>

            <h3 className="text-sm font-bold truncate md:max-w-2xl max-w-48 ">
              {event.title}
            </h3>

            <p className="text-sm text-gray-400 font-medium truncate md:max-w-2xl max-w-48">
              {event.description}
            </p>
          </div>
          <div className="flex flex-col justify-between items-end h-full">
            {isBooking && badgeConfig && (
              <Badge color={badgeConfig.color} label={badgeConfig.label} />
            )}

            {isUnavailability ? (
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex items-center justify-center text-xs font-bold gap-0.5 text-vigil-orange hover:opacity-70 transition-opacity disabled:opacity-40">
                {isDeleting ? "..." : "Elimina"}
                <TrashIcon className="w-4 h-4" />
              </button>
            ) : (
              <button className="flex items-center justify-center text-xs font-bold text-vigil-orange hover:opacity-70 transition-opacity">
                Dettagli <ChevronRightIcon className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  if (isBooking) {
    if (onBookingClick) {
      return (
        <button
          onClick={() => onBookingClick(event.id)}
          className="no-underline block w-full text-left">
          {cardContent}
        </button>
      );
    }
    return (
      <Link
        href={BookingUtils.getBookingDetailsUrl(event.id)}
        className="no-underline">
        {cardContent}
      </Link>
    );
  }

  return cardContent;
};
