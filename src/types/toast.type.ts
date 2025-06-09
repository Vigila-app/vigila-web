import { ToastPositionEnum, ToastStatusEnum } from "@/src/enums/toast.enum";

export type ToastI = {
  id?: string;
  title?: string;
  message?: string;
  children?: React.ReactNode;
  type?: ToastStatusEnum;
  position?: ToastPositionEnum;
  autoClose?: boolean;
  withIcon?: boolean;
};
