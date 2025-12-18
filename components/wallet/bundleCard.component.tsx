import React from "react";
import { CheckIcon, SparklesIcon } from "@heroicons/react/24/solid";
import clsx from "clsx";
import type { BundleCatalogType } from "@/src/types/wallet.types"; 



interface BundleCardProps {
  bundle: BundleCatalogType;
  onSelect: (bundle: BundleCatalogType) => void;
}

// Mappa dei colori per ogni tipologia di pacchetto
const THEMES: Record<string, {
  primary: string; // Colore principale (Header, Bottoni)
  light: string;   // Sfondo lista vantaggi
  border: string;  // Colore bordo card
  text: string;    // Colore testo (prezzi, frecce)
}> = {
  STARTER: {
    primary: "bg-[#36A816]",
    light: "bg-[#36A816]/10", // 10% di opacità
    border: "border-[#36A816]",
    text: "text-[#36A816]",
  },
  STANDARD: {
    primary: "bg-[#0099D6]",
    light: "bg-[#0099D6]/10",
    border: "border-[#0099D6]",
    text: "text-[#0099D6]",
  },
  PREMIUM: {
    primary: "bg-[#6366F1]", // Viola indaco
    light: "bg-[#6366F1]/10",
    border: "border-[#6366F1]",
    text: "text-[#6366F1]",
  },
  FAMILY: {
    primary: "bg-[#F05338]", // Rosso aranciato
    light: "bg-[#F05338]/10",
    border: "border-[#F05338]",
    text: "text-[#F05338]",
  },
  DEFAULT: {
    primary: "bg-gray-800",
    light: "bg-gray-100",
    border: "border-gray-800",
    text: "text-gray-800",
  }
};

export const BundleCard: React.FC<BundleCardProps> = ({ bundle, onSelect }) => {
  // Recupera il tema in base al nome (o usa default)
  const theme = THEMES[bundle.name.toUpperCase()] || THEMES.DEFAULT;
  const isPopular = bundle.name.toUpperCase() === "STANDARD"; // Logica per il badge

  return (
    <div className={clsx(" relative w-full mt-4 ", isPopular ? "mt-4" : "")}>
      
      {/* Badge */}
      {isPopular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
          <div className={clsx(
            "flex items-center gap-1 px-4 py-1 rounded-t-xl text-white text-xs font-bold uppercase shadow-sm",
            theme.primary
          )}>
            <SparklesIcon className="w-3 h-3 text-white" />
            Più scelto
          </div>
        </div>
      )}

      {/* Card Container */}
      <div className={clsx("bg-white  rounded-2xl border-2 overflow-hidden shadow-sm", theme.border)}>
        
        {/* Header Colorato */}
        <div className={clsx("w-full py-4 text-center text-white", theme.primary)}>
          <h2 className="text-2xl font-extrabold uppercase tracking-wide">
            {bundle.name}
          </h2>
          <p className="text-sm font-medium opacity-90">
            Bonus +{bundle.bonus_percentage}%
          </p>
        </div>

        {/* Body della Card */}
        <div className="p-5 flex flex-col items-center">
          
          {/* Prezzo a Pillola */}
          <div className={clsx(
            "rounded-full px-8 py-3 mb-2 flex items-baseline justify-center gap-1",
            theme.primary
          )}>
            <span className="text-3xl font-bold text-white">€{bundle.price}</span>
           
          </div>

          {/* Freccia e Credito Totale */}
          <div className={clsx("flex items-center gap-2 font-bold text-lg mb-6", theme.text)}>
            <span>➜</span>
            <span>€{bundle.credit_amount} di credito</span>
          </div>

          {/* Lista Vantaggi (Box Chiaro) */}
          <div className={clsx("w-full rounded-xl p-4 flex flex-col gap-3", theme.light)}>
            {bundle.features.map((feature, idx) => (
              <div key={idx} className="flex items-start gap-2.5">
                <CheckIcon className={clsx("w-4 h-4 mt-1 shrink-0", theme.text)} strokeWidth={3} />
                <span className="text-sm text-gray-700 font-medium leading-tight">
                  {feature}
                </span>
              </div>
            ))}
          </div>

          {/* Bottone Acquista */}
          <button
            onClick={() => onSelect(bundle)}
            className={clsx(
              "w-full mt-6 py-3 rounded-full text-white font-bold text-sm uppercase tracking-wide transition-opacity hover:opacity-90 shadow-md",
              theme.primary
            )}
          >
            Acquista ora
          </button>
        </div>
      </div>
    </div>
  );
};