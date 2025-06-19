"use client";

import { Avatar, Button, Undraw } from "@/components";
import { Input } from "@/components/form";
import { ToastStatusEnum } from "@/src/enums/toast.enum";
import { UserService } from "@/src/services";
import { useAppStore } from "@/src/store/app/app.store";
import { useUserStore } from "@/src/store/user/user.store";
import { StorageUtils } from "@/src/utils/storage.utils";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

type ProfileFormI = {
  name: string;
  surname: string;
  // TODO add other detail fields
};

const ProfileComponent = () => {
  const { user, userDetails } = useUserStore();
  const { showToast } = useAppStore();
  
  const role:string= user?.user_metadata?.role;
  
  const formatRole= (role:string) => {
  if (!role) return "";
  return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
};

  const {
    control,
    formState: { errors, isValid },
    handleSubmit,
    setError,
    reset,
  } = useForm<ProfileFormI>({
    defaultValues: {
      name: userDetails?.name || "",
      surname: userDetails?.surname || "",
    },
  });

  useEffect(() => {
    if (userDetails) {
      reset({
        name: userDetails?.name || "",
        surname: userDetails?.surname || "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userDetails]);

  const onSubmit = async (formData: ProfileFormI) => {
    if (isValid) {
      try {
        const { name, surname } = formData;
        if (name !== userDetails?.name || surname !== userDetails?.surname) {
          await UserService.updateUser(
            { displayName: `${name} ${surname}` },
            { name, surname }
          );
          showToast({
            message: "Profile updated successfully",
            type: ToastStatusEnum.SUCCESS,
          });
        } else if (name === userDetails?.name) {
          setError("name", {
            type: "custom",
            message: "Must insert different First Name to update profile",
          });
        } else if (surname === userDetails?.surname) {
          setError("surname", {
            type: "custom",
            message: "Must insert different Last Name to update profile",
          });
        }
      } catch (err) {
        console.error("Error updating user", err);
        showToast({
          message: "Sorry, something went wrong",
          type: ToastStatusEnum.ERROR,
        });
      }
    }
  };

  const uploadProfilePic = async (
    file: string | ArrayBuffer | File,
    metadata?: { contentType?: string, name?: string }
  ) => {
    try {
      if (file) {
/*         const resizedImg = (await resizeImage(
          base64ProfilePic,
          150,
          150
        )) as string; */
        const response = await StorageUtils.uploadFile(
          "profile_pics",
          file,
          `${user?.id}/${user?.id}`,
          metadata
        );
        if (response?.path)
          UserService.updateUser({ photoURL: response.path });
        showToast({
          message: "Profile updated successfully",
          type: ToastStatusEnum.SUCCESS,
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
    }
  };

  return (
  
    <section id="update-profile" aria-label="update profile">
      <h1 className="text-lg font-medium mb-2 leading-none sticky top-0 p-4 pb-2 z-40">
        Update profile
      </h1>
      <Undraw graphic="profile" />
      <div className="p-4">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full mx-auto max-w-lg space-y-8 p-4"
        >
          <div className="inline-flex justify-center w-full text-gray-500 mb-2">
            <Avatar
              label={`${userDetails?.displayName || "-"}-${formatRole(role)}`}
              size="big"
              withUpload
              onFileUpload={uploadProfilePic}
              imgUrl={StorageUtils.getURL("profile_pics", userDetails?.photoURL as string)}
              value={userDetails?.displayName || ""}
            />
          </div>
          <Controller
            name="name"
            control={control}
            rules={{ required: true, minLength: 2, maxLength: 30 }}
            render={({ field }) => (
              <Input
                {...field}
                label="First name"
                placeholder="Enter name"
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
            rules={{ required: true, minLength: 2, maxLength: 30 }}
            render={({ field }) => (
              <Input
                {...field}
                label="Last name"
                placeholder="Enter last name"
                type="text"
                required
                autoComplete="family-name"
                aria-invalid={!!errors.surname}
                error={errors.surname}
              />
            )}
          />

          <div className="flex items-center justify-end">
            <Button type="submit" primary label="Update profile" />
          </div>
        </form>
      </div>
    </section>
  );
};

export default ProfileComponent;
