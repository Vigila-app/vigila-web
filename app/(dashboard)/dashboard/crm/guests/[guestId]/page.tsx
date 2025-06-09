"use client";

import { Routes } from "@/src/routes";
import { GuestI } from "@/src/types/crm.types";
import { replaceDynamicUrl } from "@/src/utils/common.utils";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ManageCustomerId({
  params,
}: {
  params: { guestId: GuestI["id"] };
}) {
  const router = useRouter();
  useEffect(() => {
    router.push(
      `${replaceDynamicUrl(
        Routes.guestDetails.url,
        ":guestId",
        params.guestId
      )}/general`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return;
}
