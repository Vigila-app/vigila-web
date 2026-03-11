"use client"

import { useRouter } from "next/navigation"
import { Routes } from "@/src/routes"
import AvailabilityFlow from "@/components/calendar/AvailabilityRules/AvailabilityFlow"
// Se hai icone specifiche importale, altrimenti le ho lasciate opzionali nel tipo



const FirstBookingSelection = () => {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-8">
      <AvailabilityFlow
        onComplete={() => router.push(Routes.matchingLoading.url)}
      />
    </div>
  )
}

export default FirstBookingSelection
