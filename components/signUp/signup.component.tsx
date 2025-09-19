"use client";

import { Button, Divider } from "@/components";
import ProviderButton from "@/components/button/providerButton";
import { Input } from "@/components/form";
import { SupabaseErrors } from "@/src/constants/supabase.constants";
import { FormFieldType } from "@/src/constants/form.constants";
import { ProviderEnum } from "@/src/enums/common.enums";
import { ToastStatusEnum } from "@/src/enums/toast.enum";
import { Routes } from "@/src/routes";
import { AuthService } from "@/src/services";
import { useAppStore } from "@/src/store/app/app.store";
import { CmsPageFormI } from "@/src/types/cms.types";
import { UserTermsType } from "@/src/types/user.types";
import {
  AtSymbolIcon,
  EyeIcon,
  FaceSmileIcon,
  HeartIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { RolesEnum } from "@/src/enums/roles.enums";
import dynamic from "next/dynamic";
import useAltcha from "@/src/hooks/useAltcha";
import { useEffect, useState } from "react";
import { AltchaService } from "@/src/services/altcha.service";
import clsx from "clsx";

const Altcha = dynamic(() => import("@/components/@core/altcha/altcha"), {
  ssr: !!false,
});

const LocalLoaderId = "signup-progress";

type SignupComponentI = {
  staticData?: CmsPageFormI;
  role: RolesEnum;
};

type RegistrationFormI = {
  email: string;
  name: string;
  surname: string;
  password: string;
  confirmPassword: string;
  [field: string]: string | number;
};

const SignupComponent = (props: SignupComponentI) => {
  const { staticData: { title, text, fields = [] } = {}, role } = props;
  const {
    localLoaders: { [LocalLoaderId]: { isLoading = false } = {} } = {},
    showLocalLoader,
    hideLocalLoader,
    showToast,
  } = useAppStore();
  const router = useRouter();
  const { challenge, isVerified, onStateChange } = useAltcha();
  const [showPassword, setShowPassword] = useState(false);
  const {
    control,
    formState: { errors, isValid },
    handleSubmit,
    setError,
  } = useForm<RegistrationFormI>();

  const redirectOnboard = () => {
    router.replace(
      role === RolesEnum.CONSUMER ? Routes.onBoard.url : Routes.onBoardVigil.url
    );
  };

  const manageSignupError = (error: { code?: string }) => {
    switch (error?.code) {
      case SupabaseErrors.USER_EXIST: {
        router.replace(Routes.login.url);
        showToast({
          message: "Login with your credentials",
          type: ToastStatusEnum.WARNING,
        });
        break;
      }
      default: {
        showToast({
          message: "Sorry, something went wrong",
          type: ToastStatusEnum.ERROR,
        });
        break;
      }
    }
  };

  const onSubmit = async (formData: RegistrationFormI) => {
    if (isValid && formData.password === formData.confirmPassword) {
      try {
        showLocalLoader(LocalLoaderId);
        const { email, password, name, surname } = formData;

        const terms: UserTermsType = {
          "terms-and-conditions-1": true,
        };
        if (fields?.length) {
          fields
            ?.filter((field) => field.type === "term")
            .forEach((term) => {
              terms[term.id] = Boolean(formData[term.id]);
            });
        }
        if (challenge) {
          await AltchaService.verifyChallenge(challenge);
          await AuthService.signup(
            { email, password, name, surname, role },
            terms
          );
          redirectOnboard();
        }
      } catch (error: any) {
        console.error("Error registering user", error);
        if (error) {
          manageSignupError({ code: error?.code });
        } else {
          showToast({
            message: "Sorry, something went wrong",
            type: ToastStatusEnum.ERROR,
          });
        }
      } finally {
        hideLocalLoader(LocalLoaderId);
      }
    } else if (formData.password !== formData.confirmPassword) {
      setError("confirmPassword", {
        type: "custom",
        message: "Password and Confirm password mismatch!",
      });
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
        {title || text ? (
          <div>
            {title ? (
              <h2 className="text-center font-medium">{title}</h2>
            ) : null}
            {text ? (
              <p className="text-center text-sm text-gray-500 mt-2">{text}</p>
            ) : null}
          </div>
        ) : null}
        {/* <Undraw graphic="sign-up" /> */}
        <div className="mt-4 mb-8 mx-auto max-w-56 text-center">
          <div
            className={clsx(
              "mb-4 w-full inline-flex items-center justify-center gap-2 p-2 rounded-full shadow",
              role === RolesEnum.CONSUMER
                ? "text-consumer-blue bg-consumer-light-blue"
                : "text-vigil-orange bg-vigil-light-orange"
            )}
          >
            {role === RolesEnum.CONSUMER ? (
              <HeartIcon className="size-6" />
            ) : (
              <FaceSmileIcon className="size-6" />
            )}
            <span>
              Registrazione&nbsp;
              {role === RolesEnum.CONSUMER ? "Famiglia" : "Vigil"}
            </span>
          </div>
          <div>
            <Link
              href={
                role === RolesEnum.CONSUMER
                  ? Routes.registrationVigil.url
                  : Routes.registrationConsumer.url
              }
              className={clsx(
                "hover:font-semibold transition",
                role === RolesEnum.CONSUMER
                  ? "text-vigil-orange"
                  : "text-consumer-blue"
              )}
            >
              Cambia tipo di account
            </Link>
          </div>
        </div>
        <Controller
          name="name"
          control={control}
          rules={{ required: true, ...FormFieldType.NAME }}
          render={({ field }) => (
            <Input
              {...field}
              autoFocus
              label="Nome"
              role={role}
              placeholder="Inserisci nome"
              type="text"
              required
              autoComplete="given-name"
              aria-invalid={!!errors.name}
              error={errors.name}
            />
          )}
        />
        <Controller
          name="surname"
          control={control}
          rules={{ required: true, ...FormFieldType.SURNAME }}
          render={({ field }) => (
            <Input
              {...field}
              label="Cognome"
              placeholder="Inserisci cognome"
              type="text"
              required
              role={role}
              autoComplete="family-name"
              aria-invalid={!!errors.surname}
              error={errors.surname}
            />
          )}
        />
        <Controller
          name="email"
          control={control}
          rules={{ required: true, ...FormFieldType.EMAIL }}
          render={({ field }) => (
            <Input
              {...field}
              label="Email"
              placeholder="Inserisci email"
              type="email"
              required
              role={role}
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
          rules={{ required: true, ...FormFieldType.PASSWORD }}
          render={({ field }) => (
            <Input
              {...field}
              label="Password"
              placeholder="Inserisci password"
              type={showPassword ? "text" : "password"}
              required
              role={role}
              autoComplete="new-password"
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
              label="Conferma password"
              placeholder="Re-inserisci password"
              type={showPassword ? "text" : "password"}
              required
              role={role}
              autoComplete="new-password"
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

        {fields.map((field) =>
          field.type === "term" ? (
            <div key={field.id}>
              <label htmlFor={field.id} className="flex gap-4">
                <Controller
                  name={field.id}
                  control={control}
                  rules={{ required: field.required }}
                  render={({ field: formField }) => (
                    <input
                      {...formField}
                      type="checkbox"
                      id={field.id}
                      required={field.required}
                      aria-invalid={!!errors[field.id]}
                      className="min-h-5 h-5 min-w-5 w-5 rounded-md border-gray-200 bg-white shadow-sm"
                    />
                  )}
                />

                <span className="text-sm text-gray-700">
                  {field.label}
                  {field.required && "*"}
                </span>
              </label>
            </div>
          ) : null
        )}

        {/* <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500 mt-2">
            L&apos;Utente dichiara di avere preso visione e di accettare
            integralmente le disposizioni di cui ai&nbsp;
            <Link
              href={Routes.termsConditions.url}
              target="blank"
              className={clsx(
                "underline",
                role === RolesEnum.CONSUMER
                  ? "text-consumer-blue"
                  : "text-vigil-orange"
              )}
            >
              Termini e Condizioni
            </Link>
            .
            <br />
            <br />
            L&apos;Utente dichiara di avere preso visione delle&nbsp;
            <Link
              href={Routes.privacyPolicy.url}
              target="blank"
              className={clsx(
                "underline",
                role === RolesEnum.CONSUMER
                  ? "text-consumer-blue"
                  : "text-vigil-orange"
              )}
            >
              Privacy Policy
            </Link>
            &nbsp;e di acconsentire al trattamento dei propri dati personali,
            conformemente a quanto previsto nella stessa informativa.
          </p>
        </div> */}

        <div>
          <Button
            full
            type="submit"
            role={role}
            label={`Crea account ${role === RolesEnum.CONSUMER ? "Famiglia" : "Vigil"}`}
            isLoading={isLoading}
          />
          <Altcha floating onStateChange={onStateChange} />
        </div>
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
            label="Registrati con Apple"
          /> */}
        </div>
      </div>

      <div className="space-y-2 mt-6">
        <p className="justify-center text-sm text-gray-500 inline-flex items-center w-full">
          Hai già un account?&nbsp;
          <Link
            href={Routes.login.url}
            className={clsx(
              role === RolesEnum.CONSUMER
                ? "text-consumer-blue"
                : "text-vigil-orange"
            )}
          >
            {Routes.login.label}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupComponent;
