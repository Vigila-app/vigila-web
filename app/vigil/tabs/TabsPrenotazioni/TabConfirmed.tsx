import { BookingCardComponent } from "@/components/bookings";
import { useBookingsStore } from "@/src/store/bookings/bookings.store";
import { useEffect } from "react";

export default function TabConfirmed() {
  const { bookings, getBookings } = useBookingsStore();
  const confirmedBookings = bookings.filter((b) => b.status === "confirmed");

  useEffect(() => {
    getBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="w-full">
      <h1 className="py-3 text-[18px] font-semibold">Prenotazioni accettate</h1>
      <div className=" flex flex-col gap-4 items-center">
        {confirmedBookings?.length ? (
          confirmedBookings.map((booking) => (
            <BookingCardComponent key={booking.id} bookingId={booking.id} />
          ))
        ) : (
          <div className="text-center py-4 text-gray-500">
            Nessuna prenotazione accettata
          </div>
        )}
      </div>
    </div>
  );
}
