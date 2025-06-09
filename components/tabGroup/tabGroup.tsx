"use client";
import clsx from "clsx";
import Link from "next/link";
import { useEffect, useState } from "react";

export type TabI = {
  active?: boolean;
  label: string;
  url?: string;
};
type TabGroupI = {
  align?: "left" | "center" | "right";
  onTabChange?: (tab: TabI) => void;
  tabs: TabI[];
};

const TabGroup = (props: TabGroupI) => {
  const { align = "left", tabs = [], onTabChange = () => ({}) } = props;

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

        <select
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
        </select>
      </div>

      <div className="hidden sm:block">
        <div className="border-b border-gray-200">
          <nav
            className={clsx(
              "-mb-px flex gap-6",
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
                  key={tab.label}
                  href={tab.url}
                  className={clsx(
                    "shrink-0 p-3 border font-medium text-sm transition",
                    activeTab.label === tab.label
                      ? "rounded-t-lg border-gray-300 border-b-white bg-white text-primary-600 hover:!border-b-white hover:!border-gray-300"
                      : "border-transparent text-gray-500 hover:text-gray-700",
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
                  key={tab.label}
                  className={clsx(
                    "cursor-pointer shrink-0 p-3 border font-medium text-sm transition",
                    activeTab.label === tab.label
                      ? "rounded-t-lg border-gray-300 border-b-white text-primary-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
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
