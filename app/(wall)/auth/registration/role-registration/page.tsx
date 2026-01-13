import { CmsService } from "@/src/services/cms.service";
import { CmsPageI } from "@/src/types/cms.types";
import { cache } from "react";
import GoogleRoleSelector from "@/components/signUp/googleRoleSelector";

// cache revalidation - 1 hour
export const revalidate = 3600;

const getCmsData = cache(async () => {
  try {
    const response = await CmsService.getLocalPage("google_role_selection");
    return response;
  } catch (error) {
    return {
      main: {
        title: "Benvenuto in Vigila",
        text: "Il tuo account Google è connesso. Per iniziare, dicci come vuoi usare la piattaforma.",
      },
    } as CmsPageI;
  }
});

export default async function GoogleRoleSelection() {
  const data = (await getCmsData()) as CmsPageI;
  const { main: { title, text } = {} } = data;

  return (
    <section className="py-16 bg-gray-50 min-h-screen flex items-center">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 w-full">
        <div className="bg-white w-full mx-auto max-w-xl p-8 rounded-3xl shadow-xl">
          {/* Header CMS */}
          <div className="text-center mb-8">
            <h2 className="font-bold text-3xl text-gray-900 ">
              {title || "Benvenuto in Vigila"}
            </h2>
            <p className="mt-3 text-lg font-normal">
              {text ||
                "Il tuo account Google è connesso. Per iniziare, dicci come vuoi usare la piattaforma."}
            </p>
          </div>

          <h3 className="text-center font-semibold text-xs uppercase tracking-wider text-gray-600 mb-4">
            Seleziona il tuo ruolo
          </h3>

          {/* Componente Client Interattivo */}
          <GoogleRoleSelector />

          {/* Footer Informativo */}
          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <p className="text-sm font-medium text-gray-600 max-w-sm mx-auto">
              Fai attenzione a scegliere il ruolo corretto: una volta
              selezionato dovrai contattare l'assistenza per modificarlo.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
