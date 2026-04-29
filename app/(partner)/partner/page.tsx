import Link from "next/link";
import Image from "next/image";
import {
  DocumentTextIcon,
  BuildingOffice2Icon,
} from "@heroicons/react/24/outline";
import PartnerFooter from "@/components/partner/PartnerFooter";
import { Routes } from "@/src/routes";

export const metadata = {
  title: Routes.partner.title,
  description:
    "Unisciti a Vigila con la partnership più adatta alla tua organizzazione. CAF, patronati, cliniche e centri diagnostici.",
};

export default function PartnerPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Navbar minimale */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 md:px-6">
          <Link href="/" className="shrink-0">
            <Image
              src="/assets/logo.png"
              alt="Vigila"
              width={88}
              height={26}
              priority
            />
          </Link>
          <nav className="flex items-center gap-4 md:gap-6">
            <Link
              href={Routes.registrationConsumer.url}
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              Per le famiglie
            </Link>
            <Link
              href={Routes.registrationVigil.url}
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              Per i caregiver
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1">
        <section className="py-16 md:py-24 px-4 text-center bg-gradient-to-b from-gray-50 to-white">
          <div className="mx-auto max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Diventa partner Vigila
            </h1>
            <p className="mt-4 text-lg md:text-xl text-gray-600 max-w-xl mx-auto">
              Scegli il tipo di partnership più adatto alla tua organizzazione.
            </p>
          </div>
        </section>

        {/* Due card */}
        <section className="px-4 pb-20">
          <div className="mx-auto max-w-4xl grid md:grid-cols-2 gap-6">
            {/* Card CAF */}
            <div className="rounded-2xl border border-gray-200 bg-white shadow-md p-8 flex flex-col gap-5 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-consumer-light-blue flex items-center justify-center text-consumer-blue">
                <DocumentTextIcon className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  CAF, Patronati e Associazioni
                </h2>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Gestisci contratti, buste paga e pratiche per le famiglie che
                  trovano un caregiver su Vigila. Nuovi clienti senza fare
                  acquisizione.
                </p>
              </div>
              <Link
                href="/partner/caf"
                className="mt-auto inline-flex items-center justify-center rounded-full bg-consumer-blue px-6 py-3 text-sm font-semibold text-white shadow hover:bg-consumer-blue/90 transition"
              >
                Scopri la partnership →
              </Link>
            </div>

            {/* Card Cliniche */}
            <div className="rounded-2xl border border-gray-200 bg-white shadow-md p-8 flex flex-col gap-5 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-vigil-light-orange flex items-center justify-center text-vigil-orange">
                <BuildingOffice2Icon className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  Cliniche e Centri Diagnostici
                </h2>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Prenota caregiver per i tuoi pazienti, segnala chi ha bisogno
                  di assistenza a domicilio e guadagna una commissione per ogni
                  famiglia che attivi.
                </p>
              </div>
              <Link
                href="/partner/cliniche"
                className="mt-auto inline-flex items-center justify-center rounded-full bg-vigil-orange px-6 py-3 text-sm font-semibold text-white shadow hover:bg-vigil-orange/90 transition"
              >
                Scopri la partnership →
              </Link>
            </div>
          </div>
        </section>
      </main>

      <PartnerFooter />
    </div>
  );
}
