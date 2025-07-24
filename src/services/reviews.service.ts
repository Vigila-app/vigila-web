import { ApiService } from "@/src/services";
import { apiReviews } from "@/src/constants/api.constants";
import { ReviewI, ReviewFormI, ReviewStatsI } from "@/src/types/review.types";

export const ReviewsService = {
  createReview: async (newReview: ReviewFormI) =>
    new Promise<ReviewI>(async (resolve, reject) => {
      try {
        const { data: review } = (await ApiService.post(
          apiReviews.CREATE(),
          newReview
        )) as { data: ReviewI };
        resolve(review);
      } catch (error) {
        console.error("ReviewsService createReview error", error);
        reject(error);
      }
    }),

  getReviews: async () =>
    new Promise<ReviewI[]>(async (resolve, reject) => {
      try {
        const result = (await ApiService.get(apiReviews.LIST())) as {
          data: ReviewI[];
        };
        const { data: response = [] } = result;
        resolve(response);
      } catch (error) {
        console.error("ReviewsService getReviews error", error);
        reject(error);
      }
    }),

  getReviewsByVigil: async (vigilId: string) =>
    new Promise<ReviewI[]>(async (resolve, reject) => {
      try {
        const result = (await ApiService.get(
          apiReviews.LIST_BY_VIGIL(vigilId)
        )) as { data: ReviewI[] };
        const { data: response = [] } = result;
        resolve(response);
      } catch (error) {
        console.error("ReviewsService getReviewsByVigil error", error);
        reject(error);
      }
    }),

  getReviewByBooking: async (bookingId: string) =>
    new Promise<ReviewI | null>(async (resolve, reject) => {
      try {
        const result = (await ApiService.get(
          apiReviews.BY_BOOKING(bookingId)
        )) as { data: ReviewI | null };
        const { data: response = null } = result;
        resolve(response);
      } catch (error) {
        console.error("ReviewsService getReviewByBooking error", error);
        reject(error);
      }
    }),

  getVigilStats: async (vigilId: string) =>
    new Promise<ReviewStatsI>(async (resolve, reject) => {
      try {
        const result = (await ApiService.get(
          apiReviews.VIGIL_STATS(vigilId)
        )) as { data: ReviewStatsI };
        const { data: response } = result;
        resolve(response);
      } catch (error) {
        console.error("ReviewsService getVigilStats error", error);
        reject(error);
      }
    }),

  updateReview: async (reviewId: string, updates: Partial<ReviewFormI>) =>
    new Promise<ReviewI>(async (resolve, reject) => {
      try {
        const result = (await ApiService.put(
          apiReviews.UPDATE(reviewId),
          updates
        )) as { data: ReviewI };
        resolve(result.data);
      } catch (error) {
        console.error("ReviewsService updateReview error", error);
        reject(error);
      }
    }),

  deleteReview: async (reviewId: string) =>
    new Promise<boolean>(async (resolve, reject) => {
      try {
        await ApiService.delete(apiReviews.DELETE(reviewId));
        resolve(true);
      } catch (error) {
        console.error("ReviewsService deleteReview error", error);
        reject(error);
      }
    }),
};
