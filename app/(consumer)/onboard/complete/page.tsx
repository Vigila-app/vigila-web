"use client";

import Link from "next/link";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckIcon,
  FaceSmileIcon,
} from "@heroicons/react/24/outline";
import { ButtonLink, Logo } from "@/components";
import { Routes } from "@/src/routes";
import { Poppins } from "next/font/google";
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600"],
  style: ["normal", "italic"],
});
export default function VigilOnboardingCompletePage() {
  return (
    <section
      className={"min-h-[calc(100vh-4rem)] bg-gray-50 " + poppins.className}>
      <div className="mx-auto w-full max-w-screen-sm px-4 py-8">
        <div className="flex items-center justify-end">
          <Link
            href={Routes.home.url}
            //TODO renderizzamento prenotazione
            className="inline-flex items-center gap-2 text-sm font-medium text-vigil-orange">
            Vai alla home
            <ArrowRightIcon className="size-4" />
          </Link>
        </div>

        <div className="mt-8 rounded-3xl bg-white p-6 text-center shadow-lg">
          <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-green-100">
            <CheckIcon className="size-8 text-green-600" />
          </div>

          <h1 className="mt-6 text-2xl font-bold">REGISTRAZIONE COMPLETATA!</h1>

          <div className="mx-auto mt-4 inline-flex items-center gap-2 rounded-full bg-consumer-light-blue px-4 py-2 text-sm font-semibold text-consumer-blue">
            <FaceSmileIcon className="size-4" />
            Benvenuto/a nella famiglia di Vigila
          </div>

          <p className="mt-4 text-sm text-gray-600">
            Il tuo profilo è completo e pronto per la tua prima prenotazione.
          </p>

          <div className="mx-auto max-w-md mt-6 rounded-2xl bg-consumer-light-blue px-4 py-3 text-sm text-consumer-blue">
            <span className="font-semibold">Prossimo passo:</span> Crea la tua
            prima prenotazione scegliendo il vigil che fa al caso tuo!
          </div>

          <div className="mt-8 flex justify-center">
            <ButtonLink
              href={Routes.inizializationBooking.url}
              label="Inizia subito"
              primary={false}
              icon={<ArrowRightIcon className="size-4" />}
              iconPosition="right"
              customClass="!bg-gradient-to-r !from-vigil-orange !to-consumer-blue !text-white shadow-md hover:opacity-90"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
