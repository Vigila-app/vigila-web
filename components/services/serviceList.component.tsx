"use client";
import { useServicesStore } from "@/src/store/services/services.store";
import { useEffect, useState } from "react";
import { Badge, Button, LastUpdate, Table } from "@/components";
import {
  amountDisplay,
  replaceDynamicUrl,
  timestampToDate,
} from "@/src/utils/common.utils";
import { Timestamp } from "firebase/firestore/lite";
import { ChevronRightIcon, PlusCircleIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { Routes } from "@/src/routes";
import { DropdownFilter } from "@/components/filters";
import ServiceFormModal, {
  ServiceFormModalId,
} from "@/components/services/serviceForm/serviceForm.modal";
import { useModalStore } from "@/src/store/modal/modal.store";
import { isValidDate } from "@/src/utils/date.utils";
import { useTabActive } from "@/src/hooks";

const ServiceListComponent = () => {
  const {
    getServices,
    services: servicesStore = [],
    lastUpdate,
    resetLastUpdate,
  } = useServicesStore();
  const { openModal } = useModalStore();
  const isTabActive = useTabActive();

  const [services, setServices] = useState(servicesStore);
  const [filters, setFilters] = useState<{ [filter: string]: string }>({
    service: "",
  });

  const updateServiceList = async (force = false) => {
    getServices(force);
  };

  useEffect(() => {
    if (isTabActive) updateServiceList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTabActive]);

  useEffect(() => {
    setServices(servicesStore);
  }, [servicesStore]);

  const updateFilters = (filter: string, value: string) => {
    setFilters({ ...filters, [filter]: value });
  };

  return (
    <>
      <div className="sr-only bg-blue-500 bg-green-500 bg-red-500 bg-yellow-500 bg-purple-500" />
      <div className="w-full inline-flex items-center justify-between">
        <h2>
          Service List (
          {services?.length <= 99
            ? services?.length
            : services?.length
            ? "99+"
            : "0"}
          )
        </h2>
        <div className="inline-flex items-center gap-4">
          <Button
            icon={<PlusCircleIcon className="size-4" />}
            customClass="!px-3 !py-0"
            text
            label="New Service"
            action={() => openModal(ServiceFormModalId)}
          />
          <LastUpdate
            lastUpdate={lastUpdate as Date}
            onUpdate={() => updateServiceList(true)}
          />
        </div>
      </div>
      <div className="my-4">
        <div className="space-y-2">
          <div className="w-full inline-flex items-center gap-8">
            <DropdownFilter
              label="Search"
              type="text"
              placeholder="Search Service by ID or Name"
              onChange={(v) =>
                (v && v.length >= 3) || v === ""
                  ? updateFilters("service", v)
                  : null
              }
              value={filters.service}
            />
          </div>
          {filters.service ? (
            <div className="w-full px-1 inline-flex items-center flex-wrap gap-2">
              {filters.service ? (
                <Badge color="sky" label={`Search: ${filters.service}`} />
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
      <Table
        cols={[
          { field: "id", align: "left", label: "ID" },
          { field: "name", align: "left" },
          { field: "price", align: "right", sortable: true },
          { field: "lastUpdateDate", label: "Last update" },
          { field: "action", content: <></>, align: "right", size: "sm" },
        ]}
        order={{ field: "price", direction: "asc" }}
        rows={services
          .filter((service) => {
            let flag = true;
            flag =
              flag && filters.service
                ? service.id.includes(filters.service) ||
                  service.name.includes(filters.service)
                : flag;

            return flag;
          })
          .map((service) => ({
            ...service,
            creationDate: isValidDate(service.creationDate as unknown as string)
              ? new Date(
                  service.creationDate as unknown as string
                )?.toLocaleString()
              : timestampToDate(
                  service.creationDate as Timestamp
                )?.toLocaleString(),
            lastUpdateDate: isValidDate(
              service.lastUpdateDate as unknown as string
            )
              ? new Date(
                  service.lastUpdateDate as unknown as string
                )?.toLocaleString()
              : timestampToDate(
                  service.lastUpdateDate as Timestamp
                )?.toLocaleString(),
            id:
              filters.service && service.id.includes(filters.service) ? (
                <>
                  {service.id.split(filters.service)[0]}
                  <span className="text-sky-400 font-medium">
                    {filters.service}
                  </span>
                  {service.id.split(filters.service)[1]}
                </>
              ) : (
                service.id
              ),
            name:
              filters.service && service.name.includes(filters.service) ? (
                <>
                  {service.name.split(filters.service)[0]}
                  <span className="text-sky-400 font-medium">
                    {filters.service}
                  </span>
                  {service.name.split(filters.service)[1]}
                </>
              ) : (
                service.name
              ),
            price: `${service.currency}${amountDisplay(service.price)}`,
            priceValue: service.price,
            action: (
              <Link
                className="absolute right-4 top-1/2 translate-y-[-50%]"
                href={`${replaceDynamicUrl(
                  Routes.serviceDetails.url,
                  ":serviceId",
                  service.id
                )}`}
              >
                <ChevronRightIcon className="size-4" />
              </Link>
            ),
          }))}
      />
      {/*<div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {services
          .filter((service) => {
            let flag = true;
            flag =
              flag && filters.service
                ? service.id.includes(filters.service) ||
                  service.name.includes(filters.service)
                : flag;

            return flag;
          })
          .map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>*/}
      <ServiceFormModal
        onSubmit={() => {
          resetLastUpdate?.();
          getServices?.(true);
        }}
      />
    </>
  );
};

export default ServiceListComponent;
