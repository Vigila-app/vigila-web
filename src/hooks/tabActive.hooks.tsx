"use client";
import { useCallback, useEffect, useState } from "react";

const useTabActive = () => {
  const [visibilityState, setVisibilityState] = useState(true);

  const handleVisibilityChange = useCallback(() => {
    setVisibilityState(document.visibilityState === "visible");
  }, []);

  useEffect(() => {
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return visibilityState;
};

export default useTabActive;
