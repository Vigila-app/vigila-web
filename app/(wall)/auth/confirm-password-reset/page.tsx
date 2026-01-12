"use client"

import { Routes } from "@/src/routes"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

export default function ConfirmPasswordResetPage() {
  const params = useSearchParams()
  return (
    <section className="py-16">
      <div className="mx-auto max-w-screen-md px-4 sm:px-6 lg:px-8">
        <div className="bg-pureWhite w-full mx-auto my-6 p-6 md:p-8 rounded-3xl shadow-lg text-center">
          <h2 className="text-2xl font-semibold mb-4">Conferma la tua email</h2>
          <p className="text-sm text-gray-600 mb-6">
            Ti abbiamo inviato una email all'indirizzo {params.get("email")}.
          </p>
          <p className="text-sm text-gray-600 mb-6">
            Clicca sul link contenuto nella mail per resettare la tua password.
          </p>
          <p>Verifica anche la tua cartella spam.</p>

          <p className="mt-16">
            Per assistenza contatta il nostro
            <br />
            <Link
              href={Routes.customerCare.url}
              className="underline text-consumer-blue"
            >
              {Routes.customerCare.label}
            </Link>
          </p>
        </div>
      </div>
    </section>
  )
}
