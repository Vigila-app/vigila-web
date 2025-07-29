"use client";

import { Button, ButtonLink, Divider, Undraw } from "@/components";
import { Input } from "@/components/form";
import { AtSymbolIcon, EyeIcon } from "@heroicons/react/24/outline";
import { Controller, useForm } from "react-hook-form";
import { AuthService } from "@/src/services";
import { useRouter } from "next/navigation";
import { Routes } from "@/src/routes";
import { useAppStore } from "@/src/store/app/app.store";
import { ToastStatusEnum } from "@/src/enums/toast.enum";
import { ProviderEnum } from "@/src/enums/common.enums";
import ProviderButton from "@/components/button/providerButton";
import { FormFieldType } from "@/src/constants/form.constants";
import dynamic from "next/dynamic";
import useAltcha from "@/src/hooks/useAltcha";
import { AltchaService } from "@/src/services/altcha.service";
import { useEffect } from "react";

const Altcha = dynamic(() => import("@/components/@core/altcha/altcha"), {
  ssr: !!false,
});
import { RolesEnum } from "@/src/enums/roles.enums";

type LoginFormI = {
  email: string;
  password: string;
};

const LoginComponent = () => {
  const { showLoader, hideLoader, showToast } = useAppStore();
  const router = useRouter();
  const { challenge, isVerified, onStateChange } = useAltcha();
  const {
    control,
    formState: { errors, isValid },
    handleSubmit,
    setError,
  } = useForm<LoginFormI>();

  const redirectHome = () => {
    router.replace(Routes.home.url);
  };

  const onSubmit = async (formData: LoginFormI) => {
    if (isValid) {
      const { email, password } = formData;
      try {
        showLoader();
        if (challenge) {
          await AltchaService.verifyChallenge(challenge);
          await AuthService.login(email, password);
          redirectHome();
        }
      } catch (error) {
        console.error("Error authenticating user", error);
        setError("email", { type: "validate" });
        setError("password", { type: "validate" });
        showToast({
          message: "Sorry, wrong credentials",
          type: ToastStatusEnum.ERROR,
        });
      } finally {
        hideLoader();
      }
    }
  };

  useEffect(() => {
    if (isVerified) {
      handleSubmit(onSubmit)();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVerified]);

  return (
    <div className="bg-white w-full mx-auto my-6 max-w-lg p-6 md:p-8 rounded-lg shadow-lg">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <h2 className="text-center font-medium">Login</h2>
          <p className="text-center text-sm text-gray-500 mt-2">
            Inserisci le tue credenziali per accedere
          </p>
        </div>
        <Undraw graphic="login" />
        <Controller
          name="email"
          control={control}
          rules={{ required: true, ...FormFieldType.EMAIL }}
          render={({ field }) => (
            <Input
              {...field}
              autoFocus
              label="Email"
              placeholder="Inserisci email"
              type="email"
              required
              role={RolesEnum.CONSUMER}
              autoComplete="email"
              aria-invalid={!!errors.email}
              error={errors.email}
              icon={<AtSymbolIcon className="size-4 text-gray-500" />}
            />
          )}
        />
        <Controller
          name="password"
          control={control}
          rules={{
            required: true,
            minLength: FormFieldType.PASSWORD.minLength,
            maxLength: FormFieldType.PASSWORD.maxLength,
          }}
          render={({ field }) => (
            <Input
              {...field}
              label="Password"
              placeholder="Inserisci password"
              type="password"
              required
              role={RolesEnum.CONSUMER}
              autoComplete="current-password"
              aria-invalid={!!errors.password}
              error={errors.password}
              icon={<EyeIcon className="size-4 text-gray-500" />}
            />
          )}
        />
        <Button type="submit" primary full role={RolesEnum.CONSUMER} label={Routes.login.label} />
        <Altcha floating onStateChange={onStateChange} />
      </form>

      <div className="login-methods">
        <Divider />
        <div className="social-login space-y-4">
          <ProviderButton
            provider={ProviderEnum.GOOGLE}
            full
            //action={() => AuthService.providerLogin(ProviderEnum.GOOGLE)}
            label="Accedi con Google"
          />
          {/* <ProviderButton
            provider={ProviderEnum.APPLE}
            full
            //action={() => AuthService.providerLogin(ProviderEnum.APPLE)}
            label="Accedi con Apple"
          /> */}
        </div>
      </div>

      <div className="space-y-2 mt-6">
        <p className="text-center text-sm text-gray-500">
          <ButtonLink
            inline
            text
            label="Password dimenticata?"
            href={Routes.resetPassword.url}
          />
        </p>
        <p className="text-center text-sm text-gray-500">
          Non hai un account?&nbsp;
          <ButtonLink
            inline
            text
            label={Routes.registration.label}
            href={Routes.registration.url}
          />
        </p>
      </div>
    </div>
  );
};

export default LoginComponent;
