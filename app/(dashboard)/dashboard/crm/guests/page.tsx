"use client";
import dynamic from "next/dynamic";

const CustomerListComponent = dynamic(
  () => import("@/components/crm/guests/customerList.component"),
  { ssr: !!false }
);

export default function Customers() {
  return (
    <section id="crm-customers">
      <CustomerListComponent />
    </section>
  );
}
