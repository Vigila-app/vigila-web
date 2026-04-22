"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MatchingService, UserService, ApiService } from "@/src/services";
import { apiMatching } from "@/src/constants/api.constants";
import { Routes } from "@/src/routes";
import { buildMatchingRequestFromAnswers } from "@/src/services/matching.service";

export default function MatchingLoadingPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const run = async () => {
      try {
        const raw =
          typeof window !== "undefined"
            ? sessionStorage.getItem("matching_answers")
            : null;
        if (!raw) {
          console.warn("No matching answers found in sessionStorage");
          return;
        }
        const parsed = JSON.parse(raw);
        // stored shape is raw answers object; ensure we accept both legacy and { answers, matchingRequest }
        const answers = parsed.answers ?? parsed;
        const user = await UserService.getUser();
        if (!user?.id) {
          console.warn("No authenticated user for matching");
          return;
        }
        // Ensure we have a built matchingRequest (includes `schedule`) and persist it.
        let matchingRequest = parsed.matchingRequest;
        if (!matchingRequest) {
          try {
            matchingRequest = buildMatchingRequestFromAnswers(answers);
            // persist the built request alongside answers so no-match page can read it
            sessionStorage.setItem(
              "matching_answers",
              JSON.stringify({ answers, matchingRequest }),
            );
          } catch (e) {
            console.warn("Failed to build matchingRequest in loading page", e);
          }
        }

        // Call matching endpoint; prefer posting the pre-built request when available
        let resp;
        if (matchingRequest) {
          resp = await ApiService.post(apiMatching.MATCH(), matchingRequest);
        } else {
          resp = await MatchingService.match({
            role: "CONSUMER",
            data: answers,
          });
        }
        console.log("Matching response (loading page)", resp);

        // persist response for downstream pages
        sessionStorage.setItem("matching_response", JSON.stringify(resp));

        // If no vigils found, redirect to the no-match page
        if (resp && Array.isArray(resp.data) && resp.data.length === 0) {
          // keep the original answers available for the no-match page
          sessionStorage.setItem("matching_answers", JSON.stringify(answers));
          router.replace(Routes.matchingNoMatch?.url || "/matching/no-match");
          return;
        }

        // If we have matches, redirect to the success page
        if (resp && Array.isArray(resp.data) && resp.data.length > 0) {
          // ensure answers are also available
          sessionStorage.setItem("matching_answers", JSON.stringify(answers));
          router.replace(Routes.matchingSuccess?.url || "/matching/success");
          return;
        }
      } catch (err: any) {
        console.error("Matching call failed in loading page", err);
        if (mounted) setError(err?.message || String(err));
      }
    };
    run();
    return () => {
      mounted = false;
    };
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md ring-1 ring-slate-200">
        <div className="p-6 flex flex-col items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center">
            <svg
              className="w-10 h-10 text-consumer-blue"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z" />
              <path d="M6 20c0-3.3137 2.6863-6 6-6s6 2.6863 6 6" />
            </svg>
          </div>

          <h1 className="text-center text-lg font-semibold text-slate-900">
            Stiamo cercando il caregiver giusto per te
          </h1>

          <p className="text-center text-sm text-slate-500">
            Ci vorrà solo qualche secondo...
          </p>

          <div className="w-full">
            <button
              onClick={() => router.push("/")}
              className="w-full px-4 py-3 rounded-full bg-consumer-blue text-white font-semibold"
            >
              Vai al mio annuncio
            </button>
          </div>

          {error && <div className="text-sm text-red-500">Errore: {error}</div>}
        </div>
      </div>
    </div>
  );
}
