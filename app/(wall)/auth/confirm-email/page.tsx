import { CmsService } from "@/src/services/cms.service";
import ConfirmEmailComponent from "./confirmEmail.component";
import { CmsPageI } from "@/src/types/cms.types";
import { SimplePage } from "@/components";
import { cache } from "react";
import { calcDelay } from "@/src/utils/common.utils";
import { FrequencyEnum } from "@/src/enums/common.enums";

// cache revalidation
export const revalidate = calcDelay(2, FrequencyEnum.HOURS);

const getCmsData = cache(async () => {
  try {
    const response = await CmsService.getLocalPage("confirm-email");
    return response;
  } catch (error) {
    throw new Error("Failed to fetch confirm-email data");
  }
});

export default async function ConfirmEmail() {
  const data = (await getCmsData()) as CmsPageI;
  const { title = "Confirm email", text } = data;
  return (
    <section className="py-4">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-between">
        <SimplePage title={title} text={text} />
        <ConfirmEmailComponent />
      </div>
    </section>
  );
}
