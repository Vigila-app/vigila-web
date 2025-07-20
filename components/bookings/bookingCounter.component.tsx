"use client";

import { useBookingsStore } from "@/src/store/bookings/bookings.store";

import { useUserStore } from "@/src/store/user/user.store";

import { useEffect } from "react";

import Card from "../card/card";

const BookingCounterComponent = () => {
  const { bookings, getBookings} = useBookingsStore();

  const { user } = useUserStore();

  useEffect(() => {
    if (user?.id) {
      getBookings();
    }
  }, [user]);

  const confirmedBookings = bookings.filter((b) => b.status === "confirmed");
  const numeroPrenotazioniConfermate = confirmedBookings.length;

  const numeroPrenotazioni = bookings.length || 0;
  return (
    <div className="flex flex-col p-4">
      <Card>
        <div className="flex gap-4 justify-center items-center">
          <span className="text-4xl text-consumer-blue font-semibold_">
            {numeroPrenotazioniConfermate}
          </span>
          <span className="font-semibold text-sm ">
            Prenotazioni Confermate{" "}
          </span>
        </div>
      </Card>
      <Card>
        <div className="flex gap-4 justify-center items-center">
          <span className="text-4xl text-vigil-orange font-semibold_">
            {numeroPrenotazioni}
          </span>
          <span className="font-semibold text-sm ">Totale Prenotazioni </span>
        </div>
      </Card>
    </div>
  );
};
export default BookingCounterComponent;
