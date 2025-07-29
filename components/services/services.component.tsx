"use client";
import { useAppStore } from "@/src/store/app/app.store";
import { useVigilStore } from "@/src/store/vigil/vigil.store";
import { SearchAddress } from "@/components/maps";
import { AddressI } from "@/src/types/maps.types";
import { ApiService } from "@/src/services";
import { apiServices } from "@/src/constants/api.constants";
import { useEffect, useState } from "react";
import { ServiceI } from "@/src/types/services.types";
import ServiceCard from "@/components/services/serviceCard.component";
import { RolesEnum } from "@/src/enums/roles.enums";

const ServicesComponent = () => {
  const { showLoader, hideLoader } = useAppStore();
  const { getVigilsDetails } = useVigilStore();
  const [services, setServices] = useState<ServiceI[]>([]);

  const searchServices = async ({ address }: AddressI) => {
    try {
      if (address?.postCode || address?.postalCode || address?.postcode ||address?.cap) {
        showLoader();
        const services = await ApiService.get<{ data: ServiceI[] }>(
          apiServices.LIST(),
          {
            postalCode: (address.postCode ||
              address.postalCode ||
              address.postcode || address.cap) as string,
          }
        );
        if (!services?.data) {
          throw new Error("No services found for the provided postal code.");
        }
        setServices(services.data);
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
    <div className="container mx-auto px-4 py-4">
      <SearchAddress
        location
        role={RolesEnum.VIGIL}
        onSubmit={searchServices}
        label="Trova servizi in questa zona"
        placeholder="Inserisci indirizzo, città o CAP"
      />
      <div className="my-4">
        {services.map((service) => (
          <ServiceCard service={service} key={service.id} />
        ))}
      </div>
    </div>
  );
};

export default ServicesComponent;
