"use client";

import { useEffect, useState } from "react";
import { StarIcon, UserIcon } from "@heroicons/react/24/outline";
import { TabGroup } from "@/components";
import { TabItem } from "@/components/tabGroup/tabGroup";
import { useVigilStore } from "@/src/store/vigil/vigil.store";
import PanoramicaTab from "@/app/vigil/tabs/panoramica";
import RecensioniTab from "@/app/vigil/tabs/recensioni";
import VigilProfileModalHeader from "@/components/matching/VigilProfileModalHeader";

type Props = {
  vigilId?: string;
};

type TabId = "panoramica" | "recensioni";

const tabs: TabItem[] = [
  { id: "panoramica", label: <UserIcon className="size-6" /> },
  { id: "recensioni", label: <StarIcon className="size-6" /> },
];

const VigilProfileModal = ({ vigilId }: Props) => {
  const { vigils, getVigilsDetails } = useVigilStore();
  const [activeTab, setActiveTab] = useState<TabId>("panoramica");
  const vigil = vigils?.find((v) => v.id === vigilId);

  useEffect(() => {
    if (vigilId) getVigilsDetails([vigilId]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vigilId]);

  return (
    <div className="flex flex-col items-center bg-gray-100 rounded-2xl pt-5">
      <VigilProfileModalHeader vigil={vigil} />

      <div className="mt-2 w-full">
        <TabGroup
          variant="segmented"
          selectedId={activeTab}
          tabs={tabs}
          onChange={(id) => setActiveTab(id as TabId)}
        />
        {activeTab === "panoramica" && <PanoramicaTab vigilId={vigilId} />}
        {activeTab === "recensioni" && (
          <RecensioniTab vigilId={vigilId} simplified />
        )}
      </div>
    </div>
  );
};

export default VigilProfileModal;
