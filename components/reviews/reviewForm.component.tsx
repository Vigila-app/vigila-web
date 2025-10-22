"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components";
import { TextArea } from "@/components/form";
import { ReviewFormI } from "@/src/types/review.types";
import { useReviewsStore } from "@/src/store/reviews/reviews.store";
import { useModalStore } from "@/src/store/modal/modal.store";
import { useAppStore } from "@/src/store/app/app.store";

interface ReviewFormComponentProps {
  bookingId: string;
  vigilName?: string;
  onSuccess?: () => void;
  isModal?: boolean;
  initialData?: {
    rating: number;
    comment: string;
  };
}

interface ReviewFormData {
  rating: number;
  comment: string;
}

const ReviewFormComponent = (props: ReviewFormComponentProps) => {
  const { bookingId, vigilName, onSuccess, isModal = false, initialData } = props;
  const [hoveredRating, setHoveredRating] = useState(0);
  
  const { createReview, updateReview, getReviews } = useReviewsStore();
  const { closeModal } = useModalStore();
  const { showLoader, hideLoader } = useAppStore();

  const {
    control,
    formState: { errors, isValid },
    handleSubmit,
    watch,
    setValue,
    setError,
  } = useForm<ReviewFormData>({
    defaultValues: {
      rating: initialData?.rating || 0,
      comment: initialData?.comment || "",
    },
  });

  const watchedRating = watch("rating");

  const isEditing = !!initialData;

  const submitForm = async (formData: ReviewFormData) => {
    if (!isValid) return;
    
    showLoader();
    try {
      if (isEditing) {
        // For editing, we need to find the review ID first
        const reviews = await getReviews();
        const existingReview = reviews.find(r => r.booking_id === bookingId);
        
        if (existingReview) {
          await updateReview(existingReview.id, {
            rating: formData.rating,
            comment: formData.comment.trim(),
          });
        } else {
          throw new Error("Review not found for editing");
        }
      } else {
        // Creating new review
        const reviewData: ReviewFormI = {
          booking_id: bookingId,
          rating: formData.rating,
          comment: formData.comment.trim(),
        };
        
        await createReview(reviewData);
      }
      
      if (onSuccess) {
        onSuccess();
      }
      
      if (isModal) {
        closeModal();
      }
    } catch (error) {
      console.error("Error saving review", error);
      setError("comment", { 
        type: "custom", 
        message: "Errore nel salvataggio della recensione. Contata l'assistenza per ricevere supporto." 
      });
    } finally {
      hideLoader();
    }
  };

  const renderStars = () => {
    const currentRating = watchedRating || 0;
    
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className={`text-2xl focus:outline-none transition-colors ${
              star <= (hoveredRating || currentRating)
                ? "text-yellow-400"
                : "text-gray-300"
            }`}
            onMouseEnter={() => setHoveredRating(star)}
            onMouseLeave={() => setHoveredRating(0)}
            onClick={() => setValue("rating", star)}
          >
            ★
          </button>
        ))}
        <span className="ml-2 text-sm text-gray-600">
          {currentRating > 0 ? `${currentRating}/5` : "Seleziona un voto"}
        </span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {isEditing ? "Modifica recensione" : "Lascia una recensione"}
        </h3>
        {vigilName && (
          <p className="text-gray-600">
            Come è stato il servizio di <strong>{vigilName}</strong>?
          </p>
        )}
      </div>

      <form onSubmit={handleSubmit(submitForm)} className="space-y-6">
        {/* Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Valutazione *
          </label>
          <Controller
            name="rating"
            control={control}
            rules={{ 
              required: "Seleziona una valutazione",
              min: { value: 1, message: "Seleziona una valutazione da 1 a 5 stelle" },
              max: { value: 5, message: "Seleziona una valutazione da 1 a 5 stelle" }
            }}
            render={({ field }) => (
              <div>
                {renderStars()}
                <input type="hidden" {...field} />
              </div>
            )}
          />
          {errors.rating && (
            <p className="mt-1 text-sm text-red-600">{errors.rating.message}</p>
          )}
        </div>

        {/* Comment */}
        <div>
          <Controller
            name="comment"
            control={control}
            rules={{
              required: "Il commento è obbligatorio",
              minLength: { value: 10, message: "Il commento deve essere di almeno 10 caratteri" },
              maxLength: { value: 500, message: "Il commento non può superare i 500 caratteri" }
            }}
            render={({ field }) => (
              <TextArea
                {...field}
                id="comment"
                label="Commento *"
                placeholder="Descrivi la tua esperienza con questo servizio..."
                rows={4}
                maxLength={500}
                error={errors.comment}
              />
            )}
          />
          <div className="mt-1 text-right">
            <span className="text-sm text-gray-500">
              {watch("comment")?.length || 0}/500 caratteri
            </span>
          </div>
        </div>

        {/* Submit buttons */}
        <div className="flex gap-4">
          {isModal && (
            <Button
              type="button"
              text
              label="Annulla"
              action={() => closeModal()}
            />
          )}
          <Button
            type="submit"
            label={isEditing ? "Salva modifiche" : "Pubblica recensione"}
            disabled={!isValid || (watchedRating || 0) === 0 || !(watch("comment") || "").trim()}
            action={() => {}}
          />
        </div>
      </form>
    </div>
  );
};

export default ReviewFormComponent;
