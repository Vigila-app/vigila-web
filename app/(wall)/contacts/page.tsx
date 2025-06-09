import { SimplePage } from "@/components";
import { Routes } from "@/src/routes";
import { CmsService } from "@/src/services/cms.service";
import { CmsPageI } from "@/src/types/cms.types";
import { Metadata } from "next";
import { cache } from "react";

export const metadata: Metadata = {
  title: Routes.contacts.title,
};

const getCmsData = cache(async () => {
  try {
    const response = await CmsService.getLocalPage("contacts");
    return response;
  } catch (error) {
    throw new Error("Failed to fetch contacts data");
  }
});

export default async function Contacts() {
  const data = (await getCmsData()) as CmsPageI;
  const { title = "Contacts", text } = data;
  return (
    <section className="py-4">
      <SimplePage title={title} text={text} />
    </section>
  );
}
