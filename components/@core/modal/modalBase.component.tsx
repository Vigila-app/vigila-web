"use client";

import { Button } from "@/components";
import { ModalPortalComponent } from "@/components/@core/modal";
import { useModalStore } from "@/src/store/modal/modal.store";
import { ModalI } from "@/src/types/modal.types";
import { XMarkIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";

type ModalBaseI = ModalI & {
  title?: string;
  primaryAction?: () => void;
  primaryActionLabel?: string;
  secondaryAction?: () => void;
  secondaryActionLabel?: string;
  secondaryActionType?: "default" | "danger";
};

const ModalBase = (props: ModalBaseI) => {
  const { closeModal } = useModalStore();
  const {
    children,
    closable = false,
    customClass,
    modalId,
    onClose,
    primaryAction,
    primaryActionLabel = "Confirm",
    secondaryAction,
    secondaryActionLabel = "Cancel",
    secondaryActionType = "default",
    target,
    title,
  } = props;

  const handleModalClose = () => {
    closeModal();
    onClose?.();
  };

  const withFooter = !!(primaryAction || secondaryAction);

  return (
    <ModalPortalComponent
      customClass={customClass}
      modalId={modalId}
      target={target}
      closable={closable}
      onClose={onClose}
    >
      <>
        <div className="modal-header relative mb-4">
          {title ? (
            <h2 className="text-lg font-semibold leading-none">{title}</h2>
          ) : null}
          {closable ? (
            <span
              role="button"
              onClick={handleModalClose}
              aria-label="Close modal"
              className="absolute -top-2 -right-2 transition hover:text-gray-500"
            >
              <XMarkIcon className="size-6 md:size-5" />
            </span>
          ) : null}
        </div>
        <div
          className={clsx(
            "modal-body px-2 text-sm text-gray-500 pt-1 overflow-y-auto",
            "max-h-[calc(100vh-6rem)]",
            "md:max-h-[calc(100vh-16rem)]"
          )}
        >
          {children}
        </div>
        {withFooter ? (
          <div className="modal-footer mt-4 justify-end flex gap-4">
            {secondaryAction ? (
              <Button
                secondary={secondaryActionType === "default"}
                danger={secondaryActionType === "danger"}
                label={secondaryActionLabel}
                action={secondaryAction}
              />
            ) : null}
            {primaryAction ? (
              <Button
                primary
                label={primaryActionLabel}
                action={primaryAction}
              />
            ) : null}
          </div>
        ) : null}
      </>
    </ModalPortalComponent>
  );
};

export default ModalBase;
