"use client";

import { useVigilStore } from "@/src/store/vigil/vigil.store";
import { useServicesStore } from "@/src/store/services/services.store";
import { ServiceI } from "@/src/types/services.types";
import { ServicesUtils } from "@/src/utils/services.utils";
import { Avatar, Button } from "@/components";
import { Routes } from "@/src/routes";
import { useRouter } from "next/navigation";
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
        `${Routes.createBooking.url}?service_id=${service.id}&vigil_Id=${service.vigil_id}`
      );
    }
  };

  return (
    <article
      key={service.id}
      className="border w-full p-4 mb-4 rounded-lg shadow-sm space-y-4">
      <div className="flex flex-nowrap flex-col gap-2">
        <div className="flex gap-2 items-center">
          <Avatar
            size="medium"
            userId={vigilDetails?.id}
            value={vigilDetails?.displayName}
          />
          <span className=" flex flex-grow items-center font-semibold text-lg ">
            {vigilDetails?.displayName}
          </span>
        </div>
        <div className="flex gap-1 ">
          <span className="text-sm font-semibold flex-1 items-center">
            {service.name}
          </span>
          <p className="text-sm text-gray-500 flex items-center">
            {service?.currency}
            {service?.unit_price} /
            {ServicesUtils.getServiceUnitType(service.unit_type)}
          </p>
        </div>
        {service?.description && (
          <p className="flex items-center text-xs">{service?.description}</p>
        )}
      </div>
      <div className="inline-flex w-full items-center justify-center gap-3">
        <Button small role={RolesEnum.CONSUMER} label="Vedi dettagli" />
        <Button
          small
          label="Prenota ora"
          role={RolesEnum.VIGIL}
          action={goToBooking}
        />
      </div>
    </article>
  );
};

export default ServiceCard;
