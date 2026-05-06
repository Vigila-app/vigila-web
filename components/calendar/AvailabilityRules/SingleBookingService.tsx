import { useEffect, useMemo, useState } from "react";
import { RolesEnum } from "@/src/enums/roles.enums";
import { ServicesService } from "@/src/services";
import { ServiceCatalogTypeEnum } from "@/src/enums/services.enums";
import { ServiceDayForm } from "./ServiceDayForm";

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

export const SingleBookingService = ({
  answers,
  setAnswers,
  role = RolesEnum.CONSUMER,
}: SingleBookingServiceProps) => {
  const catalog = useMemo(() => ServicesService.getServicesCatalog(), []);

  const [selectedServiceName, setSelectedServiceName] = useState<string | null>(
    () => {
      const direct = answers?.service_type as
        | ServiceCatalogTypeEnum
        | undefined;
      if (direct) return catalog.find((s) => s.type === direct)?.name ?? null;
      const fromServices =
        answers?.services && typeof answers.services === "object"
          ? (
              Object.values(answers.services)[0] as
                | { services?: string }
                | undefined
            )?.services
          : undefined;
      return fromServices ?? null;
    },
  );
  const [car, setCar] = useState<boolean>(!!answers?.car);
  const [notes, setNotes] = useState<string>(
    typeof answers?.notes === "string" ? answers.notes : "",
  );

  useEffect(() => {
    if (!setAnswers) return;
    const selectedType = catalog.find((s) => s.name === selectedServiceName)
      ?.type as ServiceCatalogTypeEnum | undefined;
    setAnswers((prev) => {
      const next = { ...(prev || {}) };
      let changed = false;
      if (selectedType && selectedType !== prev?.service_type) {
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
  }, [selectedServiceName, car, notes, setAnswers, catalog]);

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
        <ServiceDayForm
          selectedServiceName={selectedServiceName}
          car={car}
          notes={notes}
          onServiceChange={setSelectedServiceName}
          onCarChange={setCar}
          onNotesChange={setNotes}
          role={role}
          notesInputId="single-service-notes"
        />
      </div>
    </div>
  );
};

export default SingleBookingService;
