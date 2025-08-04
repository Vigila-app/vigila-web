import { Card } from "@/components";
import { Routes } from "@/src/routes";
import { CmsService } from "@/src/services/cms.service";
import { CmsPageI } from "@/src/types/cms.types";
import { FaceSmileIcon, HeartIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { cache } from "react";

// cache revalidation - 1 hour
export const revalidate = 3600;

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
  const { main: { title = "Sign up", text } = {} } = data;
  return (
    <section className="py-8">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-between">
        <div className="bg-white w-full mx-auto my-6 max-w-lg p-6 md:p-8 rounded-lg shadow-lg text-center">
          {title || text ? (
            <div>
              {title ? (
                <h2 className="text-center font-semibold text-3xl">{title}</h2>
              ) : null}
              {text ? (
                <p className="text-center font-normal text-sm  mt-2">{text}</p>
              ) : null}
            </div>
          ) : null}
          <h3 className="font-semibold text-sm my-4">Come vuoi unirti a Vigila?</h3>
          <div className="space-y-4 my-4">
            <Link href={Routes.registrationConsumer.url}>
              <Card containerClass="text-consumer-blue flex flex-col items-center justify-center p-4 hover:scale-95 transition">
                <HeartIcon className="size-6" />
                <h4 className="font-bold">Hai bisogno di aiuto?</h4>
                <p className="text-gray-500 text-[12px]">Trova un Vigil di fiducia nella tua zona</p>
              </Card>
            </Link>
            <Link href={Routes.registrationVigil.url}>
              <Card containerClass="text-vigil-orange flex flex-col items-center justify-center p-4 hover:scale-95 transition">
                <FaceSmileIcon className="size-6" />
                <h4 className="font-bold">Vuoi lavorare con noi?</h4>
                <p className="text-gray-500 text-[12px]">Lavoro flessibile, retribuito e valido per CFU</p>
              </Card>
            </Link>
          </div>
          <div className="space-y-2 mt-6">
            <p className="justify-center text-sm inline-flex items-center w-full">
              Hai già un account?&nbsp;
              <Link href={Routes.login.url} className="text-consumer-blue">
                {Routes.login.label}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
