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

  const [activeTab, setActiveTab] = useState(
    tabs.find((tab) => tab.active) || tabs[0]
  );

  useEffect(() => {
    onTabChange(activeTab);
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
        <div className="flex gap-2 border-y  border-gray-200 pb-2 pt-2 mt-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              role={role}
              onClick={() => setActiveTab(tab)}
              className={clsx(
                "px-4 py-2 text-sm font-medium transition-colors border-t-2  ",
                activeTab.label === tab.label
                  ? role === RolesEnum.CONSUMER
                    ? "border-consumer-blue text-consumer-blue stroke-consumer-blue"
                    : "border-vigil-orange text-vigil-orange stroke-vigil-orange"
                  : "border-transparent text-gray-500 stroke-gray-500 hover:text-black  hover:stroke-black"
              )}>
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
            )}>
            {tabs.map((tab) =>
              tab.url ? (
                <Link
                  key={tab.id}
                  href={tab.url}
                  className={clsx(
                    "shrink-0 p-3 border font-medium text-sm transition",
                    activeTab.label === tab.label
                      ? "rounded-t-2xl   bg-white text-primary-600"
                      : "border-transparent text-gray-500 stroke-gray-500 hover:text-black hover:stroke-black",
                    "hover:rounded-t-lg hover:border-gray-200"
                  )}
                  onClick={() => {
                    setActiveTab(tab);
                  }}>
                  {tab.label}
                </Link>
              ) : (
                <span
                  key={tab.id}
                  className={clsx(
                    "cursor-pointer shrink-0 p-3 border font-medium text-sm transition",
                    activeTab.label === tab.label
                      ? "rounded-t-lg  border-b-white text-primary-600"
                      : "border-transparent text-gray-500 hover:text-black"
                  )}
                  onClick={() => {
                    setActiveTab(tab);
                  }}>
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
