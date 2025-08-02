import { BookingCardComponent } from "@/components/bookings";
import { useBookingsStore } from "@/src/store/bookings/bookings.store";

export default function TabConfirmed() {
  const { bookings, getBookings, getBookingDetails } = useBookingsStore();
  const confirmedBookings = bookings.filter((b) => b.status === "confirmed");

  return (
    <div>
      <h1 className="py-3 text-[18px] font-semibold">Prenotazini accettate</h1>
      <div className="px-4">
        {confirmedBookings.map((booking) => (
          <BookingCardComponent key={booking.id} bookingId={booking.id} />
        ))}
      </div>
    </div>
  );
}
