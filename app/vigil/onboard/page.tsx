"use client";

import dynamic from "next/dynamic";

const OnboardComponent = dynamic(
  () => import("@/components/onboarding/vigil/onboardComponent_Vigil"),
  { ssr: !!false }
);

export default function Profile() {
  return (
    <section id="user-profile">
      <OnboardComponent />
    </section>
  );
}
