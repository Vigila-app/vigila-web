import clsx from "clsx";
import { dayNames } from "./Services";

export const SelectedDays = ({
  selectedDays,
  answers,
  currentDayIdx,
  setCurrentDayIdx,
  classes,
  isInteractive = true,
}: {
  selectedDays: number[];
  answers?: Record<string, any>;
  currentDayIdx: number;
  setCurrentDayIdx: (arg: number) => void;
  isInteractive?: boolean;
  classes: {
    bg: string;
    bgLight: string;
    text: string;
    border: string;
    hoverBorder: string;
    hoverText: string;
  };
}) => {
  return selectedDays.map((day, idx) => {
    const isActive = idx === currentDayIdx;
    const dayServices = answers?.services?.[day];
    const hasEdited = !!dayServices;
    return (
      <div key={"rule_" + day} className="flex items-center">
        <button
          type="button"
          onClick={isInteractive ? () => setCurrentDayIdx(idx) : undefined}
          disabled={!isInteractive}
          aria-disabled={!isInteractive}
          className={clsx(
            "font-bold text-sm px-4 py-2 rounded-full",
            !isInteractive && "cursor-default",
            isActive
              ? clsx("text-white", classes.bg)
              : "text-zinc-700 bg-white border",
          )}
        >
          {dayNames[Number(day)]}
        </button>
      </div>
    );
  });
};
