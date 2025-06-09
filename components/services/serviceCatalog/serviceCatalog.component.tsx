import { useServicesStore } from "@/src/store/services/services.store";
import { ServiceCard } from "@/components/services";
import { ServiceI } from "@/src/types/services.types";
import { useEffect, useState } from "react";
import { Button } from "@/components";

type ServiceCatalogComponentI = {
  isModal?: boolean;
  onChange?: (selected: ServiceI[]) => void;
  selected?: ServiceI[];
  services?: ServiceI[];
  text?: string;
  title?: string;
};

const ServiceCatalogComponent = (props: ServiceCatalogComponentI) => {
  const {
    isModal,
    onChange = () => ({}),
    selected: eSelected = [],
    services: eServices,
  } = props;
  const { getServices, services: storeServices = [] } = useServicesStore();
  const [services, setServices] = useState<ServiceI[]>(
    eServices || storeServices
  );
  const [selected, setSelected] = useState<ServiceI[]>(eSelected);

  const handleChange = (service: ServiceI, isAdded = true) => {
    if (isAdded && !selected.find((s) => s.id === service.id)) {
      setSelected([...selected, service]);
    } else {
      setSelected(selected.filter((s) => s.id !== service.id));
    }
  };

  useEffect(() => {
    if (eServices) setServices(eServices);
  }, [eServices]);

  useEffect(() => {
    onChange?.(selected);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  useEffect(() => {
    if (!eServices) getServices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="w-full">
      <div className="w-full mb-4">
        {selected?.length
          ? `${selected.length} service${
              selected.length > 1 ? "s" : ""
            } selected`
          : "Select services to offer"}
      </div>
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {services.map((service) => {
          const isSelected = !!selected.find((s) => s.id === service.id);
          return (
            <ServiceCard
              key={service.id}
              service={service}
              selected={isSelected}
              action={
                service.active ? (
                  <Button
                    action={() => handleChange(service, !isSelected)}
                    disabled={!service.active}
                    label={isSelected ? "Selected" : "Add"}
                    customClass="!py-2 !text-xs"
                    primary={!isSelected}
                    secondary={isSelected}
                  />
                ) : null
              }
            />
          );
        })}
      </div>
    </div>
  );
};

export default ServiceCatalogComponent;
