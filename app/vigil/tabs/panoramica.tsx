import Card from "@/components/card/card";
import { useBookingsStore } from "@/src/store/bookings/bookings.store";
import { useUserStore } from "@/src/store/user/user.store";
import { useVigilStore } from "@/src/store/vigil/vigil.store";
import {
  AcademicCapIcon,
  BookOpenIcon,
  CheckBadgeIcon,
  EnvelopeIcon,
  HeartIcon,
  LanguageIcon,
  MapPinIcon,
  PhoneIcon,
  TrophyIcon,
} from "@heroicons/react/24/outline";
import { useEffect } from "react";

const PanoramicaTab = () => {
  const { vigils, getVigilsDetails } = useVigilStore();
  const { bookings, getBookings } = useBookingsStore();
  const { user } = useUserStore();

  useEffect(() => {
    if (user?.id) {
      getVigilsDetails([user.id], true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const vigil = vigils.find((v) => v.id === user?.id);
 
  const completedBookings = bookings.filter((b) => b.status === "completed");
  const numberCompletedBookings = completedBookings.length;

  // parte da 0 e per ogni elemento di completedBookings somma il risultato di prezzo- vigila fee
  const totalEarnings = completedBookings.reduce((total, booking) => total +(booking.price - booking.fee), 0);

  return (
    <section className="py-4 bg-gray-100 w-full flex flex-col gap-6 rounded-b-2xl">
      <Card>
        <h1 className="flex flex-row items-center gap-2 pb-2">
          <HeartIcon className="size-6 text-red-600" />
          <span className="font-semibold text-lg">Chi sono</span>
        </h1>

        <div>
          <p className="font-medium leading-relaxed text-sm">
            {vigil?.information}
          </p>
        </div>
      </Card>
      <Card>
        <div className="flex flex-row items-center gap-2 pb-2">
          <AcademicCapIcon className="size-6 text-consumer-blue" />

          <h3 className="text-lg font-semibold ">Competenze</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="bg-consumer-light-blue text-blue-900 text-sm font-medium px-2.5 py-0.5 rounded-full">
            Hard coded
          </span>
          <span className="bg-consumer-light-blue text-blue-900 text-sm font-medium px-2.5 py-0.5 rounded-full ">
            Hard coded
          </span>
          <span className="bg-consumer-light-blue text-blue-900 text-sm font-medium px-2.5 py-0.5 rounded-full ">
            hard coded
          </span>
        </div>
      </Card>
    
      <Card>
        <div className="flex flex-row items-center gap-2 pb-2">
          <TrophyIcon className="size-6 text-yellow-500" />
          <h3 className="text-lg font-semibold">Le mie statistiche</h3>
        </div>
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-consumer-blue">{numberCompletedBookings}</p>
            <p className="text-sm font-medium">Servizi completati</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-vigil-orange">{totalEarnings}€</p>
            <p className="text-sm font-medium">Guadagno totale</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-consumer-blue">
              {vigil?.averageRating}
            </p>
            <p className="text-sm font-medium">Valutazione media</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-vigil-orange">
              {vigil?.reviews?.length || "0"}
            </p>
            <p className="text-sm font-medium">Recensioni</p>
          </div>
        </div>
      </Card>
      <Card>
        <div className="flex flex-row items-center gap-2 pb-2">
          <PhoneIcon className="size-6 text-consumer-blue" />

          <h3 className="text-lg font-semibold">Contatti</h3>
        </div>
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <EnvelopeIcon className="size-4" />
            <span>{user?.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <PhoneIcon className="size-4" />
            <span>{vigil?.phone}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPinIcon className="size-4" />
            <span className="text-ellipsis overflow-hidden whitespace-nowrap max-w-36 md:max-w-52">
              {vigil?.addresses?.map((a) => a.name)?.join(", ")}
            </span>
          </div>
        </div>
      </Card>
      
    </section>
  );
};

export default PanoramicaTab;
