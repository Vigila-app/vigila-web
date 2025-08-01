"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components";
import { ServiceCatalogItem, ServiceI } from "@/src/types/services.types";
import { RolesEnum } from "@/src/enums/roles.enums";
import { CurrencyEnum, FrequencyEnum } from "@/src/enums/common.enums";
import { ServicesService } from "@/src/services/services.service";
import clsx from "clsx";
import { XCircleIcon, PlusIcon, MinusIcon } from "@heroicons/react/24/outline";

type SelectedService = {
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
  selectedServices: ServiceI[];
  onServicesChange: (services: ServiceI[]) => void;
}

const ServicesCatalog: React.FC<ServicesCatalogProps> = ({
  role,
  onServicesChange,
}) => {
  const [internalSelectedServices, setInternalSelectedServices] = useState<
    SelectedService[]
  >([]);
  const [servicesCatalog, setServicesCatalog] = useState<ServiceCatalogItem[]>(
    []
  );

  // Carica il catalogo servizi
  useEffect(() => {
    setServicesCatalog(ServicesService.getServicesCatalog());
  }, []);

  // Converte i servizi interni in formato ServiceI per il form
  useEffect(() => {
    const convertedServices: Partial<ServiceI>[] = internalSelectedServices.map(
      (service) => ({
        id: service.catalogId.toString(),
        active: true,
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
    };

    setInternalSelectedServices((prev) => [...prev, newService]);
  };

  const removeService = (index: number) => {
    setInternalSelectedServices((prev) => prev.filter((_, i) => i !== index));
  };

  const updateServicePrice = (index: number, newPrice: number) => {
    setInternalSelectedServices((prev) =>
      prev.map((service, i) =>
        i === index ? { ...service, unit_price: newPrice } : service
      )
    );
  };

  const toggleExtra = (serviceIndex: number, extraId: string) => {
    setInternalSelectedServices((prev) =>
      prev.map((service, i) => {
        if (i === serviceIndex) {
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

  return (
    <div className="space-y-6">
      <div>
        <label
          className={clsx(
            "block font-medium mb-4 text-lg",
            role === RolesEnum.VIGIL && "text-vigil-orange",
            role === RolesEnum.CONSUMER && "text-consumer-blue"
          )}
        >
          Scegli i servizi che vuoi offrire
        </label>

        {/* Catalogo servizi disponibili */}
        <div className="grid gap-4 mb-6">
          {servicesCatalog.map((catalogService: ServiceCatalogItem) => (
            <Card key={catalogService.id} containerClass="p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">
                    {catalogService.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3">
                    {catalogService.description}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>
                      €{catalogService.min_hourly_rate}-
                      {catalogService.max_hourly_rate}/ora
                    </span>
                    <span>
                      Consigliato: €{catalogService.recommended_hourly_rate}/ora
                    </span>
                    <span>Min. {catalogService.minimum_duration_hours}h</span>
                  </div>
                  {catalogService.extra.length > 0 && (
                    <div className="mt-2">
                      <span className="text-xs text-gray-500">
                        Opzioni extra disponibili:{" "}
                        {catalogService.extra
                          .map((e: any) => `${e.name} €${e.fixed_price}`)
                          .join(", ")}
                      </span>
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => addService(catalogService)}
                  disabled={isServiceSelected(catalogService.id)}
                  className={clsx(
                    "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    isServiceSelected(catalogService.id)
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : role === RolesEnum.VIGIL
                        ? "bg-vigil-orange text-white hover:bg-vigil-orange/90"
                        : "bg-consumer-blue text-white hover:bg-consumer-blue/90"
                  )}
                >
                  <PlusIcon className="w-4 h-4" />
                  {isServiceSelected(catalogService.id)
                    ? "Aggiunto"
                    : "Aggiungi"}
                </button>
              </div>
            </Card>
          ))}
        </div>

        {/* Servizi selezionati */}
        {internalSelectedServices.length > 0 && (
          <div>
            <h4 className="font-medium mb-3">Servizi selezionati:</h4>
            <div className="space-y-3">
              {internalSelectedServices.map((selectedService, index) => {
                const catalogService = getCatalogService(
                  selectedService.catalogId
                );
                if (!catalogService) return null;

                return (
                  <Card key={index} className="p-4 bg-gray-50">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h5 className="font-medium">{selectedService.name}</h5>
                        <p className="text-sm text-gray-600">
                          {selectedService.description}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeService(index)}
                        className="text-red-500 hover:text-red-700 p-1"
                        aria-label="Rimuovi servizio"
                      >
                        <XCircleIcon className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Configurazione prezzo */}
                    <div className="mb-3">
                      <label className="block text-sm font-medium mb-2">
                        Prezzo orario (€{catalogService.min_hourly_rate}-
                        {catalogService.max_hourly_rate})
                      </label>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            updateServicePrice(
                              index,
                              Math.max(
                                catalogService.min_hourly_rate,
                                selectedService.unit_price - 1
                              )
                            )
                          }
                          disabled={
                            selectedService.unit_price <=
                            catalogService.min_hourly_rate
                          }
                          className="p-1 rounded border disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <MinusIcon className="w-4 h-4" />
                        </button>
                        <span className="font-medium min-w-[60px] text-center">
                          €{selectedService.unit_price}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            updateServicePrice(
                              index,
                              Math.min(
                                catalogService.max_hourly_rate,
                                selectedService.unit_price + 1
                              )
                            )
                          }
                          disabled={
                            selectedService.unit_price >=
                            catalogService.max_hourly_rate
                          }
                          className="p-1 rounded border disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <PlusIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Opzioni extra */}
                    {catalogService.extra.length > 0 && (
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Opzioni extra:
                        </label>
                        <div className="space-y-2">
                          {catalogService.extra.map((extra: any) => (
                            <label
                              key={extra.id}
                              className="flex items-center gap-2 text-sm"
                            >
                              <input
                                type="checkbox"
                                checked={selectedService.selectedExtras.includes(
                                  extra.id
                                )}
                                onChange={() => toggleExtra(index, extra.id)}
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
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {internalSelectedServices.length === 0 && (
          <p className="text-gray-500 text-center py-8">
            Seleziona almeno un servizio dal catalogo sopra
          </p>
        )}
      </div>
    </div>
  );
};

export default ServicesCatalog;
