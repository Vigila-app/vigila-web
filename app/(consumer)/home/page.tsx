"use client";
import { useBookingsStore } from "@/src/store/bookings/bookings.store";
import { Button } from "@/components";
import {
  CalendarIcon,
  ChevronRightIcon,
  MagnifyingGlassCircleIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import {
  BookingCardComponent,
  BookingFormComponent,
} from "@/components/bookings";
import Card from "@/components/card/card";

import { BookingI } from "@/src/types/booking.types";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/src/store/app/app.store";
import { useEffect, useState } from "react";
import BookingCounterComponent from "@/components/bookings/bookingCounter.component";
import { ServicesComponent } from "@/components/services";
import { useServicesStore } from "@/src/store/services/services.store";
import { useVigilStore } from "@/src/store/vigil/vigil.store";

type BookingHomeComponentI = {
  bookingId: BookingI["id"];
  onUpdate?: (booking: BookingI) => void;
};

export default function HomeConsumer(props: BookingHomeComponentI) {
  const { bookingId, onUpdate = () => ({}) } = props;
  const router = useRouter();
  const {
    showToast,
    showLoader,
    hideLoader,
    loader: { isLoading },
  } = useAppStore();
  const { bookings, getBookings, getBookingDetails } = useBookingsStore();
  const { services } = useServicesStore();

  const { vigils, getVigilsDetails } = useVigilStore();
  const [loading, setLoading] = useState(false);
  const booking = bookings.find((b) => b.id === bookingId);
  const service = services.find((s)=> s.id === booking?.service_id);

  useEffect(() => {
    handleGetBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const handleGetBookings = async (force = false) => {
    setLoading(true);
    try {
      await getBookings(force);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="my-6 bg-gray-50">
      <section className="space-y-4 flex flex-col gap-4 m-4">
        <div className="flex items-center gap-1">
          <MagnifyingGlassIcon className="w-6 h-6 text-vigil-orange" />
          <span className="text-lg font-semibold">
            Cerca vigil e servizi nella tua zona
          </span>
        </div>
        <Card>
          <div className="px-4">
            <ServicesComponent />
          </div>
        </Card>
      </section>
      <BookingCounterComponent />
      <Card>
        <section className="bg-consumer-light-blue rounded-2xl p-4 text-center space-y-3 border-consumer-blue border-2">
          <h2 className="text-xl font-bold text-consumer-blue">
            Hai bisogno di aiuto?
          </h2>
          <p className="font-medium text-sm text-consumer-blue">
            Trova il Vigil perfetto per le tue esigenze in pochi click
          </p>
          <Button
            label="Cerca un vigil "
            className="bg-consumer-blue  text-white font-bold py-2 px-4 rounded-lg w-full flex items-center justify-center">
            {/* <Search className="w-4 h-4 mr-2" /> Cerca un Vigil */}
          </Button>
        </section>
      </Card>

   
      <section className="space-y-4 flex flex-col gap-4">
        <div className="flex items-center justify-between  font-semibold text-lg px-4">
          <div className="flex items-center gap-1 ">
            <CalendarIcon className="w-6 h-6 text-consumer-blue" /> Prossime
            Prenotazioni
          </div>

          <Link
            href="/user/profile" //aggiungere un href funzionante per le tabs
            className="text-primary-red flex items-center text-sm">
            <ChevronRightIcon className="w-4 h-4 text-vigil-orange" />
          </Link>
        </div>

        <div className="px-4">
          {bookings.map((booking) => (
            <BookingCardComponent key={booking.id} bookingId={booking.id} />
          ))}
        </div>
      </section>
    </div>
  );
}
