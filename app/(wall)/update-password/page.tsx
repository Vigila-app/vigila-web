"use client"
import { Button, ButtonLink } from "@/components"
import { Input } from "@/components/form"
import LoginPhoto from "@/components/svg/LoginPhoto"
import { AppConstants } from "@/src/constants"
import { FormEventHandler, useState } from "react"

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState<string>("")
  const [passwordConfirm, setPasswordConfirm] = useState<string>("")
    const handleSubmit: FormEventHandler<HTMLFormElement> = (ev) => {
      ev.preventDefault()
      console.log(password, passwordConfirm)
      
    }
  //TODO: make this pvt -> routes-it.json
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
                label="Inserisci la tua nuova password per Vigila"
                type="password"
                placeholder="***********"
                isForm
                value={password}
                onChange={(pass) => setPassword(pass as string)}
              />
              <Input
                id="password-recovery-confirmation"
                label="Conferma la tua nuova password per Vigila"
                type="password"
                placeholder="***********"
                isForm
                value={passwordConfirm}
                onChange={(pass) => setPasswordConfirm(pass as string)}
              />
              <Button label="Cambia password">
                Cambia password
              </Button>
            </form>
          </p>
          
        </div>
      </div>
    </section>
  )
}
