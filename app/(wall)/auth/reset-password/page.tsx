"use client"
import { Button, ButtonLink } from "@/components"
import { Input } from "@/components/form"
import { AppConstants } from "@/src/constants"
import { AuthService } from "@/src/services"
import {
  ChangeEventHandler,
  FormEvent,
  FormEventHandler,
  useState,
} from "react"

export default function ResetPasswordPage() {
  /* 

    UX flow checklist: https://www.checklist.design/flows/resetting-password
    Supabase: https://supabase.com/docs/reference/javascript/auth-resetpasswordforemail

  */
  const [email, setEmail] = useState<string>("")
  const handleSubmit: FormEventHandler<HTMLFormElement> = (ev) => {
    ev.preventDefault()
    AuthService.passwordReset(email)
    
  }

  return (
    <section className="py-16">
      <div className="mx-auto max-w-screen-md px-4 sm:px-6 lg:px-8">
        <div className="bg-pureWhite w-full mx-auto my-6 p-6 md:p-8 rounded-3xl shadow-lg text-center">
          <h2 className="text-2xl font-semibold mb-4">Password dimenticata?</h2>
          <p className="text-sm text-gray-600 mb-6"> </p>
          <p className="text-sm text-gray-600 mb-6">
            <form onSubmit={handleSubmit}>
              <Input
                id="password-recovery"
                label="Inserisci l'email associata al tuo account Vigila"
                type="email"
                placeholder="email@provider.it"
                isForm
                value={email} //input is state controlled
                onChange={(val) => setEmail(val as string)} //input is type email, it will never be a number
                required
              />
              <Button label="Inizia il processo di recupero">
                Inizia il processo di recupero
              </Button>
            </form>
          </p>
          <p>Non ricordi la mail? </p>
          <ButtonLink
            label="Contatta assistenza"
            href={AppConstants.whatsappUrl}
            target="_blank"
          />
        </div>
      </div>
    </section>
  )
}
