"use client";
import { RolesEnum } from "@/src/enums/roles.enums";
import clsx from "clsx";
import Link from "next/link";
import { useEffect, useState } from "react";

export type TabI = {
  active?: boolean;
  label: any;
  id?: string;
  url?: string;
};
type TabGroupI = {
  align?: "left" | "center" | "right";
  onTabChange?: (tab: TabI) => void;
  tabs: TabI[];
  role?: RolesEnum;
};

const TabGroup = (props: TabGroupI) => {
  const { align = "left", tabs = [], onTabChange = () => ({}), role } = props;

  const [activeTab, setActiveTab] = useState<TabI | undefined>(() => tabs.find((tab) => tab.active) || tabs[0]);

  

  useEffect(() => {
    if (activeTab) onTabChange(activeTab);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  return (
    <div>
      <div className="sm:hidden">
        <label htmlFor="Tab" className="sr-only">
          Nav Tab
        </label>
        {/* TODO possibilità di scelta del tipo di menu per le tabs */}
        {/* <select
          id="Tab"
          className="w-full p-3 rounded-md border border-gray-200"
          value={activeTab.label}
          onChange={({ currentTarget: { value } }) => {
            setActiveTab(tabs.find((tab) => tab.label === value) || tabs[0]);
          }}
        >
          {tabs.map((tab) => (
            <option
              selected={activeTab.label === tab.label}
              key={tab.label}
              value={tab.label}
            >
              {tab.label}
            </option>
          ))}
        </select> */}
        <div className="flex justify-center gap-2 ">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              role={role}
              onClick={() => setActiveTab(tab)}
              className={clsx(
                "px-3 py-1 text-sm font-medium transition-colors border rounded-4xl border-transparent text-gray-500 stroke-gray-500",
                activeTab?.id === tab.id
                  ? role === RolesEnum.CONSUMER
                    ? "!text-consumer-blue bg-white"
                    : "!text-vigil-orange bg-white"
                  : null
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="hidden sm:block">
        <div className="border-b border-gray-200">
          <nav
            className={clsx(
              " px-6 flex gap-6",
              align === "center"
                ? "justify-center"
                : align === "left"
                  ? "justify-start"
                  : "justify-end"
            )}
          >
            {tabs.map((tab) =>
              tab.url ? (
                <Link
                  key={tab.id}
                  href={tab.url}
                  className={clsx(
                    "shrink-0 p-3 border font-medium text-sm transition",
                    activeTab?.id === tab.id
                      ? role === RolesEnum.CONSUMER
                        ? "rounded-t-2xl bg-white !text-consumer-blue"
                        : "rounded-t-2xl bg-white !text-vigil-orange"
                      : null,
                    "border-transparent text-gray-500 stroke-gray-500 hover:text-black hover:stroke-black",
                    "hover:rounded-t-lg hover:border-gray-200"
                  )}
                  onClick={() => {
                    setActiveTab(tab);
                  }}
                >
                  {tab.label}
                </Link>
              ) : (
                <span
                  key={tab.id}
                  className={clsx(
                    "cursor-pointer shrink-0 p-3 border font-medium text-sm transition",
                    activeTab?.id === tab.id
                      ? role === RolesEnum.CONSUMER
                        ? "rounded-t-lg  border-b-white !text-consumer-blue"
                        : "rounded-t-lg  border-b-white !text-vigil-orange"
                      : "border-transparent text-gray-500 hover:text-black"
                  )}
                  onClick={() => {
                    setActiveTab(tab);
                  }}
                >
                  {tab.label}
                </span>
              )
            )}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default TabGroup;
