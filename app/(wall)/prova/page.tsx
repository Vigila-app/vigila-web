import { SimplePage } from "@/components";
import { CmsService } from "@/src/services/cms.service";
import { CmsPageI } from "@/src/types/cms.types";
import { Metadata } from "next";
import { cache } from "react";

import { ProvaService } from "@/src/services/prova.service";

export const metadata: Metadata = {
  title: "Pagina Prova",
};

const getCmsData = cache(async () => {
  try {
    const response = await CmsService.getLocalPage("prova");
    return response;
  } catch (error) {
    throw new Error("Failed to fetch  json Prova data");
  }
});
const getApiData = cache(async () => {
  try {
    const response = await ProvaService.getData();
    return response;
  } catch (error) {
    throw new Error("failed to fetch api Prova data");
  }
});

export default async function Prova() {
  const data = (await getCmsData()) as CmsPageI;

  const apiData = await getApiData();

  const { title = "Prova", text } = data;
  return (
    <div>
      <section className="py-4 font-bold text-amber-400">
        <SimplePage title={title} text={text} />
      </section>
      {/* <section className="py-4 font-medium text-blue-300 ">
        <div>{JSON.stringify(apiData)}</div>
    </section> */}
    </div>
  );
}
