"use client"
import { Button, ButtonLink } from "@/components"
import { Input } from "@/components/form"
import { AppConstants } from "@/src/constants"
import { FormFieldType } from "@/src/constants/form.constants"
import { RolesEnum } from "@/src/enums/roles.enums"
import { ToastStatusEnum } from "@/src/enums/toast.enum"
import useAltcha from "@/src/hooks/useAltcha"
import { AuthService } from "@/src/services"
import { AltchaService } from "@/src/services/altcha.service"
import { useAppStore } from "@/src/store/app/app.store"
import { EnvelopeIcon } from "@heroicons/react/24/outline"
import dynamic from "next/dynamic"
import { useEffect } from "react"
import { Controller, useForm } from "react-hook-form"
const Altcha = dynamic(() => import("@/components/@core/altcha/altcha"), {
  ssr: !!false,
})
type RequestPasswordResetI = {
  email: string
}
export default function ResetPasswordPage() {
  const {
    control,
    formState: { errors, isValid },
    handleSubmit,
    reset,
  } = useForm<RequestPasswordResetI>()
  const { showToast } = useAppStore()
  const { challenge, isVerified, onStateChange } = useAltcha()

  useEffect(() => {
    if (isVerified) {
      handleSubmit(onSubmit)()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVerified])

  const onSubmit = async (formData: RequestPasswordResetI) => {
    try {
      if (isValid) {
        if (challenge) {
          await AltchaService.verifyChallenge(challenge)

          await AuthService.passwordReset(formData.email)
          showToast({
            message: "Controlla la tua email per recuperare la password",
            type: ToastStatusEnum.SUCCESS,
          })
        }
      } else throw new Error("Qualcosa è andato storto")
    } catch (error) {
      console.error("Error requesting password reset", error)
      showToast({
        message: "Qualcosa è andato storto",
        type: ToastStatusEnum.ERROR,
      })
    } finally {
      reset()
    }
  }

  return (
    <section className="py-16">
      <div className="mx-auto max-w-screen-md px-4 sm:px-6 lg:px-8">
        <div className="bg-pureWhite w-full mx-auto my-6 p-6 md:p-8 rounded-3xl shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 text-center">
            Password dimenticata?
          </h2>
          <p className="text-sm text-gray-600 mb-6">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="w-full mx-auto max-w-lg space-y-8"
            >
              <Controller
                name="email"
                control={control}
                rules={{ required: true, ...FormFieldType.EMAIL }}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="email"
                    label="Inserisci l'email associata al tuo account Vigila"
                    type="email"
                    placeholder="email@provider.it"
                    role={RolesEnum.CONSUMER}
                    required
                    autoComplete="new-email"
                    aria-invalid={!!errors.email}
                    error={errors.email}
                    icon={<EnvelopeIcon className="h-4 w-4 text-gray-500" />}
                  />
                )}
              ></Controller>

              <div className="flex items-center justify-center">
                <Button
                  type="submit"
                  primary
                  label="Inizia il processo di recupero"
                >
                  Inizia il processo di recupero
                </Button>
                <Altcha floating onStateChange={onStateChange} />
              </div>
            </form>
          </p>
          <div className="text-center">
            <p>Non ricordi la mail? </p>
            <ButtonLink
              secondary
              label="Contatta assistenza"
              href={AppConstants.whatsappUrl}
              target="_blank"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
