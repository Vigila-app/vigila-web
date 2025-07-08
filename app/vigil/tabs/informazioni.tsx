import { Button } from "@/components";
import Card from "@/components/card/card";
import { Input } from "@/components/form";
import { RolesEnum } from "@/src/enums/roles.enums";
import { ToastStatusEnum } from "@/src/enums/toast.enum";
import { UserService } from "@/src/services";
import { useAppStore } from "@/src/store/app/app.store";
import { useUserStore } from "@/src/store/user/user.store";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

const informazioniTab = () => {
  const { user, userDetails, forceUpdate: forceUserUpdate } = useUserStore();
  const { showToast } = useAppStore();
  const role: RolesEnum = user?.user_metadata?.role as RolesEnum;
  const email: string = user?.email || "";
  const birthday: string = user?.user_metadata?.birthday;
  const phone: string = user?.user_metadata?.phone;

  type ProfileFormI = {
    name: string;
    surname: string;
    birthday: string;
    email: string;
    phone: string;
    // TODO add other detail fields
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
      email: email || "",
      phone: phone || "",
      birthday: birthday || "",
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
        const { name, surname, birthday, email, phone } = formData;
        if (
          name !== userDetails?.name ||
          surname !== userDetails?.surname ||
          email !== user?.email ||
          phone !== user?.phone
        ) {
          await UserService.updateUser(
            { displayName: `${name} ${surname}` },
            { name, surname, birthday, email, phone }
          );
          console.log();
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
        } else if (email === user?.email) {
          setError("email", {
            type: "custom",
            message: "Must insert different email to update profile",
          });
        } else if (phone === user?.phone) {
          setError("phone", {
            type: "custom",
            message: "Must insert different phone to update profile",
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
  return (
    <Card>
      <h2>Informazioni personali</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
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
        <Controller
          name="birthday"
          control={control}
          rules={{ required: true, minLength: 2, maxLength: 30 }}
          render={({ field }) => (
            <Input
              {...field}
              label="Birthdate"
              placeholder="La tua data di nascita"
              type="text"
              required
              aria-invalid={!!errors.birthday}
              error={errors.birthday}
            />
          )}
        />
        <Controller
          name="email"
          control={control}
          rules={{ required: true, minLength: 2, maxLength: 30 }}
          render={({ field }) => (
            <Input
              {...field}
              label="Email"
              placeholder="la tua email"
              type="text"
              required
              autoComplete="email"
              aria-invalid={!!errors.email}
              error={errors.email}
            />
          )}
        />
        <Controller
          name="phone"
          control={control}
          rules={{ required: true, minLength: 2, maxLength: 30 }}
          render={({ field }) => (
            <Input
              {...field}
              label="Cellulare"
              placeholder="cellulare"
              type="text"
              required
              aria-invalid={!!errors.phone}
              error={errors.phone}
            />
          )}
        />
        <div className="flex items-center justify-end pt-4">
          <Button type="submit" primary role={role} label="Update profile" />
        </div>
      </form>
    </Card>
  );
};
export default informazioniTab;
