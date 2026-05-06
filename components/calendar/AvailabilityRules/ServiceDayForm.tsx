import { ComponentType, useMemo } from "react";
import clsx from "clsx";
import { HeartIcon, UserGroupIcon } from "@heroicons/react/24/outline";
import { RolesEnum } from "@/src/enums/roles.enums";
import { ServicesService } from "@/src/services";
import Caffe from "@/components/svg/Caffe";
import Vasca from "@/components/svg/Vasca";
import { Car } from "@/components/svg";
import { SingleService } from "./SingleService";

export const SERVICE_ICON_MAP: Record<
  string,
  ComponentType<{ className?: string }>
> = {
  "Compagnia e conversazione": Caffe as ComponentType<{ className?: string }>,
  "Assistenza leggera": HeartIcon as ComponentType<{ className?: string }>,
  "Assistenza alla persona": UserGroupIcon as ComponentType<{
    className?: string;
  }>,
  "Igiene personale": Vasca as ComponentType<{ className?: string }>,
};

type ServiceDayFormProps = {
  selectedServiceName: string | null;
  car: boolean;
  notes: string;
  onServiceChange: (name: string) => void;
  onCarChange: (car: boolean) => void;
  onNotesChange: (notes: string) => void;
  role?: RolesEnum;
  notesInputId?: string;
};

export const ServiceDayForm = ({
  selectedServiceName,
  car,
  notes,
  onServiceChange,
  onCarChange,
  onNotesChange,
  role = RolesEnum.CONSUMER,
  notesInputId = "service-day-notes",
}: ServiceDayFormProps) => {
  const catalog = useMemo(() => ServicesService.getServicesCatalog(), []);

  const colorClasses = useMemo(
    () =>
      role === RolesEnum.CONSUMER
        ? {
            bgLight: "bg-consumer-light-blue",
            text: "text-consumer-blue",
            border: "border-consumer-light-blue",
          }
        : {
            bgLight: "bg-vigil-light-orange",
            text: "text-vigil-orange",
            border: "border-vigil-orange",
          },
    [role],
  );

  return (
    <>
      <div className="grid sm:grid-cols-2 grid-cols-1 gap-3 mb-4">
        {catalog.map((service) => {
          const Icon = SERVICE_ICON_MAP[service.name] || HeartIcon;
          const price =
            service.recommended_hourly_rate ??
            service.min_hourly_rate ??
            service.max_hourly_rate ??
            0;
          return (
            <SingleService
              key={service.type}
              Icon={Icon}
              name={service.name}
              desc={service.description}
              price={price}
              role={role}
              checked={selectedServiceName === service.name}
              onChange={() => onServiceChange(service.name)}
            />
          );
        })}
      </div>

      <div className="mb-4">
        <label
          className={clsx(
            "block cursor-pointer w-full p-3 rounded-2xl border",
            car
              ? clsx(colorClasses.border, colorClasses.bgLight)
              : "border-zinc-200 bg-white",
          )}
        >
          <input
            type="checkbox"
            checked={car}
            onChange={() => onCarChange(!car)}
            className="hidden"
          />
          <h3 className="flex items-center gap-2 w-full font-bold text-lg">
            <Car className={clsx("w-5 h-5", colorClasses.text)} />
            <span>Accompagnamento in auto</span>
          </h3>
          <p className="text-md text-zinc-400">
            L&apos;operatore accompagna con la sua propria auto
          </p>
          <p className={clsx("text-xs", colorClasses.text)}>
            +5 EUR rimborso carburante per visita
          </p>
        </label>
      </div>

      <div className="mb-4">
        <label htmlFor={notesInputId} className="block font-semibold mb-1">
          Note
        </label>
        <textarea
          id={notesInputId}
          className="w-full border rounded-md p-2"
          rows={2}
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          placeholder="Aggiungi note opzionali..."
        />
      </div>
    </>
  );
};
