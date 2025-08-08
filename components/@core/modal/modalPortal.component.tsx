"use client";

import { useModalStore } from "@/src/store/modal/modal.store";
import { ModalI } from "@/src/types/modal.types";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

type ModalPortalI = ModalI & {
  customClass?: string;
};

const ModalPortalComponent = (props: ModalPortalI) => {
  const { isOpen, modalId: storeModalId, closeModal } = useModalStore();
  const {
    children,
    closable = false,
    customClass,
    modalId,
    onClose,
    target,
  } = props;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(isOpen && storeModalId === modalId);
  }, [isOpen, storeModalId, modalId]);

  const handleClose = () => {
    if (mounted && closable) {
      closeModal();
      onClose?.();
    }
  };

  useEffect(() => {
    if (mounted && closable) {
      const keyDownHandler = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          e.preventDefault();
          handleClose();
        }
      };

      document.addEventListener("keydown", keyDownHandler);

      return () => {
        document.removeEventListener("keydown", keyDownHandler);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted, closable]);

  return mounted
    ? createPortal(
        <div className="curtain fixed flex justify-center z-50 inset-0 w-full h-screen bg-black/25">
          <div
            className={clsx(
              "absolute z-50 bg-white p-6",
              "w-screen h-screen top-0 left-0",
              "md:w-full md:h-auto md:max-w-2xl md:left-1/2 md:-translate-x-1/2 md:top-1/4 md:-translate-y-1/4 md:max-h-[calc(100vh-8rem)]",
              "lg:max-w-5xl",
              "rounded border border-gray-200 shadow-xl overflow-hidden",
              customClass
            )}
          >
            {children}
          </div>
        </div>,
        target
          ? document.getElementById(target) || document.body
          : document.body
      )
    : null;
};

export default ModalPortalComponent;
