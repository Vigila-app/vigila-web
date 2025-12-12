"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Button, Card } from "@/components";
import Badge from "@/components/badge/badge.component";
import { ServiceCatalogItem, ServiceI } from "@/src/types/services.types";
import { RolesEnum } from "@/src/enums/roles.enums";
import { CurrencyEnum, FrequencyEnum } from "@/src/enums/common.enums";
import { ServicesService } from "@/src/services/services.service";
import clsx from "clsx";
import {
  XCircleIcon,
  ShieldCheckIcon,
  // PlusIcon,
  // MinusIcon,
  ShoppingCartIcon,
  UsersIcon,
  UserIcon,
  ExclamationTriangleIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";

type SelectedService = {
  active: boolean;
  catalogId: number;
  name: string;
  description: string;
  unit_price: number;
  unit_type: string;
  min_unit: number;
  max_unit?: number;
  currency: CurrencyEnum;
  selectedExtras: string[];
  type: string;
};

interface ServicesCatalogProps {
  role: RolesEnum;
  occupation?: string;
  selectedServices?: ServiceI[];
  onServicesChange: (services: ServiceI[]) => void;
}

const ServicesCatalog: React.FC<ServicesCatalogProps> = ({
  role,
  occupation,
  onServicesChange,
  // selectedServices = [],
}) => {
  const [internalSelectedServices, setInternalSelectedServices] = useState<
    SelectedService[]
  >([]);
  const [servicesCatalog, setServicesCatalog] = useState<ServiceCatalogItem[]>(
    []
  );
  const iconMap: Record<string, React.ReactNode> = {
    "Compagnia e conversazione": (
      <div className=" bg-red-300 w-14 h-14 rounded-full p-1 flex items-center justify-center">
        <UsersIcon className="w-10 h-10 text-red-800 " />
      </div>
    ),
    "Assistenza leggera": (
      <div className=" bg-yellow-200 w-16 h-16 rounded-full p-1 flex items-center justify-center">
        <ShoppingCartIcon className="w-12 h-12 text-yellow-700" />
      </div>
    ),
    "Assistenza alla persona": (
      <div className=" bg-green-200 w-16 h-16 rounded-full p-1 flex items-center justify-center">
        <UserIcon className="w-12 h-12 text-green-700" />
      </div>
    ),
  };

  // Carica il catalogo servizi
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setServicesCatalog(ServicesService.getServicesCatalog());
  }, []);

  // Converte i servizi interni in formato ServiceI per il form
  useEffect(() => {
    const convertedServices: Partial<ServiceI>[] = internalSelectedServices.map(
      (service) => ({
        id: service.catalogId.toString(),
        active: service.active,
        name: service.name,
        description: service.description,
        unit_price: service.unit_price,
        currency: service.currency,
        unit_type: service.unit_type,
        min_unit: service.min_unit,
        max_unit: service.max_unit,
        info: {
          catalog_id: service.catalogId,
          extras: service.selectedExtras,
        },
        type: service.type,
      })
    );
    onServicesChange(convertedServices as ServiceI[]);
  }, [internalSelectedServices, onServicesChange]);

  const addService = (catalogService: ServiceCatalogItem) => {
    const newService: SelectedService = {
      catalogId: catalogService.id,
      name: catalogService.name,
      description: catalogService.description,
      unit_price: catalogService.recommended_hourly_rate,
      unit_type: FrequencyEnum.HOURS,
      min_unit: catalogService.minimum_duration_hours,
      currency: CurrencyEnum.EURO,
      selectedExtras: [],
      type: catalogService.type,
      active: !catalogService.professional,
    };

    setInternalSelectedServices((prev) => [...prev, newService]);
  };

  const removeService = (catalogId: SelectedService["catalogId"]) => {
    setInternalSelectedServices((prev) =>
      prev.filter((service) => service.catalogId !== catalogId)
    );
  };

  const updateServicePrice = (index: number, newPrice: number) => {
    setInternalSelectedServices((prev) =>
      prev.map((service, i) =>
        i === index ? { ...service, unit_price: newPrice } : service
      )
    );
  };

  const toggleExtra = (
    catalogId: SelectedService["catalogId"],
    extraId: string
  ) => {
    setInternalSelectedServices((prev) =>
      prev.map((service, i) => {
        if (service.catalogId === catalogId) {
          const selectedExtras = service.selectedExtras.includes(extraId)
            ? service.selectedExtras.filter((id) => id !== extraId)
            : [...service.selectedExtras, extraId];
          return { ...service, selectedExtras };
        }
        return service;
      })
    );
  };

  const isServiceSelected = (catalogId: number) => {
    return internalSelectedServices.some(
      (service) => service.catalogId === catalogId
    );
  };

  const getCatalogService = (catalogId: number) => {
    return servicesCatalog.find(
      (service: ServiceCatalogItem) => service.id === catalogId
    );
  };

  const filteredServices = useMemo(() => {
    return servicesCatalog.filter((service: ServiceCatalogItem) => {
      // Se non c'è un'occupazione selezionata non mostrare i servizi
      if (!occupation) return false;

      // Se il servizio è già selezionato, non mostrarlo nel catalogo
      // if (selectedServices.find((s) => s.info?.catalog_id === service.id)) {
      //   return false;
      // }

      // Se il servizio non ha requisiti di occupazione, è disponibile per tutti
      if (!service.occupation || service.occupation.length === 0) return true;

      // Altrimenti, verifica se l'occupazione corrente è tra quelle richieste
      return service.occupation.includes(occupation);
    });
  }, [occupation, servicesCatalog]);

  return (
    <div className="space-y-8">
      <div>
        <label
          className={clsx(
            "block font-semibold mb- text-xl mb-4",
            role === RolesEnum.VIGIL && "text-vigil-orange",
            role === RolesEnum.CONSUMER && "text-consumer-blue"
          )}
        >
          Scegli i servizi che vuoi offrire
        </label>

        {/* Catalogo servizi disponibili */}
        <div className="grid gap-6 mb-8 scroll-m-12" id="services-catalog">
          {!occupation && (
            <a
              href="#occupazione"
              className="inline-flex justify-center w-full my-2 items-center gap-1 text-sm animate-pulse"
            >
              <ExclamationTriangleIcon className="size-5 min-w-4 text-vigil-orange" />
              <span>
                Seleziona la tua occupazione per visualizzare i servizi
                disponibili.
              </span>
            </a>
          )}
          {occupation && filteredServices.length === 0 && (
            <p className="text-gray-500 text-center py-8">
              Nessun servizio disponibile per la tua occupazione al momento.
            </p>
          )}
          {occupation &&
            filteredServices.map((catalogService: ServiceCatalogItem) => (
              <Card
                key={catalogService.id}
                customClass={clsx(
                  isServiceSelected(catalogService.id) &&
                    "!bg-green-50 !border-green-300"
                )}
              >
                <div className="relative flex flex-col justify-between">
                  {isServiceSelected(catalogService.id) ? (
                    <button
                      type="button"
                      onClick={() => removeService(catalogService.id)}
                      className="text-gray-500 hover:text-red-600 p-1 absolute top-0 right-0"
                      aria-label="Rimuovi servizio"
                    >
                      <XCircleIcon className="size-5 min-w-5" />
                    </button>
                  ) : null}
                  <div className="flex-1 mb-4">
                    <div className="flex items-center justify-between mb-4">
                      <p className="font-semibold text-xl text-consumer-blue">
                        {catalogService.name}
                      </p>
                      {catalogService.professional && (
                        <Badge
                          label={
                            <span className="inline-flex gap-1 items-center">
                              <ShieldCheckIcon className="size-4" />
                              Professionale
                            </span>
                          }
                          color="blue"
                        />
                      )}
                    </div>

                    <div className="flex justify-between w-full items-center">
                      {iconMap[catalogService.name] || ""}
                      <div className="flex flex-col gap-1 justify-center items-end">
                        <div className="flex gap-1">
                          <span>
                            {/* €{catalogService.min_hourly_rate}- */}€
                            {catalogService.min_hourly_rate}/h
                          </span>
                          |
                          <span>
                            min.&nbsp;{catalogService.minimum_duration_hours}h
                          </span>
                        </div>
                        {/* <span className="text-[16px] text-gray-600">
                        Consigliato: €{catalogService.recommended_hourly_rate}
                        /ora
                      </span> */}
                      </div>
                    </div>
                    <p className="my-2">Descrizione:</p>
                    <p className="font-light mb-3">
                      {catalogService.description}
                    </p>
                    {catalogService.extra.length > 0 && (
                      <div className="mt-2">
                        {isServiceSelected(catalogService.id) ? (
                          <>
                            <label className="block text-sm font-medium mb-2">
                              Aggiungi opzioni extra:
                            </label>
                            <div className="space-y-2">
                              {catalogService.extra.map((extra: any) => (
                                <label
                                  key={extra.id}
                                  className="flex items-center gap-2 text-sm"
                                >
                                  <input
                                    type="checkbox"
                                    checked={internalSelectedServices
                                      .find(
                                        (service) =>
                                          service.catalogId ===
                                          catalogService.id
                                      )
                                      ?.selectedExtras.includes(extra.id)}
                                    onChange={() =>
                                      toggleExtra(catalogService.id, extra.id)
                                    }
                                    className="rounded"
                                  />
                                  <span>
                                    {extra.name} (+€{extra.fixed_price})
                                  </span>
                                  {extra.note && (
                                    <span className="text-gray-500 text-xs">
                                      ({extra.note})
                                    </span>
                                  )}
                                </label>
                              ))}
                            </div>
                          </>
                        ) : (
                          <span className="text-sm text-gray-500">
                            Opzioni extra disponibili:&nbsp;
                            {catalogService.extra
                              .map(
                                (extra) => `${extra.name} €${extra.fixed_price}`
                              )
                              .join(", ")}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  {isServiceSelected(catalogService.id) ? (
                    <a
                      href={`#selected-service-${catalogService.id}`}
                      className="inline-flex justify-center w-full items-center gap-1 text-sm"
                    >
                      <CheckIcon className="size-5 min-w-4 text-green-600" />
                      <span className="text-green-600">Servizio aggiunto</span>
                    </a>
                  ) : (
                    <Button
                      role={RolesEnum.VIGIL}
                      customClass="!px-3"
                      full
                      label="Aggiungi Servizio"
                      type="button"
                      action={() => addService(catalogService)}
                      disabled={isServiceSelected(catalogService.id)}
                    />
                  )}
                </div>
              </Card>
            ))}
        </div>

        {occupation &&
        filteredServices?.length &&
        internalSelectedServices.length === 0 ? (
          <a
            href="#services-catalog"
            className="inline-flex justify-center w-full my-2 items-center gap-1 text-sm animate-pulse"
          >
            <ExclamationTriangleIcon className="size-5 min-w-4 text-vigil-orange" />
            <span className="border-b border-vigil-orange">
              Aggiungi almeno un servizio per continuare
            </span>
          </a>
        ) : null}
      </div>
    </div>
  );
};

export default ServicesCatalog;
