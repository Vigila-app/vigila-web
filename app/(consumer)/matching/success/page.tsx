"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Routes } from "@/src/routes";
import { CheckCircleIcon, StarIcon } from "@heroicons/react/24/solid";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { BookingsService, PaymentService } from "@/src/services";
import { useAppStore } from "@/src/store/app/app.store";
import { useUserStore } from "@/src/store/user/user.store";
import { CheckoutForm } from "@/components/checkout";
import { getCurrency } from "@/src/utils/common.utils";
import { ServiceCatalogTypeEnum } from "@/src/enums/services.enums";
import { CurrencyEnum } from "@/src/enums/common.enums";
import { BookingFormI } from "@/src/types/booking.types";
import { Avatar, ButtonLink } from "@/components";
import MatchedVigil from "@/components/matching/MatchedVigil";

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
  const { user } = useUserStore();
  const { showLoader, hideLoader } = useAppStore();

  const [answers, setAnswers] = useState<any>(null);
  const [response, setResponse] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [clientSecret, setClientSecret] = useState<string>("");
  const [bookingIds, setBookingIds] = useState<string[]>([]);
  const [error, setError] = useState<string>("");

  // Helper: Create a single trial booking for the first 2 weeks
  const createTrialBooking = async (
    compatibleSlots: any[],
    vigil: any,
    answer: any,
    matchPrice: number,
  ) => {
    try {
      if (!user?.id) throw new Error("User not authenticated");
      if (compatibleSlots.length === 0)
        throw new Error("No compatible slots found");

      // Get first 14 days of slots
      const now = new Date();
      const twoWeeksLater = new Date(now);
      twoWeeksLater.setDate(twoWeeksLater.getDate() + 14);

      const slotsInRange = compatibleSlots.filter((slot: any) => {
        const slotDate = new Date(slot.date);
        return slotDate >= now && slotDate <= twoWeeksLater;
      });

      if (slotsInRange.length === 0) {
        throw new Error("No slots available in the first 2 weeks");
      }

      const schedule =
        answer?.matchingRequest?.schedule || answer?.schedule || {};

      // Extract service info from schedule (use first available service)
      const scheduleEntries = Object.entries(schedule);
      const firstService =
        (scheduleEntries[0]?.[1] as any)?.service ||
        ServiceCatalogTypeEnum.LIGHT_ASSISTANCE;

      // Get address info
      const address = answer?.address || {};
      const postalCode = address?.postal_code || address?.postalCode || [""];
      const addressStr =
        `${address?.street || ""} ${address?.house_number || ""}, ${address?.city || ""}, ${address?.postal_code || address?.postalCode || ""}`.trim();

      // Create single trial booking covering F2 weeks with number of slots as quantity
      const bookingStartDate = new Date(now);
      bookingStartDate.setHours(0, 0, 0, 0);

      const bookingEndDate = new Date(twoWeeksLater);
      bookingEndDate.setHours(23, 59, 59, 999);

      const booking: BookingFormI = {
        consumer_id: user.id,
        vigil_id: vigil?.id,
        service_id: firstService,
        startDate: bookingStartDate,
        endDate: bookingEndDate,
        quantity: slotsInRange.length,
        min_unit: 1,
        price: matchPrice,
        fee: 0,
        currency: "EUR",
        address: addressStr,
        postalCode: Array.isArray(postalCode) ? postalCode : [postalCode],
        status: "pending" as any,
        note: `Trial booking - ${slotsInRange.length} slots covered in 2 weeks`,
      } as BookingFormI;

      const createdBooking = await BookingsService.createBooking(booking);
      return createdBooking.id;
    } catch (err) {
      console.error("Error creating trial booking:", err);
      throw err;
    }
  };

  // Handler for "Proceed with this caregiver" button
  const handleProceedWithMatch = async () => {
    try {
      setError("");
      setIsProcessing(true);
      showLoader();

      if (!user?.id || !response) {
        throw new Error("Missing required data");
      }

      // Step 1: Create trial booking for first 2 weeks
      // const bookingId = await createTrialBooking(
      //   best.compatibleSlotDetails || [],
      //   best,
      //   answers,
      //   response.price,
      // );
      // setBookingIds([bookingId]);

      // // Step 2: Create payment intent for the booking
      // const paymentResponse = await PaymentService.createPaymentIntent({
      //   bookingId: bookingId, //
      //   user: user.id,
      //   amount: Math.round((response.price / 2) * 100),
      //   currency: getCurrency(CurrencyEnum.EURO),
      // });

      // if (!paymentResponse.success) {
      //   throw new Error("Failed to create payment intent");
      // }

      // setClientSecret(paymentResponse.clientSecret);
      hideLoader();
    } catch (err: any) {
      console.error("Error in handleProceedWithMatch:", err);
      setError(err.message || "An error occurred");
      hideLoader();
      setIsProcessing(false);
    }
  };

  const handlePaymentSuccess = async (paymentIntentId: string) => {
    // Payment status update is handled server-side by the Stripe webhook.
    // Redirect to trial confirmed page
    router.push(
      `${Routes.matchingTrialConfirmed?.url || "/matching/trial-confirmed"}?bookingIds=${bookingIds.join(",")}`,
    );
  };

  useEffect(() => {
    if (globalThis.window === undefined) return;
    try {
      const rawAns = sessionStorage.getItem("matching_answers");
      const rawResp = sessionStorage.getItem("matching_response");
      if (rawAns) {
        const parsed = JSON.parse(rawAns);
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setAnswers(parsed);
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
                setIsProcessing(false);
              }}
              onCancel={() => {
                setClientSecret("");
                setIsProcessing(false);
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  // build covered slots grouped by weekday
  const coveredByDay: Record<string, string[]> = {};
  (best.compatibleSlotDetails || []).forEach((slot: any) => {
    const d = new Date(slot.date).getUTCDay();
    const label = `${slot.startTime} - ${slot.endTime}`;
    const dayName = dayNames[d] || slot.date;
    coveredByDay[dayName] = coveredByDay[dayName] || [];
    if (!coveredByDay[dayName].includes(label))
      coveredByDay[dayName].push(label);
  });

  const uncovered = response.unmatchedSlots || [];

  const vigilBlock = (vigilSlots: any) => {
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
            {vigilSlots.reviewCount ? (
              <div className="text-sm text-slate-500 flex items-center gap-1">
                <StarIcon className="w-4 inline text-[#fbbf24]" />
                <span className="font-bold text-black">
                  {vigilSlots.averageRating}{" "}
                </span>{" "}
                | {vigilSlots.reviewCount} recensioni
              </div>
            ) : vigilSlots.activeFrom ? (
              <div className="text-sm text-slate-400">
                Attivo da{" "}
                {dateDisplay(vigilSlots.activeFrom || "", "monthYearLiteral")}
              </div>
            ) : null}
            <div className="flex items-center gap-2 mt-2"></div>
            <div className="mt-3 flex flex-wrap gap-2">
              {/* service tags: try to show a few examples from answers */}
              {answers?.matchingRequest?.schedule &&
                Object.values(answers.matchingRequest.schedule).map(
                  (s: any, idx: number) => (
                    <span
                      key={idx}
                      className="text-xs bg-blue-50 text-consumer-blue px-2 py-1 rounded-full"
                    >
                      {s.service}
                    </span>
                  ),
                )}
            </div>
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
            {vigilSlots.compatibleSlotDetails.map((slot: any, idx: number) => (
              <div
                key={idx}
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
            {/* {Object.entries(coveredByDay).map(([day, ranges]) => (
              <div
                key={day}
                className="flex items-center justify-between bg-consumer-light-blue rounded p-3"
              >
                <div className="flex items-center gap-3">
                  <CheckCircleIcon className="w-8 h-8 text-[#22c55e]" />
                  <div className="text-sm">
                    {day} — {ranges.join(" • ")}
                  </div>
                </div>
              </div>
            ))} */}
          </div>

          {uncovered.length > 0 && (
            <div className="mt-4">
              <div className="text-sm font-bold mb-2">Slot non coperti</div>
              <div className="space-y-2">
                {uncovered.map((u: any, i: number) => (
                  <div
                    key={i}
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
                {response.data.slice(1).map((vigil: any, idx: number) => (
                  <div key={idx} className="p-4 bg-white rounded-lg shadow">
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
                  {/* TODO: add to response */}
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
              onClick={() =>
                router.push(
                  Routes.matchingTrialConfirmed?.url ||
                    "/matching/trial-confirmed",
                )
              }
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-full bg-consumer-blue text-white font-semibold"
            >
              Procedi con questo caregiver <ArrowRightIcon className="w-4" />
            </button>
            <div className="text-center mt-3">
              <button
                onClick={() =>
                  router.push(
                    Routes.matchingNoMatch?.url || "/matching/no-match",
                  )
                }
                className="text-sm text-consumer-blue underline"
              >
                Cerco una copertura completa
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
