"use client";
import { ButtonLink } from "@/components";
import { RolesEnum } from "@/src/enums/roles.enums";
import { Routes } from "@/src/routes";
import { BundleCatalogType } from "@/src/types/wallet.types";
import bundlesJson from "@/mock/cms/wallet-bundles.json";

import {
  ArrowRightIcon,
  ArrowTrendingUpIcon,
  ClockIcon,
  ShieldCheckIcon,
  WalletIcon,
} from "@heroicons/react/24/outline";
import React, { useEffect, useState } from "react";
import { BundleCard } from "@/components/wallet/bundleCard.component";
import { WalletPaymentComponent } from "@/components/wallet/walletPaymentComponent";
import { useUserStore } from "@/src/store/user/user.store";
import { useRouter } from "next/navigation";

const WalletLanding = () => {
  const { user } = useUserStore();
  const router = useRouter();
  const steps = [
    {
      id: 1,
      title: "Scegli il tuo pacchetto",
      description:
        "Seleziona l'importo che preferisci e ottieni subito il bonus",
      theme: "red",
    },
    {
      id: 2,
      title: "Paga in sicurezza",
      description:
        "Completa l'acquisto con carta di credito o altri metodi sicuri",
      theme: "blue",
    },
    {
      id: 3,
      title: "Usa il credito",
      description:
        "Il credito è subito disponibile nel tuo wallet per prenotare servizi",
      theme: "red",
    },
  ];
  const features = [
    {
      id: 1,
      title: "Bonus immediato",
      description: "Ottieni fino al 30% di credito extra",
      icon: <ArrowTrendingUpIcon className="w-6 h-6 " strokeWidth={2} />,
      theme: "blue",
    },
    {
      id: 2,
      title: "Nessuna scadenza",
      description: "Il credito non scade mai",
      icon: <ClockIcon className="w-6 h-6 " strokeWidth={2} />,
      theme: "red",
    },
    {
      id: 3,
      title: "Sicuro e veloce",
      description: "Pagamenti protetti e immediati",
      icon: <ShieldCheckIcon className="w-6 h-6 " strokeWidth={2} />,
      theme: "blue",
    },
    {
      id: 4,
      title: "Gestione facile",
      description: "Monitora saldo e movimenti",
      icon: <WalletIcon className="w-6 h-6 " strokeWidth={2} />,
      theme: "red",
    },
  ];
  const bundles: BundleCatalogType[] = (bundlesJson.wallet_bundles ||
    []) as unknown as BundleCatalogType[];
  const [selectedBundle, setSelectedBundle] =
    useState<BundleCatalogType | null>(null);

  const handleBundleSelection = (bundle: BundleCatalogType) => {
    if (user?.id) {
      setSelectedBundle(bundle);
    } else {
      router.push(Routes.registration.url);
    }
  };

  useEffect(() => {
    if (selectedBundle) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [selectedBundle]);

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center py-10 px-4">
      <div className="max-w-[380px] w-full ">
        {/* Header Section */}
        <div className="text-center mb-8 flex flex-col items-center">
          <div className="bg-vigil-orange text-white text-lg font-semibold px-3 py-1.5 rounded-full mb-4 inline-block">
            Risparmia fino al 30%
          </div>

          <h1 className="text-4xl font-bold  leading-tight mb-4">
            Ricarica il tuo <br />
            <span className="text-vigil-orange">Wallet </span>e
            <span className="text-consumer-blue"> risparmia</span>
            <br />
          </h1>

          <p className=" text-lg font-normal leading-relaxed px-2">
            Acquista credito prepagato e ottieni bonus immediato. Più ricarichi,
            più risparmi sui servizi di assistenza.
          </p>
        </div>

        {/* Feature Cards List */}
        <div className="space-y-4">
          {features.map((feature) => (
            <div
              key={feature.id}
              className=" group border bg-white rounded-2xl p-6 flex flex-col items-center text-center ">
              <div
                className={`w-12 h-12 rounded-xl  flex items-center justify-center mb-3 text-lg
                ${feature.theme === "blue" ? "bg-consumer-light-blue text-consumer-blue" : "bg-vigil-light-orange text-vigil-orange"}`}>
                {feature.icon}
              </div>
              <h3 className="font-bold  mb-1">{feature.title}</h3>
              <p className="text-xs ">{feature.description}</p>
            </div>
          ))}
        </div>
        <div className="max-w-[380px] w-full mt-4 rounded-3xl p-6 relative">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold  mb-2">
              <span className="text-consumer-blue">Scegli</span> il tuo <br />{" "}
              <span className="text-vigil-orange"> pacchetto</span>
            </h1>
            <p className="text-gray-700 text-lg px-4 leading-relaxed">
              Più ricarichi, più risparmi. Semplice e conveniente.
            </p>
            {/* Lista Pacchetti */}
            <div className="space-y-6">
              {bundles.map((pkg) => (
                <BundleCard
                  key={pkg.id}
                  bundle={pkg}
                  onSelect={handleBundleSelection}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="p-8 pb-10 mt-8 rounded-2xl bg-white">
          <h1 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Come funziona
          </h1>
          <div className="space-y-8">
            {steps.map((step) => (
              <div key={step.id} className="flex gap-4 items-start">
                {/* Cerchio Numerato */}
                <div
                  className={`shrink-0 w-14 h-14 rounded-full flex items-center justify-center font-bold text-lg shadow-md shadow-sky-100
                ${step.theme === "blue" ? "bg-consumer-blue text-white" : "bg-vigil-orange text-white"}`}>
                  {step.id}
                </div>

                {/* Testi */}
                <div>
                  <h3 className="font-bold  text-base">{step.title}</h3>
                  <p className=" text-sm text-gray-800 font-normal ">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-center mt-8">
          <ButtonLink
            icon={<ArrowRightIcon className="w-6 h-6" />}
            label="Inizia il tuo viaggio"
            primary={false}
            iconPosition="right"
            role={RolesEnum.CONSUMER}
            href={Routes.home.url}
          />
        </div>
      </div>
      {selectedBundle && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm">
          <div className="flex min-h-full items-center justify-center p-4">
            <WalletPaymentComponent
              paymentItem={{
                id: selectedBundle.id,
                name: selectedBundle.name,
                price: selectedBundle.price,
                creditAmount: selectedBundle.credit_amount,
                metadataType: "wallet_bundle",
              }}
              onCancel={() => setSelectedBundle(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletLanding;
