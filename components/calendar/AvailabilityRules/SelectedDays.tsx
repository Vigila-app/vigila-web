import clsx from "clsx";
import { dayNames } from "./Services";

export const SelectedDays = ({
  selectedDays,
  answers,
  currentDayIdx,
  setCurrentDayIdx,
  classes,
}: {
  selectedDays: number[];
  answers?: Record<string, any>;
  currentDayIdx: number;
  setCurrentDayIdx: (arg: number) => void;
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
          onClick={() => setCurrentDayIdx(idx)}
          className={clsx(
            "font-bold text-sm px-4 py-2 rounded-full",
            isActive || hasEdited
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
