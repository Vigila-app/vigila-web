"use client";

import { LoaderSpinner } from "@/components";
import { useAppStore } from "@/src/store/app/app.store";

const GlobalLoaderManager = () => {
  const { isLoading = false } = useAppStore((state) => state.loader);

  if (!isLoading) return;

  return (
    <div role="status" className="fixed inset-0 height-100 width-100 bg-white/25 z-50 flex justify-center items-center cursor-wait">
      <LoaderSpinner size="big" />
    </div>
  );
};

export default GlobalLoaderManager;
