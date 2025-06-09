"use client";
import { useRouter } from "next/navigation";
import { Routes } from "@/src/routes";
import { Avatar, TabGroup } from "@/components";
import { capitalize, replaceDynamicUrl } from "@/src/utils/common.utils";
import { TabI } from "@/components/tabGroup/tabGroup";
import { GuestI } from "@/src/types/crm.types";
import { useCrmStore } from "@/src/store/crm/crm.store";

type CustomerManagementI = {
  guestId: GuestI["id"];
};

const CustomerManagementComponent = (props: CustomerManagementI) => {
  const { guestId } = props;
  const router = useRouter();
  const guestDetails = useCrmStore
    .getState()
    .customers.find((customer) => customer.id === guestId);

  if (!guestDetails?.id) return;

  const sections: TabI[] = [
    {
      label: "General info",
      url: `${replaceDynamicUrl(
        Routes.guestDetails.url,
        ":guestId",
        guestDetails?.id
      )}/general`,
    },
  ];

  return (
    <div>
      <div className="inline-flex justify-center w-full text-gray-500 mb-2">
        <Avatar
          label={`${capitalize(guestDetails.name)} ${capitalize(
            guestDetails.surname
          )}`}
          value={`${capitalize(guestDetails.name)} ${capitalize(
            guestDetails.surname
          )}`}
          size="big"
        />
      </div>
      <div className="mt-4">
        <TabGroup
          align="center"
          tabs={sections.map((section) => ({
            ...section,
            active: window.location.pathname.includes(
              section.url || "*not-active*"
            ),
          }))}
          onTabChange={(activeTab) => {
            if (activeTab.url) router.push(activeTab.url);
          }}
        />
      </div>
    </div>
  );
};

export default CustomerManagementComponent;
