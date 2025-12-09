"use client";

import { useState, useEffect } from "react";
import { CheckoutForm } from "@/components/checkout"; 
import { useUserStore } from "@/src/store/user/user.store";
import { PaymentService } from "@/src/services";
import { useAppStore } from "@/src/store/app/app.store";
import { useRouter } from "next/navigation";
import { Routes } from "@/src/routes"; 

type WalletPaymentItem = {
  id: string | number;
  name: string;
  price: number;
  creditAmount: number;
  metadataType?: string;
};

type WalletPaymentProps = {
  paymentItem: WalletPaymentItem;
  onCancel: () => void;
};

export const WalletPaymentComponent = ({ paymentItem, onCancel }: WalletPaymentProps) => {
  const [clientSecret, setClientSecret] = useState<string>("");
  const [error, setError] = useState<string>("");
  const router = useRouter();

  const { user, getUserDetails } = useUserStore(); // getUserDetails per aggiornare il saldo dopo
  const { showLoader, hideLoader } = useAppStore();

  // 1. Creazione del Payment Intent per il Wallet
  const createWalletPayment = async () => {
    try {
      setError("");
      showLoader();

      if (user?.id && paymentItem) {
        // Qui chiami il servizio di pagamento. 
        // Nota: Assicurati che il backend supporti un parametro 'metadata' o 'type' 
        // per distinguere tra Booking e Wallet top-up.
        const response = await PaymentService.createWalletTopUpIntent({
          user: user.id,
          amount: Math.max(Math.round(paymentItem.price * 100), 0), // Prezzo del bundle in centesimi
          currency: "eur", // O dynamic se necessario
          // Passiamo dati extra per dire al backend/webhook che è una ricarica wallet
          metadata: {
            type: paymentItem.metadataType || "wallet_topup",
            bundleId: Number(paymentItem.id),
            creditAmount: paymentItem.creditAmount,
          },
        })

        if (response.success) {
          setClientSecret(response.clientSecret);
        } else {
          console.error("Payment intent creation failed:", response);
          setError("Errore durante la creazione del pagamento");
        }
      }
    } catch (err) {
      console.error("Error creating wallet payment:", err);
      setError("Si è verificato un errore imprevisto.");
    } finally {
      hideLoader();
    }
  };

  // Carica il pagamento appena il componente viene montato
  useEffect(() => {
    if (paymentItem && user?.id) {
      createWalletPayment();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paymentItem, user?.id]);

  // 2. Gestione Successo
  const handlePaymentSuccess = async (paymentIntentId: string) => {
    try {
        showLoader();
        
        // Possiamo fare un polling o attendere qualche secondo e ricaricare l'utente.
        
        // Opzionale: chiamare una verifica lato server se vuoi feedback immediato
        // await PaymentService.verifyPaymentIntent(paymentIntentId);

        // Aggiorniamo i dati utente per vedere il nuovo saldo
        if(user?.id) await getUserDetails(true);

        // Chiudi il modale o reindirizza
        onCancel(); // Chiude il modale di pagamento
        router.refresh(); // Ricarica la pagina per mostrare nuovo saldo se necessario
        
    } catch (error) {
        console.error("Error post-payment wallet:", error);
    } finally {
        hideLoader();
    }
  };

  const handlePaymentError = (err: string) => {
    console.error("Wallet payment error:", err);
    setError(err);
  };

  return (
    <div className="bg-white p-6 rounded-3xl shadow-xl w-full max-w-md mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-xl text-gray-800">Pagamento Ricarica</h3>
        <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">✕</button>
      </div>

      <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
        <p className="text-sm text-gray-500 mb-1">Stai acquistando:</p>
        <div className="flex justify-between items-end">
            <span className="font-bold text-lg text-gray-900">{paymentItem.name}</span>
            <span className="font-bold text-xl text-sky-600">€{paymentItem.price}</span>
        </div>
        <p className="text-xs text-sky-500 mt-1">Riceverai €{paymentItem.creditAmount} di credito</p>
      </div>

      {error && (
        <div className="p-3 mb-4 text-sm text-red-500 bg-red-50 rounded-lg">
          {error}
        </div>
      )}

      {clientSecret ? (
        <CheckoutForm
          // returnUrl personalizzato per il wallet
          returnUrl={`${window?.location?.origin}${Routes.wallet?.url || '/wallet'}?payment_success=true`}
          onSuccess={handlePaymentSuccess}
          onError={handlePaymentError}
          submitLabel={`Paga €${paymentItem.price}`}
          clientSecret={clientSecret}
          showCancelButton={false}
        />
      ) : (
        <div className="h-40 flex items-center justify-center">
            <span className="loading loading-spinner text-sky-500">Caricamento pagamento...</span>
        </div>
      )}
    </div>
  );
};