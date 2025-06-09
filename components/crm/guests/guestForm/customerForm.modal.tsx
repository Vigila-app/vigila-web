import { ModalBase } from "@/components/@core/modal";
import CustomerFormComponent, {
  CustomerFormI,
} from "@/components/crm/guests/guestForm/customerForm.component";
import { GuestI } from "@/src/types/crm.types";

export const CustomerFormModalId = "customer-form-modal";

type CustomerFormModalI = {
  onSubmit?: CustomerFormI["onSubmit"];
  customer?: GuestI;
  onClose?: () => void;
  text?: string;
  title?: string;
};

const CustomerFormModal = (props: CustomerFormModalI) => {
  const { onSubmit, customer, onClose = () => ({}), text, title } = props;

  return (
    <ModalBase
      modalId={CustomerFormModalId}
      closable
      onClose={onClose}
      title="Customer"
    >
      <CustomerFormComponent
        isModal
        onSubmit={onSubmit}
        customer={customer}
        text={text}
        title={title}
      />
    </ModalBase>
  );
};

export default CustomerFormModal;
