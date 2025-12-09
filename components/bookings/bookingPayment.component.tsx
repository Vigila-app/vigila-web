"use client";

import { BookingI } from "@/src/types/booking.types";
import { useEffect, useMemo, useState } from "react";
import { useBookingsStore } from "@/src/store/bookings/bookings.store";
import { useAppStore } from "@/src/store/app/app.store";
import { CheckoutForm } from "@/components/checkout";
import { amountDisplay, getCurrency } from "@/src/utils/common.utils";
import { Routes } from "@/src/routes";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/src/store/user/user.store";
import {
  BookingsService,
  PaymentService,
  ServicesService,
} from "@/src/services";
import { PaymentStatusEnum } from "@/src/enums/booking.enums";
import { useServicesStore } from "@/src/store/services/services.store";
import { ServicesUtils } from "@/src/utils/services.utils";
import { dateDisplay } from "@/src/utils/date.utils";
import { useVigilStore } from "@/src/store/vigil/vigil.store";
import { AppConstants } from "@/src/constants";
import Card from "@/components/card/card";
import { ServiceCatalogItem } from "@/src/types/services.types";
import { useTransactionsStore } from "@/src/store/transactions/transactions.store";
import { PlusIcon, CheckCircleIcon, CreditCardIcon } from "@heroicons/react/24/outline";
import { WalletIcon as WalletSolidIcon } from "@heroicons/react/24/solid";
import clsx from "clsx";
import Button from "@/components/button/button";
import { RolesEnum } from "@/src/enums/roles.enums";

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
      disabled && "opacity-50 cursor-not-allowed"
    )}>
    <span
      className={clsx(
        "pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
        checked ? "translate-x-5" : "translate-x-0"
      )}
    />
  </button>
);

type PaymentBookingI = {
  bookingId: BookingI["id"];
};

const BookingPaymentComponent = (props: PaymentBookingI) => {
  const { bookingId } = props;
  const router = useRouter();

  const [clientSecret, setClientSecret] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<"stripe" | "wallet">(
    "stripe"
  );

  const { user } = useUserStore();
  const { bookings, getBookingDetails } = useBookingsStore();
  const { services, getServiceDetails } = useServicesStore();
  const { vigils, getVigilsDetails } = useVigilStore();
  const { transactions, getTransactions } = useTransactionsStore();

  const { showLoader, hideLoader } = useAppStore();

  const booking = useMemo(
    () => bookings.find((b) => b.id === bookingId),
    [bookings, bookingId]
  );

  const walletBalance = useMemo(() => {
    return transactions.reduce((sum, tx) => sum + tx.amount, 0);
  }, [transactions]);

  const canPayWithWallet = useMemo(() => {
    if (!booking) return false;
    return walletBalance >= booking.price * 100;
  }, [walletBalance, booking]);

  const service = useMemo(
    () => services.find((s) => s.id === booking?.service_id),
    [services, booking?.service_id]
  );
  const vigil = useMemo(
    () => vigils.find((v) => v.id === booking?.vigil_id),
    [vigils, booking?.vigil_id]
  );
  const serviceCatalog: ServiceCatalogItem = useMemo(
    () =>
      service?.info?.catalog_id &&
      ServicesService.getServiceCatalogById(service.info.catalog_id),
    [service]
  );

  // Logica Toggle Wallet
  const handleToggleWallet = (isActive: boolean) => {
    setPaymentMethod(isActive ? "wallet" : "stripe");
  };

  const loadBookingAndCreatePayment = async () => {
    try {
      setError("");
      if (clientSecret) return;
      showLoader();
      if (booking?.id && user?.id) {
        const response = await PaymentService.createPaymentIntent({
          bookingId: booking.id,
          user: user.id,
          amount: Math.round(booking.price * 100),
          currency: service?.currency
            ? getCurrency(service.currency)
            : booking.currency?.toLowerCase() || "eur",
        });
        if (response.success) setClientSecret(response.clientSecret);
        else setError("Errore durante la creazione del pagamento");
      } else throw new Error("Booking not found");
    } catch (err) {
      console.error(err);
      setError("Errore caricamento");
    } finally {
      hideLoader();
    }
  };

  useEffect(() => {
    if (booking?.id && service?.id && paymentMethod === "stripe") {
      loadBookingAndCreatePayment();
    }
  }, [booking?.id, service?.id, paymentMethod]);

  useEffect(() => {
    if (bookingId) getBookingDetails(bookingId, true);
  }, [bookingId]);
  useEffect(() => {
    if (user?.id) getTransactions(user.id);
  }, [user?.id]);
  useEffect(() => {
    if (booking?.id) {
      getServiceDetails(booking.service_id);
      getVigilsDetails([booking.vigil_id]);
    }
  }, [booking?.id]);

  const handlePaymentSuccess = async (paymentIntentId: string) => {
    try {
      showLoader();
      const paymentVerification =
        await PaymentService.verifyPaymentIntent(paymentIntentId);
      if (
        paymentVerification.success &&
        paymentVerification.data.status === "succeeded"
      ) {
        await BookingsService.updateBookingPaymentStatus(booking!.id, {
          payment_id: paymentIntentId,
          payment_status: PaymentStatusEnum.PAID,
        });
        router.push(`${Routes.bookings.url}?success=true`);
      }
    } catch (e) {
      console.error(e);
      router.push(
        `${Routes.paymentBookingConfirm.url}?bookingId=${booking!.id}&payment_intent=${paymentIntentId}`
      );
    } finally {
      hideLoader();
    }
  };

  const handleWalletPayment = async () => {
    try {
      showLoader();
      const response = await PaymentService.payBookingWithWallet(booking!.id);
      if (response.success) {
        if (user?.id) getTransactions(user.id, true);
        router.push(
          `${Routes.paymentBookingConfirm.url}?bookingId=${booking!.id}&payment_method=wallet&status=success`
        );
      } else setError("Pagamento con wallet fallito");
    } catch (err) {
      console.error(err);
      setError("Errore wallet");
    } finally {
      hideLoader();
    }
  };

  const handlePaymentError = (e: string) => console.error(e);

  if (error || !booking)
    return <div className="h-12 bg-gray-100 rounded-lg animate-pulse" />;

  return (
    <Card customClass="mx-2 max-w-lg mt-8 mx-auto">
      <div className=" w-full mx-auto rounded-3xl">
        <div className="mb-6">
          <h2 className="text-center font-medium text-2xl">
            Completa prenotazione
          </h2>
          <p className="text-center text-sm text-gray-500 mt-2">
            Per completare la prenotazione, procedi al pagamento.
          </p>
        </div>

        <div className="my-6 p-4 bg-pureWhite rounded-3xl shadow">
          <h3 className="font-medium text-vigil-orange mb-3">
            Riepilogo Prenotazione
          </h3>
          <div className="space-y-2 text-xs text-gray-700">
            <div className="flex justify-between">
              <span>ID Prenotazione:</span>
              <span className="text-xs">{booking.id}</span>
            </div>
            {service?.id && (
              <div className="flex justify-between">
                <span>Servizio:</span>
                <span>{service?.name}</span>
              </div>
            )}
            {vigil?.id && (
              <div className="flex justify-between">
                <span>Vigil:</span>
                <span>{vigil?.displayName}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Quando:</span>
              <span>{dateDisplay(booking.startDate, "dateTime")}</span>
            </div>
            <div className="flex justify-between">
              <span>Indirizzo:</span>
              <span className="max-w-3/4 text-right">{booking.address}</span>
            </div>
            <div className="flex justify-between">
              <span>Quantità:</span>
              <span>
                {booking.quantity}&nbsp;
                {service?.unit_type
                  ? ServicesUtils.getServiceUnitType(service?.unit_type)
                  : ""}
              </span>
            </div>
            {booking.extras?.length && serviceCatalog.extra?.length ? (
              <div className="flex justify-between">
                <span>Extra:</span>
                <span>
                  {serviceCatalog.extra
                    .filter((extra) =>
                      (booking.extras || []).includes(extra.id)
                    )
                    .map((extra) => extra.name)
                    .join(", ")}
                </span>
              </div>
            ) : null}
            <div className="flex justify-between font-medium text-lg border-t pt-2">
              <span>Totale:</span>
              <span>
                {service?.currency} {amountDisplay(booking.price)}
              </span>
            </div>
          </div>
        </div>

        <h2 className="text-lg font-bold text-gray-900 mb-4 px-2">
          Metodo di pagamento
        </h2>

        {/* Card Wallet Toggle */}
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
                Saldo residuo: {amountDisplay(walletBalance / 100)} €
              </p>
            </div>
          </div>
          <ToggleSwitch
            checked={paymentMethod === "wallet"}
            onChange={(isActive) => handleToggleWallet(isActive)}
            disabled={!canPayWithWallet}
          />
        </div>

        {/* Lista Carte */}
        <div
          className={clsx(
            "transition-all duration-300 mb-6",
            paymentMethod === "wallet"
              ? "opacity-50 pointer-events-none grayscale"
              : "opacity-100"
          )}>
          <h3 className="font-bold text-md text-gray-900 mb-3 px-2">
            Seleziona metodo
          </h3>

          <div className="space-y-3">
            {/* Stripe Selection */}
            <div
              onClick={() => setPaymentMethod("stripe")}
              className={clsx(
                "flex items-center justify-between p-4 rounded-2xl border cursor-pointer bg-white transition-all",
                paymentMethod === "stripe"
                  ? "border-gray-900 shadow-sm"
                  : "border-gray-200"
              )}>
              <div className="flex items-center gap-3">
                <CreditCardIcon className="w-6 h-6 text-vigil-orange" />
                <span className="font-semibold text-gray-700 text-sm">
                  Carta di Credito
                </span>
              </div>
              {paymentMethod === "stripe" ? (
                <CheckCircleIcon className="w-6 h-6 text-green-500 fill-green-50" />
              ) : (
                <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
              )}
            </div>
          </div>
        </div>

        {/* Riepilogo */}
        <div className="mt-4 bg-white p-6 rounded-[32px] shadow-sm">
          <h3 className="font-bold text-lg mb-4 text-gray-900">Pagamento</h3>

          <div className="space-y-3 mb-6 border-b border-gray-100 pb-6">
            <div className="flex justify-between text-gray-500 text-sm">
              <span>Totale Servizio</span>
              <span>€{amountDisplay(booking.price)}</span>
            </div>
            {paymentMethod === "wallet" && (
              <div className="flex justify-between text-gray-500 text-sm">
                <span>Credito wallet utilizzato</span>
                <span className="text-gray-900 font-medium">
                  - €{amountDisplay(booking.price)}
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
                : amountDisplay(booking.price)}
            </p>
          </div>

          {paymentMethod === "wallet" ? (
            <div className="flex flex-col  gap-3">
              <Button
                label="Annulla"
                primary={false}
                action={() => router.back()}></Button>
              <Button
                label="Paga con Wallet"
                role={RolesEnum.VIGIL}
                action={handleWalletPayment}></Button>
            </div>
          ) : (
            clientSecret && (
              <div className="mt-2">
                <CheckoutForm
                  clientSecret={clientSecret}
                  returnUrl={`${window?.location?.origin || AppConstants.hostUrl}${Routes.paymentBookingConfirm.url}?bookingId=${booking.id}`}
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                  submitLabel="Conferma Pagamento "
                />
                <button
                  onClick={() => router.back()}
                  className="w-full mt-3 py-3 rounded-full text-sm font-bold text-gray-500 hover:text-gray-700">
                  Annulla operazione
                </button>
              </div>
            )
          )}
        </div>
      </div>
    </Card>
  );
};

export default BookingPaymentComponent;
