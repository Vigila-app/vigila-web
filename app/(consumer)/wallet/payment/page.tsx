"use client";
import { redirect } from "next/navigation";
import { Routes } from "@/src/routes";

export default function WalletPaymentPage() {
  redirect(Routes.wallet.url);
}
