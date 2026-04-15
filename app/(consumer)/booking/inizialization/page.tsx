"use client";

import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { MatchingService, UserService } from "@/src/services";

const AvailabilityFlow = dynamic(
  () => import("@/components/calendar/AvailabilityRules/AvailabilityFlow"),
  {
    ssr: false,
  },
);

const FirstBookingSelection = () => {
  const router = useRouter();

  const handleComplete = async (answers: Record<string, any>) => {
    try {
      const user = await UserService.getUser();
      if (!user?.id) return console.warn("No user id available for matching");

      const resp = await MatchingService.match(user.id, {
        role: "CONSUMER",
        data: answers,
      });
      console.log("Matching response (from parent onComplete)", resp);
    } catch (err) {
      console.error("Matching call failed in onComplete", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-8">
      <AvailabilityFlow onComplete={handleComplete} />
    </div>
  );
};

export default FirstBookingSelection;
