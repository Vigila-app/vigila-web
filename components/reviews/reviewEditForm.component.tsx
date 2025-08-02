"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { ReviewI, ReviewFormI } from "@/src/types/review.types";
import { useReviewsStore } from "@/src/store/reviews/reviews.store";
import { useAppStore } from "@/src/store/app/app.store";
import { ToastStatusEnum } from "@/src/enums/toast.enum";
import { Input, TextArea } from "@/components/form";
import Button from "@/components/button/button";
import Card from "@/components/card/card";

interface ReviewEditFormProps {
  review: ReviewI;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const ReviewEditForm = ({
  review,
  onSuccess,
  onCancel,
}: ReviewEditFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { updateReview } = useReviewsStore();
  const { showToast } = useAppStore();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm<Partial<ReviewFormI>>({
    mode: "onChange",
    defaultValues: {
      rating: review.rating,
      comment: review.comment,
    },
  });

  const watchedRating = watch("rating");

  const renderStarRating = () => {
    return (
      <div className="flex space-x-1">
        {Array.from({ length: 5 }, (_, index) => (
          <Controller
            key={index}
            name="rating"
            control={control}
            rules={{ required: "Il rating è obbligatorio", min: 1, max: 5 }}
            render={({ field }) => (
              <button
                type="button"
                className={`text-2xl transition-colors ${
                  (watchedRating || 0) > index
                    ? "text-yellow-400 hover:text-yellow-500"
                    : "text-gray-300 hover:text-gray-400"
                }`}
                onClick={() => field.onChange(index + 1)}
              >
                ★
              </button>
            )}
          />
        ))}
      </div>
    );
  };

  const onSubmit = async (data: Partial<ReviewFormI>) => {
    if (!isValid || !review.id) return;

    setIsLoading(true);
    try {
      await updateReview(review.id, {
        rating: data.rating!,
        comment: data.comment || "",
      });

      showToast({
        message: "Recensione aggiornata con successo",
        type: ToastStatusEnum.SUCCESS,
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error updating review:", error);
      showToast({
        message: "Errore durante l'aggiornamento della recensione",
        type: ToastStatusEnum.ERROR,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-medium mb-4">Modifica Recensione</h3>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Valutazione *
          </label>
          {renderStarRating()}
          {errors.rating && (
            <p className="text-red-500 text-xs mt-1">{errors.rating.message}</p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            Valutazione attuale: {watchedRating || 0}/5
          </p>
        </div>

        {/* Comment */}
        <Controller
          name="comment"
          control={control}
          render={({ field }) => (
            <TextArea
              {...field}
              label="Commento"
              placeholder="Scrivi il tuo commento sulla sessione..."
              rows={4}
              error={errors.comment}
            />
          )}
        />

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-4">
          {onCancel && (
            <Button
              type="button"
              label="Annulla"
              secondary
              action={onCancel}
              disabled={isLoading}
            />
          )}
          <Button
            type="submit"
            label="Aggiorna Recensione"
            primary
            isLoading={isLoading}
            disabled={!isValid || isLoading}
          />
        </div>
      </form>
    </Card>
  );
};

export default ReviewEditForm;
