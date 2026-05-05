"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Routes } from "@/src/routes";
import {
  BookingsService,
  PaymentService,
  ServicesService,
} from "@/src/services";
import { BookingI } from "@/src/types/booking.types";
import {
  CheckCircleIcon,
  StarIcon,
  WalletIcon as WalletSolidIcon,
} from "@heroicons/react/24/solid";
import {
  ArrowRightIcon,
  CreditCardIcon,
  PlusIcon,
  CheckCircleIcon as CheckCircleOutlineIcon,
} from "@heroicons/react/24/outline";
import { CheckoutForm } from "@/components/checkout";
import { Avatar } from "@/components";
import { dateDisplay } from "@/src/utils/date.utils";
import { amountDisplay } from "@/src/utils/common.utils";
import { calculateSlotDurationHours } from "@/src/utils/calendar.utils";
import { useUserStore } from "@/src/store/user/user.store";
import { useTransactionsStore } from "@/src/store/transactions/transactions.store";
import { useAppStore } from "@/src/store/app/app.store";
import { useBookingsStore } from "@/src/store/bookings/bookings.store";
import Button from "@/components/button/button";
import { RolesEnum } from "@/src/enums/roles.enums";
import clsx from "clsx";

const dayNames = [
  "Domenica",
  "Lunedì",
  "Martedì",
  "Mercoledì",
  "Giovedì",
  "Venerdì",
  "Sabato",
];

const ToggleSwitch = ({
  checked,
  onChange,
  disabled,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}) => (
  <button
    type="button"
    disabled={disabled}
    onClick={() => onChange(!checked)}
    className={clsx(
      "relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
      checked ? "bg-orange-500" : "bg-gray-200",
      disabled && "opacity-50 cursor-not-allowed",
    )}
  >
    <span
      className={clsx(
        "pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
        checked ? "translate-x-5" : "translate-x-0",
      )}
    />
  </button>
);

type PaymentStage = "idle" | "selecting" | "checkout";

export default function MatchingSuccessPage() {
  const router = useRouter();
  const { user } = useUserStore();
  const { balance, getTransactions } = useTransactionsStore();
  const { showLoader, hideLoader } = useAppStore();
  const { getBookingDetails } = useBookingsStore();

  const [answers, setAnswers] = useState<any>(null);
  const [response, setResponse] = useState<any>(null);
  const [paymentStage, setPaymentStage] = useState<PaymentStage>("idle");
  const [paymentMethod, setPaymentMethod] = useState<"stripe" | "wallet">(
    "stripe",
  );
  const [clientSecret, setClientSecret] = useState<string>("");
  const [bookingIds, setBookingIds] = useState<string[]>([]);
  const [totalAmountCents, setTotalAmountCents] = useState<number>(0);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (user?.id) getTransactions(user.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  useEffect(() => {
    if (globalThis.window === undefined) return;
    try {
      const rawAns = sessionStorage.getItem("matching_answers");
      const rawResp = sessionStorage.getItem("matching_response");
      if (rawAns) {
        const parsed = JSON.parse(rawAns);
        const payload = parsed?.answers ?? parsed;
        if (parsed?.matchingRequest)
          payload.matchingRequest = parsed.matchingRequest;
        setAnswers(payload);
      }
      if (rawResp) setResponse(JSON.parse(rawResp));
    } catch (e) {
      console.error(e);
    }
  }, []);

  const totalPriceEur: number = response?.data?.[0]?.totalPrice ?? 0;

  const canPayWithWallet = useMemo(
    () => balance > 0 && balance >= Math.round(totalPriceEur * 100),
    [balance, totalPriceEur],
  );

  const redirectToConfirmed = (ids: string[]) => {
    router.push(
      `${Routes.matchingTrialConfirmed?.url || "/matching/trial-confirmed"}?bookingIds=${ids.join(",")}`,
    );
  };

  const handleConfirm = async () => {
    setError("");
    try {
      showLoader();
      const vigilSlots = response?.data?.[0];
      const slotDetails = Array.isArray(vigilSlots?.compatibleSlotDetails)
        ? vigilSlots.compatibleSlotDetails
        : [];

      if (!user?.id) throw new Error("User not authenticated");

      let vigilServices: any[] = [];
      try {
        vigilServices = await ServicesService.getServices(vigilSlots.id);
      } catch (e) {
        console.warn("Could not fetch vigil services", e);
      }

      const createdBookings: BookingI[] = [];

      for (const slot of slotDetails) {
        const startIso = `${slot.date}T${slot.startTime}:00Z`;
        const endIso = `${slot.date}T${slot.endTime}:00Z`;
        const serviceMatch = (vigilServices || []).find(
          (s: any) => s.type === slot.service,
        );
        const weekday = new Date(slot.date).getUTCDay();
        const addressStr =
          (typeof answers?.address === "string" ? answers.address : null) ||
          answers?.address?.display_name ||
          answers?.address?.address?.display_name ||
          answers?.matchingRequest?.address?.display_name ||
          answers?.matchingRequest?.address?.address ||
          answers?.matchingRequest?.address?.formatted ||
          "";
        const dayNote: string | undefined =
          answers?.services?.[weekday]?.notes ||
          answers?.services?.[String(weekday)]?.notes ||
          undefined;
        const slotQuantity = calculateSlotDurationHours(
          slot.startTime,
          slot.endTime,
        );
        const bookingPayload: any = {
          service_id: serviceMatch?.id,
          service_type: serviceMatch?.type || slot.service,
          startDate: startIso,
          endDate: endIso,
          quantity: slotQuantity,
          address: addressStr,
          ...(dayNote ? { note: dayNote } : {}),
          extras: [],
        };
        if (!bookingPayload.service_id) {
          console.warn("No service_id found for slot, skipping", slot);
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
      const matchingTotalEur =
        typeof vigilSlots?.totalPrice === "number"
          ? vigilSlots.totalPrice
          : Number(vigilSlots?.totalPrice || 0);
      const amountCents =
        matchingTotalEur > 0
          ? Math.round(matchingTotalEur * 100)
          : createdBookings.reduce((acc, b) => {
              const p =
                typeof b.price === "number" ? b.price : Number(b.price || 0);
              return acc + Math.round(p * 100);
            }, 0);

      if (!amountCents || amountCents <= 0) {
        setError("Importo non valido per il pagamento");
        return;
      }

      setBookingIds(createdIds);
      setTotalAmountCents(amountCents);
      setPaymentStage("selecting");
    } catch (e: any) {
      console.error(e);
      setError(e?.message || "Errore conferma vigil");
    } finally {
      hideLoader();
    }
  };

  const handleProceedToPayment = async () => {
    setError("");
    if (paymentMethod === "wallet") {
      await handleWalletPayment();
      return;
    }
    try {
      showLoader();
      const vigilSlots = response?.data?.[0];
      const resp = await PaymentService.createPaymentIntent({
        bookingIds,
        user: user!.id,
        amount: totalAmountCents,
        currency: (vigilSlots?.currency || "eur").toLowerCase(),
      } as any);
      if (resp?.success) {
        setClientSecret(resp.clientSecret || "");
        setPaymentStage("checkout");
      } else {
        setError("Errore durante l'inizializzazione del pagamento");
      }
    } catch (e: any) {
      console.error(e);
      setError(e?.message || "Errore inizializzazione pagamento");
    } finally {
      hideLoader();
    }
  };

  const handleWalletPayment = async () => {
    try {
      showLoader();
      for (const id of bookingIds) {
        const resp = await PaymentService.payBookingWithWallet(id);
        if (!resp?.success) {
          setError("Pagamento wallet fallito per una o più prenotazioni");
          return;
        }
        getBookingDetails(id, true);
      }
      if (user?.id) getTransactions(user.id, true);
      redirectToConfirmed(bookingIds);
    } catch (e: any) {
      console.error(e);
      setError(e?.message || "Errore pagamento wallet");
    } finally {
      hideLoader();
    }
  };

  const handlePaymentSuccess = (_paymentIntentId: string) => {
    redirectToConfirmed(bookingIds);
  };

  if (!response) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-8">
        <div className="text-slate-600">Caricamento risultato matching…</div>
      </div>
    );
  }

  if (paymentStage === "checkout" && clientSecret) {
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
                setPaymentStage("selecting");
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  if (paymentStage === "selecting") {
    const best = response?.data?.[0];
    return (
      <div className="min-h-screen bg-gray-200 flex flex-col items-center px-4 py-8">
        <div className="w-full max-w-lg">
          <div className="mb-6">
            <h2 className="text-center font-medium text-2xl">
              Completa prenotazione
            </h2>
            <p className="text-center text-sm text-gray-500 mt-2">
              Per completare la prenotazione, procedi al pagamento.
            </p>
          </div>

          {/* Booking summary */}
          <div className="my-6 p-4 bg-white rounded-3xl shadow">
            <h3 className="font-medium text-vigil-orange mb-3">
              Riepilogo Prenotazione
            </h3>
            <div className="space-y-2 text-xs text-gray-700">
              {best?.displayName && (
                <div className="flex justify-between">
                  <span>Vigil:</span>
                  <span>{best.displayName}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Slot confermati:</span>
                <span>{bookingIds.length}</span>
              </div>
              {(answers?.matchingRequest?.address?.address ||
                answers?.matchingRequest?.address?.formatted) && (
                <div className="flex justify-between">
                  <span>Indirizzo:</span>
                  <span className="max-w-3/4 text-right">
                    {answers.matchingRequest.address.address ||
                      answers.matchingRequest.address.formatted}
                  </span>
                </div>
              )}
              <div className="flex justify-between font-medium text-lg border-t pt-2">
                <span>Totale:</span>
                <span>€ {amountDisplay(totalAmountCents / 100)}</span>
              </div>
            </div>
          </div>

          <h2 className="text-lg font-bold text-gray-900 mb-4 px-2">
            Metodo di pagamento
          </h2>

          {/* Wallet toggle */}
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center relative">
                <WalletSolidIcon className="w-6 h-6 text-consumer-blue" />
                <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-[2px] border-2 border-white">
                  <PlusIcon className="w-2 h-2 text-white" strokeWidth={4} />
                </div>
              </div>
              <div>
                <p className="font-bold text-gray-900 text-sm">
                  Usa credito wallet
                </p>
                <p className="text-xs text-gray-500">
                  Saldo residuo: {amountDisplay(balance / 100)} €
                </p>
              </div>
            </div>
            <ToggleSwitch
              checked={paymentMethod === "wallet"}
              onChange={(v) => setPaymentMethod(v ? "wallet" : "stripe")}
              disabled={!canPayWithWallet}
            />
          </div>

          {/* Card selection */}
          <div
            className={clsx(
              "transition-all duration-300 mb-6",
              paymentMethod === "wallet"
                ? "opacity-50 pointer-events-none grayscale"
                : "opacity-100",
            )}
          >
            <h3 className="font-bold text-md text-gray-900 mb-3 px-2">
              Seleziona metodo
            </h3>
            <div
              onClick={() => setPaymentMethod("stripe")}
              className={clsx(
                "flex items-center justify-between p-4 rounded-2xl border cursor-pointer bg-white transition-all",
                paymentMethod === "stripe"
                  ? "border-gray-900 shadow-sm"
                  : "border-gray-200",
              )}
            >
              <div className="flex items-center gap-3">
                <CreditCardIcon className="w-6 h-6 text-vigil-orange" />
                <span className="font-semibold text-gray-700 text-sm">
                  Carta di Credito
                </span>
              </div>
              {paymentMethod === "stripe" ? (
                <CheckCircleOutlineIcon className="w-6 h-6 text-green-500" />
              ) : (
                <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
              )}
            </div>
          </div>

          {/* Payment total */}
          <div className="mt-4 bg-white p-6 rounded-[32px] shadow-sm">
            <h3 className="font-bold text-lg mb-4 text-gray-900">Pagamento</h3>
            <div className="space-y-3 mb-6 border-b border-gray-100 pb-6">
              <div className="flex justify-between text-gray-500 text-sm">
                <span>Totale Servizio</span>
                <span>€{amountDisplay(totalAmountCents / 100)}</span>
              </div>
              {paymentMethod === "wallet" && (
                <div className="flex justify-between text-gray-500 text-sm">
                  <span>Credito wallet utilizzato</span>
                  <span className="text-gray-900 font-medium">
                    - €{amountDisplay(totalAmountCents / 100)}
                  </span>
                </div>
              )}
            </div>
            <div className="flex justify-between items-end mb-6">
              <div>
                <p className="font-bold text-lg text-gray-900">Paghi tu</p>
                <p className="text-xs text-gray-400">IVA inclusa</p>
              </div>
              <p className="font-bold text-2xl text-consumer-blue">
                €
                {paymentMethod === "wallet"
                  ? "0,00"
                  : amountDisplay(totalAmountCents / 100)}
              </p>
            </div>

            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                {error}
              </div>
            )}

            <div className="flex flex-col gap-3">
              <Button
                label="Annulla"
                primary={false}
                action={() => setPaymentStage("idle")}
              />
              {paymentMethod === "wallet" ? (
                <Button
                  label="Paga con Wallet"
                  role={RolesEnum.VIGIL}
                  action={handleProceedToPayment}
                />
              ) : (
                <Button
                  label="Procedi al pagamento"
                  role={RolesEnum.CONSUMER}
                  action={handleProceedToPayment}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // idle: show vigil result
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
          </span>
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
            <div className="font-bold text-consumer-blue text-4xl">
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
      <div className="w-full max-w-lg">
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

          <div className="mt-4 p-4 bg-consumer-light-blue rounded border-2 border-consumer-light-blue">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-500">Prezzo totale</div>
                <div className="font-semibold text-consumer-blue text-2xl">
                  €{response.data[0].totalPrice || "-"}
                </div>
              </div>
            </div>
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
              {error}
            </div>
          )}

          <div className="mt-6">
            <button
              onClick={handleConfirm}
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
