"use client";

import { useVigilStore } from "@/src/store/vigil/vigil.store";
import { ServiceI } from "@/src/types/services.types";
import { ServicesUtils } from "@/src/utils/services.utils";
import { Avatar, Badge, Button, ButtonLink, Card } from "@/components";
import { Routes } from "@/src/routes";
import { useRouter } from "next/navigation";
import { ShieldCheckIcon, StarIcon } from "@heroicons/react/24/solid";
import { ReviewsUtils } from "@/src/utils/reviews.utils";
import { amountDisplay, replaceDynamicUrl } from "@/src/utils/common.utils";
import { useMemo } from "react";
import {
  CalendarIcon,
  EyeIcon,
  HeartIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";
import { dateDisplay } from "@/src/utils/date.utils";
import { RolesEnum } from "@/src/enums/roles.enums";

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
        <div className="space-y-2 flex-1 text-xs">
          <div className="inline-flex items-baseline flex-nowrap gap-4 w-full">
            <h6 className="text-base font-semibold">
              {service.vigil?.displayName}
            </h6>
            {/* {<span>(età)</span>} */}
          </div>
          <div className="inline-flex items-center flex-nowrap gap-2 w-full">
            <Badge
              label={
                <span className="inline-flex gap-1 items-center">
                  <ShieldCheckIcon className="size-3" />
                  Verificato
                </span>
              }
              color="green"
            />
            {service?.vigil?.occupation ? (
              <Badge label={service?.vigil?.occupation} color="blue" />
            ) : null}
            {/* TODO attributes list */}
          </div>
          <div className="inline-flex items-center flex-wrap md:flex-nowrap gap-4 w-full">
            {service.vigil?.addresses?.length ? (
              <div className="inline-flex items-center flex-nowrap gap-1">
                <MapPinIcon className="size-4" />
                <span className="text-ellipsis overflow-hidden whitespace-nowrap max-w-16 md:max-w-24">
                  {service.vigil?.addresses?.map((a) => a.name)?.join(", ")}
                </span>
              </div>
            ) : null}
            {service.vigil?.created_at ? (
              <div className="inline-flex items-center flex-nowrap gap-1">
                <CalendarIcon className="size-4" />
                <span>
                  su Vigila da&nbsp;
                  <span className="capitalize">
                    {dateDisplay(service.vigil?.created_at, "monthYearLiteral")}
                  </span>
                </span>
              </div>
            ) : null}
          </div>
          <div className="inline-flex items-center flex-nowrap gap-2 w-full">
            {avarageRating ? (
              <div className="inline-flex items-center flex-nowrap gap-1">
                <StarIcon className="size-4 text-yellow-500" />
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
      {service?.name ? <div>{service?.name}</div> : null}
      {service?.vigil?.information ? (
        <div>{service?.vigil?.information}</div>
      ) : null}
      {/* TODO add categories <div>categorie</div> */}
      <div className="inline-flex items-center flex-nowrap gap-4 w-full mt-6">
        <Button
          role={RolesEnum.VIGIL}
          customClass="flex-1 !p-3"
          label="Prenota ora"
          action={goToBooking}
          icon={<CalendarIcon className="size-6" />}
        />
        <div className="inline-flex flex-col items-end">
          <span className="text-consumer-blue font-bold">
            {amountDisplay(service?.unit_price, service?.currency)}
          </span>
          &nbsp;a&nbsp;
          {ServicesUtils.getServiceUnitType(service.unit_type)}
        </div>
      </div>
      <div className="inline-flex items-center justify-between flex-nowrap gap-4 w-full mt-4">
        <ButtonLink
          label="Visualizza"
          secondary
          full
          href={replaceDynamicUrl(
            Routes.vigilDetails.url,
            ":vigilId",
            service.vigil_id
          )}
          icon={<EyeIcon className="size-6" />}
          customClass="!p-3"
        />
        <Button
          // TODO feature missing
          disabled
          secondary
          full
          label="Salva"
          action={() => {
            // TODO add to favorites
          }}
          icon={<HeartIcon className="size-6" />}
          customClass="!p-3"
        />
      </div>
    </Card>
  );
};

export default ServiceCard;
