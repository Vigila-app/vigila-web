import { ButtonLink } from "@/components";
import { AppConstants } from "@/src/constants";

export default function ResetPasswordPage() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-screen-md px-4 sm:px-6 lg:px-8">
        <div className="bg-pureWhite w-full mx-auto my-6 p-6 md:p-8 rounded-3xl shadow-lg text-center">
          <h2 className="text-2xl font-semibold mb-4">Reset della password</h2>
          <p className="text-sm text-gray-600 mb-6">
            Se hai bisogno di assistenza per resettare la password, contatta il
            nostro servizio clienti.
          </p>
          <p className="text-sm text-gray-600 mb-6">
            Puoi scriverci direttamente via WhatsApp:
          </p>
          <ButtonLink
            label="Contatta assistenza"
            href={AppConstants.whatsappUrl}
            target="_blank"
          />
        </div>
      </div>
    </section>
  );
}
