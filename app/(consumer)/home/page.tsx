"use client";

import { useBookingsStore } from "@/src/store/bookings/bookings.store";
import { Button, ButtonLink } from "@/components";
import {
  CalendarIcon,
  ChevronRightIcon,
  HeartIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { BookingCardComponent } from "@/components/bookings";
import Card from "@/components/card/card";
import { useEffect } from "react";
import BookingCounterComponent from "@/components/bookings/bookingCounter.component";
import { ServicesComponent } from "@/components/services";
import { Routes } from "@/src/routes";

export default function HomeConsumer() {
  const { bookings, getBookings } = useBookingsStore();

  const handleGetBookings = async (force = false) => {
    getBookings(force);
  };

  useEffect(() => {
    handleGetBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="my-6 md:max-w-3xl mx-auto w-full px-4">
      <div className="text-2xl font-semibold mb-6 flex items-center justify-center gap-2 text-vigil-orange">
        <div className=" bg-vigil-light-orange rounded-full p-2 flex items-center justify-center">
          <span className="h-6 w-6 ">
            <HeartIcon />
          </span>
        </div>
        <p>Benvenuto su Vigila!</p>
      </div>
      <section className=" flex flex-col ">
        <div className="flex items-center gap-1 mb-4">
          <MagnifyingGlassIcon className="w-6 h-6 text-vigil-orange" />
          <span className="text-lg font-semibold ">
            Cerca il Vigil adatto a te
          </span>
        </div>
        <ServicesComponent />
      </section>
      <BookingCounterComponent />
      <Card>
        <section className="bg-consumer-light-blue rounded-2xl p-4 text-center space-y-3 border-consumer-blue border-2">
          <h2 className="text-xl font-bold text-consumer-blue">
            Stai riscontrando delle difficoltà?
          </h2>
          <p className="font-medium text-sm text-consumer-blue">
            Contatta il nostro servizio clienti, siamo qui per aiutarti!
          </p>
          <ButtonLink
            label="Contattaci subito"
            href={Routes.customerCare.url}
            className="bg-consumer-blue  text-white font-bold py-2 px-4 rounded-lg w-full flex items-center justify-center"></ButtonLink>
        </section>
      </Card>

      {bookings?.length > 0 && (
        <section className="flex flex-col gap-4 mt-8 ">
          <div className="flex items-center justify-between  font-semibold text-lg ">
            <div className="inline-flex items-center gap-1 ">
              <CalendarIcon className="w-6 h-6 text-consumer-blue" />
              <span className="text-consumer-blue">Prossime Prenotazioni</span>
            </div>

            <Link
              href={`${Routes.profileConsumer.url}`}
              className="text-primary-red flex items-center text-sm">
              <ChevronRightIcon className="size-4 text-vigil-orange" />
            </Link>
          </div>

          {bookings?.length ? (
            <div className=" w-full flex flex-col gap-4 justify-center">
              {bookings.map((booking) => (
                <BookingCardComponent key={booking.id} bookingId={booking.id} />
              ))}
            </div>
          ) : null}
        </section>
      )}
    </div>
  );
}
