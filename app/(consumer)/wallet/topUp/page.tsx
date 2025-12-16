"use client";
import React, { useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import Button from "@/components/button/button"; // Il tuo bottone
import { Routes } from "@/src/routes";
import { TopUpOption } from "@/src/types/wallet.types";
import TopUpCard from "@/components/wallet/topUpCard.component";
import { RolesEnum } from "@/src/enums/roles.enums";

import { WalletPaymentComponent } from "@/components/wallet/walletPaymentComponent";

import MOCK_OPTIONS from "@/mock/cms/wallet-topup-options.json"

export default function WalletTopUp() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showPayment, setShowPayment] = useState(false);

  const handleContinue = () => {
    if (!selectedId) return;
    setShowPayment(true);
  };

  const selectedOption = MOCK_OPTIONS.find((opt) => opt.id === selectedId);

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 flex justify-center font-sans">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <Link
            href={Routes.wallet.url}
            className="flex items-center text-sm font-medium text-consumer-blue hover:underline">
            <ChevronLeftIcon className="w-4 h-4 mr-1" />
            Torna al wallet
          </Link>
          <Link
            href={Routes.wallet.url}
            className="flex items-center text-sm font-medium text-vigil-orange hover:underline">
            Vai ai pacchetti
            <ChevronRightIcon className="w-4 h-4 mr-1" />
          </Link>
        </div>

        <div className="mb-8 text-center sm:text-left">
          <h1 className="text-2xl font-bold  mb-2">
            Aggiungi credito al tuo wallet
          </h1>
          <p className="text-gray-500 text-sm leading-relaxed">
            Scegli un importo tra quelli proposti qui di seguito per ricaricare
            rapidamente il tuo saldo.
          </p>
        </div>

        <div className="flex flex-col gap-4 mb-8">
          {MOCK_OPTIONS.map((option) => (
            <TopUpCard
              key={option.id}
              option={option}
              isSelected={selectedId === option.id}
              onSelect={setSelectedId}
            />
          ))}
        </div>

        <div className="mt-4 pt-2 pb-4">
          <Button
            label="Continua"
            full
            primary={false}
            disabled={!selectedId}
            action={handleContinue}
            role={RolesEnum.CONSUMER}
          />

          {/* <div className="text-center mt-4">
            <button className="text-sm font-medium text-red-500 hover:text-red-600 transition-colors">
              Hai un codice? Riscatta qui
            </button>
          </div> */}
        </div>
      </div>

      {/* Modal Pagamento */}
      {showPayment && selectedOption && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm">
          <div className="flex min-h-full items-center justify-center p-4">
            <WalletPaymentComponent
              paymentItem={{
                id: selectedOption.id,
                name: `Ricarica €${selectedOption.creditAmount}`,
                price: selectedOption.payAmount,
                creditAmount: selectedOption.creditAmount,
                metadataType: "wallet_topup",
              }}
              onCancel={() => setShowPayment(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
