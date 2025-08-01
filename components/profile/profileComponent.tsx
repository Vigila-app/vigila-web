"use client";

import { Avatar, TabGroup } from "@/components";
import { RolesEnum } from "@/src/enums/roles.enums";
import { ToastStatusEnum } from "@/src/enums/toast.enum";
import { useAppStore } from "@/src/store/app/app.store";
import { useUserStore } from "@/src/store/user/user.store";
import { StorageUtils } from "@/src/utils/storage.utils";
import { useState } from "react";
import { TabI } from "@/components/tabGroup/tabGroup";
import PanoramicaTab from "@/app/vigil/tabs/panoramica";
import Profile from "@/public/svg/Profile";
import Prenotazioni from "@/public/svg/Prenotazioni";
import Documenti from "@/public/svg/Informazioni";
import Disponbilità from "@/public/svg/Disponibilità";
import Recensioni from "@/public/svg/Recensioni";
import PrenotationTabs from "@/app/vigil/tabs/prenotazioni";
import InformazioniTab from "@/app/vigil/tabs/informazioni";
import DisponibilitàTab from "@/app/vigil/tabs/disponibilità";
import RecensioniTab from "@/app/vigil/tabs/recensioni";
import PanoramicaConsumerTab from "@/app/(consumer)/tabs/panoramicaConsumer";
import PrenotazioniConsumerTabs from "@/app/(consumer)/tabs/prenotazioniConsumer";
import Famiglia from "@/public/svg/Famiglia";
import FamigliaTab from "@/app/(consumer)/tabs/famigliaTab";
import InformazioniConsumerTab from "@/app/(consumer)/tabs/informazionicConsumerTab";
import { useConsumerStore } from "@/src/store/consumer/consumer.store";
import { dateDisplay } from "@/src/utils/date.utils";
import { useVigilStore } from "@/src/store/vigil/vigil.store";
import { MapPinIcon } from "@heroicons/react/24/outline";

const ProfileComponent = () => {
  const { user, forceUpdate: forceUserUpdate } = useUserStore();
  const { consumers } = useConsumerStore();
  const { vigils } = useVigilStore();
  const { showToast } = useAppStore();
  const role = user?.user_metadata?.role as RolesEnum;
  const isConsumer = role === RolesEnum.CONSUMER;
  const consumer = consumers?.find((c) => c.id === user?.id);
  const isVigil = role === RolesEnum.VIGIL;
  const vigil = vigils?.find((v) => v.id === user?.id);

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
    ...(isVigil
      ? [
          {
            label: <Disponbilità />,
            id: "disponibilità",
          },
        ]
      : [
          {
            label: <Famiglia />,
            id: "famiglia",
          },
        ]),
    {
      label: <Recensioni />,
      id: "recensioni",
    },
    {
      label: <Documenti />,
      id: "informazioni",
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

  const userTabs = getTabsForRole(role);
  const [selectedTab, setSelectedTab] = useState<TabI>(userTabs[0]); //per avere tab attive

  const formatRole = (role: string) => {
    if (!role) return "";
    return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
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
  if (isConsumer) {
    return (
      <div>
        <div className="max-w-7xl mx-auto">
          <div className="rounded-lg h-full bg-background-default shadow-sm py-6 px-8 mb-6">
            <div className="flex flex-col items-center justify-between pt-5 bg-gray-100 rounded-2xl">
              <div className="flex flex-col items-center rounded-2xl border-2 bg-white p-5">
                <div className="flex items-center justify-center">
                  <Avatar
                    size="big"
                    withUpload
                    onFileUpload={uploadProfilePic}
                    value={consumer?.displayName}
                    userId={consumer?.id}
                  />
                </div>
                <div className="flex-1  ">
                  <section className="flex flex-col items-center ">
                    <h1 className="text-3xl font-bold mb-2 text-center">
                      {consumer?.displayName}
                    </h1>
                    <span className="text-gray-500 font-medium flex items-center text-center">
                      {formatRole(role)}
                    </span>
                    <div className="flex flex-col items-center gap-2  mb-3">
                      {consumer?.address?.name ? (
                      <div className="inline-flex items-center flex-nowrap gap-1">
                        <MapPinIcon className="size-4" />
                        <span className="text-ellipsis overflow-hidden whitespace-nowrap max-w-16 md:max-w-24">
                          {consumer?.address?.name}
                        </span>
                      </div>
                    ) : null}
                      {consumer?.created_at && (
                        <span>
                          🗓️ Su Vigila da:&nbsp;
                          <span className="capitalize">
                            {dateDisplay(consumer.created_at, "monthYearLiteral")}
                          </span>
                        </span>
                      )}
                    </div>
                  </section>
                </div>
              </div>
              <TabGroup
                role={role}
                tabs={tabs}
                onTabChange={(tab) => setSelectedTab(tab)}
              />
              {selectedTab.id === "panoramica" && <PanoramicaConsumerTab />}
              {selectedTab.id === "prenotazioni" && (
                <PrenotazioniConsumerTabs />
              )}
              {selectedTab.id === "informazioni" && <InformazioniConsumerTab />}
              {selectedTab.id === "famiglia" && <FamigliaTab />}
              {selectedTab.id === "recensioni" && <RecensioniTab />}
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div>
      <div className="max-w-7xl mx-auto">
        <div className=" rounded-lg  bg-background-default shadow-sm py-6 px-8 mb-6">
          <div className="flex  flex-col items-center justify-between pt-5 bg-gray-100  rounded-2xl ">
            <div className="flex  flex-col items-center rounded-2xl border-2 bg-white p-5">
              <div className="  flex items-center justify-center">
                <Avatar
                  size="big"
                  withUpload
                  onFileUpload={uploadProfilePic}
                  value={vigil?.displayName}
                  userId={vigil?.id}
                />
              </div>
              <div className="flex-1">
                <section className="flex flex-col items-center ">
                  <h1 className="text-3xl font-bold mb-2 text-center">
                    {vigil?.displayName}
                  </h1>
                  <span className="text-gray-500 font-medium flex items-center text-center">
                    {formatRole(role)}
                  </span>
                  <div className="flex items-center gap-2 mb-3">
                    {vigil?.addresses?.length ? (
                      <div className="inline-flex items-center flex-nowrap gap-1">
                        <MapPinIcon className="size-4" />
                        <span className="text-ellipsis overflow-hidden whitespace-nowrap max-w-16 md:max-w-24">
                          {vigil?.addresses?.map((a) => a.name)?.join(", ")}
                        </span>
                      </div>
                    ) : null}
                    <span className="text-ellipsis overflow-hidden whitespace-nowrap max-w-16 md:max-w-24"></span>
                    {vigil?.created_at && (
                      <span>
                        🗓️ Su Vigil da:&nbsp;
                        <span className="capitalize">
                          {dateDisplay(vigil.created_at, "monthYearLiteral")}
                        </span>
                      </span>
                    )}
                  </div>
                </section>
              </div>
            </div>
            <TabGroup
              role={role}
              tabs={tabs}
              onTabChange={(tab) => setSelectedTab(tab)}
            />
            {selectedTab.id === "panoramica" && <PanoramicaTab />}
            {selectedTab.id === "prenotazioni" && <PrenotationTabs />}
            {selectedTab.id === "informazioni" && <InformazioniTab />}
            {selectedTab.id === "disponibilità" && <DisponibilitàTab />}
            {selectedTab.id === "recensioni" && <RecensioniTab />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileComponent;
