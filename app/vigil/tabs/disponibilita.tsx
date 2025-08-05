import { Button } from "@/components";
import Card from "@/components/card/card";
import clsx from "clsx";
import { useState } from "react";

type Availability = {
  morning: boolean;
  afternoon: boolean;
  evening: boolean;
};

type WeeklyAvailability = {
  [key: string]: Availability;
};

const initialAvailability: WeeklyAvailability = {
  Lunedì: { morning: false, afternoon: false, evening: false },
  Martedì: { morning: false, afternoon: false, evening: false },
  Mercoledì: { morning: false, afternoon: false, evening: false },
  Giovedì: { morning: false, afternoon: false, evening: false },
  Venerdì: { morning: false, afternoon: false, evening: false },
  Sabato: { morning: false, afternoon: false, evening: false },
  Domenica: { morning: false, afternoon: false, evening: false },
};

export default function DisponibilitaTab() {
  const [availability, setAvailability] =
    useState<WeeklyAvailability>(initialAvailability);
  const [isEditing, setIsEditing] = useState(false);

  const toggleAvailability = (day: string, timeSlot: keyof Availability) => {
    if (!isEditing) return;
    setAvailability((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [timeSlot]: !prev[day][timeSlot],
      },
    }));
  };

  const days = [
    "Lunedì",
    "Martedì",
    "Mercoledì",
    "Giovedì",
    "Venerdì",
    "Sabato",
    "Domenica",
  ];
  const timeSlots: { key: keyof Availability; label: string; time: string }[] =
    [
      { key: "morning", label: "Mattina", time: "8:00 - 12:00" },
      { key: "afternoon", label: "Pomeriggio", time: "14:00 - 18:00" },
      { key: "evening", label: "Sera", time: "18:00 - 22:00" },
    ];

  return (
    <Card>
      <div className="flex flex-row items-center justify-between pb-2">
        <h3 className="text-lg font-semibold">La mia disponibilità</h3>
        <Button label="Modifica" action={() => setIsEditing(!isEditing)} />
      </div>
      <div className="p-4">
        <div className="grid grid-cols-[auto_1fr_1fr_1fr] gap-x-4 gap-y-3 text-center text-sm">
          <div className="font-medium text-left">Giorno</div>
          {timeSlots.map((slot) => (
            <div key={slot.key} className="font-medium">
              {slot.label}
              <p className="text-xs text-muted-foreground">{slot.time}</p>
            </div>
          ))}

          {days.map((day) => (
            <>
              <div key={day} className="text-left font-medium py-2">
                {day}
              </div>
              {timeSlots.map((slot) => (
                <div
                  key={`${day}-${slot.key}`}
                  className={clsx(
                    "flex items-center justify-center py-2",
                    isEditing && "cursor-pointer hover:opacity-80"
                  )}
                  onClick={() => toggleAvailability(day, slot.key)}>
                  <div
                    className={clsx(
                      "w-4 h-4 rounded-full",
                      availability[day][slot.key]
                        ? "bg-blue-500"
                        : "bg-gray-300"
                    )}
                  />
                </div>
              ))}
            </>
          ))}
        </div>
        {isEditing && (
          <div className="mt-4 text-center">
            <Button label="Salva" action={() => setIsEditing(false)}></Button>
          </div>
        )}
      </div>
    </Card>
  );
}
