import { BookingCardComponent } from "@/components/bookings";
import { useBookingsStore } from "@/src/store/bookings/bookings.store";
import { useEffect } from "react";

export default function TabInattesa() {
  const { bookings, getBookings } = useBookingsStore();
  const pendingBookings = bookings.filter((b) => b.status === "pending");

  useEffect(() => {
    getBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <h1 className="py-3 text-[18px] font-semibold">Richieste in arrivo</h1>
      <div className="flex flex-col gap-4 items-center">
        {pendingBookings?.length ? (
          pendingBookings.map((booking) => (
            <BookingCardComponent key={booking.id} bookingId={booking.id} />
          ))
        ) : (
          <div className="text-center py-4 text-gray-500">
            Nessuna nuova richiesta in arrivo
          </div>
        )}
      </div>
    </div>
  );
}
