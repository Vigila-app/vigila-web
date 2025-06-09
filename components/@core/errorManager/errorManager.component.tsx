"use client";

import { useEffect } from "react";
import { useAppStore } from "@/src/store/app/app.store";
import { ErrorUtils } from "@/src/utils/error.utils";

const ErrorManagerComponent = () => {
  const { error } = useAppStore();

  useEffect(() => {
    if (error?.code) {
      // TODO manage error
      console.log(ErrorUtils.getErrorByCode(error));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error?.code]);

  return;
};

export default ErrorManagerComponent;
