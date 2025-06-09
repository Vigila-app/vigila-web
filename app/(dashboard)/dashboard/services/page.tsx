import dynamic from "next/dynamic";

const ServiceListComponent = dynamic(
  () => import("@/components/services/serviceList.component"),
  {
    ssr: !!false,
  }
);

export default async function Services() {
  return (
    <section id="services">
      <ServiceListComponent />
    </section>
  );
}
