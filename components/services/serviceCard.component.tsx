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
  ExclamationTriangleIcon,
  EyeIcon,
  MapPinIcon,
  UserIcon,
  ChatBubbleBottomCenterIcon,
  UserPlusIcon,
} from "@heroicons/react/24/outline";
import { dateDisplay } from "@/src/utils/date.utils";
import { RolesEnum } from "@/src/enums/roles.enums";
import clsx from "clsx";
import { useUserStore } from "@/src/store/user/user.store";
import { ServicesService } from "@/src/services";
import {
  OccupationEnum,
  OccupationLabels,
  VigilHygieneServiceEnum,
  VigilOutdoorServiceEnum,
} from "@/src/enums/onboarding.enums";
import { VigilDataType } from "@/src/types/vigil.types";

type ServiceCardI = {
  service: ServiceI;
  showActions?: boolean;
  onEdit?: () => void;
  onToggleStatus?: () => void;
  onDelete?: () => void;
  simplified?: boolean;
  vigilData?: VigilDataType;
};

const ServiceCard = (props: ServiceCardI) => {
  const {
    service,
    showActions = false,
    onEdit,
    onToggleStatus,
    onDelete,
    simplified = false,
    vigilData,
  } = props;
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const router = useRouter();
  const { vigils } = useVigilStore();
  const vigilDetails = vigils.find((vigil) => vigil.id === service.vigil_id);
  const { user } = useUserStore();
  const role = useMemo(
    () => user?.user_metadata?.role,
    [user?.user_metadata?.role],
  );
  const isVigil = user?.user_metadata?.role === RolesEnum.VIGIL;
  const isConsumer = user?.user_metadata?.role === RolesEnum.CONSUMER;

  const iconMap: Record<string, React.ReactNode> = {
    "Compagnia e conversazione": (
      <div className="bg-red-300 w-14 h-14 rounded-full p-1 flex items-center justify-center flex-shrink-0">
        <ChatBubbleBottomCenterIcon className="w-10 h-10 text-red-800" />
      </div>
    ),
    "Assistenza leggera": (
      <div className="bg-yellow-200 w-14 h-14 rounded-full p-1 flex items-center justify-center flex-shrink-0">
        <UserIcon className="w-10 h-10 text-yellow-700" />
      </div>
    ),
    "Assistenza alla persona": (
      <div className="bg-green-200 w-14 h-14 rounded-full p-1 flex items-center justify-center flex-shrink-0">
        <UserPlusIcon className="w-10 h-10 text-green-700" />
      </div>
    ),
  };

  const goToBooking = () => {
    if (service?.id && service?.vigil_id) {
      router.push(
        `${Routes.createBooking.url}?serviceId=${service.id}&vigilId=${service.vigil_id}`,
      );
    }
  };

  const avarageRating = useMemo(() => {
    return (
      vigilDetails?.averageRating ||
      ReviewsUtils.calculateAverageRating(vigilDetails?.reviews || [])
    );
  }, [vigilDetails?.averageRating, vigilDetails?.reviews]);

  const serviceCatalog: ServiceCatalogItem | undefined = useMemo(
    // eslint-disable-next-line react-hooks/preserve-manual-memoization
    () =>
      service?.info?.catalog_id
        ? ServicesService.getServiceCatalogById(service.info.catalog_id)
        : undefined,
    [service?.info?.catalog_id],
  );
  console.log("ServiceCard render", { service, serviceCatalog });
  const activeExtras = useMemo(() => {
    if (!vigilData || !serviceCatalog?.extra?.length) return [];

    const hasTransport =
      !!vigilData.outdoor_services?.length &&
      !vigilData.outdoor_services.every(
        (s) => s === VigilOutdoorServiceEnum.NONE,
      );

    const hygieneServices =
      vigilData.hygene_services?.filter(
        (s) => s !== VigilHygieneServiceEnum.NONE,
      ) ?? [];

    return serviceCatalog.extra.filter((extra) => {
      const map: Record<string, boolean> = {
        transport: hasTransport,
        bed_help: hygieneServices.includes(VigilHygieneServiceEnum.BED_HELP),
        bathroom_help: hygieneServices.includes(
          VigilHygieneServiceEnum.BATHROOM_HELP,
        ),
        diaper_help: hygieneServices.includes(
          VigilHygieneServiceEnum.DIAPER_HELP,
        ),
      };
      return map[extra.id] ?? false;
    });
  }, [vigilData, serviceCatalog]);
  return (
    <Card
      customClass={clsx("py-4", !service.active && "!bg-gray-100")}
      containerClass="space-y-2"
    >
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
              {vigilDetails?.verified ? (
                <Badge
                  label={
                    <span className="inline-flex gap-1 items-center">
                      <ShieldCheckIcon className="size-3" />
                      Verificato
                    </span>
                  }
                  color="green"
                />
              ) : null}
              {service?.vigil?.occupation &&
              service.vigil?.occupation !== OccupationEnum.OTHER ? (
                <Badge
                  label={
                    OccupationLabels[
                      service.vigil.occupation.trim() as OccupationEnum
                    ]
                  }
                  color="blue"
                />
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
                        "monthYearLiteral",
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
        <div className="flex flex-col items-start gap-2 w-full">
          <div
            className={clsx(
              "flex justify-between",
              simplified && "items-center gap-4",
            )}
          >
            {simplified && iconMap[service?.name]}
            <div className="flex-1 ">
              <p className="text-lg font-semibold">{service?.name}</p>
              {simplified && role === RolesEnum.VIGIL ? (
                <div className="mt-2">
                  <Badge
                    label={service.active ? "Attivo" : "Non attivo"}
                    color={service.active ? "green" : "red"}
                  />
                </div>
              ) : null}
            </div>
          </div>

          <div className="text-sm mt-1 font-base text-gray-800 w-full ">
            <p>{service?.description}</p>
            {simplified && role === RolesEnum.VIGIL && (
              <>
                {activeExtras.length > 0 && (
                  <p className="font-normal my-2">
                    Extra attivi:&nbsp;
                    {activeExtras
                      .map((extra) => `${extra.name} €${extra.fixed_price}`)
                      .join(", ")}
                  </p>
                )}
                <div className="flex items-center  mt-4 justify-between">
                  <div className="flex gap-5  justify-center items-center">
                    {onToggleStatus &&
                      (!serviceCatalog?.professional ||
                        (serviceCatalog?.professional && service.active)) && (
                        <Button
                          label={service.active ? "Disattiva" : "Attiva"}
                          type="button"
                          role={RolesEnum.CONSUMER}
                          action={onToggleStatus}
                        />
                      )}
                    {onDelete && (
                      <Button
                        label="Rimuovi"
                        type="button"
                        danger
                        action={() => setShowDeleteModal(true)}
                      />
                    )}
                  </div>
                  <p className=" flex justify-end font-medium text-lg my-1 text-black ">
                    Tariffa: &nbsp;
                    {service?.currency}
                    {service?.unit_price}/h
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      ) : null}

      {!simplified && service?.vigil?.information ? (
        <div>{service?.vigil?.information}</div>
      ) : null}
      {/* TODO add categories <div>categorie</div> */}

      {isConsumer && (
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
                  (role === RolesEnum.CONSUMER
                    ? (serviceCatalog?.fee ?? 0)
                    : 0),
                service?.currency,
              )}
            </span>
            <span>/</span>
            {ServicesUtils.getServiceUnitType(service.unit_type)}
          </div>
        </div>
      )}
      {showActions && isVigil ? (
        <div className="inline-flex items-center gap-2 mt-4 flex-wrap">
          {/* {onEdit && (
            <Button
              label="Modifica"
              small
              role={RolesEnum.CONSUMER}
              type="button"
              action={onEdit}
            />
          )} */}

          {onToggleStatus &&
            serviceCatalog?.professional &&
            !service.active && (
              <div className="flex gap-2 bg-amber-50 border border-amber-200 rounded-lg p-2 text-amber-700 w-full items-center mb-2">
                <ExclamationTriangleIcon className="size-4 min-w-4 text-amber-800" />
                <div className="text-sm">
                  I servizi professionali verrano attivati solo dopo la verifica
                  della documentazione da parte del nostro team.
                </div>
              </div>
            )}
        </div>
      ) : null}
      {showDeleteModal && onDelete && (
        <div className="fixed inset-0  bg-white/10 backdrop-blur-sm bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-bold mb-2">Conferma rimozione</h3>
            <p className="mb-4">
              Sei sicuro di voler rimuovere il servizio <b>{service.name}</b>?
              <br />
            </p>
            <div className="flex gap-6 justify-center">
              <Button
                secondary
                label="Annulla"
                role={RolesEnum.CONSUMER}
                type="button"
                action={() => setShowDeleteModal(false)}
              />
              <Button
                label="Rimuovi"
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
              service.vigil_id,
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
