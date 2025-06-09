import { ModalBase } from "@/components/@core/modal";
import ServiceFormComponent, { ServiceFormI } from "@/components/services/serviceForm/serviceForm.component";
import { ServiceI } from "@/src/types/services.types";

export const ServiceFormModalId = "service-form-modal";

type ServiceFormModalI = {
  onSubmit?: ServiceFormI["onSubmit"];
  service?: ServiceI;
  text?: string;
  title?: string;
};

const ServiceFormModal = (props: ServiceFormModalI) => {
  const { onSubmit, service, text, title } = props;

  return (
    <ModalBase modalId={ServiceFormModalId} closable title="Service">
      <ServiceFormComponent
        isModal
        onSubmit={onSubmit}
        service={service}
        text={text}
        title={title}
      />
    </ModalBase>
  );
};

export default ServiceFormModal;
