import Card from "@/components/card/card";
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
  const { user } = useUserStore();

  useEffect(() => {
    if (user?.id) {
      getVigilsDetails([user.id], true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const vigil = vigils.find((v) => v.id === user?.id);

  return (
    <section className="p-4 bg-gray-100 rounded-b-2xl">
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
          <BookOpenIcon className="size-6 text-vigil-orange" />
          <h3 className="text-lg font-semibold">Interessi</h3>
        </div>
        <div className="flex flex-wrap gap-2 ">
          <span className="bg-vigil-light-orange text-red-900 text-sm font-medium px-2.5 py-0.5 rounded-full">
            Hard coded
          </span>
          <span className="bg-vigil-light-orange text-red-900 text-sm font-medium px-2.5 py-0.5 rounded-full ">
            Hard coded
          </span>
          <span className="bg-vigil-light-orange text-red-900 text-sm font-medium px-2.5 py-0.5 rounded-full ">
            Hard coded
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
            <p className="text-2xl font-bold text-blue-600">TBD</p>
            <p className="text-sm text-muted-foreground">servizi completati</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-red-600">TBD</p>
            <p className="text-sm text-muted-foreground">guadagno totale</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-blue-600">
              {vigil?.averageRating}
            </p>
            <p className="text-sm text-muted-foreground">valutazione media</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-red-600">
              {vigil?.reviews?.length || "0"}
            </p>
            <p className="text-sm text-muted-foreground">recensioni</p>
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
      <Card>
        <div className="flex flex-row items-center gap-2 pb-2">
          <LanguageIcon className="size-6 text-vigil-orange" />
          <h3 className="text-lg font-semibold">Lingue</h3>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Italiano</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Inglese</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Francese</span>
          </div>
        </div>
      </Card>
    </section>
  );
};

export default PanoramicaTab;
