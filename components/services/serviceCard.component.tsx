"use client";

import { useVigilStore } from "@/src/store/vigil/vigil.store";
import { ServiceI } from "@/src/types/services.types";
import { ServicesUtils } from "@/src/utils/services.utils";
import { Avatar, Button } from "@/components";
import { Routes } from "@/src/routes";
import { useRouter } from "next/navigation";

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
      router.push(`${Routes.createBooking.url}?serviceId=${service.id}&vigilId=${service.vigil_id}`);
    }
  };

  return (
    <article
      key={service.id}
      className="border w-full p-4 mb-4 rounded-lg shadow-sm space-y-4"
    >
      <div className="flex flex-nowrap gap-4">
        <div>
          <Avatar size="medium" userId={vigilDetails?.id} value={vigilDetails?.displayName} />
          <span>{vigilDetails?.displayName}</span>
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
        <Button secondary label="Vedi dettagli" />
        <Button label="Prenota ora" action={goToBooking} />
      </div>
    </article>
  );
};

export default ServiceCard;
