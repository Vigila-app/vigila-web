import { Routes } from "@/src/routes";
import { ServiceI } from "@/src/types/services.types";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export default function ServiceDetailsLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { serviceId: ServiceI["id"] };
}) {
  return (
    <>
      <div className="inline-flex gap-1 items-center mb-2">
        <Link href={Routes.services.url}>{Routes.services.label}</Link>
        <ChevronRightIcon className="size-4" />
        <span>{params.serviceId}</span>
      </div>
      {children}
    </>
  );
}
