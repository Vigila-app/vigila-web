"use client";

import { Button, ButtonLink, Divider, Undraw } from "@/components";
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
import { AtSymbolIcon, EyeIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { RolesEnum } from "@/src/enums/roles.enums";

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
  const {
    control,
    formState: { errors, isValid },
    handleSubmit,
    setError,
  } = useForm<RegistrationFormI>();

  const redirectHome = () => {
    router.replace(Routes.home.url);
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
        await AuthService.signup(
          { email, password, name, surname, role },
          terms
        );
        redirectHome();
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
        <Undraw graphic="sign-up" />
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
              type="password"
              required
              role={role}
              autoComplete="new-password"
              aria-invalid={!!errors.password}
              error={errors.password}
              icon={<EyeIcon className="size-4 text-gray-500" />}
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
              type="password"
              required
              role={role}
              autoComplete="new-password"
              aria-invalid={!!errors.confirmPassword}
              error={errors.confirmPassword}
              icon={<EyeIcon className="size-4 text-gray-500" />}
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

        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500 mt-2">
            Creando un account, accetti i nostri&nbsp;
            <Link
              href={Routes.termsConditions.url}
              target="blank"
              className="text-gray-700 underline">
              termini & condizioni
            </Link>
            &nbsp;e la&nbsp;
            <Link
              href={Routes.privacyPolicy.url}
              target="blank"
              className="text-gray-700 underline">
              privacy policy
            </Link>
            .
          </p>
        </div>

        <div>
          <Button
            full
            type="submit"
            role={role}
            label="Crea un account"
            isLoading={isLoading}
          />
        </div>
      </form>

      <div className="login-methods">
        <Divider />
        <div className="social-login space-y-4">
          <ProviderButton
            provider={ProviderEnum.GOOGLE}
            full
            //action={() => AuthService.providerLogin(ProviderEnum.GOOGLE)}
            label="Registrati con Google"
          />
          <ProviderButton
            provider={ProviderEnum.APPLE}
            full
            //action={() => AuthService.providerLogin(ProviderEnum.APPLE)}
            label="Registrati con Apple"
          />
        </div>
      </div>

      <p className="text-center text-sm text-gray-500 mt-6">
        Hai già un account?&nbsp;
        <ButtonLink
          inline
          text
          label={Routes.login.label}
          href={Routes.login.url}
        />
      </p>
    </div>
  );
};

export default SignupComponent;
