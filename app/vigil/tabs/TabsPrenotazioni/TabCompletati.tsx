import { BookingCardComponent } from "@/components/bookings";
import { useBookingsStore } from "@/src/store/bookings/bookings.store";
import { useEffect } from "react";

export default function TabCompletati() {
  const { bookings, getBookings } = useBookingsStore();
  const completedBookings = bookings.filter((b) => b.status === "completed");

  useEffect(() => {
    getBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="w-full">
      <h1 className="py-3 text-[18px] font-semibold">
        Prenotazioni completate
      </h1>
      <div className="px-4 flex flex-col gap-4 items-center">
        {completedBookings?.length ? (
          completedBookings.map((booking) => (
            <BookingCardComponent key={booking.id} bookingId={booking.id} />
          ))
        ) : (
          <div className="text-center py-4 text-gray-500">
            Nessuna prenotazione completata
          </div>
        )}
      </div>
    </div>
  );
}
