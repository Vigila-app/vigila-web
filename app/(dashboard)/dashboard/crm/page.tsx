"use client";
import { Routes } from "@/src/routes";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function CRM() {
  const router = useRouter();
  useEffect(() => {
    router.push(Routes.guests.url);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return;
}
