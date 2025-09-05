"use client";

import { useVigilStore } from "@/src/store/vigil/vigil.store";
import { ServiceCatalogItem, ServiceI } from "@/src/types/services.types";
import { ServicesUtils } from "@/src/utils/services.utils";
import { Avatar, Badge, Button, ButtonLink, Card } from "@/components";
import { Routes } from "@/src/routes";
import { useRouter } from "next/navigation";
import { ShieldCheckIcon, StarIcon } from "@heroicons/react/24/solid";
import { ReviewsUtils } from "@/src/utils/reviews.utils";
import { amountDisplay, replaceDynamicUrl } from "@/src/utils/common.utils";
import { useMemo, useState } from "react";
import {
  CalendarIcon,
  EyeIcon,
  HeartIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";
import { dateDisplay } from "@/src/utils/date.utils";
import { RolesEnum } from "@/src/enums/roles.enums";
import clsx from "clsx";
import { useUserStore } from "@/src/store/user/user.store";
import { ServicesService } from "@/src/services";

type ServiceCardI = {
  service: ServiceI;
  showActions?: boolean;
  onEdit?: () => void;
  onToggleStatus?: () => void;
  onDelete?: () => void;
  simplified?: boolean;
};

const ServiceCard = (props: ServiceCardI) => {
  const {
    service,
    showActions = false,
    onEdit,
    onToggleStatus,
    onDelete,
    simplified = false,
  } = props;
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const router = useRouter();
  const { vigils } = useVigilStore();
  const vigilDetails = vigils.find((vigil) => vigil.id === service.vigil_id);
  const { user } = useUserStore();
  const role = useMemo(
    () => user?.user_metadata?.role,
    [user?.user_metadata?.role]
  );

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

  const serviceCatalog: ServiceCatalogItem = useMemo(
    () =>
      service?.info?.catalog_id &&
      ServicesService.getServiceCatalogById(service.info.catalog_id),
    [service?.info?.catalog_id]
  );

  return (
    <Card
      customClass={clsx("py-4", !service.active && "!bg-gray-100")}
      containerClass="space-y-2">
      {!simplified ? (
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
                      {dateDisplay(
                        service.vigil?.created_at,
                        "monthYearLiteral"
                      )}
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
      ) : null}
      {service?.name ? (
        <div className="flex-flexcol items-start gap-6">
          <div className="flex justify-between">
            <p className="text-[17px] font-semibold text-vigil-orange">
              {service?.name}
            </p>
            {simplified && role === RolesEnum.VIGIL ? (
              <div>
                <Badge
                  label={service.active ? "Attivo" : "Non attivo"}
                  color={service.active ? "green" : "red"}
                />
              </div>
            ) : null}
          </div>
          <p className="text-sm text-gray-600">{service?.description}</p>
        </div>
      ) : null}

      {!simplified && service?.vigil?.information ? (
        <div>{service?.vigil?.information}</div>
      ) : null}
      {/* TODO add categories <div>categorie</div> */}

      {!simplified && (
        <div className="inline-flex items-center flex-nowrap gap-4 w-full mt-6">
          <Button
            role={RolesEnum.VIGIL}
            customClass="flex-1 !p-3"
            label="Prenota ora"
            action={goToBooking}
            icon={<CalendarIcon className="size-6" />}
          />
          <div className="flex items-center justify-center ">
            <span className="text-consumer-blue font-bold">
              {amountDisplay(
                service?.unit_price +
                  (role === RolesEnum.CONSUMER ? serviceCatalog.fee : 0),
                service?.currency
              )}
            </span>
            <span>/</span>
            {ServicesUtils.getServiceUnitType(service.unit_type)}
          </div>
        </div>
      )}
      {showActions && (
        <div className="inline-flex items-center gap-2 mt-4 flex-wrap">
          {onEdit && (
            <Button
              label="Modifica"
              small
              role={RolesEnum.CONSUMER}
              type="button"
              action={onEdit}
            />
          )}
          {onToggleStatus && (
            <Button
              small
              label={service.active ? "Disattiva" : "Attiva"}
              type="button"
              role={RolesEnum.CONSUMER}
              action={onToggleStatus}
            />
          )}
          {onDelete && (
            <Button
              label="Elimina"
              type="button"
              small
              danger
              action={() => setShowDeleteModal(true)}
            />
          )}
        </div>
      )}
      {showDeleteModal && onDelete && (
        <div className="fixed inset-0  bg-white/10 backdrop-blur-sm bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-bold mb-2">Conferma eliminazione</h3>
            <p className="mb-4">
              Sei sicuro di voler eliminare il servizio <b>{service.name}</b>?
              Questa azione non può essere annullata.
            </p>
            <div className="flex gap-6 justify-center">
              <Button
                label="Annulla"
                role={RolesEnum.CONSUMER}
                type="button"
                action={() => setShowDeleteModal(false)}
              />
              <Button
                label="Elimina"
                type="button"
                danger
                action={() => {
                  setShowDeleteModal(false);
                  onDelete?.();
                }}
              />
            </div>
          </div>
        </div>
      )}
      {!simplified ? (
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
            {/* TODO feature missing */}
          {/* <Button
            disabled
            secondary
            full
            label="Salva"
            action={() => {
              // TODO add to favorites
            }}
            icon={<HeartIcon className="size-6" />}
            customClass="!p-3"
          /> */}
        </div>
      ) : null}
    </Card>
  );
};

export default ServiceCard;
