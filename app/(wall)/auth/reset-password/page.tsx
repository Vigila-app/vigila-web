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
    console.log(email)
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
                // TODO: delete the overthinkging at 1AM
                //pattern="/^.*@[a-zA-Z]*\.[a-z]{0,3}$" //tentative regex -> the first part + presence of @ is checked by html, I want to make sure it has the extension and the correct structure
                //alternatives: ^[\w\d!#$%&'*+\-\/=?^_`{|}~]*@[a-zA-Z]*\.[a-z]{0,3}$ -> this isn't 100% precise to standard (see below) but should cover most basic-user emails.
                //ideally this can be outsourced to an api or we can trust html's validation
                //by RFC standard emails have such a big range of possibilities, including + for sub-locals and ip addresses for the domain, which is why HTML doesn't require the extension.
                //!as a secondary, less invasive check we can check if the domain has only \d and /. -> it's an IP, no extension is required
                // example: (^.*@(?:[a-zA-Z]+\.)+[a-zA-Z]{2,}(?:\.[a-zA-Z]{2,})*|^.*@\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$)$ -> can probably be optimized
                //matches:
                // firstname.lastname@example.com.uk -> OK
                // firstname.lastname@example.com -> OK
                // firstname.lastname@example -> NO
                // email@123.123.123.123 -> OK
                // email@123.123.123.123.com -> NO
                //!this is me overthinking, HTML validation is probably ok lol
                //note: a backend check should be implemented using the same regex + input sanitazation
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
