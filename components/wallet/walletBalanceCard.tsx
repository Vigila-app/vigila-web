import React from "react";
import {
  WalletIcon,
  PlusIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import { ButtonLink } from "@/components";
import { Routes } from "@/src/routes";
import { ButtonStyle } from "@/components/button/button.style";
import { amountDisplay } from "@/src/utils/common.utils";

interface WalletBalanceCardProps {
  balance: number;
  label?: string;
  url?: string;
  icon?: boolean;
}

export const WalletBalanceCard: React.FC<WalletBalanceCardProps> = ({
  balance,
  label = "Ricarica il tuo wallet",
  url = Routes.wallet.url,
  icon = true,
}) => {
  return (
    <div className="flex flex-col gap-2 mb-1 bg-consumer-blue px-4 rounded-2xl">
      <div className="flex justify-between items-center pt-4">
        <div className="flex flex-col gap-2 px-2 py-3">
          <p className="text-sm font-medium text-white">Saldo disponibile</p>
          <p className="text-5xl font-medium text-white">
            €{amountDisplay(balance)}
          </p>
        </div>
        <span>
          <WalletIcon className="w-9 h-9 text-white" />
        </span>
      </div>

      {/* Bottone Ricarica */}
      <div className="flex gap-12 justify-center w-full mb-4">
        <ButtonLink
          primary={false}
          label={label}
          customClass={`${ButtonStyle.walletBtnStyle} w-full rounded-full py-3`}
          href={url}
          iconPosition="right"
          icon={
            icon ? (
              <PlusIcon className="w-5 h-5 text-consumer-blue" />
            ) : (
              <ChevronRightIcon className="w-5 h-5 text-consumer-blue" />
            )
          }
        />
      </div>
    </div>
  );
};

export default WalletBalanceCard;
