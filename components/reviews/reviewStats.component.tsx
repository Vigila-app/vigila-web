"use client";

import { useEffect, useState } from "react";
import { ReviewStatsI } from "@/src/types/review.types";
import { useReviewsStore } from "@/src/store/reviews/reviews.store";

interface ReviewStatsComponentProps {
  vigilId: string;
  showDistribution?: boolean;
  compact?: boolean;
}

const ReviewStatsComponent = (props: ReviewStatsComponentProps) => {
  const { vigilId, showDistribution = true, compact = false } = props;
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<ReviewStatsI | null>(null);

  const { getVigilStats } = useReviewsStore();

  useEffect(() => {
    loadStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vigilId]);

  const loadStats = async () => {
    setLoading(true);
    try {
      const reviewStats = await getVigilStats(vigilId);
      setStats(reviewStats);
    } catch (error) {
      console.error("Error loading review stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating: number, size: "sm" | "md" | "lg" = "md") => {
    const sizeClasses = {
      sm: "text-sm",
      md: "text-lg",
      lg: "text-2xl",
    };

    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`${sizeClasses[size]} ${
              star <= Math.round(rating) ? "text-yellow-400" : "text-gray-300"
            }`}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  const renderDistribution = () => {
    if (!stats || !showDistribution || stats.total_reviews === 0) return null;

    // Create array for all ratings 1-5, filling missing ones with 0
    const distributionMap = new Map(stats.rating_distribution.map(item => [item.rating, item.count]));
    const fullDistribution = [5, 4, 3, 2, 1].map(rating => ({
      rating,
      count: distributionMap.get(rating) || 0,
      percentage: stats.total_reviews > 0 ? ((distributionMap.get(rating) || 0) / stats.total_reviews) * 100 : 0,
    }));

    return (
      <div className="space-y-2">
        {fullDistribution.map((item) => (
          <div key={item.rating} className="flex items-center gap-3">
            <span className="text-sm text-gray-600 w-8">{item.rating}★</span>
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div
                className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                style={{ width: `${item.percentage}%` }}
              />
            </div>
            <span className="text-sm text-gray-600 w-8">{item.count}</span>
          </div>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="text-center py-4">
        <p className="text-gray-500 text-sm">Caricamento statistiche...</p>
      </div>
    );
  }

  if (!stats || stats.total_reviews === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-gray-500 text-sm">Nessuna recensione disponibile</p>
      </div>
    );
  }

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        {renderStars(stats.average_rating, "sm")}
        <span className="text-sm text-gray-600">
          {stats.average_rating.toFixed(1)} ({stats.total_reviews} recensioni)
        </span>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm space-y-4">
      <h3 className="text-lg font-medium text-gray-900">Valutazioni</h3>
      
      <div className="text-center">
        <div className="text-4xl font-bold text-gray-900">
          {stats.average_rating.toFixed(1)}
        </div>
        <div className="mt-1">
          {renderStars(stats.average_rating, "lg")}
        </div>
        <div className="text-sm text-gray-600 mt-2">
          Basato su {stats.total_reviews} recensione{stats.total_reviews !== 1 ? "i" : ""}
        </div>
      </div>

      {renderDistribution()}
    </div>
  );
};

export default ReviewStatsComponent;
