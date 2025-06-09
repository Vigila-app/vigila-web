import { ModalBase } from "@/components/@core/modal";
import ServiceCatalogComponent from "./serviceCatalog.component";
import { ServiceI } from "@/src/types/services.types";
import { useState } from "react";
import { useModalStore } from "@/src/store/modal/modal.store";

export const ServiceCatalogModalId = "service-catalog-modal";

type ServiceCatalogModalI = {
  onSubmit?: (selected: ServiceI[]) => void;
  selected?: ServiceI[];
  text?: string;
  title?: string;
};

const ServiceCatalogModal = (props: ServiceCatalogModalI) => {
  const { closeModal } = useModalStore();
  const { onSubmit, selected: eSelected = [], text, title } = props;
  const [selected, setSelected] = useState<ServiceI[]>(eSelected);

  return (
    <ModalBase
      closable
      //customClass="!max-w-full !w-3/4"
      modalId={ServiceCatalogModalId}
      primaryActionLabel="Confirm"
      primaryAction={() => {
        onSubmit?.(selected);
        closeModal();
      }}
      title="Service Catalog"
    >
      <ServiceCatalogComponent
        isModal
        onChange={(newSelected) => setSelected(newSelected)}
        selected={selected}
        text={text}
        title={title}
      />
    </ModalBase>
  );
};

export default ServiceCatalogModal;
