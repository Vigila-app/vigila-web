"use client";

import { useEffect, useMemo, useState } from "react";
import { Avatar, Badge } from "@/components";
import { VigilService } from "@/src/services";
import { VigilDetailsType } from "@/src/types/vigil.types";
import { ReviewsUtils } from "@/src/utils/reviews.utils";
import { dateDisplay } from "@/src/utils/date.utils";
import { useModalStore } from "@/src/store/modal/modal.store";
import {
  CalendarIcon,
  MapPinIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { StarIcon } from "@heroicons/react/24/solid";
import {
  OccupationEnum,
  VigilTransportationEnum,
} from "@/src/enums/onboarding.enums";

type VigilInfoModalProps = {
  vigilId?: string;
  displayName?: string;
  averageRating?: number;
  reviewCount?: number;
  activeFrom?: string;
};

const MAX_REVIEWS = 3;

const VigilInfoModal = ({
  vigilId,
  displayName,
  averageRating,
  reviewCount,
  activeFrom,
}: VigilInfoModalProps) => {
  const { closeModal } = useModalStore();
  const [vigil, setVigil] = useState<VigilDetailsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadDetails = async () => {
      if (!vigilId) {
        setError("Vigil non disponibile");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");
      setVigil(null);

      try {
        const details = await VigilService.getVigilDetails(vigilId);
        if (cancelled) return;
        setVigil(details || null);
      } catch (err) {
        if (cancelled) return;
        console.error("Failed to load vigil details", err);
        setError("Impossibile caricare i dettagli del vigil");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadDetails();

    return () => {
      cancelled = true;
    };
  }, [vigilId]);

  const visibleReviews = useMemo(
    () => ReviewsUtils.getVisibleReviews(vigil?.reviews || []),
    [vigil?.reviews],
  );

  const ratingValue = useMemo(() => {
    if (typeof vigil?.averageRating === "number") return vigil.averageRating;
    if (typeof averageRating === "number") return averageRating;
    return ReviewsUtils.calculateAverageRating(vigil?.reviews || []);
  }, [vigil?.averageRating, averageRating, vigil?.reviews]);

  const visibleReviewCount = visibleReviews.length || reviewCount || 0;
  const nameLabel = vigil?.displayName || displayName || "-";
  const subscribedFrom = vigil?.created_at || activeFrom;

  const locationLabel = useMemo(() => {
    const parseDisplayName = (displayName?: string) => {
      if (!displayName) return "";
      const streetPrefixes = [
        "via ",
        "viale ",
        "piazza ",
        "corso ",
        "largo ",
        "vicolo ",
        "strada ",
        "rampa ",
        "traversa ",
        "contrada ",
        "ss ",
        "sp ",
        "s.s. ",
        "s.p. ",
      ];
      const parts = displayName
        .split(",")
        .map((part) => part.trim())
        .filter(Boolean)
        .filter((part) => {
          const lower = part.toLowerCase();
          if (/\d/.test(lower)) return false;
          if (lower === "italia" || lower === "italy") return false;
          return !streetPrefixes.some((prefix) => lower.startsWith(prefix));
        });

      if (parts.length >= 2) return `${parts[0]}, ${parts[1]}`;
      return parts[0] || "";
    };

    const formatLocation = (address?: any, displayName?: string) => {
      if (!address && !displayName) return "";
      const normalized =
        address?.address && typeof address.address === "object"
          ? address.address
          : address;
      const neighborhood =
        normalized?.neighbourhood ||
        normalized?.neighborhood ||
        normalized?.suburb ||
        normalized?.quarter ||
        normalized?.district;
      const city = normalized?.city || normalized?.town || normalized?.village;
      const location = [neighborhood, city].filter(Boolean).join(", ");
      if (location) return location;
      return parseDisplayName(displayName || normalized?.display_name);
    };

    const primary = vigil?.addresses?.[0] as any;
    const primaryLocation = formatLocation(primary, primary?.display_name);
    if (primaryLocation) return primaryLocation;

    const fallbackAddress = vigil?.address?.address || vigil?.address;
    const fallbackLocation = formatLocation(
      fallbackAddress,
      vigil?.address?.display_name,
    );
    if (fallbackLocation) return fallbackLocation;

    const cityFallback =
      primary?.address?.city ||
      primary?.address?.town ||
      primary?.address?.village ||
      primary?.city ||
      primary?.town ||
      primary?.village ||
      fallbackAddress?.city ||
      fallbackAddress?.town ||
      fallbackAddress?.village;

    if (cityFallback) return cityFallback;

    return "Localita non disponibile";
  }, [vigil?.addresses, vigil?.address]);

  const occupationValue = (vigil?.occupation || "").toString().trim();
  const isProfessional = [
    OccupationEnum.PROFESSIONAL,
    OccupationEnum.NURSE,
  ].includes(occupationValue as OccupationEnum);

  const transportationValue = (vigil?.transportation || "")
    .toString()
    .trim()
    .toLowerCase();
  const isAutomunito = [
    VigilTransportationEnum.AUTO,
    VigilTransportationEnum.MOTO,
  ].includes(transportationValue as VigilTransportationEnum);

  const renderStars = (rating: number) => (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <StarIcon
          key={star}
          className={`h-4 w-4 ${
            star <= rating ? "text-yellow-400" : "text-gray-200"
          }`}
        />
      ))}
    </div>
  );

  const renderBody = () => {
    if (loading) {
      return (
        <div className="text-sm text-gray-500">Caricamento dettagli...</div>
      );
    }

    if (error) {
      return <div className="text-sm text-red-600">{error}</div>;
    }

    return (
      <div className="space-y-5">
        <div className="flex flex-wrap gap-2">
          {isAutomunito && <Badge label="Automunito" color="green" />}
          {isProfessional && <Badge label="Professionale" color="blue" />}
        </div>

        <div className="text-sm text-gray-700">
          <div className="flex items-center gap-2">
            <MapPinIcon className="h-4 w-4 text-gray-400" />
            <span>{locationLabel}</span>
          </div>
        </div>

        {visibleReviews.length > 0 ? (
          <div className="border-t border-gray-100 pt-4">
            <h4 className="text-sm font-semibold text-gray-900">Recensioni</h4>
            <div className="mt-3 space-y-3">
              {visibleReviews.slice(0, MAX_REVIEWS).map((review, index) => (
                <div
                  key={`${review.rating}-${index}`}
                  className="rounded-lg border border-gray-100 p-3"
                >
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    {renderStars(review.rating)}
                    {review.created_at ? (
                      <span>
                        {dateDisplay(review.created_at, "monthYearLiteral")}
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-2 text-sm text-gray-700">
                    {ReviewsUtils.cleanComment(review.comment)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    );
  };

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <Avatar userId={vigilId} value={nameLabel} size="big" />
          <div>
            <h3 className="text-xl font-semibold text-gray-900">{nameLabel}</h3>
            {visibleReviewCount > 0 && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <StarIcon className="h-4 w-4 text-yellow-400" />
                <span className="font-medium">
                  {ratingValue ? ratingValue.toFixed(1) : "0.0"}
                </span>
                {visibleReviewCount ? (
                  <span className="text-gray-500">
                    ({visibleReviewCount} recensioni)
                  </span>
                ) : null}
              </div>
            )}
            <div className="flex items-center gap-2 ">
              <CalendarIcon className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-600">
                Su Vigila da{" "}
                <span className="capitalize ">
                  {subscribedFrom
                    ? dateDisplay(subscribedFrom, "monthYearLiteral")
                    : "-"}
                </span>
              </span>
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={closeModal}
          aria-label="Chiudi"
          className="text-gray-400 hover:text-gray-600"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>
      </div>

      {renderBody()}
    </div>
  );
};

export default VigilInfoModal;
