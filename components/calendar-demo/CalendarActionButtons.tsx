import React from "react";
import { PlusIcon, PencilIcon } from "@heroicons/react/24/outline";
import Button from "@/components/button/button";
import { RolesEnum } from "@/src/enums/roles.enums";
import ButtonLink from "../button/buttonLink";

export const CalendarActionButtons = ({}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-3 mt-6 w-full">
      {/* <Button
        action={onEditRecurrence}
        label="Modifica ricorrenza"
        full
        icon={<PencilIcon className="w-5 h-5" />}
        secondary
      /> */}

      <ButtonLink
        href="booking/initialization"
        full
        role={RolesEnum.VIGIL}
        label="Aggiungi visita"
        icon={<PlusIcon className="w-5 h-5" />}
      />
    </div>
  );
};
