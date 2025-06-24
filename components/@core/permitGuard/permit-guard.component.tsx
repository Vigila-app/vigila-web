"use client";

import { Routes } from "@/src/routes";
import { useAppStore } from "@/src/store/app/app.store";
import { useUserStore } from "@/src/store/user/user.store";
import { NavigationUtils } from "@/src/utils/navigation.utils";
import { PermitGuardUtils } from "@/src/utils/permit-guard.utils";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const PermitGuardComponent = () => {
  const router = useRouter();
  const pathname = usePathname();
  const user = useUserStore((state) => state.user);
  const [hide, setHide] = useState(true);
  const { showLoader, hideLoader } = useAppStore();

  const handleNotAuthorized = () => {
    console.error("Not authorized, redirecting..");
    router.replace(Routes.home.url);
  };

  const checkPermission = async () => {
    const route = NavigationUtils.getRouteByUrl(pathname);
    if (route) {
      const isAuthorized = await PermitGuardUtils.isAuthorized(route, user);
      if (!isAuthorized) {
        handleNotAuthorized();
      } else {
        setHide(false);
      }
    } else {
      handleNotAuthorized();
    }
  };

  useEffect(() => {
    setHide(true);
    checkPermission();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, user]);

  useEffect(() => {
    if (hide) {
      showLoader();
    } else {
      hideLoader();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hide]);

  if (hide) {
    return (
      <div className="fixed bg-white w-full h-full top-0 left-0 z-50 pointer-events-auto touch-none select-none cursor-not-allowed" />
    );
  }
  return null;
};

export default PermitGuardComponent;
