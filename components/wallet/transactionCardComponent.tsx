import {
  ArrowUpRightIcon,
  CalendarIcon,
  ClockIcon,
} from "@heroicons/react/24/outline"
import { ArrowDownLeftIcon } from "@heroicons/react/24/solid"
import {
  isValidTransactionType,
  TRANSACTION_TYPE,
  TransactionI,
} from "@/src/types/transactions.types"

type TransactionCardComponentProps = {
  transactionItem: TransactionI
}

export default function TransactionCardComponent({
  transactionItem,
}: TransactionCardComponentProps) {
  const isIncome = isValidTransactionType(transactionItem.type)
  const dateObj = new Date(transactionItem.created_at)
  const dateStr = dateObj.toLocaleDateString("it-IT", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
  const timeStr = dateObj.toLocaleTimeString("it-IT", {
    hour: "2-digit",
    minute: "2-digit",
  })

  return (
    <div className="flex items-center justify-between p-4 mt-2 border border-gray-300 rounded-2xl bg-white hover:border-gray-200 transition-colors">
      <div className="flex items-start gap-3 overflow-hidden">
        <div
          className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
            isIncome ? "bg-cyan-50" : "bg-red-50"
          }`}
        >
          {isIncome ? (
            <ArrowUpRightIcon className="w-5 h-5 text-cyan-500" />
          ) : (
            <ArrowDownLeftIcon className="w-5 h-5 text-red-400" />
          )}
        </div>

        <div className="flex flex-col min-w-0">
          <span className="font-bold  text-sm truncate pr-2">
            {transactionItem.description || "Transazione"}
          </span>

          <div className="flex items-center gap-3 text-[11px] text-gray-500 mt-1">
            <div className="flex items-center gap-1">
              <CalendarIcon className="w-3 h-3" />
              <span>{dateStr}</span>
            </div>
            <div className="flex items-center gap-1">
              <ClockIcon className="w-3 h-3" />
              <span>{timeStr}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-end gap-1.5 flex-shrink-0 ml-2">
        <span
          className={`text-base font-bold ${
            isIncome ? "text-cyan-500" : "text-gray-900"
          }`}
        >
          {isIncome ? "+" : "-"}€
          {Math.abs(transactionItem.amount / 100)
            .toFixed(2)
            .replace(".", ",")}
        </span>
      </div>
    </div>
  )
}
