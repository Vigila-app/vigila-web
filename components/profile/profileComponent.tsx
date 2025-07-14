"use client";

import { Avatar, TabGroup } from "@/components";
import { RolesEnum } from "@/src/enums/roles.enums";
import { ToastStatusEnum } from "@/src/enums/toast.enum";
import { UserService } from "@/src/services";
import { useAppStore } from "@/src/store/app/app.store";
import { useUserStore } from "@/src/store/user/user.store";
import { StorageUtils } from "@/src/utils/storage.utils";
import { useEffect, useState } from "react";
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
  const created_at= user?.created_at;

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

  return (
    <div>
     
      <div className="max-w-7xl mx-auto">
        <div className=" rounded-lg  bg-background-default shadow-sm py-6 px-12 mb-6">
          <div className="flex  flex-col items-center justify-between pt-5 bg-gray-100  rounded-2xl ">
            <div className="flex  flex-col items-center rounded-2xl border-2 bg-white p-5">
              <div className="  flex items-center justify-center">
                 <Avatar
                label=""
                size="big"
                withUpload
                onFileUpload={uploadProfilePic}
                value={userDetails?.displayName || ""}
              />
              </div>
              <div className="flex-1  ">
                <section className="flex flex-col items-center ">
                  <h1 className="text-3xl font-bold mb-2 text-center">
                    {userDetails?.displayName}
                  </h1>
                  <span className="text-gray-500 font-medium flex items-center text-center">
                    {formatRole(role)}
                  </span>
                  <div className="flex items-center gap-2  mb-3">
                    <span>📍 TODO localizzazione</span>
                    <span>🗓️ Su Vigil da: {created_at}</span>
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
              {selectedTab.id === "informazioni" && <InformazioniTab/>}
              {selectedTab.id === "disponibilità" && <DisponibilitàTab />}
              {selectedTab.id === "recensioni" && <RecensioniTab />}
            </div>
          </div>
        
      </div>
    </div>
  );
};

export default ProfileComponent;
