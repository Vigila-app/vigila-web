"use client";

import { Avatar } from "@/components";
import { useModalStore } from "@/src/store/modal/modal.store";
import { VigilDetailsType } from "@/src/types/vigil.types";
import { dateDisplay } from "@/src/utils/date.utils";
import { CalendarIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";

type Props = {
  vigil?: VigilDetailsType;
};

const VigilProfileModalHeader = ({ vigil }: Props) => {
  const { closeModal } = useModalStore();

  return (
    <div className="relative flex w-full flex-col items-center rounded-2xl border-2 bg-white p-5 gap-2 border-vigil-orange/60">
      <button
        type="button"
        onClick={closeModal}
        aria-label="Chiudi"
        className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
      >
        <XMarkIcon className="h-12 w-12" />
      </button>

      <div className="flex items-center justify-center">
        <Avatar size="big" value={vigil?.displayName} userId={vigil?.id} />
      </div>

      <section className="flex flex-col items-center gap-2">
        <h2 className="text-2xl font-bold text-center">
          {vigil?.displayName || "Caricamento..."}
        </h2>
        <span className="text-gray-500 font-medium text-center">Vigil</span>

        <div className="flex items-center flex-wrap justify-center gap-3 mb-1">
          {vigil?.averageRating ? (
            <div className="inline-flex items-center gap-1">
              <StarIconSolid className="w-4 h-4 text-yellow-300" />
              <p className="text-xs font-medium text-gray-600">
                Valutazione media: {vigil.averageRating}
              </p>
            </div>
          ) : (
            <span className="text-xs font-medium text-gray-500">
              0 recensioni
            </span>
          )}

          {vigil?.created_at && (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-700">
              <CalendarIcon className="w-4 h-4 text-gray-400" />
              Su Vigil da:&nbsp;
              <span className="capitalize">
                {dateDisplay(vigil.created_at, "monthYearLiteral")}
              </span>
            </span>
          )}
        </div>
      </section>
    </div>
  );
};

export default VigilProfileModalHeader;
