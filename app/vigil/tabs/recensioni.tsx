"use client";

import { Button } from "@/components";
import { BookingCardComponent } from "@/components/bookings";
import Card from "@/components/card/card";
import { ReviewCard } from "@/components/reviews";
import { RolesEnum } from "@/src/enums/roles.enums";
import { useBookingsStore } from "@/src/store/bookings/bookings.store";
import { useReviewsStore } from "@/src/store/reviews/reviews.store";
import { useUserStore } from "@/src/store/user/user.store";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface RecensioniTabProps {
  simplified?: boolean;
}

export default function RecensioniTab({
  simplified = false,
}: RecensioniTabProps) {
  const { user } = useUserStore();
  const { reviews, getReviews, getReviewsByVigil } = useReviewsStore();
  const { bookings } = useBookingsStore();
  const params = useParams();

  const vigilIdFromParams = params?.vigilId as string | undefined;
  const vigilId =
    user?.user_metadata?.role === RolesEnum.VIGIL
      ? user?.id
      : vigilIdFromParams;
  const isVigil = user?.user_metadata?.role === RolesEnum.VIGIL;
  const isConsumer = user?.user_metadata?.role === RolesEnum.CONSUMER;

  const filteredBookings = bookings.filter(
    (b) => b.vigil_id === vigilId && b.status === "completed"
  );

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (vigilId) {
      getReviewsByVigil(vigilId, true);
    } else {
      getReviews(true);
    }
    if (vigilId) {
      getReviewsByVigil(vigilId, true);
    } else {
      getReviews(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vigilId]);

  useEffect(() => {
    if (isModalOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isModalOpen]);

  return (
    <div className="space-y-4  mt-6 py-2.5 ">
      <div className="flex justify-between items-center w-full mb-6">
        <h2 className="font-semibold text-2xl  text-center">
          Recensioni recenti
        </h2>
        {isConsumer && vigilIdFromParams && (
          <Button
            label="+"
            action={() => setIsModalOpen(true)}
            small
            role={RolesEnum.VIGIL}
          />
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0  backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-lg max-w-md w-full p-6 z-50">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                Seleziona una prenotazione completata
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700">
                ✕
              </button>
            </div>

            <div className="space-y-3 max-h-[70vh] overflow-y-auto flex flex-col gap-0.5">
              {filteredBookings.length ? (
                filteredBookings.map((b) => (
                  <BookingCardComponent
                    key={b.id}
                    bookingId={b.id}
                    context="profile"
                  />
                ))
              ) : (
                <p>Nessuna prenotazione completata trovata.</p>
              )}
            </div>
          </div>
        </div>
      )}

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
