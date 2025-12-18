import { Avatar, Button } from "@/components";
import Card from "@/components/card/card";
import { useConsumerStore } from "@/src/store/consumer/consumer.store";
import { useUserStore } from "@/src/store/user/user.store";
import { MapPinIcon } from "@heroicons/react/24/outline";
import { useEffect } from "react";

export default function FamigliaTab() {
  const { consumers, getConsumersDetails } = useConsumerStore();
  const { user } = useUserStore();

  useEffect(() => {
    if (user?.id) {
      getConsumersDetails([user.id], true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);
  const consumer = consumers.find((c) => c.id === user?.id);

  var relationship;

  switch (consumer?.relationship) {
    case "Nipote":
      relationship = "Nonna/o";
      break;
    case "Figlio/a":
      relationship = "Genitore";
      break;
    case "Amico/a":
      relationship = "Amico/a";
      break;
    case " Badante":
      relationship = "Datore";
      break;
    case "Parente":
      relationship = "Parente";
    default:
      relationship = "Anziano";
      break;
  }

  const handleCancelFamily = async () => {
    console.log("familiare eliminato");
  };

  return (
    <div className=" flex flex-col items-center w-full max-h-[480px] sm:max-h-full">
      <h1 className="py-3 w-full text-[18px] font-semibold text-start">
        Famiglia
      </h1>
      <Card full>
        <div className="flex flex-col gap-2 mb-1 px-4">
          <div className="flex justify-start items-start">
            <div className="flex gap-2">
              <Avatar size="big" value={consumer?.lovedOneName} />
              <div className="flex flex-col justify-center gap-1 flex-1">
                <p className="font-semibold text-[16px] text-gray-800">
                  {consumer?.lovedOneName}
                </p>
                <div className="flex items-center gap-3">
                  <p className="text-sm text-gray-600">
                    {consumer?.lovedOneAge}&nbsp;anni
                  </p>
                  <p className="text-sm text-gray-600">{relationship}</p>
                </div>
              </div>
            </div>
            {/*To DO struttura familiare a più lovedOne */}
            {/* <Button
            label={<Cestino />}
            className="flex items-center justify-center"
            action={handleCancelFamily}
          />
          */}
          </div>

          {consumer?.address?.name && (
            <div className="flex items-center gap-2 text-xs">
              <MapPinIcon className="w-6 h-6 text-vigil-orange" />
              <span className="text-gray-700">
                {consumer?.address?.display_name}
              </span>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
