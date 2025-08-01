"use client";

import Card from "@/components/card/card";
import { RolesEnum } from "@/src/enums/roles.enums";
import { useReviewsStore } from "@/src/store/reviews/reviews.store";
import { useUserStore } from "@/src/store/user/user.store";
import { use, useEffect } from "react";

export default function RecensioniTab() {
  const { user } = useUserStore();
  const { reviews, getReviews, vigilStats } = useReviewsStore();

  const role = user?.user_metadata?.role;

  useEffect(() => {
    getReviews(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      {role === RolesEnum.VIGIL && vigilStats?.average_rating ? (
        <Card>
          <p>Valutazione Media {vigilStats.average_rating}</p>
        </Card>
      ) : null}
      <Card>
        {reviews.length ? (
          reviews.map((review) => (
            <div key={review.id}>
              <p>{review.comment}</p>
              <p>Valutazione: {review.rating}</p>
            </div>
          ))
        ) : (
          <p>Nessuna recensione trovata</p>
        )}
      </Card>
    </div>
  );
}
