"use client";

import { useBookingsStore } from "@/src/store/bookings/bookings.store";
import { useUserStore } from "@/src/store/user/user.store";
import { useEffect } from "react";
import { Card } from "@/components";

const BookingCounterComponent = () => {
  const { bookings, getBookings } = useBookingsStore();

  const { user } = useUserStore();

  useEffect(() => {
    if (user?.id) {
      getBookings();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const confirmedBookings = bookings.filter((b) => b.status === "confirmed");
  const numeroPrenotazioniConfermate = confirmedBookings.length;

  const numeroPrenotazioni = bookings.length || 0;
  return (
    <div className="flex flex-col pb-8 gap-4 mt-8">
      <Card>
        <div className="flex gap-4 justify-start items-center">
          <span className="text-4xl text-consumer-blue font-semibold">
            {numeroPrenotazioniConfermate}
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
          </span>
          <span className="font-semibold text-sm ">Totale Prenotazioni</span>
        </div>
      </Card>
    </div>
  );
};
export default BookingCounterComponent;
