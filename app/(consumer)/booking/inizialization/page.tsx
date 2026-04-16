"use client";

import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { UserService } from "@/src/services";

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
      // Persist answers briefly and redirect to the loading page which will
      // perform the matching request and show progress.
      if (typeof window !== "undefined") {
        sessionStorage.setItem("matching_answers", JSON.stringify(answers));
      }
      // use Routes constant so navigation respects app standards
      const { Routes } = await import("@/src/routes");
      router.push(Routes.matchingLoading?.url || "/matching/loading");
    } catch (err) {
      console.error("Failed to start matching flow", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-8">
      <AvailabilityFlow onComplete={handleComplete} />
    </div>
  );
};

export default FirstBookingSelection;
