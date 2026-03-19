import React, { ComponentType, useMemo } from "react";
import clsx from "clsx";
import { RolesEnum } from "@/src/enums/roles.enums";

export const SingleService = ({
  Icon,
  name,
  desc,
  price,
  checked, // optional controlled
  onChange, // optional controlled
  role,
}: {
  Icon: ComponentType<{ className?: string }>;
  name: string;
  desc: string;
  price: number;
  checked?: boolean;
  onChange?: (next: boolean) => void;
  role?: RolesEnum;
}) => {
  const [internalSelected, setInternalSelected] = React.useState(false);
  const selected = typeof checked === "boolean" ? checked : internalSelected;
  const toggle = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    const next = !selected;
    if (typeof onChange === "function") onChange(next);
    else setInternalSelected((v) => !v);
  };

  const colorClasses = useMemo(() => {
    const vigil = {
      border: "border-vigil-orange",
      bgLight: "bg-vigil-light-orange",
      text: "text-vigil-orange",
      bg: "bg-vigil-orange",
    };
    const consumer = {
      border: "border-consumer-light-blue",
      bgLight: "bg-consumer-light-blue",
      text: "text-consumer-blue",
      bg: "bg-consumer-blue",
    };
    return role === RolesEnum.CONSUMER ? consumer : vigil;
  }, [role]);
  return (
    <label
      className={clsx(
        "flex flex-col items-center justify-between gap-2 border-3 p-3 rounded-3xl cursor-pointer transition-all",
        selected
          ? clsx(colorClasses.border, "border-2 ", colorClasses.bgLight)
          : "border-zinc-400 bg-white",
      )}
      onMouseDown={(e) => toggle(e)}
    >
      <input type="radio" checked={selected} readOnly className="hidden" name="services" />
      <Icon
        className={clsx("w-10", selected ? colorClasses.text : "text-zinc-400")}
      />
      <span className="font-semibold text-zinc-900 text-center">{name}</span>
      <span className="text-sm text-zinc-500 text-center">{desc}</span>
      <div
        className={clsx(
          "badge px-2 py-1 rounded text-white text-xs font-bold",
          selected ? colorClasses.bg : "bg-zinc-400",
        )}
      >
        {price} EUR/h
      </div>
    </label>
  );
};
