"use client";

import { Routes } from "@/src/routes";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const HeadComponent = dynamic(
  () => import("@/components/@core/head/head.component"),
  { ssr: !!false }
);

export default function Account() {
  const router = useRouter();

  useEffect(() => {
    router.push(Routes.accountSecurity.url);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <HeadComponent title={Routes.account.title} />
    </>
  );
}
