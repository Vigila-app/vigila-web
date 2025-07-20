import { Avatar, Button } from "@/components";
import Card from "@/components/card/card";
import Cestino from "@/public/svg/cestino";
import { useConsumerStore } from "@/src/store/consumer/consumer.store";
import { useUserStore } from "@/src/store/user/user.store";
import { MapPinIcon } from "@heroicons/react/24/outline";
import { useEffect } from "react";

export default function FamigliaTab() {
  const { consumers, getConsumersDetails } = useConsumerStore();
   const { user, userDetails } = useUserStore();
  
    useEffect(() => {
      if (user?.id) {
       getConsumersDetails([user.id], true);
      }
    }, [user?.id]);
    const consumer = consumers.find((c) => c.id === user?.id);


   const handleCancelFamily= async()=>{
    console.log("familiare eliminato")
   }
  return (
    <Card full >
      <div className="flex flex-col gap-2 mb-1 px-4">
        <div className="flex justify-between items-start">
          <div className="flex items-start gap-2">
            <Avatar size="big" userId={consumer?.id} value={consumer?.displayName} />
            <div className="flex flex-col">
              <p className="font-semibold text-[16]">
                {consumer?.lovedOneName}{" "}
              </p>
              <p className="text-sm text-gray-600">
                {consumer?.lovedOneAge} anni
              </p>
            </div>
          </div>
          <Button
            label={<Cestino />}
            className=" flex items-center justify-center "
            action={handleCancelFamily}
          />
        </div>
       
        
        <div className="flex items-start space-x-2 text-sm">
          <MapPinIcon className="w-4 h-4  mt-0.5" />
          <span className="text-gray-600">adress del consumer</span>
        </div>
        {/* {service?.description && (
          <div className="flex flex-col">
            <p className="text-[10px] font-semibold text-consumer-blue">Note</p>
            <p className="text-[10px] font-normal">{booking?.note}</p>
          </div>
        )} */}
      </div>
    </Card>
  );
}
