"use client";

import Card from "@/components/card/card";
import { ReviewCard } from "@/components/reviews";
import { useReviewsStore } from "@/src/store/reviews/reviews.store";
import { useUserStore } from "@/src/store/user/user.store";
import { useEffect } from "react";

interface RecensioniTabProps {
  simplified?: boolean;
}

export default function RecensioniTab({
  simplified = false,
}: RecensioniTabProps) {
  const { user } = useUserStore();
  const { reviews, getReviews } = useReviewsStore();

  useEffect(() => {
    getReviews(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-4  mt-6 py-2.5 ">
      <h2 className="font-semibold text-2xl mb-6 ">Recensioni recenti</h2>
      {/* {role === RolesEnum.VIGIL &&
      user?.id &&
      vigilStats[user.id]?.average_rating ? (
        <Card>
          <p>Valutazione Media {vigilStats[user.id].average_rating}</p>
        </Card>
      ) : null} */}

      <div className="flex flex-col gap-4 items-center justify-center">
        {reviews.length ? (
          reviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              currentUser={user}
              isEditable={true}
              showEditInline={true}
              simplified={simplified}
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
