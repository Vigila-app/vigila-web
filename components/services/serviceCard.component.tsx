"use client";

import { useVigilStore } from "@/src/store/vigil/vigil.store";
import { ServiceI } from "@/src/types/services.types";
import { ServicesUtils } from "@/src/utils/services.utils";
import { Avatar, Badge, Button, ButtonLink, Card } from "@/components";
import { Routes } from "@/src/routes";
import { useRouter } from "next/navigation";
import { StarIcon } from "@heroicons/react/24/solid";
import { ReviewsUtils } from "@/src/utils/reviews.utils";
import { amountDisplay, replaceDynamicUrl } from "@/src/utils/common.utils";
import { useMemo } from "react";
import { CalendarIcon, MapPinIcon } from "@heroicons/react/24/outline";
import { dateDisplay } from "@/src/utils/date.utils";

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
    <Card customClass="p-4" containerClass="space-y-2">
      <div className="inline-flex flex-nowrap gap-4 w-full">
        <Avatar
          className="flex-shrink-0 min-w-16"
          size="big"
          userId={service.vigil_id}
          value={service.vigil?.displayName}
        />
        <div className="space-y-1 flex-1 text-xs">
          <div className="inline-flex items-baseline flex-nowrap gap-4 w-full">
            <h6 className="text-base font-semibold">
              {service.vigil?.displayName}
            </h6>
            <span>(età)</span>
          </div>
          <div className="inline-flex items-center flex-nowrap gap-2 w-full">
            <Badge label="Verificato" color="green" />
            {service?.vigil?.occupation ? (
              <Badge label={service?.vigil?.occupation} color="blue" />
            ) : null}
            {/* TODO attributes list */}
          </div>
          <div className="inline-flex items-center flex-nowrap gap-2 w-full">
            {service.vigil?.addresses?.length ? (
              <div className="inline-flex items-center flex-nowrap gap-1">
                <MapPinIcon className="size-3" />
                <span>
                  {service.vigil?.addresses?.map((a) => a.name)?.join(", ")}
                </span>
              </div>
            ) : null}
            {service.vigil?.created_at ? (
              <div className="inline-flex items-center flex-nowrap gap-1">
                <CalendarIcon className="size-3" />
                <span>
                  su Vigila da {dateDisplay(service.vigil?.created_at, "date")}
                </span>
              </div>
            ) : null}
          </div>
          <div className="inline-flex items-center flex-nowrap gap-2 w-full">
            {avarageRating ? (
              <div className="inline-flex items-center flex-nowrap gap-1">
                <StarIcon className="size-3 text-yellow-500" />
                <span>
                  {avarageRating}
                  {vigilDetails?.reviews?.length &&
                    ` (${vigilDetails?.reviews?.length} recensioni)`}
                </span>
              </div>
            ) : null}
          </div>
        </div>
      </div>
      {service?.vigil?.information ? (
        <div>{service?.vigil?.information}</div>
      ) : null}
      {/* TODO add categories <div>categorie</div> */}
      <div className="inline-flex items-center flex-nowrap gap-4 w-full">
        <Button customClass="flex-1" label="Prenota ora" action={goToBooking} />
        <div className="inline-flex flex-col items-end">
          <span className="text-consumer-blue font-bold">
            {amountDisplay(service?.unit_price, service?.currency)}
          </span>
          &nbsp;a&nbsp;
          {ServicesUtils.getServiceUnitType(service.unit_type)}
        </div>
      </div>
      <div className="inline-flex items-center justify-between flex-nowrap gap-4 w-full">
        <ButtonLink
          label="Vedi Profilo Vigil"
          secondary
          href={replaceDynamicUrl(
            Routes.vigilDetails.url,
            ":vigilId",
            service.vigil_id
          )}
        />
        <Button
          disabled={!!"TODO feature missing"}
          label="Salva"
          action={() => {
            // TODO add to favorites
          }}
        />
      </div>
    </Card>
  );
};

export default ServiceCard;
