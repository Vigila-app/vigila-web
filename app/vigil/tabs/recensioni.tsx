"use client";

import Card from "@/components/card/card";
import { ReviewCard } from "@/components/reviews";
import { RolesEnum } from "@/src/enums/roles.enums";
import { useReviewsStore } from "@/src/store/reviews/reviews.store";
import { useUserStore } from "@/src/store/user/user.store";
import { useParams } from "next/navigation";
import { useEffect } from "react";

interface RecensioniTabProps {
  simplified?: boolean;
}

export default function RecensioniTab({
  simplified = false,
}: RecensioniTabProps) {
  const { user } = useUserStore();
  const { reviews, getReviews, getReviewsByVigil } = useReviewsStore();
  const params = useParams();
  const vigilIdFromParams = params?.vigilId as string | undefined;
  const vigilId =
    user?.user_metadata?.role === RolesEnum.VIGIL
      ? user?.id
      : vigilIdFromParams;
  const isVigil = user?.user_metadata?.role === RolesEnum.VIGIL;

  useEffect(() => {
    if (vigilId) {
      getReviewsByVigil(vigilId, true);
    } else {
      getReviews(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vigilId]);

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
