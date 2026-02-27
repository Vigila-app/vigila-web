"use client";

import { ButtonLink } from "@/components";
import {
  CalendarIcon,
  ChevronRightIcon,
  HeartIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { AgendaItem } from "@/components/calendar-demo/AgendaItem";
import Card from "@/components/card/card";
import { useEffect, useMemo, useState } from "react";
import BookingCounterComponent from "@/components/bookings/bookingCounter.component";
import { ServicesComponent } from "@/components/services";
import { Routes } from "@/src/routes";
import WalletBalanceCard from "@/components/wallet/walletBalanceCard";
import { EurConverter } from "@/src/utils/common.utils";
import { formatDateToISO } from "@/src/utils/calendar.utils";
import { useTransactionsStore } from "@/src/store/transactions/transactions.store";
import { useUserStore } from "@/src/store/user/user.store";
import { CalendarService } from "@/src/services/calendar.service";
import { CalendarEventI } from "@/src/types/calendar.types";

export default function HomeConsumer() {
  const { user } = useUserStore();
  const { balance: storeBalance, getTransactions } = useTransactionsStore();

  const [todayEvents, setTodayEvents] = useState<CalendarEventI[]>([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);

  const balance = useMemo(() => EurConverter(storeBalance), [storeBalance]);

  const todayISO = useMemo(() => formatDateToISO(new Date()), []);

  useEffect(() => {
    if (user?.id) {
      getTransactions(user.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  useEffect(() => {
    const fetchTodayEvents = async () => {
      try {
        setIsLoadingEvents(true);
        const today = new Date();
        const response = await CalendarService.getConsumerCalendar(today, today);
        setTodayEvents(response.bookings ?? []);
      } catch (err) {
        console.error("Error fetching today's calendar events:", err);
        setTodayEvents([]);
      } finally {
        setIsLoadingEvents(false);
      }
    };

    fetchTodayEvents();
  }, []);

  return (
    <div className="my-6 md:max-w-3xl mx-auto w-full px-4">
      <div className="text-2xl font-semibold mb-6 flex items-center justify-center gap-2 text-vigil-orange">
        <div className="bg-vigil-light-orange rounded-full p-2 flex items-center justify-center">
          <span className="h-6 w-6">
            <HeartIcon />
          </span>
        </div>
        <p>Benvenuto su Vigila!</p>
      </div>

      <section className="flex flex-col">
        <div className="flex items-center gap-1 mb-4">
          <MagnifyingGlassIcon className="w-6 h-6 text-vigil-orange" />
          <span className="text-lg font-semibold">
            Cerca il Vigil adatto a te
          </span>
        </div>
        <ServicesComponent />
      </section>

      <WalletBalanceCard
        balance={balance}
        url={
          balance === 0
            ? `${Routes.wallet.url}`
            : `${Routes.profileConsumer.url}?tab=wallet`
        }
        icon={false}
      />
      <BookingCounterComponent />

      <Card>
        <section className="bg-consumer-light-blue rounded-2xl mt-3 p-4 text-center space-y-3 border-consumer-blue border-2">
          <h2 className="text-xl font-bold text-consumer-blue">
            Stai riscontrando delle difficoltà?
          </h2>
          <p className="font-medium text-sm text-consumer-blue">
            Contatta il nostro servizio clienti, siamo qui per aiutarti!
          </p>
          <ButtonLink
            label="Contattaci subito"
            href={Routes.customerCare.url}
            className="bg-consumer-blue text-white font-bold py-2 px-4 rounded-lg w-full flex items-center justify-center"
          />
        </section>
      </Card>

      {/* Today's Agenda Section */}
      <section className="flex flex-col gap-4 mt-8">
        <div className="flex items-center justify-between font-semibold text-lg">
          <div className="inline-flex items-center gap-1">
            <CalendarIcon className="w-6 h-6 text-consumer-blue" />
            <span className="text-consumer-blue">Oggi</span>
            <span className="text-sm font-normal text-gray-400 ml-1">
              {new Date().toLocaleDateString("it-IT", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
            </span>
          </div>
          <Link
            href={`${Routes.profileConsumer.url}?tab=calendario`}
            className="text-vigil-orange flex items-center gap-0.5 text-sm font-semibold">
            Calendario
            <ChevronRightIcon className="size-4 text-vigil-orange" />
          </Link>
        </div>

        {isLoadingEvents ? (
          <div className="bg-gray-50 rounded-2xl p-6 text-center">
            <p className="text-gray-400 text-sm font-medium animate-pulse">
              Caricamento prenotazioni...
            </p>
          </div>
        ) : todayEvents.length > 0 ? (
          <div className="w-full flex flex-col">
            {todayEvents.map((event) => (
              <AgendaItem
                key={event.id}
                event={event}
                selectedDate={todayISO}
              />
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 rounded-2xl p-6 text-center">
            <p className="text-gray-400 text-sm font-medium">
              Nessuna prenotazione per oggi
            </p>
            <Link
              href={`${Routes.profileConsumer.url}?tab=calendario`}
              className="text-vigil-orange text-sm font-bold mt-2 inline-block hover:opacity-70 transition-opacity">
              Vedi tutte le prenotazioni →
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
