"use client";
import React, { useEffect } from "react";
import { ServiceI } from "@/src/types/services.types";
import ServiceFormModal, {
  ServiceFormModalId,
} from "@/components/services/serviceForm/serviceForm.modal";
import { useServicesStore } from "@/src/store/services/services.store";
import { useModalStore } from "@/src/store/modal/modal.store";
import { amountDisplay } from "@/src/utils/common.utils";
import clsx from "clsx";
import { Button } from "@/components";

type ServiceDetailsI = {
  serviceId: ServiceI["id"];
};

const ServiceDetails = (props: ServiceDetailsI) => {
  const { serviceId } = props;
  const { deleteService, getServices, resetLastUpdate, getServiceDetails } =
    useServicesStore();
  const serviceDetails = useServicesStore
    .getState()
    .services.find((service) => service.id === serviceId);
  const { openModal } = useModalStore();

  useEffect(() => {
    if (serviceId && serviceDetails?.id !== serviceId) {
      getServiceDetails(serviceId, true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serviceId]);

  if (!(serviceId && serviceDetails?.id === serviceId)) return;

  return (
    <div>
      <div className="flow-root bg-white rounded-lg border border-gray-100 py-3 shadow-sm">
        <dl className="-my-3 divide-y divide-gray-100 text-sm">
          <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
            <dt className="font-medium text-gray-900">Name</dt>
            <dd className="text-gray-700 sm:col-span-2">
              {serviceDetails.name}
            </dd>
          </div>

          <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
            <dt className="font-medium text-gray-900">Status</dt>
            <dd className="text-gray-700 text-xs sm:col-span-2">
              <span
                className={clsx(
                  "py-1 px-2 rounded-full uppercase",
                  serviceDetails.active
                    ? "bg-green-500/25 text-green-700"
                    : "bg-gray-500/25 text-gray-700"
                )}
              >
                {serviceDetails.active ? "Active" : "Not active"}
              </span>
            </dd>
          </div>

          <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
            <dt className="font-medium text-gray-900">Price</dt>
            <dd className="text-gray-700 sm:col-span-2">
              {serviceDetails.currency}
              {amountDisplay(serviceDetails.price)}
            </dd>
          </div>

          <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
            <dt className="font-medium text-gray-900">Description</dt>
            <dd className="text-gray-700 sm:col-span-2">
              {serviceDetails.description}
            </dd>
          </div>
        </dl>
      </div>
      <div className="w-full my-4 inline-flex justify-center">
        <div className="inline-flex items-center gap-4">
          <Button action={() => openModal(ServiceFormModalId)} label="Edit" />
          <Button
            danger
            action={() => deleteService(serviceDetails.id)}
            label="Delete"
          />
        </div>
      </div>
      <ServiceFormModal
        service={serviceDetails}
        onSubmit={() => {
          resetLastUpdate?.();
          getServices?.(true);
        }}
      />
    </div>
  );
};

export default ServiceDetails;
