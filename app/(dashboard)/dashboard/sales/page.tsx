import dynamic from "next/dynamic";

const SaleListComponent = dynamic(
  () => import("@/components/sales/saleList.component"),
  {
    ssr: !!false,
  }
);

export default async function Sales() {
  return (
    <section id="sales">
      <SaleListComponent />
    </section>
  );
}
