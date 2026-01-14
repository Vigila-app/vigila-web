import dynamic from "next/dynamic";

const ConsumerMultiStepOnboarding = dynamic(
  () => import("@/components/onboarding/consumer/ConsumerMultiStepOnboarding"),
  { ssr: false }
);

export default function ConsumerOnboardPage() {
  return (
    <section id="consumer-onboard-multi-step">
      <ConsumerMultiStepOnboarding />
    </section>
  );
}
