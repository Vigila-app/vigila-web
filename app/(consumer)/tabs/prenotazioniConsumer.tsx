import { BookingCardComponent } from "@/components/bookings";
import { useBookingsStore } from "@/src/store/bookings/bookings.store";
import { useEffect } from "react";

const PrenotazioniConsumerTabs = () => {
  const { bookings, getBookings } = useBookingsStore();

  useEffect(() => {
    getBookings(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <h1 className="py-3 text-[18px] font-semibold">Le tue Prenotazioni</h1>
      <div className="">
        {bookings?.length ? (
          bookings.map((booking) => (
            <BookingCardComponent
              key={booking.id}
              bookingId={booking.id}
              context="profile"
            />
          ))
        ) : (
          <p>Nessuna prenotazione trovata</p>
        )}
      </div>
    </div>
  );
};

export default PrenotazioniConsumerTabs;
