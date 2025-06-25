"use client";

import dynamic from "next/dynamic";

const OnboardingComponent = dynamic(
  () => import("@/components/onboarding/onboardingComponent"),
  { ssr: !!false }
);

export default function Profile() {
  return (
    <section id="user-profile">
      <OnboardingComponent />
    </section>
  );
}
