"use client";

import dynamic from "next/dynamic";

const DashboardComponent = dynamic(
  () => import("@/components/dashboard/dashboard.component"),
  { ssr: !!false }
);

export default function Dashboard() {
  /*const router = useRouter();
  useEffect(() => {
    router.push(Routes.units.url);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);*/
  return (
    <section id="dashboard">
      <DashboardComponent />
    </section>
  );
}
