"use client";

import {  Button, TabGroup,  } from "@/components";
import { ReviewStatsComponent, ReviewListComponent } from "@/components/reviews";
import { RolesEnum } from "@/src/enums/roles.enums";
import { ToastStatusEnum } from "@/src/enums/toast.enum";
import { UserService } from "@/src/services";
import { useAppStore } from "@/src/store/app/app.store";
import { useUserStore } from "@/src/store/user/user.store";
import { StorageUtils } from "@/src/utils/storage.utils";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { TabI } from "@/components/tabGroup/tabGroup";
import PrenotazioniTab from "@/app/vigil/tabs/prenotazioni";

type ProfileFormI = {
  name: string;
  surname: string;
  // TODO add other detail fields
};

const tabs: TabI[] = [
  {
    label: "Informazioni Personali",
    active: true,
  },
  {
    label: "Impostazioni",
  },
];

// Add reviews tab for vigils
const getTabsForRole = (role: RolesEnum): TabI[] => {
  const baseTabs = [...tabs];
  
  if (role === RolesEnum.VIGIL) {
    baseTabs.splice(1, 0, {
      label: "Recensioni",
    });
  }
  
  return baseTabs;
};

const ProfileComponent = () => {
  const { user, userDetails, forceUpdate: forceUserUpdate } = useUserStore();
  const { showToast } = useAppStore();
  const role: RolesEnum = user?.user_metadata?.role as RolesEnum;
  const userTabs = getTabsForRole(role);
  const [selectedTab, setSelectedTab] = useState<TabI>(userTabs[0]); //per avere tab attive

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
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-6">
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
                {/* svg <User className="w-12 h-12 text-gray-400" /> */}
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-boldmb-2">
                  {userDetails?.displayName}
                </h1>
                <span className="text-gray-500 font-medium">
                  {formatRole(role)}
                </span>
                <div className="flex items-center space-x-4  mb-3">
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
                <TabGroup
                  role={role}
                  tabs={userTabs}
                  onTabChange={(tab) => setSelectedTab(tab)}
                />

                {selectedTab.label === "Informazioni Personali" && (
                  <PrenotazioniTab />
                )}

                {selectedTab.label === "Recensioni" && role === RolesEnum.VIGIL && user?.id && (
                  <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* <div className="lg:col-span-1">
                      <ReviewStatsComponent vigilId={user.id} />
                    </div> */}
                    <div className="lg:col-span-2">
                      <ReviewListComponent
                        vigilId={user.id}
                        showActions={false}
                        title="Le tue recensioni"
                      />
                    </div>
                  </div>
                )}

                {selectedTab.label === "Impostazioni" && <PrenotazioniTab />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileComponent;
