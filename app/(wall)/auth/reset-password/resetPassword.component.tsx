"use client";

import { Button, ButtonLink, Undraw } from "@/components";
import { Input } from "@/components/form";
import { AtSymbolIcon } from "@heroicons/react/24/outline";
import { Controller, useForm } from "react-hook-form";
import { UserService } from "@/src/services";
import { useRouter } from "next/navigation";
import { Routes } from "@/src/routes";
import { useAppStore } from "@/src/store/app/app.store";
import { ToastPositionEnum, ToastStatusEnum } from "@/src/enums/toast.enum";
import { FormFieldType } from "@/src/constants/form.constants";

type ResetPasswordFormI = {
  email: string;
};

const ResetPasswordComponent = () => {
  const { showLoader, hideLoader, showToast } = useAppStore();
  const router = useRouter();
  const {
    control,
    formState: { errors, isValid },
    handleSubmit,
  } = useForm<ResetPasswordFormI>();

  const redirectHome = () => {
    router.replace(Routes.home.url);
  };

  const onSubmit = async (formData: ResetPasswordFormI) => {
    if (isValid) {
      const { email } = formData;
      try {
        showLoader();
        await UserService.resetPassword(email);
        showToast({
          message: "Reset email sent, check your inbox or spam",
          position: ToastPositionEnum.ASIDE,
          type: ToastStatusEnum.SUCCESS,
        });
        redirectHome();
      } catch (err) {
        console.error("Error resetting user password", err);
        showToast({
          message: "Sorry, something went wrong",
          type: ToastStatusEnum.ERROR,
        });
      } finally {
        hideLoader();
      }
    }
  };

  return (
    <div className="bg-white w-full mx-auto my-6 max-w-lg p-6 md:p-8 rounded-lg shadow-lg">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <h2 className="text-center font-medium">Reset password</h2>
          <p className="text-center text-sm text-gray-500 mt-2">
            Insert your email address to receive a reset link
          </p>
        </div>
        <Undraw graphic="forgot-password" />
        <Controller
          name="email"
          control={control}
          rules={{ required: true, ...FormFieldType.EMAIL }}
          render={({ field }) => (
            <Input
              {...field}
              autoFocus
              label="Email"
              placeholder="Insert email"
              type="email"
              required
              autoComplete="email"
              aria-invalid={!!errors.email}
              error={errors.email}
              icon={<AtSymbolIcon className="h-4 w-4 text-gray-500" />}
            />
          )}
        />

        <div>
          <Button type="submit" primary full label="Reset password" />
        </div>
      </form>

      <div className="space-y-2 mt-6">
        <p className="text-center text-sm text-gray-500">
          Back to&nbsp;
          <ButtonLink
            inline
            text
            label={Routes.login.label}
            href={Routes.login.url}
          />
        </p>
        <p className="text-center text-sm text-gray-500">
          Don&apos;t have an account?&nbsp;
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

export default ResetPasswordComponent;
