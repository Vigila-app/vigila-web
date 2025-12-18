import clsx from "clsx";
import { ReactNode } from "react";

export type TabItem = {
  id: string;
  label: ReactNode;
  disabled?: boolean;
};

interface TabGroupProps {
  tabs: TabItem[];
  selectedId: string;
  onChange: (id: string) => void;
  variant?: "segmented" | "pills" | "icons";
}

export const TabGroup = ({
  tabs,
  selectedId,
  onChange,
  variant = "pills",
}: TabGroupProps) => {
  const containerStyles = clsx(
    "flex items-center w-full",
    // Stile Movimenti:
    variant === "segmented" && "bg-gray-200 p-1 rounded-4xl gap-1",
    // Stile Prenotazioni:
    variant === "pills" && "gap-2 overflow-x-auto no-scrollbar",
    // Stile Profilo:
    variant === "icons" && "justify-between px-6 py-3 border-t border-gray-100"
  );

  return (
    <div className={containerStyles}>
      {tabs.map((tab) => {
        const isActive = selectedId === tab.id;

        // 2. Stili del Bottone
        const buttonStyles = clsx(
          "flex items-center justify-center transition-all duration-200 ease-in-out focus:outline-none whitespace-nowrap",

          //  VARIANTE SEGMENTED (Movimenti)
          variant === "segmented" && [
            "flex-1 py-1 text-sm font-medium rounded-2xl",
            isActive
              ? "bg-white text-black shadow-sm"
              : "text-black hover:text-gray-700 bg-transparent",
          ],

          // VARIANTE PILLS (Prenotazioni)
          variant === "pills" && [
            "px-4 py-2 rounded-full border text-sm font-medium shrink-0",
            isActive
              ? "bg-white  text-black"
              : "bg-white text-gray-600 hover:bg-gray-50",
          ],

          // VARIANTE ICONS (Profilo)
          variant === "icons" && [
            "flex flex-col gap-1 py-1 px-2 rounded-2xl",
            isActive
              ? "text-consumer-blue bg-white"
              : "text-gray-400 hover:text-gray-600",
          ]
        );

        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            disabled={tab.disabled}
            className={buttonStyles}>
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};
export default TabGroup;
