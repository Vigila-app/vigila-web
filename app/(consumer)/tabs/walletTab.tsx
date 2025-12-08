import { ButtonLink, TabGroup } from "@/components";
import React, { useMemo, useState, useEffect } from "react";
import type { TransactionType } from "@/src/types/wallet.types";
import {
  ArrowTrendingDownIcon,
  ArrowTrendingUpIcon,
  ChevronRightIcon,
  PlusIcon,
  WalletIcon,
} from "@heroicons/react/24/outline";
import { Routes } from "@/src/routes";
import { useUserStore } from "@/src/store/user/user.store";
import { PaymentService } from "@/src/services";
import { TabItem } from "@/components/tabGroup/tabGroup";
import { useTransactionsStore } from "@/src/store/transactions/transactions.store";
import TransactionCardComponent from "@/components/wallet/transactionCardComponent";
import Link from "next/link";
import { ButtonStyle } from "@/components/button/button.style";

export default function WalletTab() {
  const { user } = useUserStore();
  const [loading, setLoading] = useState(true);
  const { transactions, getTransactions, lastUpdate } = useTransactionsStore();

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
  console.log("Transactions in WalletTab:", transactions);

  const tabs: TabItem[] = [
    { label: "Tutti", id: "all" },
    { label: "Mese", id: "month" },
    { label: "Settimana", id: "week" },
  ];
  const [selectedTab, setSelectedTab] = useState("all");

  const stats = useMemo(() => {
    const incomeTypes = ["TOP_UP", "CREDIT", "BONUS", "REFUND"];

    const expenseTypes = ["PAYMENT", "DEBIT"];

    const totalDeposited = transactions
      .filter((tx) => incomeTypes.includes(tx.type))
      .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);

    const totalSpent = transactions
      .filter((tx) => expenseTypes.includes(tx.type))
      .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);

    return { totalDeposited, totalSpent };
  }, [transactions]);

  const currentBalance = useMemo(() => {
    return transactions.reduce((sum, tx) => sum + tx.amount, 0);
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    const now = new Date();

    return transactions.filter((tx) => {
      const txDate = new Date(tx.created_at);

      if (selectedTab === "week") {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(now.getDate() - 7);
        return txDate >= oneWeekAgo;
      }

      if (selectedTab === "month") {
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(now.getMonth() - 1);
        return txDate >= oneMonthAgo;
      }

      return true;
    });
  }, [selectedTab, transactions]);

  return (
    <div className="flex flex-col items-center w-full sm:max-h-full">
      <h1 className="py-3 w-full text-lg font-semibold text-start">Wallet</h1>
      <div className="w-full">
        <div className="flex flex-col gap-2 mb-1 bg-consumer-blue px-4 rounded-2xl">
          {/* bilancio */}
          <div className="flex justify-between items-center pt-4">
            <div className="flex flex-col gap-2 px-2 py-3">
              <p className="text-sm font-medium  text-white">
                Saldo disponibile
              </p>
              <p className="text-5xl font-medium  text-white">
                €{currentBalance.toFixed(2).replace(".", ",")}
              </p>
            </div>
            <span>
              <WalletIcon className="w-9 h-9 text-white" />
            </span>
          </div>

          <div className="flex  gap-12 justify-center w-full mb-4">
            <ButtonLink
              primary={false}
              label={"Ricarica il tuo wallet "}
              customClass={`${ButtonStyle.walletBtnStyle} w-full rounded-full py-3`}
              href={Routes.walletTopUp.url}
              icon={<PlusIcon className="w-5 h-5 text-consumer-blue" />}
            />
          </div>
        </div>
        {/* Recap movimenti */}
        <div>
          <div className="flex mt-3 gap-3 w-full ">
            <div className="bg-white p-5 rounded-3xl shadow-sm flex items-center justify-between w-full">
              <div>
                <h3 className="text-base font-semibold mb-1">
                  {"Totale Ricaricato"}
                </h3>
                <p className=" text-sm font-normal">
                  €{stats.totalDeposited.toFixed(2).replace(".", ",")}
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
                  €{stats.totalSpent.toFixed(2).replace(".", ",")}
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
