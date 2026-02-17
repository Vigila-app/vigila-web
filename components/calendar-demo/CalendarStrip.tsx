import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

export const CalendarStrip = ({
  days,
  selectedDate,
  eventsDates,
  onDateClick,
  onNextWeek,
  onPrevWeek,
  currentMonthLabel,
}: any) => {
  return (
    <div className="bg-vigil-orange text-white p-5  shadow-xl">
      {/* Header Navigazione */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={onPrevWeek}
          className="p-2 hover:bg-white/10 rounded-full">
          <ChevronLeftIcon className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-bold capitalize">{currentMonthLabel}</h2>

        <button
          onClick={onNextWeek}
          className="p-2 hover:bg-white/10 rounded-full">
            <ChevronRightIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Griglia 7 colonne x 2 righe */}
      <div className="grid grid-cols-7 gap-y-5">
        {days.map((day: any) => {
          const isSelected = day.dateISO === selectedDate;
          const hasEvent = eventsDates.includes(day.dateISO);

          return (
            <div
              key={day.dateISO}
              onClick={() => onDateClick(day.dateISO)}
              className="flex flex-col items-center cursor-pointer">
              <span className="text-[10px] opacity-70 mb-2 font-medium">
                {day.weekdayLabel}
              </span>

              <div
                className={`
                w-10 h-10 flex items-center justify-center rounded-full text-sm font-bold transition-all
                ${isSelected ? "bg-white text-consumer-blue shadow-lg" : "hover:bg-white/20"}
                ${day.isToday && !isSelected ? "border border-white/40" : ""}
              `}>
                {day.dayNumber}
              </div>

              {/* Pallino Evento */}
              <div className="h-1 mt-1.5">
                {hasEvent && (
                  <div
                    className={`w-1.5 h-1.5 rounded-full ${isSelected ? "bg-consumer-blue" : "bg-red-200"}`}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
