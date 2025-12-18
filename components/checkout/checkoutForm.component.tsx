"use client"

import { useState } from "react"
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
  ExpressCheckoutElement,
} from "@stripe/react-stripe-js"
import { Button } from "@/components"
import { useAppStore } from "@/src/store/app/app.store"
import { ToastStatusEnum } from "@/src/enums/toast.enum"
import { useRouter } from "next/navigation"
import { loadStripe } from "@stripe/stripe-js"
import { RolesEnum } from "@/src/enums/roles.enums"

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
)

type CheckoutFormProps = {
  appearance?: {
    theme?: "stripe" | "flat" | "night"
    variables?: Record<string, string>
  }
  clientSecret: string
  returnUrl?: string
  onSuccess: (paymentIntentId: string) => void
  onError?: (error: string) => void
  onCancel?: () => void
  submitLabel?: string
  cancelLabel?: string
  showCancelButton?: boolean
  disabled?: boolean
}

const CheckoutFormComponent = ({
  returnUrl,
  onSuccess,
  onError,
  onCancel,
  submitLabel = "Paga ora",
  cancelLabel = "Annulla",
  showCancelButton = true,
  disabled = false,
}: CheckoutFormProps) => {
  const router = useRouter()
  const stripe = useStripe()
  const elements = useElements()

  const [message, setMessage] = useState<string>("")

  const {
    showLoader,
    hideLoader,
    showToast,
    loader: { isLoading },
  } = useAppStore()

  const handleSubmit = async (event?: React.FormEvent) => {
    try {
      event?.preventDefault?.()
      showLoader()

      if (!stripe || !elements) {
        setMessage(
          "Il sistema di pagamento non è ancora pronto. Riprova tra qualche secondo."
        )
        return
      }

      //Verifica che tutti gli elementi siano validi prima di procedere
      const { error: submitError } = await elements.submit()
      if (submitError) {
        console.error("Elements submit error:", submitError)
        setMessage(submitError.message || "Verifica i dati inseriti e riprova.")
        showToast({
          message: submitError.message || "Verifica i dati inseriti e riprova.",
          type: ToastStatusEnum.ERROR,
        })
        return
      }

      const confirmParams: any = {}

      if (returnUrl) {
        confirmParams.return_url = returnUrl
      }

      const result = await stripe.confirmPayment({
        elements,
        confirmParams,
        redirect: "if_required",
      })

      if (result.error) {
        const errorMessage =
          result.error.message ||
          "Si è verificato un errore durante il pagamento"

        if (
          result.error.type === "card_error" ||
          result.error.type === "validation_error"
        ) {
          setMessage(errorMessage)
        } else {
          setMessage("Si è verificato un errore imprevisto.")
        }

        showToast({
          message: errorMessage,
          type: ToastStatusEnum.ERROR,
        })

        onError?.(errorMessage)
      } else {
        // Se non c'è errore, il pagamento è andato a buon fine
        // In modalità "if_required", se non c'è redirect, significa che il pagamento è completato
        showToast({
          message: "Pagamento completato con successo!",
          type: ToastStatusEnum.SUCCESS,
        })

        // Per ottenere l'ID del PaymentIntent, dobbiamo fare una chiamata separata
        // o passarlo tramite metadata. Per ora usiamo un placeholder
        onSuccess(result.paymentIntent.id)
      }
    } catch (err) {
      console.error("Payment error:", err)
      const errorMessage = "Si è verificato un errore durante il pagamento"

      setMessage(errorMessage)

      showToast({
        message: errorMessage,
        type: ToastStatusEnum.ERROR,
      })

      onError?.(errorMessage)
    } finally {
      hideLoader()
    }
  }

  const handleCancel = () => {
    if (onCancel) {
      onCancel()
    } else {
      router.back()
    }
  }

  const paymentElementOptions = {
    layout: "tabs" as const,
  }

  const isFormDisabled = disabled || isLoading || !stripe || !elements

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="payment-element-container">
        <PaymentElement options={paymentElementOptions} className="my-4" />
        <ExpressCheckoutElement onConfirm={() => handleSubmit()} />
      </div>

      {message && (
        <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg">
          {message}
        </div>
      )}

      <div className="flex flex-row-reverse md:flex-row gap-4 flex-wrap md:flex-nowrap items-center">
        {showCancelButton && (
          <Button
            type="button"
            primary={false}
            full
            label={cancelLabel}
            action={handleCancel}
            disabled={isLoading}
            customClass="px-4"
          />
        )}
        <Button
          type="submit"
          full
          role={RolesEnum.CONSUMER}
          label={isLoading ? "Elaborazione..." : submitLabel}
          isLoading={isLoading}
          disabled={isFormDisabled || isLoading}
        />
      </div>

      <div className="text-xs text-gray-500 text-center">
        <p>I tuoi dati di pagamento sono protetti e crittografati.</p>
        <p>Questo sito è protetto da Stripe.</p>
      </div>
    </form>
  )
}

const CheckoutForm = (props: CheckoutFormProps) => {
  // Verifica che il clientSecret sia valido
  if (!(props.clientSecret && stripePromise)) {
    return (
      <div className="text-center p-6 bg-yellow-50 rounded-lg">
        <p className="text-yellow-600 text-sm">
          Attendi la creazione del pagamento...
        </p>
      </div>
    )
  }

  const appearance = {
    theme: "stripe" as const,
    variables: {
      colorPrimary: "#f97316",
      colorBackground: "#ffffff",
      colorText: "#30313d",
      colorDanger: "#df1b41",
      fontFamily: "Inter, system-ui, sans-serif",
      spacingUnit: "4px",
      borderRadius: "8px",
    },
    ...props.appearance,
  }

  const options = {
    clientSecret: props.clientSecret,
    appearance,
    loader: "auto" as const,
    locale: "it" as const,
  }

  return (
    <Elements options={options} stripe={stripePromise}>
      <CheckoutFormComponent {...props} />
    </Elements>
  )
}

export default CheckoutForm
