import { SimplePage } from "@/components";
import { Routes } from "@/src/routes";
import { CmsService } from "@/src/services/cms.service";
import { CmsPageI } from "@/src/types/cms.types";
import { Metadata } from "next";
import { cache } from "react";

export const metadata: Metadata = {
  title: Routes.privacyPolicy.title,
};

const getCmsData = cache(async () => {
  try {
    const response = await CmsService.getLocalPage("privacy-policy");
    return response;
  } catch (error) {
    throw new Error("Failed to fetch privacy-policy data");
  }
});

export default async function PrivacyPolicy() {
  const data = (await getCmsData()) as CmsPageI;
  const { title = "Privacy Policy", text } = data;
  return (
    <section className="py-4">
      <SimplePage title={title} text={text} />
    </section>
  );
}
