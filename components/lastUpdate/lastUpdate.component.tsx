"use client";

import { isValidDate } from "@/src/utils/date.utils";
import { ArrowPathIcon } from "@heroicons/react/24/outline";

type LastUpdateI = {
  lastUpdate: Date | string;
  onUpdate?: () => void;
};

const LastUpdate = (props: LastUpdateI) => {
  const { lastUpdate, onUpdate = () => ({}) } = props;
  return (
    <div className="inline-flex items-center text-xs gap-1">
      <button onClick={onUpdate} role="button">
        <ArrowPathIcon className="size-4" />
      </button>
      <span className="hidden md:block">
        Ultimo aggiornamento:
        {lastUpdate && isValidDate(lastUpdate as Date)
          ? new Date(lastUpdate).toLocaleString()
          : "-"}
      </span>
    </div>
  );
};

export default LastUpdate;
