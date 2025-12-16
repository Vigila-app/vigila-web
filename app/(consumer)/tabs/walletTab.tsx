import { TabGroup } from "@/components";
import React, { useMemo, useState, useEffect } from "react";
import {
  ArrowTrendingDownIcon,
  ArrowTrendingUpIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import { Routes } from "@/src/routes";
import { useUserStore } from "@/src/store/user/user.store";
import { TabItem } from "@/components/tabGroup/tabGroup";
import { useTransactionsStore } from "@/src/store/transactions/transactions.store";
import TransactionCardComponent from "@/components/wallet/transactionCardComponent";
import Link from "next/link";

import { amountDisplay, EurConverter } from "@/src/utils/common.utils";

import WalletBalanceCard from "@/components/wallet/walletBalanceCard";

export default function WalletTab() {
  const { user } = useUserStore();
  const [loading, setLoading] = useState(true);
  const {
    transactions,
    balance: storeBalance,
    totalDeposited,
    totalSpent,
    getTransactions,
  } = useTransactionsStore();

  useEffect(() => {
    const fetchData = async () => {
      if (user?.id) {
        setLoading(true);
        try {
          await getTransactions(user.id);
        } catch (error) {
          console.error("Errore fetch transactions:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchData();
  }, [user?.id, getTransactions]);

  const tabs: TabItem[] = [
    { label: "Tutti", id: "all" },
    { label: "Mese", id: "month" },
    { label: "Settimana", id: "week" },
  ];
  const [selectedTab, setSelectedTab] = useState("all");

  const balance = useMemo(() => {
    return EurConverter(storeBalance);
  }, [storeBalance]);

  const filteredTransactions = useMemo(() => {
    const now = new Date();

    const oneWeekAgo = new Date(now);
    oneWeekAgo.setDate(now.getDate() - 7);

    const oneMonthAgo = new Date(now);
    oneMonthAgo.setMonth(now.getMonth() - 1);

    return transactions.filter((tx) => {
      if (selectedTab === "all") return true;
      const txDate = new Date(tx.created_at);
      if (selectedTab === "week") return txDate >= oneWeekAgo;
      if (selectedTab === "month") return txDate >= oneMonthAgo;
      return true;
    });
  }, [selectedTab, transactions]);
  return (
    <div className="flex flex-col items-center w-full sm:max-h-full">
      <h1 className="py-3 w-full text-lg font-semibold text-start">Wallet</h1>
      <div className="w-full">
        <WalletBalanceCard balance={balance} />
        {/* Recap movimenti */}
        <div>
          <div className="flex mt-3 gap-3 w-full ">
            <div className="bg-white p-5 rounded-3xl shadow-sm flex items-center justify-between w-full">
              <div>
                <h3 className="text-base font-semibold mb-1">
                  {"Totale Ricaricato"}
                </h3>
                <p className=" text-sm font-normal">
                  €{amountDisplay(EurConverter(totalDeposited))}
                </p>
              </div>

              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center bg-green-100 `}>
                <ArrowTrendingUpIcon
                  className={`w-6 h-6 text-green-500 `}
                  strokeWidth={2}
                />
              </div>
            </div>
          </div>
          <div className="flex mt-3 gap-3 w-full">
            <div className="bg-white p-5 rounded-3xl shadow-sm flex items-center justify-between w-full">
              <div>
                <h3 className="text-base font-semibold  mb-1">
                  {"Totale speso"}
                </h3>
                <p className=" text-sm font-normal">
                  €{amountDisplay(EurConverter(totalSpent))}
                </p>
              </div>

              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center bg-red-100 `}>
                <ArrowTrendingDownIcon
                  className={`w-6 h-6 text-red-700`}
                  strokeWidth={2}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col w-full mt-3  mx-auto bg-white p-6 rounded-2xl shadow-sm">
          <h2 className="text-sm font-semibold mb-2">Movimenti </h2>
          <h3 className="text-gray-500 text-sm font-medium mb-4">
            Storico ricariche e spese
          </h3>
          <div className="mb-6">
            <TabGroup
              variant="segmented"
              tabs={tabs}
              selectedId={selectedTab}
              onChange={setSelectedTab}
            />
          </div>
          <div className="flex flex-col gap-1 ">
            {loading ? (
              <p className="text-center text-gray-400 py-4">Caricamento...</p>
            ) : filteredTransactions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-gray-400 gap-2">
                <p>Nessun movimento trovato.</p>
              </div>
            ) : (
              // ECCO LA PARTE PULITA
              filteredTransactions.map((tx) => (
                <TransactionCardComponent key={tx.id} transactionItem={tx} />
              ))
            )}
          </div>
        </div>
        <div className="w-full mt-6">
          <div className="bg-vigil-light-orange border border-vigil-orange rounded-3xl p-6 text-center shadow-sm">
            <h3 className="text-vigil-orange font-bold text-lg mb-1">
              Risparmia con i pacchetti prepagati
            </h3>

            <p className="text-vigil-orange text-sm font-medium opacity-80 mb-5">
              Ottieni fino al 30% di bonus ricaricando il tuo wallet
            </p>

            <Link
              href={Routes.wallet.url}
              className="group flex items-center justify-center w-full py-3 px-4 rounded-full border border-[#E85C3A] text-[#E85C3A] font-semibold text-sm hover:bg-[#E85C3A] hover:text-white transition-all duration-300">
              Scopri i pacchetti
              <ChevronRightIcon
                className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform"
                strokeWidth={2.5}
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
