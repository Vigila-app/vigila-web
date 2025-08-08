import { ReviewI } from "@/src/types/review.types";

type Review = Partial<ReviewI> & {
  rating: number;
  comment: string;
  visible: boolean;
};

const BANNED_WORDS = [
  "cazzo",
  "merda",
  "stronzo",
  "bastardo",
  "coglione",
  "fottuto",
  "minchia",
  "porco",
  "dio",
  "madonna",
  "cristo",
  "troia",
  "puttana",
  "vaffanculo",
  "fanculo",
];

export const ReviewsUtils = {
  calculateAverageRating: (reviews: Review[]): number => {
    if (!reviews || reviews.length === 0) {
      return 0;
    }

    const visibleReviews = reviews.filter((review) => review.visible === true);

    if (visibleReviews.length === 0) {
      return 0;
    }

    const totalRating = visibleReviews.reduce(
      (sum, review) => sum + review.rating,
      0
    );
    const average = totalRating / visibleReviews.length;

    // Arrotonda a 1 decimale
    return Math.round(average * 10) / 10;
  },

  cleanComment: (comment: string): string => {
    if (!comment || typeof comment !== "string") {
      return "";
    }

    let cleanedComment = comment;

    // Rimuove caratteri speciali mantenendo lettere, numeri, spazi e punteggiatura di base
    cleanedComment = cleanedComment.replace(
      /[^\w\s.,!?;:àèéìíîòóùú'"()-]/gi,
      ""
    );

    // Rimuove spazi multipli
    cleanedComment = cleanedComment.replace(/\s+/g, " ");

    // Rimuove parole bannate (case insensitive)
    BANNED_WORDS.forEach((bannedWord) => {
      const regex = new RegExp(`\\b${bannedWord}\\b`, "gi");
      cleanedComment = cleanedComment.replace(regex, "***");
    });

    // Rimuove spazi iniziali e finali
    cleanedComment = cleanedComment.trim();

    return cleanedComment;
  },

  getVisibleReviews: (reviews: Review[]): Review[] => {
    if (!reviews || reviews.length === 0) {
      return [];
    }

    return reviews.filter((review) => review.visible === true);
  },

  getRatingDistribution: (reviews: Review[]): Record<number, number> => {
    const visibleReviews = ReviewsUtils.getVisibleReviews(reviews);

    const distribution = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    };

    visibleReviews.forEach((review) => {
      if (review.rating >= 1 && review.rating <= 5) {
        distribution[review.rating as keyof typeof distribution]++;
      }
    });

    return distribution;
  },

  getReviewsStats: (reviews: Review[]) => {
    const visibleReviews = ReviewsUtils.getVisibleReviews(reviews);
    const averageRating = ReviewsUtils.calculateAverageRating(reviews);
    const distribution = ReviewsUtils.getRatingDistribution(reviews);

    return {
      totalReviews: reviews?.length || 0,
      visibleReviews: visibleReviews.length,
      averageRating,
      distribution,
    };
  },
};
