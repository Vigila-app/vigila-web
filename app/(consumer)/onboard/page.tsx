import dynamic from "next/dynamic";

const ConsumerOnboardComponent = dynamic(
  () => import("@/components/onboarding/consumer/onboardComponent_Consumer"),
  { ssr: !!false }
);

export default function Profile() {
  return (
    <section id="user-profile">
      <ConsumerOnboardComponent />
    </section>
  );
}
