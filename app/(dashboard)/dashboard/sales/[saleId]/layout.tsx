import { Routes } from "@/src/routes";
import { SaleI } from "@/src/types/sales.types";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export default function SaleDetailsLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { saleId: SaleI["id"] };
}) {
  return (
    <>
      <div className="inline-flex gap-1 items-center mb-2">
        <Link href={Routes.sales.url}>{Routes.sales.label}</Link>
        <ChevronRightIcon className="size-4" />
        <span>{params.saleId}</span>
      </div>
      {children}
    </>
  );
}
