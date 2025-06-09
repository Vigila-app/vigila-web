import { CmsService } from "@/src/services";
import HomeComponent from "./home.component";
import { CmsPageI } from "@/src/types/cms.types";
import { calcDelay } from "@/src/utils/common.utils";
import { FrequencyEnum } from "@/src/enums/common.enums";
import { cache } from "react";

// cache revalidation
export const revalidate = calcDelay(30, FrequencyEnum.MINUTES);

const getCmsData = cache(async () => {
  try {
    const response = await CmsService.getLocalPage("home");
    return response;
  } catch (error) {
    throw new Error("Failed to fetch home data");
  }
});

export default async function Home() {
  const data = (await getCmsData()) as CmsPageI;
  const { ["main-hero"]: mainHero } = data;
  return (
    <>
      <HomeComponent hero={mainHero} />
    </>
  );
}
