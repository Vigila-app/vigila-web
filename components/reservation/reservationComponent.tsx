import Prenotazioni from "@/public/svg/Prenotazioni";
import Card from "../card/card";
import Orologio from "@/public/svg/Orologio";
import MapPin from "@/public/svg/MapPin";
import { MapPinIcon } from "@heroicons/react/24/outline";
import Button from "../button/button";
import { RolesEnum } from "@/src/enums/roles.enums";
import { useState } from "react";

export default function Reservation() {
  type Booking = {
    id: string;
    client: string;
    clientAge: string;
    service: string;
    price: string;
    time: string;
    location: string;
    date: string;
    notes?: string;
  };
  const booking: Booking = {
    id: "1",
    client: "Mario",
    clientAge: "76",
    service: "Accompagnamento medico",
    price: "30",
    date: "12/02/2025",
    time: "16:00-17:00",
    location: "Via Berna 45, Pozzuoli",
    notes: "Visita cardiovascolare, fatica a camminare",
  };

  const [accepted, setAccepted] = useState<null | boolean>(null);
  const [refused, setRefused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const handleAccepted = async () => {
    setIsLoading(true);
    try {
      await // TODO SERVICE PER I BOOKING BookingService.updateStatus(
      //             ...,true,
      //           );
      console.log("successo");
      setAccepted(true); //aggiunta per il setEditing
      // showToast({
      //   message: "Profile updated successfully",
      //   type: ToastStatusEnum.SUCCESS,
      // });
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };
  const handleRefused = async () => {
    //   setIsLoading(true);
    //   try {
    console.log("successo");
    setAccepted(false);
    //   } catch (error) {
    //   } finally {
    //     setIsLoading(false);
    //   }
  };

  return (
    <Card full key={booking.id}>
      <div className="">
        <div className="p-6">
          <div className="flex items-start justify-between mb-4 ">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100">
                {/* <Image/>*/}
              </div>
              <div>
                <h3 className="font-semibold text-[16]">{booking.client}</h3>
                <p className="text-sm text-gray-600">
                  {booking.clientAge} anni
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3 mb-4 px-6">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-[12px] text-consumer-blue">
              {booking.service}
            </span>
            <span className="font-semibold text-[12px] text-vigil-orange">
              €{booking.price}
            </span>
          </div>

          <div className="flex items-center space-x-4 text-[10px] text-gray-600">
            <span className="flex items-center gap-1">
              <Prenotazioni />
              <span>{booking.date}</span>
            </span>
            <div className="flex items-center gap-1 ">
              <Orologio />
              <span>{booking.time}</span>
            </div>
          </div>

          <div className="flex items-start space-x-2 text-sm">
            <MapPinIcon className="w-4 h-4  mt-0.5" />
            <span className="text-gray-600">{booking.location}</span>
          </div>

          {booking.notes && (
            <div className="bg-gray-100 p-3 rounded-2xl">
              <p className="text-[10px] ">{booking.notes}</p>
            </div>
          )}
        </div>
      </div>
      <div className="flex justify-center gap-3">
        {accepted === null ? (
          <>
            <Button
              customclass="!px-6 !py-2"
              role={RolesEnum.CONSUMER}
              label="Accetta"
              action={handleAccepted}
            />
            <Button
              customclass="!px-6 !py-2"
              role={RolesEnum.VIGIL}
              action={handleRefused}
              label="Rifiuta"
            />
          </>
        ) : accepted === true ? (
          <Button label="Accettata" disabled />
        ) : (
          <Button label="Rifiutata" disabled />
        )}
      </div>
    </Card>
  );
}
