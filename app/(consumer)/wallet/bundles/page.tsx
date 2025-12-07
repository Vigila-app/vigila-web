"use client";
import React, { useState, useEffect } from "react";
import bundlesJson from '../../../../mock/cms/wallet-bundles.json';
import type { BundleCatalogType } from '../../../../src/types/wallet.types';
import { BundleCard } from "@/components/wallet/bundleCard.component";
import { WalletPaymentComponent } from "@/components/wallet/walletPaymentComponent";

const WalletBundles: React.FC = () => {
  const bundles: BundleCatalogType[] = (bundlesJson.wallet_bundles || []) as unknown as BundleCatalogType[];
  const [selectedBundle, setSelectedBundle] = useState<BundleCatalogType | null>(null);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selectedBundle) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedBundle]);

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-center py-10 px-4 font-sans">
      <div className="max-w-[380px] w-full bg-white rounded-3xl p-6 shadow-sm border border-gray-100 relative">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Scegli il tuo <br /> pacchetto
          </h1>
          <p className="text-gray-500 text-sm px-4 leading-relaxed">
            Più ricarichi, più risparmi. Semplice e conveniente.
          </p>
        </div>

        {/* Lista Pacchetti */}
        <div className="space-y-6">
          {bundles.map((pkg) => (
            <BundleCard 
              key={pkg.id} 
              bundle={pkg} 
              onSelect={(bundle) => setSelectedBundle(bundle)} 
            />
          ))}
        </div>
      </div>

      {/* Modal Pagamento */}
      {selectedBundle && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm">
          <div className="flex min-h-full items-center justify-center p-4">
             <WalletPaymentComponent 
                selectedBundle={selectedBundle} 
                onCancel={() => setSelectedBundle(null)} 
             />
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletBundles;