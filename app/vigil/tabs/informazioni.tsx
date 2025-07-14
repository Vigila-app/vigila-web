import { Button, ButtonLink } from "@/components";
import Card from "@/components/card/card";
import { Input } from "@/components/form";
import { RolesEnum } from "@/src/enums/roles.enums";
import { ToastStatusEnum } from "@/src/enums/toast.enum";
import { UserService } from "@/src/services";
import { useAppStore } from "@/src/store/app/app.store";
import { useUserStore } from "@/src/store/user/user.store";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

const informazioniTab = () => {
  const { user, userDetails } = useUserStore();
  const { showToast } = useAppStore();
  const role: RolesEnum = user?.user_metadata?.role as RolesEnum;
  const email: string = user?.email || "";
  const birthday: string = user?.user_metadata?.birthday;
  const phone: string = user?.user_metadata?.phone;

  //esempio di editing dinamico
  const [isEditing, setIsEditing] = useState(true);

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
    if (userDetails && isEditing) {
      reset({
        name: userDetails?.name || "",
        surname: userDetails?.surname || "",
        email: email || "",
        phone: phone || "",
        birthday: birthday || "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userDetails, isEditing, reset]);

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
          console.log("successo");
          setIsEditing(false); //aggiunta per il setEditing
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
    <div className="grid lg:grid-cols-2 gap-6">
      <Card>
        <div>
          <div className="font-semibold ">Informazioni personali</div>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium  text-vigil-orange">
                Nome
              </label>

              <p>{userDetails?.name}</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium  text-vigil-orange">
                Cognome
              </label>

              <p>{userDetails?.surname}</p>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-vigil-orange">
              Data di nascita
            </label>

            <p>{userDetails?.birthday}</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-vigil-orange">
              Email
            </label>
            <p>{userDetails?.email}</p>
            <p className="text-xs text-gray-500">
              Per modificare l'email contatta il supporto
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-vigil-orange">
              Telefono
            </label>

            <p>{userDetails?.phone}</p>
          </div>
        </div>
      </Card>

      <Card>
        <p className="text-consumer-blue font-bold text-xl">Telefono</p>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="phone"
            control={control}
            render={({ field }) =>
              isEditing ? (
                <Input
                  type="text"
                  aria-invalid={!!errors.phone}
                  error={errors.phone}
                  {...field}
                  label=""
                />
              ) : (
                <p>{field.value}</p>
              )
            }
          />
          {isEditing && (
            <div className="flex gap-1.5 mt-3">
              <Button type="submit" label="Salva" />
              <Button
                label="Annulla"
                type="button"
                action={() => setIsEditing(false)}
              />
            </div>
          )}
        </form>
        {!isEditing && (
          <div className="mt-3 flex items-center justify-center">
            <Button
              label="Modifica"
              type="button"
              action={() => setIsEditing(true)}
            />
          </div>
        )}
      </Card>
    </div>
    // <Card>
    //   <h2 className="text-vigil-orange">Informazioni personali</h2>
    //   <form onSubmit={handleSubmit(onSubmit)}>
    //     <Controller
    //       name="name"
    //       control={control}
    //       rules={{ required: true, minLength: 2, maxLength: 30 }}
    //       render={({ field }) => (
    //         <Input
    //           {...field}
    //           label="First name"
    //           placeholder="Enter name"
    //           type="text"
    //           required
    //           role={role}
    //           autoComplete="given-name"
    //           aria-invalid={!!errors.name}
    //           error={errors.name}
    //         />
    //       )}
    //     />
    //     <Controller
    //       name="surname"
    //       control={control}
    //       rules={{ required: true, minLength: 2, maxLength: 30 }}
    //       render={({ field }) => (
    //         <Input
    //           {...field}
    //           label="Last name"
    //           placeholder="Enter last name"
    //           type="text"
    //           required
    //           role={role}
    //           autoComplete="family-name"
    //           aria-invalid={!!errors.surname}
    //           error={errors.surname}
    //         />
    //       )}
    //     />
    //     <Controller
    //       name="birthday"
    //       control={control}
    //       rules={{ required: true, minLength: 2, maxLength: 30 }}
    //       render={({ field }) => (
    //         <Input
    //           {...field}
    //           label="Birthdate"
    //           placeholder="La tua data di nascita"
    //           type="text"
    //           required
    //           role={role}
    //           aria-invalid={!!errors.birthday}
    //           error={errors.birthday}
    //         />
    //       )}
    //     />
    //     <Controller
    //       name="email"
    //       control={control}
    //       rules={{ required: true, minLength: 2, maxLength: 30 }}
    //       render={({ field }) => (
    //         <Input
    //           {...field}
    //           label="Email"
    //           placeholder="la tua email"
    //           type="text"
    //           required
    //           role={role}
    //           autoComplete="email"
    //           aria-invalid={!!errors.email}
    //           error={errors.email}
    //         />
    //       )}
    //     />
    //     <Controller
    //       name="phone"
    //       control={control}
    //       rules={{ required: true, minLength: 2, maxLength: 30 }}
    //       render={({ field }) => (
    //         <Input
    //           {...field}
    //           label="Cellulare"
    //           placeholder="cellulare"
    //           type="text"
    //           required
    //           role={role}
    //           aria-invalid={!!errors.phone}
    //           error={errors.phone}
    //         />
    //       )}
    //     />
    //     <div className="flex items-center justify-end pt-4">
    //       <Button type="submit" primary role={role} label="Update profile" />
    //     </div>
    //   </form>
    // </Card>
  );
};
export default informazioniTab;
