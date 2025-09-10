"use client";

import { useState } from "react";
import { ReviewI } from "@/src/types/review.types";
import { RolesEnum } from "@/src/enums/roles.enums";
import { UserType } from "@/src/types/user.types";
import Card from "@/components/card/card";
import Button from "@/components/button/button";
import { useReviewsStore } from "@/src/store/reviews/reviews.store";
import { useAppStore } from "@/src/store/app/app.store";
import { ToastStatusEnum } from "@/src/enums/toast.enum";
import ReviewEditForm from "./reviewEditForm.component";
import { dateDisplay } from "@/src/utils/date.utils";

interface ReviewCardProps {
  review: ReviewI;
  currentUser?: UserType;
  isEditable?: boolean;
  onEdit?: (review: ReviewI) => void;
  onDelete?: (reviewId: string) => void;
  showEditInline?: boolean;
}

const ReviewCard = ({
  review,
  currentUser,
  isEditable = true,
  onEdit,
  onDelete,
  showEditInline = false,
}: ReviewCardProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { deleteReview } = useReviewsStore();
  const { showToast } = useAppStore();

  const userRole = currentUser?.user_metadata?.role;
  const isOwner = currentUser?.id === review.consumer_id;
  const isAdmin = userRole === RolesEnum.ADMIN;

  //Lascio per ipotetica futura  feature per contattare supporto per review non veritiera

  const isVigilOwner =
    userRole === RolesEnum.VIGIL && currentUser?.id === review.vigil_id;

  // Determina se l'utente può modificare la recensione
  const canEdit = isEditable && (isOwner || isAdmin);

  // Determina se l'utente può eliminare la recensione
  const canDelete = isEditable && (isOwner || isAdmin);

  // Renderizza le stelle per il rating
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span
        key={index}
        className={`text-lg ${
          index < rating ? "text-yellow-400" : "text-gray-300"
        }`}>
        ★
      </span>
    ));
  };

  // Gestisce la modifica della recensione
  const handleEdit = () => {
    if (onEdit) {
      onEdit(review);
    } else if (showEditInline) {
      setIsEditing(true);
    } else {
      // Fallback: log per debug
      console.log("Edit review:", review.id);
    }
  };

  const handleEditSuccess = () => {
    setIsEditing(false);
    showToast({
      message: "Recensione aggiornata con successo",
      type: ToastStatusEnum.SUCCESS,
    });
  };

  const handleEditCancel = () => {
    setIsEditing(false);
  };

  // Gestisce l'eliminazione della recensione
  const handleDelete = async () => {
    if (!review.id) return;

    const confirmDelete = window.confirm(
      "Sei sicuro di voler eliminare questa recensione? L'azione non può essere annullata."
    );

    if (!confirmDelete) return;

    try {
      setIsDeleting(true);
      const success = await deleteReview(review.id);

      if (success) {
        showToast({
          message: "Recensione eliminata con successo",
          type: ToastStatusEnum.SUCCESS,
        });

        if (onDelete) {
          onDelete(review.id);
        }
      } else {
        throw new Error("Errore durante l'eliminazione");
      }
    } catch (error) {
      console.error("Error deleting review:", error);
      showToast({
        message: "Errore durante l'eliminazione della recensione",
        type: ToastStatusEnum.ERROR,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // Se è in modalità editing, mostra il form di modifica
  if (isEditing && showEditInline) {
    return (
      <ReviewEditForm
        review={review}
        onSuccess={handleEditSuccess}
        onCancel={handleEditCancel}
      />
    );
  }

  return (
    <Card className="p-4 space-y-3 border border-amber-600 rounded-2xl w-full max-w-full"> 
      {/* Header con rating e data */}
      <div className="flex justify-between  items-start">
        <div className="flex items-center space-x-2">
          <div className="flex">{renderStars(review.rating)}</div>
          <span className="text-sm text-gray-500">({review.rating}/5)</span>
        </div>
        <span className="text-xs text-gray-400">
          {dateDisplay(review.created_at, "monthYearLiteral")}
        </span>
      </div>

      {/* Commento */}
      {review.comment && (
        <div className="text-gray-700">
          <p className="leading-relaxed">{review.comment}</p>
        </div>
      )}

      {/* Informazioni utente se disponibili */}
      {review.consumer && (
        <div className="text-xs text-gray-500 border-t pt-2">
          <span>
            Recensione di:&nbsp;
            {review.consumer.user_metadata?.name || "Utente anonimo"}
          </span>
        </div>
      )}

      {/* Badge di stato */}
      <div className="flex items-center space-x-2">
        {!review.visible && (
          <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
            Non visibile
          </span>
        )}
        {review.updated_at && (
          <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded-full">
            Modificata
          </span>
        )}
      </div>

      {/* Azioni */}
      {(canEdit  || canDelete) && (
        <div className="flex justify-end space-x-2 border-t pt-3">
          {canEdit && (
            <Button
              label="Modifica"
              secondary
              small
              action={handleEdit}
              disabled={isDeleting}
            />
          )}
          {canDelete && (
            <Button
              label="Elimina"
              danger
              small
              action={handleDelete}
              isLoading={isDeleting}
              disabled={isDeleting}
            />
          )}
        </div>
      )}

      {/* Informazioni debug per admin */}
      {isAdmin && (
        <div className="text-xs text-gray-400 border-t pt-2 space-y-1">
          <div>ID: {review.id}</div>
          <div>Booking ID: {review.booking_id}</div>
          <div>Consumer ID: {review.consumer_id}</div>
          <div>Vigil ID: {review.vigil_id}</div>
        </div>
      )}
    </Card>
  );
};

export default ReviewCard;
