import { SimplePage } from "@/components";
import { CmsService } from "@/src/services";
import { CmsPageI } from "@/src/types/cms.types";
import { cache } from "react";

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

  return (
    <div className="mx-auto max-w-screen-xl py-4 sm:px-6 lg:px-8">
      <SimplePage title={data.title as string} text={data.text} html={data.html} />
    </div>
  );
}