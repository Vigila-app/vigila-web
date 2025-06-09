"use client";

import { Button, ButtonLink } from "@/components";
import { Input } from "@/components/form";
import { EyeIcon } from "@heroicons/react/24/outline";
import { Controller, useForm } from "react-hook-form";
import { UserService } from "@/src/services";
import { useRouter } from "next/navigation";
import { Routes } from "@/src/routes";
import { useAppStore } from "@/src/store/app/app.store";
import { ToastPositionEnum, ToastStatusEnum } from "@/src/enums/toast.enum";
import { FormFieldType } from "@/src/constants/form.constants";

type ResetPasswordFormI = {
  password: string;
  confirmPassword: string;
};

const UpdatePasswordComponent = () => {
  const { showLoader, hideLoader, showToast } = useAppStore();
  const router = useRouter();
  const {
    control,
    formState: { errors, isValid },
    handleSubmit,
  } = useForm<ResetPasswordFormI>();

  const redirectLogin = () => {
    router.replace(Routes.login.url);
  };

  const onSubmit = async (formData: ResetPasswordFormI) => {
    if (isValid && formData.password === formData.confirmPassword) {
      const { password } = formData;
      try {
        showLoader();
        await UserService.updatePassword(password);
        showToast({
          message: "Password succesfully updated, please login",
          position: ToastPositionEnum.ASIDE,
          type: ToastStatusEnum.SUCCESS,
        });
        redirectLogin();
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
          <h2 className="text-center font-medium">Update password</h2>
          <p className="text-center text-sm text-gray-500 mt-2">
            Insert your new password
          </p>
        </div>
        <Controller
          name="password"
          control={control}
          rules={{ required: true, ...FormFieldType.PASSWORD }}
          render={({ field }) => (
            <Input
              {...field}
              label="Password"
              placeholder="Insert new password"
              type="password"
              required
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
              label="Confirm password"
              placeholder="Re-insert password"
              type="password"
              required
              autoComplete="new-password"
              aria-invalid={!!errors.confirmPassword}
              error={errors.confirmPassword}
              icon={<EyeIcon className="size-4 text-gray-500" />}
            />
          )}
        />

        <div>
          <Button type="submit" primary full label="Update password" />
        </div>
      </form>

      <div className="space-y-2 mt-6">
        <p className="text-center text-sm text-gray-500">
          Go to&nbsp;
          <ButtonLink
            inline
            text
            label={Routes.login.label}
            href={Routes.login.url}
          />
        </p>
      </div>
    </div>
  );
};

export default UpdatePasswordComponent;
