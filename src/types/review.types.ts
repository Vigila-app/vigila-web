import { BookingI } from "./booking.types";
import { UserType } from "./user.types";

export interface ReviewI {
  id: string;
  booking_id: BookingI["id"];
  consumer_id: UserType["id"];
  vigil_id: UserType["id"];
  rating: number; // 1-5
  comment: string;
  visible: boolean;
  created_at: Date;
  updated_at?: Date;
  
  // Relazioni opzionali per join
  booking?: BookingI;
  consumer?: UserType;
  vigil?: UserType;
}

export interface ReviewFormI {
  booking_id: string;
  rating: number;
  comment: string;
  visible?: boolean; // Campo opzionale per admin
}

export interface ReviewStatsI {
  average_rating: number;
  total_reviews: number;
  rating_distribution: {
    rating: number;
    count: number;
  }[];
}

export interface ReviewStoreType {
  reviews: ReviewI[];
  vigilStats: Record<string, ReviewStatsI>;
  lastUpdate?: Date;
  
  // Actions
  getReviews: (force?: boolean) => Promise<ReviewI[]>;
  getReviewsByVigil: (vigilId: string, force?: boolean) => Promise<ReviewI[]>;
  getVigilStats: (vigilId: string, force?: boolean) => Promise<ReviewStatsI>;
  getReviewByBooking: (bookingId: string) => Promise<ReviewI | null>;
  createReview: (review: ReviewFormI) => Promise<ReviewI>;
  updateReview: (reviewId: string, updates: Partial<ReviewFormI>) => Promise<ReviewI>;
  deleteReview: (reviewId: string) => Promise<boolean>;
  canReviewBooking: (bookingId: string) => boolean;
  onLogout: () => void;
}
