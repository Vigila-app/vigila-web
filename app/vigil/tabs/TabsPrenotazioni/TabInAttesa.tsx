import { BookingCardComponent } from "@/components/bookings";
import { useBookingsStore } from "@/src/store/bookings/bookings.store";

export default function TabInattesa() {
  const { bookings } = useBookingsStore();
  const pendingBookings = bookings.filter((b) => b.status === "pending");

  return (
    <div>
      <h1 className="py-3 text-[18px] font-semibold">Richieste in arrivo</h1>
      <div className="px-4">
        {pendingBookings.map((booking) => (
          <BookingCardComponent key={booking.id} bookingId={booking.id} />
        ))}
      </div>
    </div>
  );
}
