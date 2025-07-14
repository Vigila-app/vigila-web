import TabGroup, { TabI } from "@/components/tabGroup/tabGroup";
import { RolesEnum } from "@/src/enums/roles.enums";
import { useUserStore } from "@/src/store/user/user.store";
import { useState } from "react";

import TabInattesa from "@/app/vigil/tabs/TabsPrenotazioni/TabInAttesa";

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
    <section className="">
      <div className=" text-[10px} rounded-2xl bg-gray-200 ">
        <TabGroup
          role={role}
          tabs={tabs}
          onTabChange={(tab) => setSelectedTab(tab)}
        />
      </div>
      
      {selectedTab.label === "In attesa" && <TabInattesa />}
      {selectedTab.label === "Accettate" && <TabInattesa />}
      {selectedTab.label === "Completate" && <TabInattesa />}
      {/* //  ToDO popolazione delle prenotazione  */}
    </section>
  );
};
export default PrenotationTabs;
