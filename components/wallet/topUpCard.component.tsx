import { TopUpOption } from "@/src/types/wallet.types";

const TopUpCard = ({
  option,
  isSelected,
  onSelect,
}: {
  option: TopUpOption;
  isSelected: boolean;
  onSelect: (id: string) => void;
}) => {
  const bonus = option.creditAmount - option.payAmount;
  const hasBonus = bonus > 0;

  return (
    <div
      onClick={() => onSelect(option.id)}
      className={`relative w-full p-5 rounded-2xl cursor-pointer transition-all duration-200 border-2 bg-white shadow-sm 
        ${
          isSelected
            ? "border-consumer-blue ring-1 ring-consumer-blue/20"
            : "border-transparent hover:border-gray-200"
        }`}>
      {hasBonus && (
        <div className="inline-flex items-center gap-1.5 bg-red-50 text-red-500 px-2.5 py-1 rounded-lg mb-2">
          <span className="text-[10px] font-bold uppercase tracking-wide">
            🎁 In omaggio {bonus.toFixed(2)} €
          </span>
        </div>
      )}

      <div className="flex flex-col">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-gray-900 tracking-tight">
            {option.creditAmount.toFixed(2)} €
          </span>
          <span className="text-sm text-gray-500 font-medium">
            al prezzo di {option.payAmount.toFixed(2)} €
          </span>
        </div>
      </div>

      <div
        className={`absolute top-1/2 -translate-y-1/2 right-5 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors
        ${isSelected ? "border-consumer-blue bg-consumer-blue" : "border-gray-200"}`}>
        {isSelected && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
      </div>
    </div>
  );
};
export default TopUpCard;
