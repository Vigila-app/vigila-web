import dynamic from "next/dynamic";

const OnboardComponent = dynamic(
  () => import("@/components/onboarding/consumer/onboardComponent_Consumer"),
  { ssr: !!false }
);

export default function Profile() {
  return (
    <section id="user-profile">
      <OnboardComponent />
    </section>
  );
}
