"use server";

import { redirect } from "next/navigation";

export async function SsrRedirect(to: string) {
  redirect(to);
};
