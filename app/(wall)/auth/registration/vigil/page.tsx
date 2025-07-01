import { CmsService } from "@/src/services/cms.service";
import SignupComponent from "@/components/signUp/signup.component";
import { CmsPageI } from "@/src/types/cms.types";
import { SimplePage } from "@/components";
import { cache } from "react";
import { calcDelay } from "@/src/utils/common.utils";
import { FrequencyEnum } from "@/src/enums/common.enums";
import { RolesEnum } from "@/src/enums/roles.enums";

// cache revalidation
export const revalidate = calcDelay(1, FrequencyEnum.HOURS);

const getCmsData = cache(async () => {
  try {
    const response = await CmsService.getLocalPage("registration");
    return response;
  } catch (error) {
    throw new Error("Failed to fetch registration data");
  }
});

export default async function Registration() {
  const data = (await getCmsData()) as CmsPageI;
  const { form: staticData, title = "Registration", text } = data;
  return (
    <section className="py-4">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-between">
        <SimplePage title={title} text={text} />
        <SignupComponent staticData={staticData} role={RolesEnum.VIGIL}  />
      </div>
    </section>
  );
}
