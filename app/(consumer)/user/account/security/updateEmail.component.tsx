"use client";

import { Button } from "@/components";
import { ModalBase } from "@/components/@core/modal";
import { Input } from "@/components/form";
import { FormFieldType } from "@/src/constants/form.constants";
import { ToastStatusEnum } from "@/src/enums/toast.enum";
import { UserService } from "@/src/services";
import { useAppStore } from "@/src/store/app/app.store";
import { useModalStore } from "@/src/store/modal/modal.store";
import { useUserStore } from "@/src/store/user/user.store";
import { AtSymbolIcon } from "@heroicons/react/24/outline";
import { Controller, useForm } from "react-hook-form";

const updatedEmailModal = "updated-email-modal";

type UpdateEmailFormI = {
  newEmail: string;
};

const UpdateEmailComponent = () => {
  const user = useUserStore((state) => state.user);
  const { openModal } = useModalStore();
  const { showToast } = useAppStore();

  const {
    control,
    formState: { errors, isValid },
    handleSubmit,
    reset,
    setError,
  } = useForm<UpdateEmailFormI>();

  // if (!user?.emailVerified) {
  //   console.log("Impossible to update mail, verify the current email first");
  //   return;
  // }

  const onSubmit = async (formData: UpdateEmailFormI) => {
    const { newEmail } = formData;
    if (isValid && newEmail !== user?.email) {
      try {
        await UserService.updateEmail(newEmail);
        openModal(updatedEmailModal);
        reset();
        showToast({
          message: "Email updated successfully",
          type: ToastStatusEnum.SUCCESS,
        });
      } catch (err) {
        console.error("Error updating user email", err);
        showToast({
          message: "Sorry, something went wrong",
          type: ToastStatusEnum.ERROR,
        });
      }
    } else if (newEmail === user?.email) {
      setError("newEmail", {
        type: "custom",
        message: "New email address must be different from current",
      });
    }
  };

  return (
    <>
      <section
        className="w-full p-4 rounded bg-gray-100/50 shadow"
        id="update-email"
        aria-label="update email"
      >
        <h4 className="text-md font-medium mb-4 leading-none">Update email</h4>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full mx-auto max-w-lg space-y-8"
        >
          <Input
            label="Current email"
            type="email"
            required
            disabled
            icon={<AtSymbolIcon className="h-4 w-4 text-gray-500" />}
            value={user?.email || ""}
          />
          <Controller
            name="newEmail"
            control={control}
            rules={{ required: true, ...FormFieldType.EMAIL }}
            render={({ field }) => (
              <Input
                {...field}
                label="New email"
                placeholder="Enter new email"
                type="email"
                required
                autoComplete="email"
                aria-invalid={!!errors.newEmail}
                error={errors.newEmail}
                icon={<AtSymbolIcon className="h-4 w-4 text-gray-500" />}
              />
            )}
          />

          <div className="flex items-center justify-end">
            <Button type="submit" primary label="Update email" />
          </div>
        </form>
      </section>
      <ModalBase modalId={updatedEmailModal} closable title="Success">
        Email successfully updated into&nbsp;
        <span className="font-medium">{user?.email}</span>!<br />
        Please check your inbox to verify the new email address.
      </ModalBase>
    </>
  );
};

export default UpdateEmailComponent;
