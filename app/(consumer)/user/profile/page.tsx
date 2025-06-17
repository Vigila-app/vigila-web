"use client";

import dynamic from "next/dynamic";

const UpdateProfileComponent = dynamic(
  () => import("@/components/user/profile/updateProfile.component"),
  { ssr: !!false }
);

export default function Profile() {
  return (
    <section id="user-profile">
      <UpdateProfileComponent />
    </section>
  );
}
