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
    <div className="flex flex-col items-center justify-center w-full max-h-[480px] sm:max-h-full overflow-x-hidden ">
      <h1 className="py-3 text-[18px] text-start w-full font-semibold">Le tue Prenotazioni</h1>
      <div className="flex flex-col items-center gap-4 w-full overflow-y-scroll overflow-x-hidden ">
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
