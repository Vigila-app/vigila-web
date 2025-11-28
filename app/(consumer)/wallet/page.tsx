import { Button, ButtonLink } from "@/components";
import { Routes } from "@/src/routes";
import React from "react";

const WalletLanding = () => {
  const steps = [
    {
      id: 1,
      title: "Scegli il tuo pacchetto",
      description:
        "Seleziona l'importo che preferisci e ottieni subito il bonus",
    },
    {
      id: 2,
      title: "Paga in sicurezza",
      description:
        "Completa l'acquisto con carta di credito o altri metodi sicuri",
    },
    {
      id: 3,
      title: "Usa il credito",
      description:
        "Il credito è subito disponibile nel tuo wallet per prenotare servizi",
    },
  ];
  const features = [
    {
      id: 1,
      title: "Bonus immediato",
      description: "Ottieni fino al 30% di credito extra",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round">
          <line x1="18" y1="20" x2="18" y2="10"></line>
          <line x1="12" y1="20" x2="12" y2="4"></line>
          <line x1="6" y1="20" x2="6" y2="14"></line>
        </svg>
      ),
      theme: "blue",
    },
    {
      id: 2,
      title: "Nessuna scadenza",
      description: "Il credito non scade mai",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
      ),
      theme: "red",
    },
    {
      id: 3,
      title: "Sicuro e veloce",
      description: "Pagamenti protetti e immediati",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
        </svg>
      ),
      theme: "blue",
    },
    {
      id: 4,
      title: "Gestione facile",
      description: "Monitora saldo e movimenti",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="9" y1="3" x2="9" y2="21"></line>
        </svg>
      ),
      theme: "red",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-center py-10 px-4">
      <div className="max-w-[380px] w-full bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
        {/* Header Section */}
        <div className="text-center mb-8 flex flex-col items-center">
          <div className="bg-red-50 text-red-500 text-xs font-bold px-3 py-1.5 rounded-full mb-4 inline-block">
            Risparmia fino al 30%
          </div>

          <h1 className="text-3xl font-bold text-gray-900 leading-tight mb-4">
            Ricarica il <br />
            tuo Wallet <br />
            <span className="text-sky-500">e risparmia</span>
          </h1>

          <p className="text-gray-500 text-sm leading-relaxed px-2">
            Acquista credito prepagato e ottieni bonus immediato. Più ricarichi,
            più risparmi sui servizi di assistenza.
          </p>
        </div>

        {/* Feature Cards List */}
        <div className="space-y-4">
          {features.map((feature) => (
            <div
              key={feature.id}
              className="group border border-gray-100 rounded-xl p-6 flex flex-col items-center text-center hover:shadow-md hover:border-gray-200 transition-all duration-300 bg-white">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 text-lg
                ${feature.theme === "blue" ? "bg-sky-50 text-sky-500" : "bg-red-50 text-red-500"}`}>
                {feature.icon}
              </div>
              <h3 className="font-bold text-gray-900 mb-1">{feature.title}</h3>
              <p className="text-xs text-gray-400">{feature.description}</p>
            </div>
          ))}
          
        </div>
        <div className="p-8 pb-10">
          <h1 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Come funziona
          </h1>
          <div className="space-y-8">
            {steps.map((step) => (
              <div key={step.id} className="flex gap-4 items-start">
                {/* Cerchio Numerato */}
                <div className="shrink-0 w-8 h-8 rounded-full bg-sky-500 text-white flex items-center justify-center font-bold text-sm shadow-md shadow-sky-100">
                  {step.id}
                </div>

                {/* Testi */}
                <div className="pt-0.5">
                  <h3 className="font-bold text-gray-900 text-sm mb-1">
                    {step.title}
                  </h3>
                  <p className="text-gray-500 text-xs leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
          {/* Feature payment button */}
        </div>
          <div className="flex items-center justify-center">
            <ButtonLink label="Ricarica" href={Routes.walletBundles.url} />
          </div>
      </div>
    </div>
  );
};

export default WalletLanding;
