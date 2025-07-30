import { CmsService } from "@/src/services";
import HomeComponent from "./home.component";
import RedirectHandler from "./redirect-handler.component";
import { CmsPageI } from "@/src/types/cms.types";
import { cache } from "react";

// cache revalidation - 30 minutes
export const revalidate = 1800;

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
      <RedirectHandler />
      <HomeComponent hero={mainHero} />
    </>
  );
}
