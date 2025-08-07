"use client";

import { Button, Divider, Undraw } from "@/components";
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
import { RolesEnum } from "@/src/enums/roles.enums";
import Link from "next/link";
import Login from "./page";
import LoginPhoto from "@/components/svg/LoginPhoto";

const Altcha = dynamic(() => import("@/components/@core/altcha/altcha"), {
  ssr: !!false,
});

type LoginFormI = {
  email: string;
  password: string;
};

const LoginComponent = (props: { title?: string; text?: string }) => {
  const { title, text } = props;
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
     <div className=" flex items-center justify-center"> 
     <LoginPhoto className="w-full h-auto mb-6 " />

     </div>
      {title || text ? (
        <div>
          {title && <h2 className="text-center font-semibold text-3xl text-vigil-orange">{title}</h2>}
          {text && (
            <p className="text-center text-sm text-consumer-blue my-2">{text}</p>
          )}
        </div>
      ) : null}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
              login
              autoComplete="email"
              aria-invalid={!!errors.email}
              error={errors.email}
              icon={<AtSymbolIcon className="size-4 text-gray-500" />}
            />
          )}
        />
        <div>
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
                login
                autoComplete="current-password"
                aria-invalid={!!errors.password}
                error={errors.password}
                icon={<EyeIcon className="size-4 text-gray-500" />}
              />
            )}
          />
          <div className="text-right my-2">
            <Link
              href={Routes.resetPassword.url}
              className="text-consumer-blue text-xs">
              Password dimenticata?
            </Link>
          </div>
        </div>
        <Button
          type="submit"
          primary
          full
          role={RolesEnum.CONSUMER}
          label={Routes.login.label}
        />
        <Altcha floating onStateChange={onStateChange} />
      </form>

      <div className="login-methods">
        <Divider />
        <div className="social-login space-y-4">
          <ProviderButton
            provider={ProviderEnum.GOOGLE}
            full
            //action={() => AuthService.providerLogin(ProviderEnum.GOOGLE)}
            label="Continua con Google"
            customClass="rounded-full shadow"
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
        <p className="justify-center text-sm text-gray-500 inline-flex items-center w-full">
          Non hai un account?&nbsp;
          <Link href={Routes.registration.url} className="text-consumer-blue">
            {Routes.registration.label}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginComponent;
