"use client";
import { Routes } from "@/src/routes";
import { useAppStore } from "@/src/store/app/app.store";
import { useSalesStore } from "@/src/store/sales/sales.store";
import { SaleI } from "@/src/types/sales.types";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const SaleDetailsComponent = dynamic(
  () => import("@/components/sales/saleDetails.component"),
  {
    ssr: !!false,
  }
);

export default function SaleDetails({
  params,
}: {
  params: { saleId: SaleI["id"] };
}) {
  const router = useRouter();
  const { getSaleDetails } = useSalesStore();
  const { showLoader, hideLoader } = useAppStore();
  const sale = (useSalesStore
    .getState()
    .sales.find((sale) => sale.id === params.saleId) || {}) as SaleI;

    const retrieveSaleDetails = async () => {
      try {
        showLoader();
        await getSaleDetails(params.saleId);
      } catch (error) {
        router.replace(Routes.sales.url);
      } finally {
        hideLoader();
      }
    };

    useEffect(() => {
      if (params?.saleId !== sale?.id) {
        retrieveSaleDetails();
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params?.saleId, sale?.id]);

  if (!sale?.id) return;

  return (
    <section id="sale-details">
      <SaleDetailsComponent sale={sale} />
    </section>
  );
}
