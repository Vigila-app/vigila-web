"use client";
import { useAppStore } from "@/src/store/app/app.store";
import { useVigilStore } from "@/src/store/vigil/vigil.store";
import { AddressI } from "@/src/types/maps.types";
import { ApiService } from "@/src/services";
import { apiServices } from "@/src/constants/api.constants";
import { useEffect, useState } from "react";
import { ServiceI } from "@/src/types/services.types";
import ServiceCard from "@/components/services/serviceCard.component";
import dynamic from "next/dynamic";
import { RolesEnum } from "@/src/enums/roles.enums";
import { Card } from "@/components";
import { Select } from "../form";
import { AdjustmentsHorizontalIcon } from "@heroicons/react/24/outline";

const SearchAddress = dynamic(
  () => import("@/components/maps/searchAddress.component"),
  {
    ssr: false,
    loading: () => (
      <div className="h-12 bg-gray-100 rounded-lg animate-pulse" />
    ),
  }
);

const ServicesComponent = () => {
  const { showLoader, hideLoader } = useAppStore();
  const { getVigilsDetails } = useVigilStore();
  const [services, setServices] = useState<ServiceI[]>([]);
  const [showServices, setShowServices] = useState(false);

  const searchServices = async ({ address }: AddressI) => {
    try {
      if (
        address?.postCode ||
        address?.postalCode ||
        address?.postcode ||
        address?.cap
      ) {
        showLoader();
        const services = await ApiService.get<{ data: ServiceI[] }>(
          apiServices.LIST(),
          {
            postalCode: (address.postCode ||
              address.postalCode ||
              address.postcode ||
              address.cap) as string,
          }
        );
        if (!services?.data) {
          throw new Error("No services found for the provided postal code.");
        }
        setServices(services.data);
        setShowServices(true);
      } else {
        throw new Error("Postal code is required to search for services.");
      }
    } catch (error) {
      console.error("Error searching services:", error);
    } finally {
      hideLoader();
    }
  };

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
        <div className="my-4 inline-flex items-center gap-4 w-full">
          <Select
            options={[
              { label: "Opzione 1", value: "1" },
              { label: "Opzione 2", value: "2" },
            ]}
            role={RolesEnum.VIGIL}
          />
          <button>
            <AdjustmentsHorizontalIcon className="size-6 text-vigil-orange cursor-pointer" />
          </button>
        </div>
      </Card>

      <div className="my-4">
        {showServices ? (
          services.length ? (
            services.map((service) => (
              <ServiceCard service={service} key={service.id} />
            ))
          ) : (
            <div>Nessun servizio trovato</div>
          )
        ) : null}
      </div>
    </>
  );
};

export default ServicesComponent;
