import { ComponentType, useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import { HeartIcon, UserGroupIcon } from "@heroicons/react/24/outline";
import { RolesEnum } from "@/src/enums/roles.enums";
import { ServicesService } from "@/src/services";
import {
  ServiceCatalogTypeEnum,
  ServiceCatalogTypeLabels,
} from "@/src/enums/services.enums";
import Caffe from "@/components/svg/Caffe";
import Vasca from "@/components/svg/Vasca";
import { Car } from "@/components/svg";
import { SingleService } from "./SingleService";

const SERVICE_ICON_MAP: Record<
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

type SingleBookingServiceProps = {
  answers?: Record<string, any>;
  setAnswers?: (
    updater:
      | Record<string, any>
      | ((prev: Record<string, any>) => Record<string, any>),
  ) => void;
  role?: RolesEnum;
  isLastStep?: boolean;
};

const findTypeByLabel = (label: string | undefined | null) => {
  if (!label) return undefined;
  const entry = Object.entries(ServiceCatalogTypeLabels).find(
    ([, lbl]) => lbl === label,
  );
  return entry?.[0] as ServiceCatalogTypeEnum | undefined;
};

export const SingleBookingService = ({
  answers,
  setAnswers,
  role = RolesEnum.CONSUMER,
}: SingleBookingServiceProps) => {
  const catalog = useMemo(() => ServicesService.getServicesCatalog(), []);

  const [selectedType, setSelectedType] = useState<
    ServiceCatalogTypeEnum | undefined
  >(() => {
    const direct = answers?.service_type as ServiceCatalogTypeEnum | undefined;
    if (direct) return direct;
    const fromServices =
      answers?.services && typeof answers.services === "object"
        ? (
            Object.values(answers.services)[0] as
              | { services?: string }
              | undefined
          )?.services
        : undefined;
    return findTypeByLabel(fromServices);
  });
  const [car, setCar] = useState<boolean>(!!answers?.car);
  const [notes, setNotes] = useState<string>(
    typeof answers?.notes === "string" ? answers.notes : "",
  );

  useEffect(() => {
    if (!setAnswers) return;
    setAnswers((prev) => {
      const next = { ...(prev || {}) };
      let changed = false;
      if (selectedType && prev?.service_type !== selectedType) {
        next.service_type = selectedType;
        changed = true;
      }
      if (!!prev?.car !== car) {
        next.car = car;
        changed = true;
      }
      if ((prev?.notes ?? "") !== notes) {
        next.notes = notes;
        changed = true;
      }
      return changed ? next : prev;
    });
  }, [selectedType, car, notes, setAnswers]);

  const colorClasses = useMemo(() => {
    const vigil = {
      bg: "bg-vigil-orange",
      bgLight: "bg-vigil-light-orange",
      text: "text-vigil-orange",
      border: "border-vigil-orange",
    };
    const consumer = {
      bg: "bg-consumer-blue",
      bgLight: "bg-consumer-light-blue",
      text: "text-consumer-blue",
      border: "border-consumer-light-blue",
    };
    return role === RolesEnum.CONSUMER ? consumer : vigil;
  }, [role]);

  return (
    <div className="bg-zinc-200 p-4 rounded-2xl">
      <div className="bg-white p-4 rounded-2xl">
        <div className="mb-4">
          <h2 className="font-semibold text-lg mb-1">
            Di che servizio hai bisogno?
          </h2>
          <p className="text-sm text-zinc-500">
            Scegli il servizio principale per questa prenotazione.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
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
                checked={selectedType === service.type}
                onChange={() =>
                  setSelectedType(service.type as ServiceCatalogTypeEnum)
                }
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
              onChange={() => setCar((v) => !v)}
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

        <div>
          <label
            htmlFor="single-service-notes"
            className="block font-semibold mb-1"
          >
            Note
          </label>
          <textarea
            id="single-service-notes"
            className="w-full border rounded-md p-2"
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Aggiungi note opzionali..."
          />
        </div>
      </div>
    </div>
  );
};

export default SingleBookingService;
