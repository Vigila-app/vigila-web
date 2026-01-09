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
    // Uso una chiave specifica per questo step intermedio
    const response = await CmsService.getLocalPage("google_role_selection");
    return response;
  } catch (error) {
    return {
      main: {
        title: "Account creato con successo!",
        text: "Hai completato l'accesso con Google. Ora dicci chi sei per configurare il tuo profilo.",
      },
    } as CmsPageI;
  }
});

export default async function GoogleRoleSelection() {
  const data = (await getCmsData()) as CmsPageI;
  const { main: { title, text } = {} } = data;

  return (
    <section className="py-16">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 text-center">
        <div className="bg-pureWhite w-full mx-auto my-6 max-w-lg p-6 md:p-8 rounded-3xl shadow-lg text-center">
          {/* Intestazione dinamica */}
          <div>
            <h2 className="text-center font-semibold text-3xl">
              {title || "Benvenuto in Vigila"}
            </h2>
            <p className="text-center font-normal text-base mt-2 text-gray-700">
              {text ||
                "Il tuo account è attivo. Per proseguire, seleziona il tuo ruolo."}
            </p>
          </div>

          <h3 className="font-semibold text-sm my-6  uppercase tracking-wide">
            Come vuoi usare Vigila?
          </h3>

          <div className="my-4 space-y-4">
            {/* Opzione CONSUMER */}
            {/* Nota: Qui punteremo alla rotta che finalizza la creazione del Consumer */}
            <Link href={Routes.registrationConsumer.url}>
              <Card
                customClass="mb-4"
                containerClass="text-consumer-blue flex flex-col items-center justify-center p-6 hover:scale-[1.05] transition duration-200 ">
                <HeartIcon className="size-8 mb-2" />
                <h4 className="font-bold text-lg">Cerco Assistenza</h4>
                <p className="text-gray-600 text-sm mt-1">
                  Voglio trovare un Vigil di fiducia per la mia famiglia
                </p>
              </Card>
            </Link>

            {/* Opzione VIGIL */}
            {/* Nota: Qui punteremo alla rotta che finalizza la creazione del Vigil */}
            <Link href={Routes.registrationVigil.url}>
              <Card containerClass="text-vigil-orange flex flex-col items-center justify-center p-6 hover:scale-[1.05] transition duration-200 ">
                <FaceSmileIcon className="size-8 mb-2" />
                <h4 className="font-bold text-lg">Voglio Lavorare</h4>
                <p className="text-gray-600 text-sm mt-1">
                  Voglio offrire i miei servizi, guadagnare e ottenere CFU
                </p>
              </Card>
            </Link>
          </div>

          {/* Footer: Invece del login, mettiamo un'opzione di uscita nel caso abbiano sbagliato account Google */}
          <div className="space-y-2 mt-8  pt-4">
            <p className="justify-center text-sm text-gray-600 inline-flex items-center w-full">
              Fai attenzione a scegliere il ruolo corretto: una volta
              selezionato dovrai contattare l'assistenza per modificarlo.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
