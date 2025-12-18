"use client";

import { Avatar, TabGroup } from "@/components";
import { RolesEnum } from "@/src/enums/roles.enums";
import { ToastStatusEnum } from "@/src/enums/toast.enum";
import { useAppStore } from "@/src/store/app/app.store";
import { useUserStore } from "@/src/store/user/user.store";
import { StorageUtils } from "@/src/utils/storage.utils";
import { useQueryState } from "nuqs";
import { TabItem } from "@/components/tabGroup/tabGroup";
import PanoramicaTab from "@/app/vigil/tabs/panoramica";
import PrenotationTabs from "@/app/vigil/tabs/prenotazioni";
import InformazioniTab from "@/app/vigil/tabs/informazioni";
import RecensioniTab from "@/app/vigil/tabs/recensioni";
import PanoramicaConsumerTab from "@/app/(consumer)/tabs/panoramicaConsumer";
import PrenotazioniConsumerTabs from "@/app/(consumer)/tabs/prenotazioniConsumer";
import FamigliaTab from "@/app/(consumer)/tabs/famigliaTab";
import InformazioniConsumerTab from "@/app/(consumer)/tabs/informazionicConsumerTab";
import { useConsumerStore } from "@/src/store/consumer/consumer.store";
import { dateDisplay } from "@/src/utils/date.utils";
import { useVigilStore } from "@/src/store/vigil/vigil.store";
import {
  BriefcaseIcon,
  CalendarDaysIcon,
  DocumentIcon,
  MapPinIcon,
  StarIcon,
  UserGroupIcon,
  UserIcon,
  WalletIcon,
} from "@heroicons/react/24/outline";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";
import ServiziTab from "@/app/vigil/tabs/servizi";
import clsx from "clsx";
import { useBookingsStore } from "@/src/store/bookings/bookings.store";
import WalletTab from "@/app/(consumer)/tabs/walletTab";

const ProfileComponent = () => {
  const { user, forceUpdate: forceUserUpdate } = useUserStore();
  
  const [tab, setTab] = useQueryState("tab", { defaultValue: "panoramica" });
  const currentTabId = tab || "panoramica";

  const { consumers } = useConsumerStore();
  const { vigils } = useVigilStore();
  const { showToast } = useAppStore();
  const { bookings } = useBookingsStore();
  const role = user?.user_metadata?.role as RolesEnum;
  const isConsumer = role === RolesEnum.CONSUMER;
  const consumer = consumers?.find((c) => c.id === user?.id);
  const isVigil = role === RolesEnum.VIGIL;
  const vigil = vigils?.find((v) => v.id === user?.id);

  const pendingBookings = bookings.filter((b) => b.status === "pending");

  const tabs: TabItem[] = [
    {
      label: <UserIcon className="size-6" />,
      id: "panoramica",
    },
    {
      label: (
        <CalendarDaysIcon
          className={clsx(
            "size-6",
            pendingBookings.length > 0 && "text-red-500",
            isVigil && pendingBookings.length > 0 && "animate-bounce"
          )}
        />
      ),
      id: "prenotazioni",
    },
    ...(isVigil
      ? [
          {
            label: <BriefcaseIcon className="size-6" />,
            id: "servizi",
          },
        ]
      : [
          {
            label: <UserGroupIcon className="size-6" />,
            id: "famiglia",
          },
          { label: <WalletIcon className="size-6" />, id: "wallet" },
        ]),
    {
      label: <StarIcon className="size-6" />,
      id: "recensioni",
    },
    {
      label: <DocumentIcon className="size-6" />,
      id: "informazioni",
    },
  ];

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
        await StorageUtils.uploadFile("profile-pics", file, user.id, metadata);
        forceUserUpdate();
        showToast({
          message: "Profilo aggiornato",
          type: ToastStatusEnum.SUCCESS,
        });
        setTimeout(() => {
          window?.location.reload();
        }, 1000);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // --- RENDER CONSUMER ---
  if (isConsumer) {
    return (
      <div>
        <div className="max-w-7xl mx-auto">
          <div className="rounded-lg min-h-screen bg-background-default shadow-sm py-4 px-6 mb-3">
            <div className="flex flex-col items-center justify-between pt-5 bg-gray-100 rounded-2xl">
              <div className="flex w-full flex-col items-center rounded-2xl border-2 bg-white p-5 gap-2 border-consumer-blue/60">
                <div className="flex items-center justify-center">
                  <Avatar
                    size="xxl"
                    withUpload
                    onFileUpload={uploadProfilePic}
                    value={consumer?.displayName}
                    userId={consumer?.id}
                  />
                </div>
                <div className="flex-1 ">
                  <section className="flex flex-col items-center gap-2">
                    <h1 className="text-3xl font-bold text-center">
                      {consumer?.displayName}
                    </h1>
                    <span className="text-gray-500 font-medium flex items-center text-center">
                      {formatRole(role)}
                    </span>
                    <div className="flex flex-col md:flex-row items-center gap-3 mb-3">
                      {consumer?.address?.name ? (
                        <div className="inline-flex items-center flex-nowrap gap-1">
                          <MapPinIcon className="size-4 text-vigil-orange" />
                          <span className="text-xs font-medium text-gray-700 overflow-hidden whitespace-nowrap text-ellipsis max-w-3xs md:max-w-md">
                            {`${consumer?.address?.address?.road ?? consumer?.address?.display_name}, ${consumer?.address?.address?.suburb ?? ""}, ${consumer?.address?.address?.town ?? ""}, ${consumer?.address?.address?.county ?? ""} `}
                          </span>
                        </div>
                      ) : null}
                      {consumer?.created_at && (
                        <span className="text-xs font-medium text-gray-700">
                          🗓️ Su Vigila da:&nbsp;
                          <span className="capitalize">
                            {dateDisplay(
                              consumer.created_at,
                              "monthYearLiteral"
                            )}
                          </span>
                        </span>
                      )}
                    </div>
                  </section>
                </div>
              </div>
              
              {/* --- TAB GROUP E CONTENUTI CONSUMER --- */}
              <div className="mt-2 w-full">
                <TabGroup
                  variant="icons"
                  tabs={tabs}
                  selectedId={currentTabId}
                  onChange={(id:string) => setTab(id)}
                />
                
                {currentTabId === "panoramica" && <PanoramicaConsumerTab />}
                {currentTabId === "prenotazioni" && <PrenotazioniConsumerTabs />}
                {currentTabId === "famiglia" && <FamigliaTab />}
                {currentTabId === "recensioni" && <RecensioniTab />}
                {currentTabId === "informazioni" && <InformazioniConsumerTab />}
                {currentTabId === "wallet" && <WalletTab />}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- RENDER VIGIL ---
  return (
    <div>
      <div className="max-w-7xl mx-auto">
        <div className=" rounded-lg bg-background-default shadow-sm py-6 px-6 mb-3">
          <div className="flex flex-col items-center justify-between pt-5 bg-gray-100 rounded-2xl ">
            <div className="flex w-full flex-col items-center rounded-2xl border-2 bg-white p-5 gap-2 border-vigil-orange/60">
              <div className="flex items-center justify-center">
                <Avatar
                  size="xxl"
                  withUpload
                  onFileUpload={uploadProfilePic}
                  value={vigil?.displayName}
                  userId={vigil?.id}
                />
              </div>
              <div className="md:flex-1 ">
                <section className="flex flex-col items-center gap-2 ">
                  <h1 className="text-3xl font-bold text-center">
                    {vigil?.displayName}
                  </h1>
                  <span className="text-gray-500 font-medium flex items-center text-center">
                    {formatRole(role)}
                  </span>
                  <div className="flex flex-col md:flex-row items-center gap-2 mb-3">
                    {vigil?.averageRating ? (
                      <div className="inline-flex items-center flex-nowrap gap-1">
                        <div className="flex items-center gap-1">
                          <StarIconSolid className="w-4 h-4 text-yellow-300" />
                          <p className="text-xs font-medium text-gray-600">
                            Valutazione media:&nbsp;{vigil?.averageRating}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <span className="text-gray-500 font-medium flex justify-center items-center text-center">
                        {" "}
                        0 recensioni{" "}
                      </span>
                    )}

                    {vigil?.created_at && (
                      <span className="text-xs font-medium text-gray-700">
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
            
            <div className="mt-2 w-full">
              <TabGroup
                variant="icons"
                tabs={tabs}
                selectedId={currentTabId}
                onChange={(id:string) => setTab(id)}
              />

              {/* Contenuto Condizionale VIGIL */}
              {currentTabId === "panoramica" && <PanoramicaTab />}
              {currentTabId === "prenotazioni" && <PrenotationTabs />}
              {currentTabId === "servizi" && <ServiziTab />}
              {currentTabId === "recensioni" && <RecensioniTab />}
              {currentTabId === "informazioni" && <InformazioniTab />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileComponent;