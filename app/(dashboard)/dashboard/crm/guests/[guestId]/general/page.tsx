"use client";
import { GuestI } from "@/src/types/crm.types";
import dynamic from "next/dynamic";

const GuestDetailsComponent = dynamic(
  () => import("@/components/crm/guests/guestDetails.component"),
  {
    ssr: !!false,
  }
);

export default function CustomerDetails({
  params,
}: {
  params: { guestId: GuestI["id"] };
}) {
  if (!params?.guestId) return;

  return (
    <div id="customer-details-general" className="w-full">
      <GuestDetailsComponent guestId={params.guestId} editable />
    </div>
  );
}
