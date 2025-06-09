export type ModalI = {
  children?: React.ReactNode;
  closable?: boolean;
  customClass?: string;
  modalId: string;
  onClose?: () => void;
  target?: string;
};

export type ModalStoreType = {
  onLogout: () => void;

  isOpen: boolean;
  modalId?: string;
  payload?: { [key: string]: string | number | {} | any[] };
  openModal: (
    modalId: ModalStoreType["modalId"],
    payload?: ModalStoreType["payload"]
  ) => void;
  closeModal: () => void;
};
