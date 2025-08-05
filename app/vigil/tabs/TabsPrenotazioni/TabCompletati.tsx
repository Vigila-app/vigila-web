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
    <div>
      <h1 className="py-3 text-[18px] font-semibold">
        Prenotazioni completate
      </h1>
      <div className="px-4">
        {completedBookings.map((booking) => (
          <BookingCardComponent key={booking.id} bookingId={booking.id} />
        ))}
      </div>
    </div>
  );
}
