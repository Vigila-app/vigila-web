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
    <div className="flex flex-col items-center justify-center w-full max-h-[480px] sm:max-h-full ">
      <h1 className="py-3 text-[18px] text-start w-full font-semibold">Le tue Recensioni</h1>
      <div className="flex flex-col items-center gap-4 w-full overflow-y-scroll ">
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
