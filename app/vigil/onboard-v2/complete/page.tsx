"use client";

import Link from "next/link";
import { ArrowLeftIcon, CheckIcon, FaceSmileIcon } from "@heroicons/react/24/outline";
import { ButtonLink, Logo } from "@/components";
import { Routes } from "@/src/routes";
import { Poppins } from "next/font/google"
import clsx from "clsx";
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600"],
  style: ["normal", "italic"],
})
export default function VigilOnboardingCompletePage() {
  return (
    <section
      className={clsx("min-h-[calc(100vh-4rem)] bg-gray-50", poppins.className)}
    >
      <div className="mx-auto w-full max-w-screen-sm px-4 py-8">
        <div className="flex items-center justify-between">
          <Logo size="small" />
          <Link
            href={Routes.profileVigil.url}
            className="inline-flex items-center gap-2 text-sm font-medium text-vigil-orange"
          >
            <ArrowLeftIcon className="size-4" />
            Torna alla home
          </Link>
        </div>

        <div className="mt-8 rounded-3xl bg-white p-6 text-center shadow-lg">
          <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-green-100">
            <CheckIcon className="size-8 text-green-600" />
          </div>

          <h1 className="mt-6 text-2xl font-bold text-gray-900">
            REGISTRAZIONE COMPLETATA!
          </h1>

          <div className="mx-auto mt-4 inline-flex items-center gap-2 rounded-full bg-sky-100 px-4 py-2 text-sm font-semibold text-consumer-blue">
            <FaceSmileIcon className="size-4" />
            Benvenuto/a tra i Vigili!
          </div>

          <p className="mt-4 text-sm text-gray-600">
            Il tuo profilo è completo e pronto per essere visto dalle famiglie.
          </p>

          <div className="mx-auto mt-6 rounded-2xl bg-sky-100 px-4 py-3 text-sm text-consumer-blue">
            <span className="font-semibold">Prossimo passo:</span> Verifica i
            tuoi documenti per iniziare a ricevere richieste di assistenza.
          </div>

          <div className="mt-8 flex justify-center">
            <ButtonLink
              href={Routes.profileVigil.url}
              label="Inizia subito"
              primary={false}
              customClass="!rounded-full !border-0 !bg-gradient-to-r !from-[#E94E34] !to-[#009EDA] !px-8 !py-3 !text-white shadow-md hover:opacity-90"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
