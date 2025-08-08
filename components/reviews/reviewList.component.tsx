"use client";

import { useEffect, useState } from "react";
import { ReviewI } from "@/src/types/review.types";
import { useReviewsStore } from "@/src/store/reviews/reviews.store";
import { dateDisplay } from "@/src/utils/date.utils";
import { Button } from "@/components";
import { useUserStore } from "@/src/store/user/user.store";
import { RolesEnum } from "@/src/enums/roles.enums";
import { useModalStore } from "@/src/store/modal/modal.store";

interface ReviewListComponentProps {
  vigilId?: string;
  consumerId?: string;
  showActions?: boolean;
  limit?: number;
  title?: string;
}

const ReviewListComponent = (props: ReviewListComponentProps) => {
  const {
    vigilId,
    consumerId,
    showActions = true,
    limit,
    title = "Recensioni",
  } = props;
  const [loading, setLoading] = useState(false);
  const [reviews, setReviews] = useState<ReviewI[]>([]);

  const { getReviews, getReviewsByVigil, deleteReview } = useReviewsStore();
  const { user } = useUserStore();
  const { openModal } = useModalStore();

  useEffect(() => {
    loadReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vigilId, consumerId]);

  const loadReviews = async () => {
    setLoading(true);
    try {
      let reviewData: ReviewI[] = [];

      if (vigilId) {
        reviewData = await getReviewsByVigil(vigilId);
      } else {
        reviewData = await getReviews();
      }

      if (consumerId) {
        reviewData = reviewData.filter(
          (review) => review.consumer_id === consumerId
        );
      }

      if (limit) {
        reviewData = reviewData.slice(0, limit);
      }

      setReviews(reviewData);
    } catch (error) {
      console.error("Error loading reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (window.confirm("Sei sicuro di voler eliminare questa recensione?")) {
      try {
        await deleteReview(reviewId);
        setReviews(reviews.filter((review) => review.id !== reviewId));
      } catch (error) {
        console.error("Error deleting review:", error);
      }
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`text-lg ${
              star <= rating ? "text-yellow-400" : "text-gray-300"
            }`}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  const canEditReview = (review: ReviewI) => {
    return (
      user?.id === review.consumer_id ||
      user?.user_metadata?.role === RolesEnum.ADMIN
    );
  };

  const canDeleteReview = (review: ReviewI) => {
    return (
      user?.id === review.consumer_id ||
      user?.user_metadata?.role === RolesEnum.ADMIN
    );
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Caricamento recensioni...</p>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Nessuna recensione trovata.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        {limit && reviews.length >= limit && (
          <Button
            text
            label="Vedi tutte"
            action={() => {
              // Navigate to full reviews page
              console.log("Navigate to full reviews");
            }}
          />
        )}
      </div>

      <div className="space-y-4">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">{renderStars(review.rating)}</div>
              <div className="text-sm text-gray-500">
                {dateDisplay(review.created_at, "monthYearLiteral")}
              </div>
            </div>

            <div className="mb-4">
              <p className="text-gray-800 leading-relaxed">{review.comment}</p>
            </div>

            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">
                {review.consumer?.displayName && (
                  <>
                    <span>Di: </span>
                    <span className="font-medium">
                      {review.consumer?.displayName}
                    </span>
                  </>
                )}
                {review.vigil && (
                  <>
                    <span className="mx-2">•</span>
                    <span>Per: </span>
                    <span className="font-medium">
                      {review.vigil?.displayName}
                    </span>
                  </>
                )}
              </div>

              {showActions && (
                <div className="flex gap-2">
                  {canEditReview(review) && (
                    <Button
                      text
                      label="Modifica"
                      customClass="text-sm"
                      action={() =>
                        openModal("review-edit", {
                          reviewId: review.id,
                          initialData: {
                            rating: review.rating,
                            comment: review.comment,
                          },
                        })
                      }
                    />
                  )}
                  {canDeleteReview(review) && (
                    <Button
                      text
                      label="Elimina"
                      customClass="text-sm text-red-600 hover:text-red-800"
                      action={() => handleDeleteReview(review.id)}
                    />
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewListComponent;
