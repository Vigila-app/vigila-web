"use client";

import { Toast } from "@/components";
import { ToastPositionEnum } from "@/src/enums/toast.enum";
import { useAppStore } from "@/src/store/app/app.store";

const ToastManagerComponent = () => {
  const { toastList } = useAppStore();

  if (!toastList?.length) return;

  const getToastByPosition = (position: ToastPositionEnum) =>
    toastList.filter((toast) => toast.position === position);

  return (
    <div className="toast-manager fixed z-50 bg-transparent inset-0 pointer-events-none">
      {getToastByPosition(ToastPositionEnum.TOP).length ? (
        <div
          className="absolute top-16 left-1/2 space-y-2 max-h-svh w-2/3"
          style={{ transform: "translateX(-50%)" }}
        >
          {getToastByPosition(ToastPositionEnum.TOP).map((toast) => (
            <Toast {...toast} key={toast.id} />
          ))}
        </div>
      ) : null}

      {getToastByPosition(ToastPositionEnum.ASIDE).length ? (
        <aside className="absolute bottom-8 right-8 space-y-2 max-h-svh w-3/4 md:w-1/4">
          {getToastByPosition(ToastPositionEnum.ASIDE).map((toast) => (
            <Toast {...toast} key={toast.id} />
          ))}
        </aside>
      ) : null}
    </div>
  );
};

export default ToastManagerComponent;
