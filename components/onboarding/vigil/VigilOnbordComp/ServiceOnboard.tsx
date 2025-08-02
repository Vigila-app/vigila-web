import { useState } from "react";

import ServiceCard from "@/components/onboarding/vigil/VigilOnbordComp/ServiceCard";
import { ServiceFormModal } from "@/components/services";
import { useUserStore } from "@/src/store/user/user.store";
import { RolesEnum } from "@/src/enums/roles.enums";
import { ServiceI } from "@/src/types/services.types";
import { useModalStore } from "@/src/store/modal/modal.store";
import { ServiceFormModalId } from "@/components/services/serviceForm/serviceForm.modal";

export default function ServiceOboard() {
  const { user } = useUserStore();
  const role: RolesEnum = user?.user_metadata?.role as RolesEnum;

  const [editingService, setEditingService] = useState<ServiceI | null>(null);
  const { openModal, closeModal } = useModalStore();
  // Lista di servizi temporanei creati localmente
  const [services, setServices] = useState<ServiceI[]>([]);

  // Aggiunge o aggiorna un servizio nella lista locale
  const handleAddOrUpdateService = (newService: ServiceI) => {
    const serviceWithId = {
      ...newService,
      id: newService.id ?? Date.now().toString(),
      // genera id se mancante
    };
    setServices((prev) => {
      const existingIndex = prev.findIndex((s) => s.id === serviceWithId.id);
      if (existingIndex > -1) {
        // Aggiorna servizio esistente
        const updated = [...prev];
        updated[existingIndex] = serviceWithId;
        return updated;
      } else {
        // Aggiungi nuovo servizio
        return [...prev, serviceWithId];
      }
    });
    setEditingService(null);
    closeModal();
  };

  const handleEditService = (service: ServiceI) => {
    setEditingService(service);
    openModal(ServiceFormModalId, { service });
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <p className="text-lg text-vigil-orange">
          Seleziona i servizi che offri e imposta la tua tariffa.
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        <div className="grid gap-4">
          {services.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              onClick={() => handleEditService(service)}
            />
          ))}
          <div
            className="cursor-pointer transition-all duration-300 border-1 border-vigil-orange rounded-4xl hover:border-vigil-orange "
            onClick={() => {
              setEditingService(null);
              openModal(ServiceFormModalId);
            }}>
            <div className="p-4 text-center space-y-2 ">
              <p className="text-sm font-normal text-vigil-orange  ">
                Aggiungi servizio
              </p>
            </div>
          </div>
        </div>
      </div>

      <ServiceFormModal onSubmit={handleAddOrUpdateService} />
    </div>
  );
}
