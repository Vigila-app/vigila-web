import {Button, ButtonLink } from "@/components";
import Card from "@/components/card/card";
import React, { useMemo, useState, useEffect } from "react";
import type { TransactionType } from '@/src/types/wallet.types';
import { ArrowDownIcon, ArrowUpIcon } from '@heroicons/react/24/outline';
import { Routes } from "@/src/routes";
import { RolesEnum } from "@/src/enums/roles.enums";
import { useUserStore } from "@/src/store/user/user.store";
import { PaymentService } from "@/src/services";

export default function WalletTab() {
  const { user } = useUserStore();
  const [transactions, setTransactions] = useState<TransactionType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (user?.id) {
        try {
          setLoading(true);
          const data = await PaymentService.getWalletTransactions(user.id);
          setTransactions(data);
        } catch (error) {
          console.error("Failed to fetch transactions", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchTransactions();
  }, [user?.id]);

  // Calculate stats from transactions
  const stats = useMemo(() => {
    const totalDeposited = transactions
      .filter(tx => tx.type === 'credit')
      .reduce((sum, tx) => sum + tx.amount, 0);
    const totalSpent = Math.abs(
      transactions
        .filter(tx => tx.type === 'debit')
        .reduce((sum, tx) => sum + tx.amount, 0)
    );
    const savings = totalDeposited - totalSpent;
    return { totalDeposited, totalSpent, savings };
  }, [transactions]);

  // Current balance (sum of all transactions)
  const currentBalance = useMemo(() => {
    return transactions.reduce((sum, tx) => sum + tx.amount, 0);
  }, [transactions]);

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('it-IT', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="flex flex-col items-center w-full max-h-[480px] sm:max-h-full">
      <h1 className="py-3 w-full text-[18px] font-semibold text-start">Wallet</h1>
      <Card full>
        <div className="flex flex-col gap-2 mb-1 px-4">
          {/* Header / Balance */}
          <div className="flex flex-col items-center py-3">
            <p className="text-3xl font-bold text-gray-900">€{currentBalance.toFixed(2).replace('.', ',')}</p>
            <p className="text-xs text-gray-500">Saldo disponibile</p>
          </div>

          {/* Actions */}
          <div className="flex gap-12 justify-center w-full">
            <ButtonLink label={"Ricarica"} role={RolesEnum.VIGIL}  href={Routes.wallet.url} />
           
          </div>

          {/* Stats row (skeleton like famigliaTab structure) */}
          <div className="mt-3 grid grid-cols-3 gap-3 w-full text-center">
            <div>
              <div className="text-sm font-semibold">€{stats.totalDeposited.toFixed(2).replace('.', ',')}</div>
              <div className="text-xs text-gray-500">Totale ricaricato</div>
            </div>
            <div>
              <div className="text-sm font-semibold">€{stats.totalSpent.toFixed(2).replace('.', ',')}</div>
              <div className="text-xs text-gray-500">Totale speso</div>
            </div>
            <div>
              <div className="text-sm font-semibold">€{stats.savings.toFixed(2).replace('.', ',')}</div>
              <div className="text-xs text-gray-500">Risparmiato</div>
            </div>
          </div>

          {/* Movements list */}
          <div className="mt-4">
            <h2 className="text-sm font-semibold mb-2">Movimenti recenti</h2>
            <ul className="divide-y divide-gray-100 max-h-[400px] overflow-y-auto">
              {loading ? (
                 <li className="py-3 text-xs text-gray-600 text-center">Caricamento movimenti...</li>
              ) : transactions.length > 0 ? (
                transactions.map((tx) => (
                  <li key={tx.id} className="py-3 flex items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2 flex-1">
                      {tx.type === 'credit' ? (
                        <div className="p-1.5 bg-green-100 rounded-full">
                          <ArrowDownIcon className="w-3 h-3 text-green-600" />
                        </div>
                      ) : (
                        <div className="p-1.5 bg-red-100 rounded-full">
                          <ArrowUpIcon className="w-3 h-3 text-red-600" />
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="text-gray-700 font-medium">{tx.title}</p>
                        <p className="text-gray-500 text-xs">{formatDate(tx.date)}</p>
                      </div>
                    </div>
                    <div className={`font-semibold ${tx.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                      {tx.type === 'credit' ? '+' : ''} €{Math.abs(tx.amount).toFixed(2).replace('.', ',')}
                    </div>
                  </li>
                ))
              ) : (
                <li className="py-3 text-xs text-gray-600 text-center">Nessun movimento disponibile</li>
              )}
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}
