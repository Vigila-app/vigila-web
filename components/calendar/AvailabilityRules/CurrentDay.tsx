import { dayNames } from "./Services";
import { BookingTypeEnum } from "@/src/enums/booking.enums";

export const CurrentDay = ({
  selectedDays,
  answers,
  currentDayIdx,
}: {
  selectedDays: number[];
  answers?: Record<string, any>;
  currentDayIdx: number;
}) => {
  const bookingType = answers?.["booking-type"] as BookingTypeEnum | undefined;
  const isSingle =
    bookingType === BookingTypeEnum.OCCASIONAL ||
    bookingType === BookingTypeEnum.TRIAL;

  if (isSingle) {
    const raw = answers?.["start-date"] ?? answers?.startDate ?? answers?.date;
    let display = "Seleziona data";
    if (raw) {
      try {
        const d =
          typeof raw === "string"
            ? new Date(raw)
            : raw instanceof Date
              ? raw
              : new Date(String(raw));
        if (!isNaN(d.getTime())) display = d.toLocaleDateString();
        else display = String(raw);
      } catch (e) {
        display = String(raw);
      }
    }
    return (
      <>
        <h2>Data</h2>
        <span className="ml-2 text-zinc-600 text-sm">{display}</span>
      </>
    );
  }

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
  );
};
