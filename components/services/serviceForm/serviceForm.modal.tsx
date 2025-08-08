import { ModalBase } from "@/components/@core/modal";
import ServiceFormComponent, {
  ServiceFormI,
} from "@/components/services/serviceForm/serviceForm.component";
import { useModalStore } from "@/src/store/modal/modal.store";
import { ServiceI } from "@/src/types/services.types";
import { useState } from "react";

export const ServiceFormModalId = "service-form-modal";

type ServiceFormModalI = {
  onSubmit?: ServiceFormI["onSubmit"];
  text?: string;
  title?: string;
};
const ServiceFormModal = (props: ServiceFormModalI) => {
  const { onSubmit, text, title } = props;
  const { isOpen, closeModal, modalId, payload } = useModalStore();
  const modalIsOpen = isOpen && modalId === ServiceFormModalId;
  if (!modalIsOpen) return null;
  const service = payload?.service as ServiceI | undefined;

  const handleSubmit = (newService: ServiceI) => {
    onSubmit?.(newService);
    console.log(newService);
    closeModal();
  };

  return (
    <ModalBase
      modalId={ServiceFormModalId}
      closable
      title="Servizio"
      onClose={closeModal}>
      <ServiceFormComponent
        isModal
        onSubmit={handleSubmit}
        service={service}
        text={text}
        title={title}
      />
    </ModalBase>
  );
};

export default ServiceFormModal;
