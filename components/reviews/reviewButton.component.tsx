"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components";
import { BookingI } from "@/src/types/booking.types";
import { ReviewI } from "@/src/types/review.types";
import { useReviewsStore } from "@/src/store/reviews/reviews.store";
import { useModalStore } from "@/src/store/modal/modal.store";
import { useUserStore } from "@/src/store/user/user.store";
import { BookingStatusEnum } from "@/src/enums/booking.enums";
import { RolesEnum } from "@/src/enums/roles.enums";

interface ReviewButtonComponentProps {
  booking: BookingI;
  vigilName?: string;
  onReviewCreated?: () => void;
}

const ReviewButtonComponent = (props: ReviewButtonComponentProps) => {
  const { booking, vigilName, onReviewCreated } = props;
  const [existingReview, setExistingReview] = useState<ReviewI | null>(null);
  const [loading, setLoading] = useState(false);

  const { getReviewByBooking, canReviewBooking } = useReviewsStore();
  const { openModal } = useModalStore();
  const { user } = useUserStore();

  useEffect(() => {
    checkExistingReview();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [booking.id]);

  const checkExistingReview = async () => {
    if (
      booking.status === BookingStatusEnum.COMPLETED &&
      user?.user_metadata?.role === RolesEnum.CONSUMER &&
      user?.id === booking.consumer_id
    ) {
      setLoading(true);
      try {
        const review = await getReviewByBooking(booking.id);
        setExistingReview(review);
      } catch (error) {
        console.error("Error checking existing review:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleReviewClick = () => {
    if (existingReview) {
      // Open modal to view/edit existing review
      openModal("review-edit", {
        reviewId: existingReview.id,
        initialData: {
          rating: existingReview.rating,
          comment: existingReview.comment,
        },
        onSuccess: () => {
          checkExistingReview();
          if (onReviewCreated) {
            onReviewCreated();
          }
        },
      });
    } else {
      // Open modal to create new review
      openModal("review-form", {
        bookingId: booking.id,
        vigilName: vigilName || "",
        onSuccess: () => {
          checkExistingReview();
          if (onReviewCreated) {
            onReviewCreated();
          }
        },
      });
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`text-sm ${
              star <= rating ? "text-yellow-400" : "text-gray-300"
            }`}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  // Only show for consumers who own the booking and it's completed
  if (
    booking.status !== BookingStatusEnum.COMPLETED ||
    user?.user_metadata?.role !== RolesEnum.CONSUMER ||
    user?.id !== booking.consumer_id
  ) {
    return null;
  }

  if (loading) {
    return (
      <div className="text-sm text-gray-500">
        Verificando recensione...
      </div>
    );
  }

  if (existingReview) {
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          {renderStars(existingReview.rating)}
          <span className="text-sm text-gray-600">
            La tua recensione
          </span>
        </div>
        <Button
          text
          label="Modifica recensione"
          action={handleReviewClick}
          customClass="text-sm"
        />
      </div>
    );
  }

  if (canReviewBooking(booking.id)) {
    return (
      <Button
        label="Lascia una recensione"
        action={handleReviewClick}
        customClass="bg-blue-600 hover:bg-blue-700 text-white"
      />
    );
  }

  return null;
};

export default ReviewButtonComponent;
