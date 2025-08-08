"use client";

import { useEffect, useState } from "react";
import { ReviewI } from "@/src/types/review.types";
import { useReviewsStore } from "@/src/store/reviews/reviews.store";
import { ReviewListComponent } from "@/components/reviews";
import { Button, Badge } from "@/components";
import { useUserStore } from "@/src/store/user/user.store";
import { RolesEnum } from "@/src/enums/roles.enums";
import { dateDisplay } from "@/src/utils/date.utils";

const AdminReviewsPage = () => {
  const [reviews, setReviews] = useState<ReviewI[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "visible" | "hidden">("all");

  const { getReviews, updateReview, deleteReview } = useReviewsStore();
  const { user } = useUserStore();

  // Redirect if not admin
  useEffect(() => {
    if (user && user.user_metadata?.role !== RolesEnum.ADMIN) {
      window.location.href = "/";
    }
  }, [user]);

  useEffect(() => {
    loadReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadReviews = async () => {
    setLoading(true);
    try {
      const reviewData = await getReviews(true); // Force refresh
      setReviews(reviewData);
    } catch (error) {
      console.error("Error loading reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleVisibility = async (reviewId: string, currentVisibility: boolean) => {
    try {
      await updateReview(reviewId, { visible: !currentVisibility });
      await loadReviews(); // Refresh the list
    } catch (error) {
      console.error("Error toggling visibility:", error);
      alert("Errore nell'aggiornamento della visibilità della recensione");
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!window.confirm("Sei sicuro di voler eliminare questa recensione? L'azione non può essere annullata.")) {
      return;
    }

    try {
      await deleteReview(reviewId);
      await loadReviews(); // Refresh the list
    } catch (error) {
      console.error("Error deleting review:", error);
      alert("Errore nell'eliminazione della recensione");
    }
  };

  const filteredReviews = reviews.filter(review => {
    switch (filter) {
      case "visible":
        return review.visible;
      case "hidden":
        return !review.visible;
      default:
        return true;
    }
  });

  const stats = {
    total: reviews.length,
    visible: reviews.filter(r => r.visible).length,
    hidden: reviews.filter(r => !r.visible).length,
    averageRating: reviews.length > 0 
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : "0",
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-500">Caricamento recensioni...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Gestione Recensioni
          </h1>
          <p className="text-gray-600 mt-2">
            Amministra tutte le recensioni della piattaforma
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            <div className="text-sm text-gray-600">Recensioni totali</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-2xl font-bold text-green-600">{stats.visible}</div>
            <div className="text-sm text-gray-600">Visibili</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-2xl font-bold text-red-600">{stats.hidden}</div>
            <div className="text-sm text-gray-600">Nascoste</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-2xl font-bold text-yellow-600">{stats.averageRating}</div>
            <div className="text-sm text-gray-600">Voto medio</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex space-x-4">
              <Button
                label="Tutte"
                action={() => setFilter("all")}
                customClass={filter === "all" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"}
              />
              <Button
                label="Visibili"
                action={() => setFilter("visible")}
                customClass={filter === "visible" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"}
              />
              <Button
                label="Nascoste"
                action={() => setFilter("hidden")}
                customClass={filter === "hidden" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"}
              />
            </div>
            <Button
              label="Aggiorna"
              action={() => loadReviews()}
            />
          </div>
        </div>

        {/* Reviews List */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Recensioni ({filteredReviews.length})
            </h3>
          </div>
          
          {filteredReviews.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              Nessuna recensione trovata per i filtri selezionati.
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredReviews.map((review) => (
                <div key={review.id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-2">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <span
                              key={star}
                              className={`text-lg ${
                                star <= review.rating ? "text-yellow-400" : "text-gray-300"
                              }`}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                        <Badge
                          label={review.visible ? "Visibile" : "Nascosta"}
                          color={review.visible ? "green" : "red"}
                        />
                        <span className="text-sm text-gray-500">
                          {dateDisplay(review.created_at, "datetime")}
                        </span>
                      </div>
                      
                      <p className="text-gray-800 mb-3">{review.comment}</p>
                      
                      <div className="text-sm text-gray-600">
                        <span>ID Recensione: {review.id.substring(0, 8)}...</span>
                        <span className="mx-2">•</span>
                        <span>Booking: {review.booking_id.substring(0, 8)}...</span>
                        <span className="mx-2">•</span>
                        <span>Consumer: {review.consumer?.displayName}</span>
                        <span className="mx-2">•</span>
                        <span>Vigil: {review.vigil?.displayName}</span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2 ml-4">
                      <Button
                        text
                        label={review.visible ? "Nascondi" : "Mostra"}
                        action={() => handleToggleVisibility(review.id, review.visible)}
                      />
                      <Button
                        text
                        label="Elimina"
                        customClass="text-red-600 hover:text-red-800"
                        action={() => handleDeleteReview(review.id)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminReviewsPage;
