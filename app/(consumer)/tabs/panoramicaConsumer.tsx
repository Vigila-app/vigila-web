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
    <section className="py-4 w-full bg-gray-100 rounded-b-2xl flex flex-col gap-4">
      <Card>
        <h1 className="flex flex-row items-center gap-2 pb-2">
          <HeartIcon className="size-6 text-red-600" />
          <span className="font-semibold text-lg">Chi sono</span>
        </h1>

        <div>
          <p className="font-medium leading-relaxed text-[13px]">
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

      <Card>
        <div className="flex flex-row items-center gap-2 pb-2">
          <span>
            <svg
              width="22"
              height="22"
              viewBox="0 0 22 22"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M17.4166 12.8333C18.7825 11.495 20.1666 9.89083 20.1666 7.79167C20.1666 6.45453 19.6355 5.17217 18.69 4.22667C17.7445 3.28117 16.4621 2.75 15.125 2.75C13.5116 2.75 12.375 3.20833 11 4.58333C9.62498 3.20833 8.48831 2.75 6.87498 2.75C5.53785 2.75 4.25548 3.28117 3.30998 4.22667C2.36449 5.17217 1.83331 6.45453 1.83331 7.79167C1.83331 9.9 3.20831 11.5042 4.58331 12.8333L11 19.25L17.4166 12.8333Z"
                stroke="#E94E34"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <h3 className="text-lg font-semibold">Interessi</h3>
        </div>
        <div className="flex flex-wrap gap-2 ">
          <span className="bg-vigil-light-orange text-red-900 text-[10px] font-medium px-2.5 py-0.5 rounded-full">
            Hard coded
          </span>
          <span className="bg-vigil-light-orange text-red-900 text-[10px] font-medium px-2.5 py-0.5 rounded-full ">
            Hard coded
          </span>
          <span className="bg-vigil-light-orange text-red-900 text-[10px] font-medium px-2.5 py-0.5 rounded-full ">
            Hard coded
          </span>
        </div>
      </Card>
    </section>
  );
};

export default PanoramicaConsumerTab;
