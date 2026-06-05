"use client";

import dynamic from "next/dynamic";

const NoticeBoardVigil = dynamic(
  () => import("@/components/notice-board/NoticeBoardVigil"),
  { ssr: false }
);

export default function BachecaPage() {
  return (
    <section id="vigil-bacheca">
      <NoticeBoardVigil />
    </section>
  );
}
