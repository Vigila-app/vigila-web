"use client";
import { useAppStore } from "@/src/store/app/app.store";
import { useVigilStore } from "@/src/store/vigil/vigil.store";
import { AddressI } from "@/src/types/maps.types";
import { ApiService } from "@/src/services";
import { apiServices } from "@/src/constants/api.constants";
import { useEffect, useState } from "react";
import { ServiceI, ServiceCatalogItem } from "@/src/types/services.types";
import { ServicesService } from "@/src/services/services.service";
import { createDebouncer } from "@/src/utils/common.utils";
import {
  useAdvancedFilters,
  useSortOptions,
  useRatingOptions,
} from "@/src/hooks/useAdvancedFilters";
import ServiceCard from "@/components/services/serviceCard.component";
import dynamic from "next/dynamic";
import { RolesEnum } from "@/src/enums/roles.enums";
import { Badge, Card } from "@/components";
import { Select, Input } from "@/components/form";
import { AdjustmentsHorizontalIcon } from "@heroicons/react/24/outline";
import { PaginationI } from "@/src/types/app.types";

const SearchAddress = dynamic(
  () => import("@/components/maps/searchAddress.component"),
  {
    ssr: false,
    loading: () => (
      <div className="h-12 bg-gray-100 rounded-lg animate-pulse" />
    ),
  }
);

const defaultPagination: PaginationI = {
  from: 0,
  to: 10,
  page: 1,
  itemPerPage: 10,
  count: 0,
};

const ServicesComponent = () => {
  const { showLoader, hideLoader } = useAppStore();
  const { getVigilsDetails } = useVigilStore();
  const [services, setServices] = useState<ServiceI[]>([]);
  const [pagination, setPagination] = useState<PaginationI>(defaultPagination);
  const [showServices, setShowServices] = useState(false);
  const [selectedServiceType, setSelectedServiceType] = useState<string>("");
  const [servicesCatalog, setServicesCatalog] = useState<ServiceCatalogItem[]>([]);
  const [lastSearchAddress, setLastSearchAddress] = useState<AddressI | null>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [isInitialLoading, setIsInitialLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string>("");

  const {
    filters: advancedFilters,
    showFilters: showAdvancedFilters,
    setShowFilters: setShowAdvancedFilters,
    updateFilter,
    updateSortOption,
    getCurrentSortValue,
    resetFilters,
    hasActiveFilters,
    getSearchParams,
  } = useAdvancedFilters();
  const sortOptions = useSortOptions();
  const ratingOptions = useRatingOptions();
  const searchDebouncer = createDebouncer('services-search', 500);

  useEffect(() => {
    const catalog = ServicesService.getServicesCatalog();
    setServicesCatalog(catalog);
  }, []);

  useEffect(() => {
    if (!lastSearchAddress) return;
    setHasMore(true);
    setServices([]);
    setPagination(defaultPagination);
    setShowServices(false);
    setErrorMsg("");
    searchDebouncer(() => {
      searchServices(lastSearchAddress);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(advancedFilters)]);

  useEffect(() => {
    if (!showServices || isInitialLoading) return;
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
          document.body.offsetHeight - 300 &&
        hasMore &&
        !isLoadingMore
      ) {
        loadMoreServices();
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showServices, hasMore, isLoadingMore, lastSearchAddress, pagination, isInitialLoading]);

  const loadMoreServices = async () => {
    if (isLoadingMore || !hasMore || !lastSearchAddress) return;
    if (typeof pagination.count === "number" && services.length >= pagination.count) {
      setHasMore(false);
      return;
    }
    setIsLoadingMore(true);
    try {
      const nextPage = pagination.page + 1;
      let postalCode = "";
      if (lastSearchAddress?.address) {
        postalCode =
          lastSearchAddress.address.postCode ||
          lastSearchAddress.address.postalCode ||
          lastSearchAddress.address.postcode ||
          lastSearchAddress.address.cap || "";
      }
      const searchParams = {
        postalCode,
        page: nextPage,
        itemPerPage: pagination.itemPerPage,
      };
      const searchParamsWithFilters = getSearchParams(searchParams);
      const result = await ApiService.get<{
        data: ServiceI[];
        pagination: PaginationI;
      }>(apiServices.LIST(), searchParamsWithFilters);
      if (result?.data?.length) {
        setServices((prev) => [...prev, ...result.data]);
        setPagination(result.pagination);
        setHasMore(
          typeof result.pagination.to === "number" &&
          typeof result.pagination.count === "number" &&
          result.pagination.to < result.pagination.count
        );
      } else {
        setHasMore(false);
      }
    } catch (error) {
      setHasMore(false);
      setErrorMsg("Errore nel caricamento dei risultati.");
    } finally {
      setIsLoadingMore(false);
    }
  };

  const serviceOptions = [
    { label: "Tutti i servizi", value: "" },
    ...servicesCatalog.map((service) => ({
      label: service.name,
      value: service.type,
    })),
  ];

  const searchServices = async (addressData: AddressI) => {
    try {
      setIsInitialLoading(true);
      setErrorMsg("");
      showLoader();
      if (
        addressData.address?.postCode ||
        addressData.address?.postalCode ||
        addressData.address?.postcode ||
        addressData.address?.cap
      ) {
        setLastSearchAddress(addressData);

        const searchParams: any = {
          postalCode: (addressData.address.postCode ||
            addressData.address.postalCode ||
            addressData.address.postcode ||
            addressData.address.cap) as string,
          page: defaultPagination.page,
          itemPerPage: defaultPagination.itemPerPage,
        };

        const searchParamsWithFilters = getSearchParams(searchParams);

        const result = await ApiService.get<{
          data: ServiceI[];
          pagination: PaginationI;
        }>(apiServices.LIST(), searchParamsWithFilters);

        if (!result?.data) {
          setServices([]);
          setPagination(defaultPagination);
          throw new Error("No services found for the provided postal code.");
        }
        setServices(result.data);
        setPagination(result.pagination);
        setShowServices(true);
        setHasMore(
          typeof result.pagination.to === "number" &&
          typeof result.pagination.count === "number" &&
          result.pagination.to < result.pagination.count
        );
      } else {
        throw new Error("Postal code is required to search for services.");
      }
    } catch (error) {
      console.error("Error searching services:", error);
      setHasMore(false);
    } finally {
      hideLoader();
      setIsInitialLoading(false);
    }
  };

  useEffect(() => {
    updateFilter("type", selectedServiceType);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedServiceType]);

  useEffect(() => {
    if (services?.length) {
      const uniqueVigilIds = Array.from(
        new Set(services.map((service) => service.vigil_id))
      );
      if (uniqueVigilIds.length) {
        getVigilsDetails(uniqueVigilIds, true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [services]);

  return (
    <>
      <Card>
        <SearchAddress
          location
          role={RolesEnum.VIGIL}
          onSubmit={searchServices}
          onChange={() => setShowServices(false)}
          placeholder="Inserisci indirizzo, città o CAP"
        />

        <div className="my-4 space-y-2">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Select
                options={serviceOptions}
                value={selectedServiceType}
                onChange={(value) => {
                  setSelectedServiceType(value);
                }}
                placeholder="Tutti i servizi"
                label="Filtra per tipo di servizio"
                role={selectedServiceType ? RolesEnum.VIGIL : undefined}
              />
            </div>
            <button
              className="mt-6"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              title="Filtri avanzati"
            >
              <span className="relative inline-block">
                <AdjustmentsHorizontalIcon
                  className={`size-6 cursor-pointer transition-colors ${
                    showAdvancedFilters || hasActiveFilters
                      ? "text-vigil-orange"
                      : "text-gray-500 hover:text-vigil-orange"
                  }`}
                />
                {(() => {
                  const activeCount = (
                    Object.keys(advancedFilters) as Array<keyof typeof advancedFilters>
                  ).filter(
                    (k) =>
                      advancedFilters[k] !== "" &&
                      advancedFilters[k] !== undefined &&
                      k !== "orderDirection"
                  ).length;
                  return activeCount > 0 ? (
                    <span
                      className="absolute -top-2 -right-2 bg-vigil-orange text-white text-xs font-bold rounded-full px-1.5 py-0.5 shadow"
                      style={{ minWidth: 18, minHeight: 18, lineHeight: '18px', textAlign: 'center' }}
                    >
                      {activeCount}
                    </span>
                  ) : null;
                })()}
              </span>
            </button>
          </div>

          {/* Pannello filtri avanzati */}
          {showAdvancedFilters && (
            <Card className="p-4 bg-gray-50 border-gray-200">
              <h4 className="text-sm font-medium text-gray-900 mb-3">
                Filtri avanzati
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Ordinamento */}
                <div>
                  <Select
                    options={sortOptions}
                    value={getCurrentSortValue()}
                    onChange={(value) => updateSortOption(value as string)}
                    placeholder="Ordina per..."
                    label="Ordinamento"
                    role={getCurrentSortValue() ? RolesEnum.VIGIL : undefined}
                  />
                </div>

                {/* Prezzo minimo */}
                <div>
                  <Input
                    type="number"
                    value={advancedFilters.minPrice?.toString() || ""}
                    onChange={(value) =>
                      updateFilter(
                        "minPrice",
                        value ? parseFloat(value as string) : undefined
                      )
                    }
                    placeholder="es. 12€/h"
                    label="Prezzo min (€/ora)"
                    min={1}
                    max={99}
                    step={1}
                    role={
                      advancedFilters.minPrice?.toString()
                        ? RolesEnum.VIGIL
                        : undefined
                    }
                  />
                </div>

                {/* Prezzo massimo */}
                <div>
                  <Input
                    type="number"
                    value={advancedFilters.maxPrice?.toString() || ""}
                    onChange={(value) =>
                      updateFilter(
                        "maxPrice",
                        value ? parseFloat(value as string) : undefined
                      )
                    }
                    placeholder="es. 25€/h"
                    label="Prezzo max (€/ora)"
                    min={1}
                    max={99}
                    step={1}
                    role={
                      advancedFilters.maxPrice?.toString()
                        ? RolesEnum.VIGIL
                        : undefined
                    }
                  />
                </div>

                {/* Valutazione minima */}
                <div>
                  <Select
                    options={ratingOptions}
                    value={advancedFilters.minRating?.toString() || ""}
                    onChange={(value) =>
                      updateFilter(
                        "minRating",
                        value ? parseInt(value) : undefined
                      )
                    }
                    placeholder="Valutazione minima"
                    label="Valutazione"
                    role={
                      advancedFilters.minRating?.toString()
                        ? RolesEnum.VIGIL
                        : undefined
                    }
                  />
                </div>
              </div>

              {/* Azioni filtri */}
              <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-200">
                <div className="text-xs text-gray-500">
                  {
                    (
                      Object.keys(advancedFilters) as Array<
                        keyof typeof advancedFilters
                      >
                    ).filter(
                      (k) =>
                        advancedFilters[k] !== "" &&
                        advancedFilters[k] !== undefined &&
                        k !== "orderDirection"
                    ).length
                  }
                  &nbsp;filtri attivi
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      resetFilters();
                      setSelectedServiceType("");
                    }}
                    className="text-xs px-3 py-1 text-gray-600 hover:text-gray-800 underline"
                  >
                    Cancella filtri
                  </button>
                  <button
                    onClick={() => setShowAdvancedFilters(false)}
                    className="text-xs px-3 py-1 bg-vigil-orange text-white rounded hover:bg-orange-600"
                  >
                    Chiudi
                  </button>
                </div>
              </div>
            </Card>
          )}
        </div>
      </Card>

      <div className="my-4">
        {showServices ? (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <h3 className="text-lg font-medium text-gray-900">
                Servizi trovati ({pagination.count})
              </h3>

              {/* Mostra filtri attivi */}
              {(advancedFilters.orderBy ||
                advancedFilters.minPrice !== undefined ||
                advancedFilters.maxPrice !== undefined ||
                advancedFilters.minRating !== undefined ||
                advancedFilters.type) && (
                <div className="text-sm text-gray-600 flex flex-wrap items-center gap-2">
                  <span className="font-medium">Filtri attivi:</span>
                  {advancedFilters.type && (
                    <Badge
                      label={
                        serviceOptions.find(
                          (opt) => opt.value === advancedFilters.type
                        )?.label || advancedFilters.type
                      }
                    />
                  )}
                  {advancedFilters.orderBy && (
                    <Badge
                      label={
                        sortOptions.find(
                          (opt) =>
                            opt.orderBy === advancedFilters.orderBy &&
                            opt.orderDirection ===
                              advancedFilters.orderDirection
                        )?.label || ""
                      }
                    />
                  )}
                  {advancedFilters.minPrice !== undefined && (
                    <Badge label={`Min: €${advancedFilters.minPrice}/h`} />
                  )}
                  {advancedFilters.maxPrice !== undefined && (
                    <Badge label={`Max: €${advancedFilters.maxPrice}/h`} />
                  )}
                  {advancedFilters.minRating !== undefined && (
                    <Badge label={`Min ${advancedFilters.minRating}⭐`} />
                  )}
                  <button
                    onClick={() => {
                      resetFilters();
                      setSelectedServiceType("");
                    }}
                    className="text-xs text-red-600 hover:text-red-800 underline ml-2"
                  >
                    Rimuovi tutti
                  </button>
                </div>
              )}
            </div>

            {/* Loader iniziale */}
            {isInitialLoading && (
              <div className="flex justify-center py-8">
                <span className="text-gray-400 text-sm">Caricamento...</span>
              </div>
            )}

            {/* Messaggio di errore */}
            {errorMsg && !isInitialLoading && (
              <div className="text-center py-4 text-red-500">
                <span>{errorMsg}</span>
              </div>
            )}

            {!isInitialLoading && !errorMsg && services.length ? (
              <div className="space-y-3">
                {services.map((service) => (
                  <ServiceCard service={service} key={service.id} />
                ))}
                {isLoadingMore && (
                  <div className="flex justify-center py-4">
                    <span className="text-gray-400 text-sm">Caricamento altri risultati...</span>
                  </div>
                )}
              </div>
            ) : <div className="text-center py-4 text-gray-500">Nessun servizio trovato.</div>}
          </div>
        ) : null}
      </div>
    </>
  );
};

export default ServicesComponent;
