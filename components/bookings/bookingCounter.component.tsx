"use client";

import { useBookingsStore } from "@/src/store/bookings/bookings.store";
import { useUserStore } from "@/src/store/user/user.store";
import { useEffect } from "react";
import { Card } from "@/components";

const BookingCounterComponent = () => {
  const { bookings, totalCount, getBookings } = useBookingsStore();

  const { user } = useUserStore();

  useEffect(() => {
    if (user?.id) {
      getBookings();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const confirmedBookings = bookings.filter((b) => b.status === "confirmed");
  const numeroPrenotazioniConfermate = Math.min(confirmedBookings.length, 99);
  const mostraPlus = confirmedBookings.length >= 99;

  const numeroPrenotazioni = Math.min(totalCount, 99);
  const mostraPlusTotal = totalCount >= 99;

  return (
    <div className="flex flex-col pb-8 gap-4 mt-8">
      <Card>
        <div className="flex gap-4 justify-start items-center">
          <span className="text-4xl text-consumer-blue font-semibold">
            {numeroPrenotazioniConfermate}
            {mostraPlus && <span className="text-2xl">+</span>}
          </span>
          <span className="font-semibold  text-sm ">
            Prenotazioni Confermate
          </span>
        </div>
      </Card>
      <Card>
        <div className="flex gap-4 justify-start items-center">
          <span className="text-4xl text-vigil-orange font-semibold">
            {numeroPrenotazioni}
            {mostraPlusTotal && <span className="text-2xl">+</span>}
          </span>
          <span className="font-semibold text-sm ">Totale Prenotazioni</span>
        </div>
      </Card>
    </div>
  );
};
export default BookingCounterComponent;
