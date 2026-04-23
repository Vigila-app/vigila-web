"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppInstance } from "@/src/utils/supabase.utils";
import { UserService } from "@/src/services";
import { Routes } from "@/src/routes";
import { Button } from "@/components";
import { Input } from "@/components/form";
import { FormFieldType } from "@/src/constants/form.constants";
import { RolesEnum } from "@/src/enums/roles.enums";
import { EyeIcon } from "@heroicons/react/24/outline";
import { Controller, useForm } from "react-hook-form";

type ActivateFormI = {
  password: string;
  confirmPassword: string;
};

type PageStateType = "loading" | "form" | "success" | "error";

export default function VigilActivatePage() {
  const router = useRouter();
  const [pageState, setPageState] = useState<PageStateType>("loading");
  const [showPassword, setShowPassword] = useState(false);
  const [sessionEstablished, setSessionEstablished] = useState(false);

  const {
    control,
    formState: { errors, isValid, isSubmitting },
    handleSubmit,
    setError,
    reset,
  } = useForm<ActivateFormI>();

  useEffect(() => {
    // Parse the URL hash for Supabase auth tokens
    const hash = window.location.hash;
    if (!hash) {
      setPageState("error");
      return;
    }

    const params = new URLSearchParams(hash.replace("#", ""));
    const accessToken = params.get("access_token");
    const refreshToken = params.get("refresh_token");
    const type = params.get("type");

    if (!accessToken || !refreshToken) {
      setPageState("error");
      return;
    }

    // Establish the session using the tokens from the magic link
    AppInstance.auth
      .setSession({ access_token: accessToken, refresh_token: refreshToken })
      .then(({ data, error }) => {
        if (error || !data?.session) {
          console.error("Error establishing session:", error);
          setPageState("error");
          return;
        }
        setSessionEstablished(true);
        setPageState("form");
      })
      .catch((err) => {
        console.error("Session error:", err);
        setPageState("error");
      });
  }, []);

  const onSubmit = async ({ password, confirmPassword }: ActivateFormI) => {
    if (!isValid || !sessionEstablished) return;

    if (password !== confirmPassword) {
      setError("confirmPassword", {
        type: "custom",
        message: "Le password non corrispondono",
      });
      return;
    }

    try {
      await UserService.updatePassword(password);
      reset();
      setPageState("success");
      // After a short delay, redirect to the vigil onboarding page
      setTimeout(() => {
        router.push(Routes.onBoardVigil.url);
      }, 2000);
    } catch (err) {
      console.error("Error setting password:", err);
      setError("password", {
        type: "custom",
        message: "Errore durante l'impostazione della password. Riprova.",
      });
    }
  };

  if (pageState === "loading") {
    return (
      <section className="py-16">
        <div className="mx-auto max-w-screen-md px-4 sm:px-6 lg:px-8">
          <div className="bg-white w-full mx-auto my-6 p-6 md:p-8 rounded-3xl shadow-lg text-center">
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
            </div>
            <p className="text-gray-600 mt-4">
              Verifica del link in corso...
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (pageState === "error") {
    return (
      <section className="py-16">
        <div className="mx-auto max-w-screen-md px-4 sm:px-6 lg:px-8">
          <div className="bg-white w-full mx-auto my-6 p-6 md:p-8 rounded-3xl shadow-lg text-center">
            <div className="text-4xl mb-4">⚠️</div>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">
              Link non valido o scaduto
            </h2>
            <p className="text-gray-600 mb-6">
              Il link di attivazione non è più valido. I link hanno una
              validità di 24 ore.
            </p>
            <p className="text-gray-600 mb-6">
              Contatta il team Vigila per ricevere un nuovo invito.
            </p>
            <Button
              label="Torna alla home"
              action={() => router.push(Routes.home.url)}
            />
          </div>
        </div>
      </section>
    );
  }

  if (pageState === "success") {
    return (
      <section className="py-16">
        <div className="mx-auto max-w-screen-md px-4 sm:px-6 lg:px-8">
          <div className="bg-white w-full mx-auto my-6 p-6 md:p-8 rounded-3xl shadow-lg text-center">
            <div className="text-4xl mb-4">🧡</div>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">
              Benvenuto/a in Vigila!
            </h2>
            <p className="text-gray-600 mb-6">
              La tua password è stata impostata con successo.
            </p>
            <p className="text-gray-600">
              Stai per essere reindirizzato/a alla pagina di configurazione del
              profilo...
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16">
      <div className="mx-auto max-w-screen-md px-4 sm:px-6 lg:px-8">
        <div className="bg-white w-full mx-auto my-6 p-6 md:p-8 rounded-3xl shadow-lg">
          <div className="text-center mb-6">
            <div className="text-4xl mb-2">🧡</div>
            <h2 className="text-2xl font-semibold text-gray-900">
              Attiva il tuo profilo Vigil
            </h2>
            <p className="text-sm text-gray-600 mt-2">
              Scegli una password sicura per il tuo account
            </p>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full mx-auto max-w-lg space-y-6"
          >
            <Controller
              name="password"
              control={control}
              rules={{ required: true, ...FormFieldType.PASSWORD }}
              render={({ field }) => (
                <Input
                  {...field}
                  id="activate-password"
                  label="Scegli una password"
                  placeholder="Inserisci la tua nuova password"
                  type={showPassword ? "text" : "password"}
                  required
                  role={RolesEnum.VIGIL}
                  autoComplete="new-password"
                  aria-invalid={!!errors.password}
                  error={errors.password}
                  icon={
                    <button
                      onClick={() => setShowPassword((v) => !v)}
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
                  id="activate-confirm-password"
                  label="Conferma la password"
                  placeholder="Reinserisci la tua password"
                  type={showPassword ? "text" : "password"}
                  required
                  role={RolesEnum.VIGIL}
                  autoComplete="new-password"
                  aria-invalid={!!errors.confirmPassword}
                  error={errors.confirmPassword}
                  icon={
                    <button
                      onClick={() => setShowPassword((v) => !v)}
                      type="button"
                    >
                      <EyeIcon className="size-4 text-gray-500" />
                    </button>
                  }
                />
              )}
            />

            <div className="flex items-center justify-end">
              <Button
                type="submit"
                primary
                label="Attiva profilo"
                isLoading={isSubmitting}
              />
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
