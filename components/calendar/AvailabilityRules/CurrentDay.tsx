import { dayNames } from "./Services"

export const CurrentDay = ({selectedDays, answers, currentDayIdx}: {selectedDays: number[], answers?: Record<string, any>, currentDayIdx: number}) => {

  return selectedDays.length === 0 ? (
          <div className="text-sm text-zinc-500">Nessun giorno selezionato</div>
        ) : (
          <>
            <h2>{dayNames[Number(selectedDays[currentDayIdx])]}</h2>
            <span className="ml-2 text-zinc-600 text-sm">
              {(answers?.availabilityRules || [])
                .filter(
                  (r: any) =>
                    Number(r.weekday) === Number(selectedDays[currentDayIdx]),
                )
                .map(
                  (r: any) =>
                    `${r.start_time.slice(0, 5)} - ${r.end_time.slice(0, 5)}`,
                )
                .join(", ")}
            </span>
          </>
        )
}