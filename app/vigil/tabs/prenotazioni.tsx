import TabGroup, { TabI } from "@/components/tabGroup/tabGroup";
import { RolesEnum } from "@/src/enums/roles.enums";
import { useUserStore } from "@/src/store/user/user.store";
import { useState } from "react";
import PanoramicaTab from "./panoramica";

const tabs: TabI[] = [
  {
    label: "In attesa",

    active: true,
  },
  {
    label: "Accettate",
  },
  {
    label: "Completate",
  },
];

const PrenotationTabs = () => {
  const { user } = useUserStore();

  const [selectedTab, setSelectedTab] = useState<TabI>(tabs[0]); //per avere tab attive
  const role: RolesEnum = user?.user_metadata?.role as RolesEnum;

  return (
    <section className="px-4">
      <div className=" rounded-2xl bg-gray-300 flex  justify-center">
        <TabGroup
          role={role}
          tabs={tabs}
          onTabChange={(tab) => setSelectedTab(tab)}
        />
      </div>
      <h4 className="font-semibold text-lg ">Richieste ricevute</h4>
      {selectedTab.label === "In attesa" && <PanoramicaTab />}
      {selectedTab.label === "Accettate" && <PanoramicaTab />}
      {selectedTab.label === "Completate" && <PanoramicaTab />}
      {/* //  ToDO popolazione delle prenotazione  */}
    </section>
  );
};
export default PrenotationTabs;
