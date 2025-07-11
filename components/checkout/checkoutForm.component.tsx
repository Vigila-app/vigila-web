"use client";

import { useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Button } from "@/components";
import { useAppStore } from "@/src/store/app/app.store";
import { ToastStatusEnum } from "@/src/enums/toast.enum";
import { useRouter } from "next/navigation";

type CheckoutFormProps = {
  returnUrl?: string;
  onSuccess: (paymentIntentId: string) => void;
  onError?: (error: string) => void;
  onCancel?: () => void;
  submitLabel?: string;
  cancelLabel?: string;
  showCancelButton?: boolean;
  disabled?: boolean;
};

const CheckoutForm = ({
  returnUrl,
  onSuccess,
  onError,
  onCancel,
  submitLabel = "Paga ora",
  cancelLabel = "Annulla",
  showCancelButton = true,
  disabled = false,
}: CheckoutFormProps) => {
  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState<string>("");

  const { showLoader, hideLoader, showToast, loader: { isLoading } } = useAppStore();

  const handleSubmit = async (event: React.FormEvent) => {
    try {
      event.preventDefault();

      if (!stripe || !elements) {
        return;
      }

      showLoader();

      const confirmParams: any = {
        redirect: "if_required",
      };

      if (returnUrl) {
        confirmParams.return_url = returnUrl;
      }

      const result = await stripe.confirmPayment({
        elements,
        confirmParams,
      });

      if (result.error) {
        const errorMessage = result.error.message || "Si è verificato un errore durante il pagamento";
        
        if (result.error.type === "card_error" || result.error.type === "validation_error") {
          setMessage(errorMessage);
        } else {
          setMessage("Si è verificato un errore imprevisto.");
        }

        showToast({
          message: errorMessage,
          type: ToastStatusEnum.ERROR,
        });

        onError?.(errorMessage);
      } else {
        // Se non c'è errore, il pagamento è andato a buon fine
        // In modalità "if_required", se non c'è redirect, significa che il pagamento è completato
        showToast({
          message: "Pagamento completato con successo!",
          type: ToastStatusEnum.SUCCESS,
        });

        // Per ottenere l'ID del PaymentIntent, dobbiamo fare una chiamata separata
        // o passarlo tramite metadata. Per ora usiamo un placeholder
        onSuccess("payment_completed");
      }
    } catch (err) {
      console.error("Payment error:", err);
      const errorMessage = "Si è verificato un errore durante il pagamento";
      
      setMessage(errorMessage);

      showToast({
        message: errorMessage,
        type: ToastStatusEnum.ERROR,
      });

      onError?.(errorMessage);
    } finally {
      hideLoader();
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      router.back();
    }
  };

  const paymentElementOptions = {
    layout: "tabs" as const,
  };

  const isFormDisabled = disabled || isLoading || !stripe || !elements;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="payment-element-container">
        <PaymentElement options={paymentElementOptions} className="mb-4" />
      </div>

      {message && (
        <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg">
          {message}
        </div>
      )}

      <div className="flex gap-4">
        {showCancelButton && (
          <Button
            type="button"
            secondary
            full
            label={cancelLabel}
            action={handleCancel}
            disabled={isLoading}
          />
        )}
        <Button
          type="submit"
          full
          label={isLoading ? "Elaborazione..." : submitLabel}
          disabled={isFormDisabled}
        />
      </div>

      <div className="text-xs text-gray-500 text-center">
        <p>I tuoi dati di pagamento sono protetti e crittografati.</p>
        <p>Questo sito è protetto da Stripe.</p>
      </div>
    </form>
  );
};

export default CheckoutForm;