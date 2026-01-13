"use client"
import { Button } from "@/components"
import { Input } from "@/components/form"
import { FormFieldType } from "@/src/constants/form.constants"
import { RolesEnum } from "@/src/enums/roles.enums"
import { ToastStatusEnum } from "@/src/enums/toast.enum"
import { Routes } from "@/src/routes"
import { AuthService, UserService } from "@/src/services"
import { useAppStore } from "@/src/store/app/app.store"
import { useUserStore } from "@/src/store/user/user.store"
import { EyeIcon } from "@heroicons/react/24/outline"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Controller, useForm } from "react-hook-form"

type UpdatePasswordPageI = {
  password: string
  confirmPassword: string
}

export default function UpdatePasswordPage() {
  const { user } = useUserStore()
  const { showToast } = useAppStore()
  const navigation = useRouter()
  const onSubmit = async (formData: UpdatePasswordPageI) => {
    const { password, confirmPassword } = formData
    if (isValid && password === confirmPassword && user?.email) {
      try {
        await UserService.updatePassword(password)
        reset()
        navigation.push(Routes.passwordResetConfirmation.url)
      } catch (err) {
        console.error("Error updating user password", err)
        showToast({
          message: "Qualcosa è andato storto",
          type: ToastStatusEnum.ERROR,
        })
      }
    } else if (password !== confirmPassword) {
      setError("confirmPassword", {
        type: "custom",
        message: "Le password non corrispondono",
      })
    }
  }

  const {
    control,
    formState: { errors, isValid },
    handleSubmit,
    setError,
    reset,
  } = useForm<UpdatePasswordPageI>()

  const [showPassword, setShowPassword] = useState(false)

  return (
    <section className="py-16">
      <div className="mx-auto max-w-screen-md px-4 sm:px-6 lg:px-8">
        <div className="bg-pureWhite w-full mx-auto my-6 p-6 md:p-8 rounded-3xl shadow-lg ">
          <h2 className="text-2xl font-semibold mb-4 text-center">
            Password dimenticata?
          </h2>
          <p className="text-sm text-gray-600 mb-6"> </p>
          <p className="text-sm text-gray-600 mb-6">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="w-full mx-auto max-w-lg space-y-8"
            >
              <Controller
                name="password"
                control={control}
                rules={{ required: true, ...FormFieldType.PASSWORD }}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="update-password-password"
                    label="Nuova password"
                    placeholder="Inserisci la nuova password"
                    type={showPassword ? "text" : "password"}
                    required
                    role={RolesEnum.CONSUMER}
                    autoComplete="password"
                    aria-invalid={!!errors.password}
                    error={errors.password}
                    icon={
                      <button
                        onClick={() => setShowPassword(!showPassword)}
                        type="button"
                      >
                        <EyeIcon className="size-4 text-gray-500" />
                      </button>
                    }
                  />
                )}
              />
              <Controller
                name="confirmPassword"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="update-password-confirm-password"
                    label="Conferma nuova password"
                    placeholder="Reinserisci la nuova password"
                    type={showPassword ? "text" : "password"}
                    role={RolesEnum.CONSUMER}
                    required
                    autoComplete="password"
                    aria-invalid={!!errors.confirmPassword}
                    error={errors.confirmPassword}
                    icon={
                      <button
                        onClick={() => setShowPassword(!showPassword)}
                        type="button"
                      >
                        <EyeIcon className="size-4 text-gray-500" />
                      </button>
                    }
                  />
                )}
              />

              <div className="flex items-center justify-end">
                <Button type="submit" primary label="Aggiorna password" />
              </div>
            </form>
          </p>
        </div>
      </div>
    </section>
  )
}
