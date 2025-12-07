import React from "react";
import { BundleCatalogType } from "@/src/types/wallet.types";

type BundleCardProps = {
  bundle: BundleCatalogType;
  onSelect?: (bundle: BundleCatalogType) => void;
};

export const BundleCard: React.FC<BundleCardProps> = ({ bundle, onSelect }) => {
  return (
    <div
      className={`relative border rounded-2xl p-6 transition-all duration-300 hover:shadow-md bg-white
        ${bundle.is_popular ? "border-sky-500 shadow-sm ring-1 ring-sky-100" : "border-gray-200 hover:border-gray-300"}`}
    >
      {/* Badge "Più scelto" */}
      {bundle.is_popular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-sky-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wide">
          <span className="flex items-center gap-1">★ Più scelto</span>
        </div>
      )}

      {/* Titolo e Bonus */}
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-bold text-gray-900 text-lg">{bundle.name}</h3>
      </div>
      <p className="text-xs text-gray-400 font-medium mb-4">
        {`Bonus +${bundle.bonus_percentage}%`}
      </p>

      {/* Prezzo */}
      <div className="mb-4">
        <span className="text-3xl font-bold text-gray-900">€{bundle.price}</span>
        <div className="mt-1 flex flex-col">
          <span className="text-sky-500 text-sm font-semibold">
            → €{bundle.credit_amount} di credito
          </span>
          <span className="text-gray-400 text-xs">
            Risparmi €{bundle.savings}
          </span>
        </div>
      </div>

      {/* Lista Features */}
      <ul className="space-y-2 mb-6">
        {bundle.features.map((feature, idx) => (
          <li key={idx} className="flex items-start gap-2 text-xs text-gray-600">
            <svg
              className="w-4 h-4 text-sky-500 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      {/* Bottone */}
      <button
        onClick={() => onSelect && onSelect(bundle)}
        className={`w-full py-3 rounded-xl text-sm font-semibold transition-colors duration-200
        ${
          bundle.is_popular
            ? "bg-sky-500 text-white hover:bg-sky-600 shadow-md shadow-sky-200"
            : "bg-transparent text-sky-500 border border-sky-500 hover:bg-sky-50"
        }`}
      >
        Acquista ora
      </button>
    </div>
  );
};
