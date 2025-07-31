import { CmsService } from "@/src/services/cms.service";
import LoginComponent from "./login.component";
import { CmsPageI } from "@/src/types/cms.types";
import { cache } from "react";

// cache revalidation - 1 hour
export const revalidate = 3600;

const getCmsData = cache(async () => {
  try {
    const response = await CmsService.getLocalPage("login");
    return response;
  } catch (error) {
    throw new Error("Failed to fetch login data");
  }
});

export default async function Login() {
  const data = (await getCmsData()) as CmsPageI;
  const { title = "Login", text } = data;
  return (
    <section className="py-4">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-between">
        <LoginComponent title={title} text={text} />
      </div>
    </section>
  );
}
