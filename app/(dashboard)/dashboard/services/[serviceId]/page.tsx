"use client";
import { ServiceI } from "@/src/types/services.types";
import dynamic from "next/dynamic";

const ServiceDetailsComponent = dynamic(
  () => import("@/components/services/serviceDetails.component"),
  {
    ssr: !!false,
  }
);

export default function TicketDetails({
  params,
}: {
  params: { serviceId: ServiceI["id"] };
}) {
  if (!params?.serviceId) return;

  return (
    <section id="service-details">
      <ServiceDetailsComponent serviceId={params.serviceId} />
    </section>
  );
}
