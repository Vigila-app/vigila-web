import { RolesEnum } from "@/src/enums/roles.enums";
import { useUserStore } from "@/src/store/user/user.store";
import { BookingCardComponent } from "@/components/bookings";
import { useBookingsStore } from "@/src/store/bookings/bookings.store";
import { useServicesStore } from "@/src/store/services/services.store";

const PrenotazioniConsumerTabs = () => {
  const { bookings, getBookings, getBookingDetails } = useBookingsStore();
  const { services, getServiceDetails, getServices } = useServicesStore();
  const { user } = useUserStore();
 
  const role: RolesEnum = user?.user_metadata?.role as RolesEnum;

  return (
    <div>
      <h1 className="py-3 text-[18px] font-semibold">Le tue Prenotazioni</h1>
      <div className="">
        {bookings.map((booking) => (
          <BookingCardComponent
            key={booking.id}
            bookingId={booking.id}
            context="profile"
          />
        ))}
      </div>
    </div>
  );
};

export default PrenotazioniConsumerTabs;
