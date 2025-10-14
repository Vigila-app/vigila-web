import Card from "@/components/card/card";
import { useConsumerStore } from "@/src/store/consumer/consumer.store";
import { useUserStore } from "@/src/store/user/user.store";
import {
  EnvelopeIcon,
  HeartIcon,
  MapPinIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";

import { useEffect } from "react";

const PanoramicaConsumerTab = () => {
  const { consumers, getConsumersDetails } = useConsumerStore();
  const { user, userDetails } = useUserStore();

  useEffect(() => {
    if (user?.id) {
      getConsumersDetails([user.id], true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const consumer = consumers.find((c) => c.id === user?.id);
  return (
    <section className="flex flex-col py-4 w-full bg-gray-100 rounded-b-2xl  gap-4">
      <Card>
        <h1 className="flex flex-row items-center gap-2 pb-2">
          <HeartIcon className="size-6 text-red-600" />
          <span className="font-semibold text-lg">Chi sono</span>
        </h1>

        <div>
          <p className="font-medium leading-relaxed text-sm">
            {consumer?.information}
          </p>
        </div>
      </Card>
      <Card>
        <div className="flex flex-row items-center gap-2 pb-2">
          <PhoneIcon className="size-6 text-consumer-blue" />

          <h3 className="text-lg font-semibold">Contatti</h3>
        </div>
        <div className="space-y-2 text-[10px] text-muted-foreground">
          <div className="flex items-center gap-2">
            <EnvelopeIcon className="size-4" />
            <span>{user?.email}</span>
          </div>
          {(consumer?.lovedOnePhone || consumer?.phone) && (
            <div className="flex items-center gap-2">
              <PhoneIcon className="size-4" />
              <span>{consumer?.lovedOnePhone || consumer?.phone}</span>
            </div>
          )}
          {consumer?.address?.name && (
            <div className="flex items-center gap-2">
              <MapPinIcon className="size-4" />
              <span>{consumer?.address?.name}</span>
            </div>
          )}
        </div>
      </Card>
    </section>
  );
};

export default PanoramicaConsumerTab;
