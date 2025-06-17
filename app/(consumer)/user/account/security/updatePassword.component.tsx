"use client";

import { Button } from "@/components";
import { ModalBase } from "@/components/@core/modal";
import { Input } from "@/components/form";
import { FormFieldType } from "@/src/constants/form.constants";
import { ToastStatusEnum } from "@/src/enums/toast.enum";
import { Routes } from "@/src/routes";
import { AuthService, UserService } from "@/src/services";
import { useAppStore } from "@/src/store/app/app.store";
import { useModalStore } from "@/src/store/modal/modal.store";
import { useUserStore } from "@/src/store/user/user.store";
import { EyeIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";

const updatedPasswordModalId = "updated-password-modal";

type UpdatePasswordFormI = {
  password: string;
  newPassword: string;
  confirmNewPassword: string;
};

const UpdatePasswordComponent = () => {
  const { user } = useUserStore();
  const { closeModal, openModal } = useModalStore();
  const { showToast } = useAppStore();
  const router = useRouter();

  const {
    control,
    formState: { errors, isValid },
    handleSubmit,
    setError,
    reset,
  } = useForm<UpdatePasswordFormI>();

  const onSubmit = async (formData: UpdatePasswordFormI) => {
    const { password, newPassword, confirmNewPassword } = formData;
    if (
      isValid &&
      newPassword !== password &&
      newPassword === confirmNewPassword &&
      user?.email
    ) {
      try {
        await AuthService.login(user.email, password);
        await UserService.updatePassword(newPassword);
        reset();
        openModal(updatedPasswordModalId);
      } catch (err) {
        console.error("Error updating user password", err);
        showToast({
          message: "Sorry, something went wrong",
          type: ToastStatusEnum.ERROR,
        });
      }
    } else if (newPassword === password) {
      setError("newPassword", {
        type: "custom",
        message: "New password must be different from current",
      });
    } else if (newPassword !== confirmNewPassword) {
      setError("confirmNewPassword", {
        type: "custom",
        message: "Confirm password mismatch from New password",
      });
    }
  };

  const reautenticateUser = () => {
    closeModal();
    setTimeout(() => {
      AuthService.logout();
      router.replace(Routes.login.url);
    });
  };

  return (
    <>
      <section
        className="w-full p-4 rounded bg-gray-100/50 shadow"
        id="update-password"
        aria-label="update password"
      >
        <h4 className="text-md font-medium mb-4 leading-none">
          Update password
        </h4>
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
                id="update-password-current-password"
                label="Current password"
                placeholder="Insert current password"
                type="password"
                required
                autoComplete="current-password"
                aria-invalid={!!errors.password}
                error={errors.password}
                icon={<EyeIcon className="h-4 w-4 text-gray-500" />}
              />
            )}
          />
          <Controller
            name="newPassword"
            control={control}
            rules={{ required: true, ...FormFieldType.PASSWORD }}
            render={({ field }) => (
              <Input
                {...field}
                id="update-password-new-password"
                label="New password"
                placeholder="Insert new password"
                type="password"
                required
                autoComplete="new-password"
                aria-invalid={!!errors.newPassword}
                error={errors.newPassword}
                icon={<EyeIcon className="h-4 w-4 text-gray-500" />}
              />
            )}
          />
          <Controller
            name="confirmNewPassword"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <Input
                {...field}
                id="update-password-confirm-new-password"
                label="Confirm new password"
                placeholder="Re-insert new password"
                type="password"
                required
                autoComplete="new-password"
                aria-invalid={!!errors.confirmNewPassword}
                error={errors.confirmNewPassword}
                icon={<EyeIcon className="h-4 w-4 text-gray-500" />}
              />
            )}
          />

          <div className="flex items-center justify-end">
            <Button type="submit" primary label="Update password" />
          </div>
        </form>
      </section>
      <ModalBase
        modalId={updatedPasswordModalId}
        title="Success"
        primaryAction={reautenticateUser}
      >
        Password successfully updated!
        <br />
        For security reasons you must login againg, you&apos;ll be redirect to
        Login page.
      </ModalBase>
    </>
  );
};

export default UpdatePasswordComponent;
