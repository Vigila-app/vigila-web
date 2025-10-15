import { Card } from "@/components";
import { ToastStatusEnum } from "@/src/enums/toast.enum";
import { UserService } from "@/src/services";
import { useAppStore } from "@/src/store/app/app.store";
import { useConsumerStore } from "@/src/store/consumer/consumer.store";
import { useUserStore } from "@/src/store/user/user.store";
import { dateDisplay } from "@/src/utils/date.utils";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const InformazioniConsumerTab = () => {
  const { user, userDetails } = useUserStore();
  const { showToast } = useAppStore();
  const { consumers, getConsumersDetails } = useConsumerStore();
  const { email, birthday, phone } = user?.user_metadata || {};
  const consumer = consumers.find((c) => c.id === user?.id);
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

  useEffect(() => {
    if (!consumer?.lovedOneName && user?.id)
      getConsumersDetails([user.id], true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [consumer?.lovedOneName, user?.id]);

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
    <div className="grid lg:grid-cols-2 gap-4 w-full py-4">
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
              Email
            </label>
            <p>{user?.email}</p>
            <p className="text-xs text-gray-500">
              Per modificare l&apos;email contatta il supporto
            </p>
          </div>
        </div>
      </Card>
      <Card>
        <div>
          <div className="font-semibold ">Informazioni del familiare</div>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium  text-vigil-orange">
                Nome
              </label>

              <p>{consumer?.lovedOneName || "-"}</p>
            </div>
            {/* <div className="space-y-2">
              <label className="text-sm font-medium  text-vigil-orange">
                Cognome
              </label>

              <p>{userDetails?.surname}</p>
            </div> */}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-vigil-orange">
              Data di nascita
            </label>

            <p>
              {consumer?.lovedOneBirthday
                ? dateDisplay(consumer?.lovedOneBirthday, "date")
                : "-"}
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-vigil-orange">
              Telefono
            </label>
            <p>{consumer?.lovedOnePhone || "-"}</p>
          </div>
        </div>
      </Card>

      {/* <Card>
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
      </Card> */}
    </div>
  );
};
export default InformazioniConsumerTab;
