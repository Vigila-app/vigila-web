"use client";

import { Avatar, TabGroup } from "@/components";
import { dateDisplay } from "@/src/utils/date.utils";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";
import PanoramicaTab from "../../tabs/panoramica";
import ServiziTab from "../../tabs/servizi";
import RecensioniTab from "../../tabs/recensioni";
import { useEffect, useState } from "react";
import { TabI } from "@/components/tabGroup/tabGroup";
import { BriefcaseIcon, StarIcon, UserIcon } from "@heroicons/react/24/outline";
import { useQueryState } from "nuqs";
import { useVigilStore } from "@/src/store/vigil/vigil.store";
import { RolesEnum } from "@/src/enums/roles.enums";
import { useParams } from "next/navigation";

const VigilProfile = () => {
  const [tab, setTab] = useQueryState("tab");
  const { vigils } = useVigilStore();
  const params = useParams();
  const vigilId = params?.vigilId as string;
  const role = RolesEnum.VIGIL;
  const vigil = vigils?.find((v) => v.id === vigilId);

  const tabs: TabI[] = [
    {
      label: <UserIcon className="size-6" />,
      id: "panoramica",
    },

    {
      label: <BriefcaseIcon className="size-6" />,
      id: "servizi",
    },

    {
      label: <StarIcon className="size-6" />,
      id: "recensioni",
      simplified: true,
    },
  ];

  const [selectedTab, setSelectedTab] = useState<TabI>(); //per avere tab attive

  useEffect(() => {
    setSelectedTab(tabs.find((t) => t.id === tab) || tabs[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  const formatRole = (role: string) => {
    if (!role) return "";
    return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
  };
  return (
    <div>
      <div className="max-w-7xl mx-auto">
        <div className=" rounded-lg  bg-background-default shadow-sm py-6 px-6 mb-3">
          <div className="flex  flex-col items-center justify-between pt-5 bg-gray-100  rounded-2xl ">
            <div className="flex w-full flex-col items-center rounded-2xl border-2 bg-white p-5 gap-2 border-vigil-orange/60">
              <div className="  flex items-center justify-center">
                <Avatar
                  size="xxl"
                  value={vigil?.displayName}
                  userId={vigil?.id}
                />
              </div>
              <div className="flex-1">
                <section className="flex flex-col items-center gap-2 ">
                  <h1 className="text-3xl font-boldtext-center">
                    {vigil?.displayName}
                  </h1>
                  <span className="text-gray-500 font-medium flex items-center text-center">
                    {formatRole(role)}
                  </span>
                  <div className="flex items-center gap-2 mb-3">
                    {vigil?.averageRating ? (
                      <div className="inline-flex items-center flex-nowrap gap-1">
                        <div className="flex items-center gap-1">
                          <StarIconSolid className="w-4 h-4 text-yellow-300" />
                          <p className="text-xs font-medium text-gray-600">
                            Valutazione media: {vigil?.averageRating}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <span className="text-gray-500 font-medium flex items-center text-center">
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
                role={role}
                tabs={tabs.map((t) => ({
                  ...t,
                  active: t.id === tab,
                }))}
                onTabChange={(tab) => setTab(tab.id as string)}
              />
              {selectedTab?.id === "panoramica" && <PanoramicaTab />}
              {selectedTab?.id === "servizi" && <ServiziTab />}
              {selectedTab?.id === "recensioni" && (
                <RecensioniTab simplified={true} />
              )}{" "}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default VigilProfile;
