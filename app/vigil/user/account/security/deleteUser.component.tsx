"use client";

import { Button, Undraw } from "@/components";
import { ModalBase } from "@/components/@core/modal";
import { Input } from "@/components/form";
import { FormFieldType } from "@/src/constants/form.constants";
import { ToastStatusEnum } from "@/src/enums/toast.enum";
import { AuthService, UserService } from "@/src/services";
import { useAppStore } from "@/src/store/app/app.store";
import { useModalStore } from "@/src/store/modal/modal.store";
import { useUserStore } from "@/src/store/user/user.store";
import { AnalyticsUtils } from "@/src/utils/analytics.utils";
import { AtSymbolIcon, EyeIcon } from "@heroicons/react/24/outline";
import { Controller, useForm } from "react-hook-form";

const deleteAccountModal = "delete-account-modal";

type DeleteUserFormI = {
  email: string;
  password: string;
};

const DeleteUserComponent = () => {
  const { user } = useUserStore();
  const { closeModal, openModal } = useModalStore();
  const { showToast } = useAppStore();

  const {
    control,
    formState: { errors, isValid },
    handleSubmit,
    reset,
    setError,
  } = useForm<DeleteUserFormI>();

  const onSubmit = async (formData: DeleteUserFormI) => {
    const { email, password } = formData;
    if (isValid && email === user?.email) {
      try {
        AnalyticsUtils.logEvent("DELETE-USER-PHASE-1");
        await AuthService.login(email, password);
        openModal(deleteAccountModal);
      } catch (err) {
        console.error("Error authenticating user", err);
        showToast({
          message: "Sorry, something went wrong",
          type: ToastStatusEnum.ERROR,
        });
      }
    } else if (email !== user?.email) {
      setError("email", {
        type: "custom",
        message: "Insert your account email",
      });
    }
  };

  const deleteAccount = async () => {
    try {
      AnalyticsUtils.logEvent("DELETE-USER-PHASE-2");
      await UserService.deleteUser();
      AuthService.logout();
    } catch (err) {
      console.error("Error deleting user", err);
      showToast({
        message: "Sorry, something went wrong",
        type: ToastStatusEnum.ERROR,
      });
    }
  };

  const abort = () => {
    reset();
    closeModal();
  };

  return (
    <>
      <section
        className="w-full p-4 rounded bg-red-100/50 shadow"
        id="cancel-account"
        aria-label="cancel account"
      >
        <h4 className="text-md font-medium mb-2 leading-none">
          Cancel account
        </h4>
        <p className="px-2 mb-4 text-sm">Sorry text here</p>
        <Undraw graphic="attention" />
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full mx-auto max-w-lg space-y-8"
        >
          <Controller
            name="email"
            control={control}
            rules={{ required: true, ...FormFieldType.EMAIL }}
            render={({ field }) => (
              <Input
                {...field}
                label="Email"
                placeholder="Enter email"
                type="email"
                required
                autoComplete="email"
                aria-invalid={!!errors.email}
                error={errors.email}
                icon={<AtSymbolIcon className="h-4 w-4 text-gray-500" />}
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
                id="delete-user-password"
                label="Password"
                placeholder="Insert password"
                type="password"
                required
                autoComplete="current-password"
                aria-invalid={!!errors.password}
                error={errors.password}
                icon={<EyeIcon className="h-4 w-4 text-gray-500" />}
              />
            )}
          />

          <div className="flex items-center justify-end">
            <Button type="submit" danger label="Cancel account" />
          </div>
        </form>
      </section>
      <ModalBase
        modalId={deleteAccountModal}
        closable
        onClose={abort}
        title="Attention"
        primaryAction={abort}
        primaryActionLabel="Keep my account!"
        secondaryAction={deleteAccount}
        secondaryActionLabel="Cancel account"
        secondaryActionType="danger"
      >
        Proceeding your account and all your data will be cancelled from our
        system!
        <br />
        <br />
        <span className="underline font-bold">
          This action is not reversible!
        </span>
      </ModalBase>
    </>
  );
};

export default DeleteUserComponent;
