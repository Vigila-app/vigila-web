"use client";

import { useUserStore } from "@/src/store/user/user.store";
import { isServer } from "@/src/utils/common.utils";
import dynamic from "next/dynamic";
import { useEffect } from "react";

const VerifyEmailComponent = dynamic(
  () => import("@/components/user/verifyEmail.component"),
  {
    ssr: !!false,
  }
);

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, userDetails, getUserDetails } = useUserStore();

  useEffect(() => {
    if (!userDetails) {
      getUserDetails();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userDetails]);

  if (isServer || !user?.id || !userDetails) return null;

  return (
    <section id="user">
      {children}
      <div className="w-50"><VerifyEmailComponent position="bottom" /></div>
    </section>
  );
}
