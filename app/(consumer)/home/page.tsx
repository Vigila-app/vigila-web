"use client";
import { useBookingsStore } from "@/src/store/bookings/bookings.store";
import { Avatar, Button } from "@/components";
import { CalendarIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import {
  BookingCardComponent,
  BookingDetailsComponent,
  BookingListComponent,
} from "@/components/bookings";
import Card from "@/components/card/card";
import { useServicesStore } from "@/src/store/services/services.store";
import { useUserStore } from "@/src/store/user/user.store";
import { useConsumerStore } from "@/src/store/consumer/consumer.store";
import { useVigilStore } from "@/src/store/vigil/vigil.store";
import { RolesEnum } from "@/src/enums/roles.enums";
import { BookingI } from "@/src/types/booking.types";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/src/store/app/app.store";
import { useEffect, useState } from "react";

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
  const { consumers, getConsumersDetails } = useConsumerStore();
  const { vigils, getVigilsDetails } = useVigilStore();
  const { services, getServiceDetails } = useServicesStore();
  const { user } = useUserStore();
  const booking = bookings.find((b) => b.id === bookingId);
  const service = services.find((s) => s.id === booking?.service_id);
  const vigil = vigils.find((v) => v.id === booking?.vigil_id);
  const consumer = consumers.find((c) => c.id === booking?.consumer_id);

  const isConsumer = user?.user_metadata?.role === RolesEnum.CONSUMER;
  const isVigil = user?.user_metadata?.role === RolesEnum.VIGIL;
  const [loading, setLoading] = useState(false);

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
    <div className="space-y-6">
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

      {/* Upcoming Bookings */}
      <section className="space-y-4 flex flex-col gap-4">
        <div className="flex items-center justify-between text-dark-gray-text font-semibold text-lg px-4">
          <div className="flex items-center ">
            <CalendarIcon className="w-6 h-6 text-consumer-blue" /> Prossime
            Prenotazioni
          </div>

          <Link
            href="/my-bookings"
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

      {/* Search Vigil in your area */}
      <section className="space-y-4">
        <div className="flex items-center text-dark-gray-text font-semibold text-lg">
          {/* <Search className="w-5 h-5 mr-2 text-primary-red" /> Cerca Vigil nella
          tua zona */}
        </div>
        <div className="space-y-3">
          {/* <Input
            placeholder="Inserisci CAP"
            className="rounded-lg border-primary-red focus:border-primary-red focus:ring-primary-red"
            icon={<MapPin className="w-4 h-4 text-primary-red" />}
          /> */}
          <div className="flex gap-2">
            {/* <Select>
              <SelectTrigger className="flex-1 rounded-lg border-primary-red focus:border-primary-red focus:ring-primary-red">
                <SelectValue placeholder="Tutti i servizi" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tutti i servizi</SelectItem>
                <SelectItem value="companionship">
                  Compagnia e conversazione
                </SelectItem>
                <SelectItem value="medical">Accompagnamento medico</SelectItem>
              </SelectContent>
            </Select> */}
            {/* <Button
              variant="outline"
              className="rounded-lg border-primary-red text-primary-red bg-transparent">
             
            </Button> */}
          </div>
        </div>
      </section>
    </div>
  );
}
