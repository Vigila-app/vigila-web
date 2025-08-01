import Card from "@/components/card/card";
import { useConsumerStore } from "@/src/store/consumer/consumer.store";
import { useUserStore } from "@/src/store/user/user.store";
import {
  EnvelopeIcon,
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
    <section className="py-4  bg-gray-100 rounded-b-2xl">
      <Card>
        <h1 className="flex flex-row items-center gap-2 pb-2">
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
          <svg
            width="22"
            height="22"
            viewBox="0 0 22 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clipPath="url(#clip0_126_1266)">
              <path
                d="M20.1667 15.51V18.26C20.1677 18.5153 20.1154 18.768 20.0132 19.0019C19.9109 19.2358 19.7609 19.4458 19.5728 19.6184C19.3846 19.791 19.1625 19.9224 18.9207 20.0041C18.6789 20.0859 18.4226 20.1163 18.1684 20.0933C15.3476 19.7868 12.6381 18.823 10.2575 17.2792C8.0427 15.8718 6.16491 13.994 4.75752 11.7792C3.20833 9.38777 2.24424 6.66508 1.94335 3.83167C1.92045 3.57818 1.95057 3.3227 2.03181 3.08149C2.11305 2.84028 2.24363 2.61863 2.41522 2.43065C2.58682 2.24267 2.79567 2.09248 3.0285 1.98965C3.26132 1.88681 3.513 1.83357 3.76752 1.83333H6.51752C6.96238 1.82895 7.39366 1.98649 7.73097 2.27657C8.06827 2.56665 8.28859 2.96949 8.35085 3.41C8.46692 4.29006 8.68218 5.15417 8.99252 5.98583C9.11585 6.31393 9.14254 6.6705 9.06943 7.01331C8.99633 7.35611 8.82648 7.67077 8.58002 7.92L7.41585 9.08417C8.72078 11.3791 10.6209 13.2792 12.9159 14.5842L14.08 13.42C14.3293 13.1735 14.6439 13.0037 14.9867 12.9306C15.3295 12.8575 15.6861 12.8842 16.0142 13.0075C16.8459 13.3178 17.71 13.5331 18.59 13.6492C19.0353 13.712 19.442 13.9363 19.7327 14.2794C20.0234 14.6225 20.1778 15.0604 20.1667 15.51Z"
                stroke="#009EDA"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
            <defs>
              <clipPath id="clip0_126_1266">
                <rect width="22" height="22" fill="white" />
              </clipPath>
            </defs>
          </svg>

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
          <div className="flex items-center gap-2">
            <MapPinIcon className="size-4" />
            <span>{consumer?.city}</span>
          </div>
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
