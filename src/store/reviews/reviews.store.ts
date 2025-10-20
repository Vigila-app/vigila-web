import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import { ReviewsService } from "@/src/services";
import { ReviewFormI, ReviewStoreType } from "@/src/types/review.types";
import { FrequencyEnum } from "@/src/enums/common.enums";
import { dateDiff } from "@/src/utils/date.utils";
import { isDev } from "@/src/utils/envs.utils";
import { BookingStatusEnum } from "@/src/enums/booking.enums";
import { useBookingsStore } from "@/src/store/bookings/bookings.store";
import { createStoreDebouncer } from "@/src/utils/store-debounce.utils";

const initReviewsStore: {
  reviews: ReviewStoreType["reviews"];
  vigilStats: ReviewStoreType["vigilStats"];
  lastUpdate: ReviewStoreType["lastUpdate"];
} = {
  reviews: [],
  vigilStats: {},
  lastUpdate: undefined,
};

// Crea il debouncer per lo store delle recensioni
const { createDebouncedAction } = createStoreDebouncer('reviews-store');

export const useReviewsStore = create<ReviewStoreType>()(
  devtools(
    persist(
      (set, get) => ({
        ...initReviewsStore,

        getReviews: async (force: boolean = false) => {
          const action = async () => {
            try {
              const lastUpdate = get().lastUpdate;
              if (
                force ||
                !lastUpdate ||
                dateDiff(new Date(), lastUpdate, FrequencyEnum.MINUTES) > 1
              ) {
                const response = await ReviewsService.getReviews();
                if (response) {
                  set(
                    () => ({
                      reviews: response,
                      lastUpdate: new Date(),
                    }),
                    false,
                    { type: "getReviews" }
                  );
                }
                return response;
              }
              return get().reviews;
            } catch (error) {
              console.error("useReviewsStore getReviews error:", error);
              throw error;
            }
          };

          return createDebouncedAction('getReviews', action, force);
        },

        getReviewsByVigil: async (vigilId: string, force: boolean = false) => {
          const action = async () => {
            try {
              const lastUpdate = get().lastUpdate;
              if (
                force ||
                !lastUpdate ||
                dateDiff(new Date(), lastUpdate, FrequencyEnum.MINUTES) > 5
              ) {
                const response = await ReviewsService.getReviewsByVigil(vigilId);
                if (response) {
                  // Update only the reviews for this vigil
                  const otherReviews = get().reviews.filter(r => r.vigil_id !== vigilId);
                  set(
                    () => ({
                      reviews: [...otherReviews, ...response],
                      lastUpdate: new Date(),
                    }),
                    false,
                    { type: "getReviewsByVigil", vigilId }
                  );
                }
                return response;
              }
              return get().reviews.filter(r => r.vigil_id === vigilId);
            } catch (error) {
              console.error("useReviewsStore getReviewsByVigil error:", error);
              throw error;
            }
          };

          return createDebouncedAction('getReviewsByVigil', action, force, vigilId);
        },

        getVigilStats: async (vigilId: string, force: boolean = false) => {
          const action = async () => {
            try {
              const existingStats = get().vigilStats[vigilId];
              if (
                force ||
                !existingStats ||
                !get().lastUpdate ||
                dateDiff(new Date(), get().lastUpdate!, FrequencyEnum.MINUTES) > 5
              ) {
                const response = await ReviewsService.getVigilStats(vigilId);
                if (response) {
                  set(
                    (state) => ({
                      vigilStats: {
                        ...state.vigilStats,
                        [vigilId]: response,
                      },
                      lastUpdate: new Date(),
                    }),
                    false,
                    { type: "getVigilStats", vigilId }
                  );
                }
                return response;
              }
              return existingStats;
            } catch (error) {
              console.error("useReviewsStore getVigilStats error:", error);
              throw error;
            }
          };

          return createDebouncedAction('getVigilStats', action, force, vigilId);
        },

        getReviewByBooking: async (bookingId: string) => {
          try {
            // First check if we have it in store
            const existingReview = get().reviews.find(r => r.booking_id === bookingId);
            if (existingReview) {
              return existingReview;
            }

            // If not, fetch from API
            const response = await ReviewsService.getReviewByBooking(bookingId);
            if (response) {
              // Add to store
              set(
                (state) => ({
                  reviews: [...state.reviews, response],
                  lastUpdate: new Date(),
                }),
                false,
                { type: "getReviewByBooking", bookingId }
              );
            }
            return response;
          } catch (error) {
            console.error("useReviewsStore getReviewByBooking error:", error);
            throw error;
          }
        },

        createReview: async (review: ReviewFormI) => {
          try {
            const newReview = await ReviewsService.createReview(review);
            set(
              (state) => ({
                reviews: [newReview, ...state.reviews],
                lastUpdate: new Date(),
              }),
              false,
              { type: "createReview", review }
            );
            
            // Update vigil stats if we have them
            const vigilStats = get().vigilStats[newReview.vigil_id];
            if (vigilStats) {
              set(
                (state) => ({
                  vigilStats: {
                    ...state.vigilStats,
                    [newReview.vigil_id]: {
                      ...vigilStats,
                      total_reviews: vigilStats.total_reviews + 1,
                      // We'll need to refetch for accurate average
                    },
                  },
                }),
                false,
                { type: "updateVigilStatsAfterCreate" }
              );
              // Refetch stats for accuracy
              get().getVigilStats(newReview.vigil_id, true);
            }
            
            return newReview;
          } catch (error) {
            console.error("useReviewsStore createReview error:", error);
            throw error;
          }
        },

        updateReview: async (reviewId: string, updates: Partial<ReviewFormI>) => {
          try {
            const updatedReview = await ReviewsService.updateReview(reviewId, updates);
            set(
              (state) => ({
                reviews: state.reviews.map(review =>
                  review.id === reviewId
                    ? { ...review, ...updatedReview }
                    : review
                ),
                lastUpdate: new Date(),
              }),
              false,
              { type: "updateReview", reviewId }
            );

            // Update vigil stats if rating changed
            if (updates.rating !== undefined) {
              get().getVigilStats(updatedReview.vigil_id, true);
            }

            return updatedReview;
          } catch (error) {
            console.error("useReviewsStore updateReview error:", error);
            throw error;
          }
        },

        deleteReview: async (reviewId: string) => {
          try {
            const review = get().reviews.find(r => r.id === reviewId);
            const success = await ReviewsService.deleteReview(reviewId);
            
            if (success) {
              set(
                (state) => ({
                  reviews: state.reviews.filter(r => r.id !== reviewId),
                  lastUpdate: new Date(),
                }),
                false,
                { type: "deleteReview", reviewId }
              );

              // Update vigil stats
              if (review) {
                get().getVigilStats(review.vigil_id, true);
              }
            }
            
            return success;
          } catch (error) {
            console.error("useReviewsStore deleteReview error:", error);
            throw error;
          }
        },

        canReviewBooking: (bookingId: string) => {
          // Check if booking exists and is completed
          const bookings = useBookingsStore.getState().bookings;
          const booking = bookings.find(b => b.id === bookingId);
          
          if (!booking || booking.status !== BookingStatusEnum.COMPLETED) {
            return false;
          }

          // Check if review already exists
          const existingReview = get().reviews.find(r => r.booking_id === bookingId);
          return !existingReview;
        },

        onLogout: () => {
          set(initReviewsStore, false, { type: "onLogout" });
        },
      }),
      {
        name: "reviews",
        storage: createJSONStorage(() => sessionStorage),
      }
    ),
    { enabled: isDev, anonymousActionType: "reviews" }
  )
);
