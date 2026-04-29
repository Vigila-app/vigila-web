"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Routes } from "@/src/routes";
import {
  BookingsService,
  PaymentService,
  UserService,
  ServicesService,
} from "@/src/services";
import { BookingI } from "@/src/types/booking.types";
import { CheckCircleIcon, StarIcon } from "@heroicons/react/24/solid";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { CheckoutForm } from "@/components/checkout";
import { Avatar } from "@/components";
import { dateDisplay } from "@/src/utils/date.utils";

const dayNames = [
  "Domenica",
  "Lunedì",
  "Martedì",
  "Mercoledì",
  "Giovedì",
  "Venerdì",
  "Sabato",
];

export default function MatchingSuccessPage() {
  const router = useRouter();
  const [answers, setAnswers] = useState<any>(null);
  const [response, setResponse] = useState<any>(null);
  const [clientSecret, setClientSecret] = useState<string>("");
  const [bookingIds, setBookingIds] = useState<string[]>([]);
  const [error, setError] = useState<string>("");

  const handlePaymentSuccess = async (_paymentIntentId: string) => {
    // payment_status is updated exclusively by the Stripe webhook.
    // booking status = CONFIRMED happens only when the vigil accepts.
    router.push(
      `${Routes.matchingTrialConfirmed?.url || "/matching/trial-confirmed"}?bookingIds=${bookingIds.join(",")}`,
    );
  };

  const handleConfirm = async () => {
    setError("");
    try {
      // gather slots
      const vigilSlots = response?.data?.[0];
      const slotDetails = Array.isArray(vigilSlots?.compatibleSlotDetails)
        ? vigilSlots.compatibleSlotDetails
        : [];

      const user = await UserService.getUser();
      if (!user?.id) throw new Error("User not authenticated");

      const createdBookings: BookingI[] = [];

      const totalPrice = vigilSlots?.totalPrice || 0;

      // fetch services for this vigil to resolve a concrete service_id per slot
      let vigilServices: any[] = [];
      try {
        vigilServices = await ServicesService.getServices(vigilSlots.id);
      } catch (e) {
        console.warn("Could not fetch vigil services", e);
      }

      for (const slot of slotDetails) {
        const startIso = `${slot.date}T${slot.startTime}:00Z`;
        const endIso = `${slot.date}T${slot.endTime}:00Z`;
        // try to find a service offered by this vigil matching the slot service type
        const serviceMatch = (vigilServices || []).find(
          (s: any) => s.type === slot.service,
        );

        // minimal payload expected by POST /api/v1/bookings
        const bookingPayload: any = {
          service_id: serviceMatch?.id,
          startDate: startIso,
          endDate: endIso,
          quantity: 1,
          // address is required by the DB schema — include consumer-provided address
          address:
            answers?.matchingRequest?.address?.address ||
            answers?.matchingRequest?.address?.formatted ||
            "",
          // extras: array of extra ids (empty if none)
          extras: [],
        };

        if (!bookingPayload.service_id) {
          console.warn("No service_id found for slot, skipping booking", slot);
          continue;
        }

        try {
          const created = await BookingsService.createBooking(bookingPayload);
          if (created?.id) createdBookings.push(created);
        } catch (e) {
          console.error("Failed to create booking for slot", slot, e);
        }
      }
      if (createdBookings.length === 0) {
        setError("Impossibile creare le prenotazioni");
        return;
      }

      const createdIds = createdBookings.map((b) => b.id);
      setBookingIds(createdIds);

      // sum server-calculated prices to get a reliable amount
      const sumCents = createdBookings.reduce((acc, b) => {
        // booking.price is numeric in euros (e.g. 12.34) — convert to cents
        const p = typeof b.price === "number" ? b.price : Number(b.price || 0);
        return acc + Math.round(p * 100);
      }, 0);

      if (!sumCents || sumCents <= 0) {
        setError("Importo non valido per il pagamento");
        return;
      }

      const paymentReq = {
        bookingIds: createdIds,
        user: user.id,
        amount: sumCents,
        currency: (vigilSlots?.currency || "eur").toLowerCase(),
      };

      const resp = await PaymentService.createPaymentIntent(paymentReq as any);
      if (resp?.success) {
        setClientSecret(resp.clientSecret || "");
      } else {
        setError("Errore durante l'inizializzazione del pagamento");
      }
    } catch (e: any) {
      console.error(e);
      setError(e?.message || "Errore conferma vigil");
    }
  };

  useEffect(() => {
    if (globalThis.window === undefined) return;
    try {
      const rawAns = sessionStorage.getItem("matching_answers");
      const rawResp = sessionStorage.getItem("matching_response");
      if (rawAns) {
        const parsed = JSON.parse(rawAns);
        const payload = parsed?.answers ?? parsed;
        if (parsed?.matchingRequest) {
          payload.matchingRequest = parsed.matchingRequest;
        }

        setAnswers(payload);
      }
      if (rawResp) setResponse(JSON.parse(rawResp));
    } catch (e) {
      console.error(e);
    }
  }, []);

  if (!response) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-8">
        <div className="text-slate-600">Caricamento risultato matching…</div>
      </div>
    );
  }

  // If checkout is in progress, show checkout form
  if (clientSecret) {
    return (
      <div className="min-h-screen bg-gray-200 flex flex-col items-center px-4 py-8">
        <div className="w-full max-w-lg">
          <div className="p-6 bg-white rounded-lg shadow">
            <h2 className="text-center font-semibold text-2xl mb-6">
              Completa il pagamento
            </h2>
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                {error}
              </div>
            )}
            <CheckoutForm
              clientSecret={clientSecret}
              returnUrl={`${globalThis.window?.location.origin || ""}/matching/trial-confirmed`}
              onSuccess={handlePaymentSuccess}
              onError={(err) => {
                console.error("Payment error:", err);
                setError("Errore durante il pagamento");
              }}
              onCancel={() => {
                setClientSecret("");
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  const best = response?.data?.[0];
  if (!best) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-8">
        <div className="text-slate-600">Nessun risultato disponibile.</div>
      </div>
    );
  }

  const uncovered = response.unmatchedSlots || [];

  const vigilBlock = (vigilSlots: any) => {
    const slotDetails = Array.isArray(vigilSlots.compatibleSlotDetails)
      ? vigilSlots.compatibleSlotDetails
      : [];
    const coveredByDay: Record<string, string[]> = {};
    slotDetails.forEach((slot: any) => {
      const d = new Date(slot.date).getUTCDay();
      const label = `${slot.startTime} - ${slot.endTime}`;
      const dayName = dayNames[d] || slot.date;
      coveredByDay[dayName] = coveredByDay[dayName] || [];
      if (!coveredByDay[dayName].includes(label))
        coveredByDay[dayName].push(label);
    });
    let metaContent = null;
    if (vigilSlots.reviewCount) {
      metaContent = (
        <div className="text-sm text-slate-500 flex items-center gap-1">
          <StarIcon className="w-4 inline text-[#fbbf24]" />
          <span className="font-bold text-black">
            {vigilSlots.averageRating}{" "}
          </span>{" "}
          | {vigilSlots.reviewCount} recensioni
        </div>
      );
    } else if (vigilSlots.activeFrom) {
      metaContent = (
        <div className="text-sm text-slate-400">
          Attivo da{" "}
          {dateDisplay(vigilSlots.activeFrom || "", "monthYearLiteral")}
        </div>
      );
    }

    return (
      <>
        <div className="flex items-center gap-4 bg-white rounded-xl shadow ring-1 ring-slate-200 overflow-hidden p-5">
          <div className="w-16 h-16 rounded-full bg-slate-100 overflow-hidden flex items-center justify-center">
            <Avatar userId={vigilSlots.id} size="big" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold">
              {vigilSlots.displayName || "-"}
            </h3>
            {metaContent}
            <div className="flex items-center gap-2 mt-2"></div>
          </div>
        </div>

        <div className="mt-6 bg-slate-50 rounded-lg p-4">
          <div className="bg-consumer-light-blue text-center p-5 mb-3 rounded-lg">
            <div className="text-sm text-slate-500">Compatibilità</div>
            <div className="font-bold text-consumer-blue text-4xl ">
              {Math.round(
                (vigilSlots.compatibleSlots /
                  Math.max(vigilSlots.totalSlots || 1, 1)) *
                  100,
              )}
              %
            </div>
          </div>
          <div className="text-sm font-bold mb-2">Slot coperti</div>
          <div className="space-y-2">
            {Object.keys(coveredByDay).length === 0 && (
              <div className="text-sm text-slate-500">Nessuno slot coperto</div>
            )}
            {slotDetails.map((slot: any) => (
              <div
                key={`${slot.date}-${slot.startTime}-${slot.endTime}`}
                className="flex items-center gap-3 bg-green-50 rounded p-3"
              >
                <CheckCircleIcon className="w-8 h-8 text-[#22c55e]" />
                <div className="text-sm">
                  {[
                    dayNames[new Date(slot.date).getUTCDay()],
                    new Date(slot.date).toLocaleDateString(),
                    slot.startTime,
                    slot.endTime,
                  ].join(" - ")}
                </div>
              </div>
            ))}
          </div>

          {uncovered.length > 0 && (
            <div className="mt-4">
              <div className="text-sm font-bold mb-2">Slot non coperti</div>
              <div className="space-y-2">
                {uncovered.map((u: any) => (
                  <div
                    key={`${u.date}-${u.startTime || ""}-${u.endTime || ""}`}
                    className="flex items-center gap-3 bg-red-50 rounded p-3"
                  >
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="text-sm text-red-600">
                      {new Date(u.date).toLocaleDateString()} — non disponibile
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </>
    );
  };

  return (
    <div className="min-h-screen bg-gray-200 flex flex-col items-center px-4 py-8">
      <div className="w-full max-w-lg ">
        <div className="p-6">
          {response.data.length > 1 && (
            <div className="flex items-center gap-2 mb-6">
              <h4 className="text-2xl font-bold">Il match per te</h4>
            </div>
          )}
          {vigilBlock(best)}

          {response.data.length > 1 && (
            <div className="mt-6">
              <h2 className="text-xl font-bold mb-4">
                Altri Vigil compatibili
              </h2>
              <div className="space-y-4">
                {response.data.slice(1).map((vigil: any) => (
                  <div
                    key={`${vigil.id || vigil.displayName || "vigil"}-${vigil.activeFrom || ""}`}
                    className="p-4 bg-white rounded-lg shadow"
                  >
                    {vigilBlock(vigil)}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-4 p-4 bg-consumer-light-blue rounded border-2 border-[#c2e8f6]">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-500">Prezzo del trial</div>
                <div className="font-semibold text-consumer-blue text-2xl">
                  €{response.data[0].totalPrice || "-"}
                </div>
              </div>
              {/* <div className="text-sm text-slate-400">
                calcolato per {response.data[0].compatibleSlots || "-"} giorni su{" "}
                {response.data[0].totalSlots || "-"}
              </div> */}
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={() => handleConfirm()}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-full bg-consumer-blue text-white font-semibold"
            >
              Procedi con questo caregiver <ArrowRightIcon className="w-4" />
            </button>
            <div className="text-center mt-3">
              <button
                onClick={() => router.push(Routes.inizializationBooking.url)}
                className="text-sm text-consumer-blue underline"
              >
                Nuova ricerca
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
