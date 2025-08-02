"use client";

import Card from "@/components/card/card";
import { ReviewCard } from "@/components/reviews";
import { useReviewsStore } from "@/src/store/reviews/reviews.store";
import { useUserStore } from "@/src/store/user/user.store";
import { useEffect } from "react";

export default function RecensioniTab() {
  const { user } = useUserStore();
  const { reviews, getReviews } = useReviewsStore();

  useEffect(() => {
    getReviews(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-4">
      {/* {role === RolesEnum.VIGIL &&
      user?.id &&
      vigilStats[user.id]?.average_rating ? (
        <Card>
          <p>Valutazione Media {vigilStats[user.id].average_rating}</p>
        </Card>
      ) : null} */}

      <div className="space-y-3">
        {reviews.length ? (
          reviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              currentUser={user}
              isEditable={true}
              showEditInline={true}
            />
          ))
        ) : (
          <Card>
            <p>Nessuna recensione trovata</p>
          </Card>
        )}
      </div>
    </div>
  );
}
