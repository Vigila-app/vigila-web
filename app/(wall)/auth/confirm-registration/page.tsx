"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components";
import { AuthService } from "@/src/services";
import { useAppStore } from "@/src/store/app/app.store";
import { Routes } from "@/src/routes";
import { ToastStatusEnum } from "@/src/enums/toast.enum";
import { useEffect, useRef, useState } from "react";
import { StorageUtils } from "@/src/utils/storage.utils";
import { isReleased } from "@/src/utils/envs.utils";
import Link from "next/link";

export default function ConfirmRegistrationPage() {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const {
    showToast,
    showLoader,
    hideLoader,
    loader: { isLoading },
  } = useAppStore();

  const MAX_ATTEMPTS = 3;
  const storageKey = `confirm_resend_count:${email}`;
  const [attemptsUsed, setAttemptsUsed] = useState<number>(0);

  const handleResend = async () => {
    if (!email) return;
    if (attemptsUsed >= MAX_ATTEMPTS) {
      showToast({
        message:
          "Hai raggiunto il numero massimo di richieste. Contatta il servizio clienti per assistenza.",
        type: ToastStatusEnum.WARNING,
      });
      return;
    }
    try {
      showLoader();
      await AuthService.resendConfirmation(email);
      showToast({
        message:
          "Email di conferma reinviata. Controlla la tua casella di posta.",
        type: ToastStatusEnum.SUCCESS,
      });
      // restart 60s cooldown after successful resend
      // increment attempts and persist
      const newAttempts = attemptsUsed + 1;
      setAttemptsUsed(newAttempts);
      try {
        // store as raw string so parsing remains simple
        StorageUtils.setSessionValues(storageKey, String(newAttempts));
      } catch (err) {
        // ignore storage errors
      }
      startCountdown();
    } catch (error) {
      console.error("Resend confirmation error", error);
      showToast({
        message: "Impossibile reinviare l'email. Riprova più tardi.",
        type: ToastStatusEnum.ERROR,
      });
    } finally {
      hideLoader();
    }
  };

  // countdown state: seconds remaining before enabling resend
  const [remainingSeconds, setRemainingSeconds] = useState<number>(60);
  const timerRef = useRef<number | null>(null);

  const clearTimer = () => {
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const startCountdown = (seconds = isReleased ? 59 : 5) => {
    clearTimer();
    setRemainingSeconds(seconds);
    timerRef.current = window.setInterval(() => {
      setRemainingSeconds((s) => {
        if (s <= 1) {
          clearTimer();
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    // start initial countdown when component mounts
    startCountdown(isReleased ? 59 : 5);

    // read email from URL on client side
    try {
      const params = new URLSearchParams(window.location.search);
      const e = params.get("email") || "";
      if (e) setEmail(e);
    } catch (err) {
      // ignore
    }

    return () => {
      clearTimer();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // load attemptsUsed once email is available
  useEffect(() => {
    if (!email) return;
    try {
      const stored = StorageUtils.getSessionValues(storageKey);
      if (stored) setAttemptsUsed(parseInt(stored, 10) || 0);
    } catch (err) {
      // ignore
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email]);

  const formatTime = (s: number) => {
    const mm = Math.floor(s / 60)
      .toString()
      .padStart(2, "0");
    const ss = (s % 60).toString().padStart(2, "0");
    return `${mm}:${ss}`;
  };

  if (!email) {
    // router.push(Routes.home.url);
    return null;
  }

  return (
    <section className="py-16">
      <div className="mx-auto max-w-screen-md px-4 sm:px-6 lg:px-8">
        <div className="bg-pureWhite w-full mx-auto my-6 p-6 md:p-8 rounded-3xl shadow-lg text-center">
          <h2 className="text-2xl font-semibold mb-4">Conferma la tua email</h2>
          <p className="text-sm text-gray-600 mb-6">
            Ti abbiamo inviato una email a<br />
            <strong>{email}</strong>
          </p>
          <p className="text-sm text-gray-600 mb-6">
            Clicca sul link contenuto nella mail per confermare il tuo account.
          </p>
          <p>Verifica anche la tua cartella spam.</p>
          <br />
          <div className="">
            {remainingSeconds > 0 ? (
              <p className="text-xs text-gray-600 mb-4">
                Non hai ricevuto l&apos;email?
                <br />
                Attendi&nbsp;
                {formatTime(remainingSeconds)}&nbsp;prima di chiedere
                un&apos;altra.
              </p>
            ) : null}
            <Button
              label="Rinvia email di conferma"
              action={handleResend}
              isLoading={isLoading}
              disabled={remainingSeconds > 0 || attemptsUsed >= MAX_ATTEMPTS}
            />

            <div className="mt-3 text-sm text-gray-600">
              {attemptsUsed >= MAX_ATTEMPTS ? (
                <p className="mt-2">
                  Hai raggiunto il numero massimo di richieste.
                </p>
              ) : null}
              <p className="mt-32">
                Per assistenza contatta il nostro<br />
                <Link
                  href={Routes.customerCare.url}
                  className="underline text-consumer-blue"
                >
                  {Routes.customerCare.label}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
