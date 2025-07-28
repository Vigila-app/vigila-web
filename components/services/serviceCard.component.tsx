"use client";

import { useVigilStore } from "@/src/store/vigil/vigil.store";
import { ServiceI } from "@/src/types/services.types";
import { ServicesUtils } from "@/src/utils/services.utils";
import { Avatar, Button, ButtonLink } from "@/components";
import { Routes } from "@/src/routes";
import { useRouter } from "next/navigation";
import { StarIcon } from "@heroicons/react/24/solid";
import { ReviewsUtils } from "@/src/utils/reviews.utils";
import { replaceDynamicUrl } from "@/src/utils/common.utils";
import { useMemo } from "react";

type ServiceCardI = {
  service: ServiceI;
};

const ServiceCard = (props: ServiceCardI) => {
  const { service } = props;
  const router = useRouter();
  const { vigils } = useVigilStore();
  const vigilDetails = vigils.find((vigil) => vigil.id === service.vigil_id);

  const goToBooking = () => {
    if (service?.id && service?.vigil_id) {
      router.push(
        `${Routes.createBooking.url}?serviceId=${service.id}&vigilId=${service.vigil_id}`
      );
    }
  };

  const avarageRating = useMemo(() => {
    return (
      vigilDetails?.averageRating ||
      ReviewsUtils.calculateAverageRating(vigilDetails?.reviews || [])
    );
  }, [vigilDetails?.averageRating, vigilDetails?.reviews]);

  return (
    <article
      key={service.id}
      className="border w-full p-4 mb-4 rounded-lg shadow-sm space-y-4"
    >
      <div className="flex flex-nowrap gap-4">
        <div className="flex flex-col items-center">
          <Avatar
            size="medium"
            userId={service.vigil_id}
            value={service.vigil?.displayName}
          />
          <span>{service.vigil?.displayName}</span>
          {avarageRating ? (
            <span className="inline-flex gap-1 items-center text-sm text-gray-500">
              <StarIcon className="size-4 text-yellow-500 inline-block" />
              <span>{avarageRating}</span>
            </span>
          ) : null}
        </div>
        <div className="flex-1">
          <h6 className="text-xl font-semibold">{service.name}</h6>
          <p>{service.description}</p>
          <p className="text-sm text-gray-500">
            {service.currency}
            {service.unit_price} /{" "}
            {ServicesUtils.getServiceUnitType(service.unit_type)}
          </p>
        </div>
      </div>
      <div className="inline-flex w-full items-center justify-center gap-4">
        <ButtonLink
          secondary
          label="Vedi Profilo Vigil"
          href={replaceDynamicUrl(
            Routes.vigilDetails.url,
            ":vigilId",
            service.vigil_id
          )}
        />
        <Button label="Prenota ora" action={goToBooking} />
      </div>
    </article>
  );
};

export default ServiceCard;
