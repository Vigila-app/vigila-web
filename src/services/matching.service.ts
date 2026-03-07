import { ApiService } from "@/src/services/api.service";
import { apiMatching } from "@/src/constants/api.constants";
import { MatchingRequestI, MatchingResponseI } from "@/src/types/matching.types";

export const MatchingService = {
  /**
   * Find matching Vigils for a Consumer's service request.
   *
   * Executes the multi-phase matching algorithm:
   * - Phase 1: filter by services, CAP, and gender preference
   * - Phase 2: check availability and count compatible slots
   * - Phase 3 (when > 5 candidates): rank by review quality
   *
   * @param request - The matching request with schedule, dates, and address
   * @returns Matching response with a ranked list of Vigils
   */
  findMatches: async (
    request: MatchingRequestI
  ): Promise<MatchingResponseI> => {
    try {
      const response = await ApiService.post(apiMatching.MATCH(), request);
      if (!response) {
        throw new Error(
          "MatchingService.findMatches received no response from ApiService.post"
        );
      }
      return response as MatchingResponseI;
    } catch (error) {
      console.error("MatchingService.findMatches error", error);
      throw error;
    }
  },
};
