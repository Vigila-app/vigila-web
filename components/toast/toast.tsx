"use client";

import { ToastPositionEnum, ToastStatusEnum } from "@/src/enums/toast.enum";
import { useAppStore } from "@/src/store/app/app.store";
import { ToastI } from "@/src/types/toast.type";
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";
import { useEffect } from "react";

type ToastComponentI = ToastI & {
  withIcon?: boolean;
};

const ToastPositionStyle = {
  [ToastPositionEnum.TOP as string]: "!text-white py-2 px-8 text-center",
  [ToastPositionEnum.ASIDE as string]: "!bg-white !text-gray-500 text-sm",
};
const ToastTypeStyle = {
  [ToastStatusEnum.INFO as string]:
    "bg-gray-500 border-gray-500/75 text-gray-500",
  [ToastStatusEnum.SUCCESS as string]:
    "bg-green-500 border-green-500/75 text-green-500",
  [ToastStatusEnum.WARNING as string]:
    "bg-orange-500 border-orange-500/75 text-orange-500",
  [ToastStatusEnum.ERROR as string]:
    "bg-red-500 border-red-500/75 text-red-500",
};

const getRoleByType = (type: ToastStatusEnum) => {
  switch (type) {
    case ToastStatusEnum.ERROR as string:
      return "error";
    case ToastStatusEnum.SUCCESS as string:
      return "status";
    case ToastStatusEnum.INFO as string:
    case ToastStatusEnum.WARNING as string:
    default:
      return "alert";
  }
};

const getIconByType = (type: ToastStatusEnum, className: string) => {
  switch (type) {
    case ToastStatusEnum.ERROR as string:
      return <ExclamationCircleIcon className={className} />;
    case ToastStatusEnum.SUCCESS as string:
      return <CheckCircleIcon className={className} />;
    case ToastStatusEnum.WARNING as string:
      return <ExclamationTriangleIcon className={className} />;
    case ToastStatusEnum.INFO as string:
      return <InformationCircleIcon className={className} />;
    default:
      return;
  }
};

const Toast = (props: ToastComponentI) => {
  const { hideToast } = useAppStore();
  const {
    id,
    message,
    position = ToastPositionEnum.ASIDE,
    type = ToastStatusEnum.INFO,
    withIcon = true,
    autoClose = true,
  } = props;

  const startAutoCloseTimer = () => {
    if (id && autoClose) {
      setTimeout(() => {
        hideToast({ id });
      }, 10000);
    }
  };

  useEffect(() => {
    if (id && autoClose) {
      startAutoCloseTimer();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <div
      className={clsx(
        "p-2 border rounded shadow transition pointer-events-auto cursor-default",
        ToastTypeStyle[type],
        ToastPositionStyle[position]
      )}
    >
      <div className="inline-flex items-center gap-2">
        {withIcon ? getIconByType(type, clsx("h-6 w-6")) : null}
        <span role={getRoleByType(type)}>{message}</span>
      </div>
    </div>
  );
};

export default Toast;
