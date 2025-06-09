import { GuestI } from "@/src/types/crm.types";
import dynamic from "next/dynamic";

const CustomerManagementComponent = dynamic(
  () => import("@/components/crm/guests/customerManagement.component"),
  {
    ssr: !!false,
  }
);

export default function CustomerDetailsLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { guestId: GuestI["id"] };
}) {
  return (
    <section id="customer-details">
      <CustomerManagementComponent guestId={params.guestId} />
      {children}
    </section>
  );
}
