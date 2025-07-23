"use client";

import { Routes } from "@/src/routes";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace(Routes.adminOverview.url);
  }, [router]);

  return null;
}
