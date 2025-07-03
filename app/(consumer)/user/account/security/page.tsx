"use client";

import { Divider } from "@/components";
import { Routes } from "@/src/routes";
import { useUserStore } from "@/src/store/user/user.store";
import dynamic from "next/dynamic";

const HeadComponent = dynamic(
  () => import("@/components/@core/head/head.component"),
  { ssr: !!false }
);
const DeleteUserComponent = dynamic(() => import("./deleteUser.component"), {
  ssr: !!false,
});
const UpdateEmailComponent = dynamic(() => import("./updateEmail.component"), {
  ssr: !!false,
});
const UpdatePasswordComponent = dynamic(
  () => import("./updatePassword.component"),
  { ssr: !!false }
);

export default function Profile() {
  const user = useUserStore((state) => state.user);
  return (
    <>
      <HeadComponent title={Routes.accountSecurity.title} />
      <h1 className="text-lg font-medium leading-none sticky top-0 p-4 mb-4 z-40">
        Account security
      </h1>
      <div className="px-4 pb-4">
        {user?.emailVerified ? (
          <>
            <UpdateEmailComponent />
            <Divider />
          </>
        ) : null}
        <UpdatePasswordComponent />
        <Divider />
        <DeleteUserComponent />
      </div>
    </>
  );
}
