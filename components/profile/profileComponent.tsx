"use client";

import { Button, TabGroup } from "@/components";
import { RolesEnum } from "@/src/enums/roles.enums";
import { ToastStatusEnum } from "@/src/enums/toast.enum";
import { UserService } from "@/src/services";
import { useAppStore } from "@/src/store/app/app.store";
import { useUserStore } from "@/src/store/user/user.store";
import { StorageUtils } from "@/src/utils/storage.utils";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { TabI } from "@/components/tabGroup/tabGroup";
import PanoramicaTab from "@/app/vigil/tabs/panoramica";
import Profile from "@/public/svg/Profile";
import Prenotazioni from "@/public/svg/prenotazioni";
import Documenti from "@/public/svg/Informazioni";
import Disponbilità from "@/public/svg/Disponibilità";
import Recensioni from "@/public/svg/Recensioni";

type ProfileFormI = {
  name: string;
  surname: string;
  // TODO add other detail fields
};

const tabs: TabI[] = [
  {
    label: <Profile />,
    id: "panoramica",
    active: true,
  },
  {
    label: <Prenotazioni />,
    id: "prenotazioni",
  },
  {
    label: <Documenti />,
    id: "informazioni",
  },
  {
    label: <Disponbilità />,
    id: "disponibilità",
  },
  {
    label: <Recensioni />,
    id: "recensioni",
  },
];

const ProfileComponent = () => {
  const { user, userDetails, forceUpdate: forceUserUpdate } = useUserStore();
  const { showToast } = useAppStore();
  const [selectedTab, setSelectedTab] = useState<TabI>(tabs[0]); //per avere tab attive
  const role: RolesEnum = user?.user_metadata?.role as RolesEnum;

  const formatRole = (role: string) => {
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
    metadata?: { contentType?: string; name?: string }
  ) => {
    try {
      if (file && user?.id) {
        /*         const resizedImg = (await resizeImage(
          base64ProfilePic,
          150,
          150
        )) as string; */
        await StorageUtils.uploadFile("profile-pics", file, user.id, metadata);
        forceUserUpdate();
        showToast({
          message: "Profilo aggiornato",
          type: ToastStatusEnum.SUCCESS,
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
    }
  };

  return (
    <div>
      {/*TODO eliminare qeusta versione e riadattare l'update del profilo 
       <section id="update-profile" aria-label="update profile">
        <h1 className="text-lg font-medium mb-2 leading-none sticky top-0 p-4 pb-2 z-40">
          Update profile
        </h1>
        <Undraw graphic="profile" />
        <div className="p-4">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full mx-auto max-w-lg space-y-8 p-4">
            <div className="inline-flex justify-center w-full text-gray-500 mb-2">
              <Avatar
                label={`${userDetails?.displayName || "-"}-${formatRole(role)}`}
                size="big"
                withUpload
                onFileUpload={uploadProfilePic}
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
      </section> */}
      <div className="max-w-7xl mx-auto">
        <div className=" rounded-lg  bg-gray-500 shadow-sm py-6 px-12 mb-6">
          {/*fondo di tutto forse eliminabile */}
          <div className="flex  flex-col items-center justify-between pt-5 bg-white rounded-2xl">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center ">
              {/*immagine persona className="w-12 h-12 text-gray-400" /> */}
            </div>
            <div className="flex-1  ">
              <section className="flex flex-col items-center">
                <h1 className="text-3xl font-bold mb-2 text-center">
                  {userDetails?.displayName}
                </h1>
                <span className="text-gray-500 font-medium flex items-center text-center">
                  {formatRole(role)}
                </span>
                <div className="flex items-center gap-2  mb-3">
                  <span>📍 TODO localizzazione</span>
                  <span>🗓️ Su Vigil da: TODO </span>
                </div>
                <div className="flex items-center justify-end">
                  <Button
                    label="Modifica profilo"
                    type="submit"
                    primary
                    role={role}>
                    Modifica
                  </Button>
                </div>
              </section>
              <TabGroup
                role={role}
                tabs={tabs}
                onTabChange={(tab) => setSelectedTab(tab)}
              />
              {selectedTab.id === "panoramica" && <PanoramicaTab />}
              {selectedTab.id === "prenotazioni" && <PanoramicaTab />}
              {selectedTab.id === "informazioni" && <PanoramicaTab />}
              {selectedTab.id === "disponibilità" && <PanoramicaTab />}
              {selectedTab.id === "recensioni" && <PanoramicaTab />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileComponent;
