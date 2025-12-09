"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Button } from "@/components";
import Card from "@/components/card/card";
import { ServicesCatalog } from "@/components";
import ServiceCard from "@/components/services/serviceCard.component";
import { ServiceI } from "@/src/types/services.types";
import { Input } from "@/components/form";
import { RolesEnum } from "@/src/enums/roles.enums";
import { useServicesStore } from "@/src/store/services/services.store";
import { useUserStore } from "@/src/store/user/user.store";
import { ServicesService } from "@/src/services";
import { useParams } from "next/navigation";
import { useVigilStore } from "@/src/store/vigil/vigil.store";

const ServiziTab = () => {
  const params = useParams();
  const vigilIdFromParams = params?.vigilId as string | undefined;
  const { user } = useUserStore();
  const { vigils } = useVigilStore();
  const vigilId =
    user?.user_metadata?.role === RolesEnum.VIGIL
      ? user?.id
      : vigilIdFromParams;
  const { services, getServices, deleteService } = useServicesStore();
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [newServiceMode, setNewServiceMode] = useState(false);
  const [newService, setNewService] = useState<Partial<ServiceI>>({});
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [pendingStatusIndex, setPendingStatusIndex] = useState<number | null>(
    null
  );
  const [pendingStatusValue, setPendingStatusValue] = useState<boolean | null>(
    null
  );
  const vigil = useMemo(
    () => vigils.find((v) => v.id === vigilId),
    [vigils, vigilId]
  );
  const isVigil = user?.user_metadata?.role === RolesEnum.VIGIL;
  const reloadServices = (fullReload = true) => {
    if (vigilId) getServices(true, vigilId, { active: fullReload && "*" });
  };
  const personalServices = services.filter(
    (service) => service.vigil_id === vigilId
  );
  useEffect(() => {
    reloadServices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (showStatusModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [showStatusModal]);

  const handleSaveService = async (updatedService: ServiceI) => {
    await ServicesService.editService(updatedService);
    reloadServices();
    setEditingIndex(null);
  };

  // Flusso modifica stato servizio
  const handleChangeStatus = (index: number, newStatus: boolean) => {
    setPendingStatusIndex(index);
    setPendingStatusValue(newStatus);
    setShowStatusModal(true);
  };

  const confirmChangeStatus = async () => {
    if (pendingStatusIndex !== null && pendingStatusValue !== null) {
      const service = services[pendingStatusIndex];
      const updatedService = { ...service, active: pendingStatusValue };
      await ServicesService.editService(updatedService);
      reloadServices();
    }
    setShowStatusModal(false);
    setPendingStatusIndex(null);
    setPendingStatusValue(null);
    setEditingIndex(null);
  };

  const cancelChangeStatus = () => {
    setShowStatusModal(false);
    setPendingStatusIndex(null);
    setPendingStatusValue(null);
  };

  // Gestione rimozione servizio
  const handleRemoveService = async (index: number) => {
    const service = services[index];
    await deleteService(service.id);
    reloadServices();
  };

  // Gestione aggiunta nuovo servizio
  const handleAddService = useCallback(
    async (service: ServiceI) => {
      const { id, ...servicePayload } = service;
      await ServicesService.createService({
        ...servicePayload,
        vigil_id: vigilId,
      } as ServiceI);
      reloadServices();
      setNewServiceMode(false);
      setNewService({});
    },

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [vigilId]
  );

  return (
    <div className="w-full mx-auto mt-4">
      <>
        <div className="py-4">
          <h2 className="font-semibold text-2xl mb-6">
            {isVigil ? "I tuoi servizi" : "Servizi"}
          </h2>
          <ul className="space-y-4">
            {(isVigil ? services : personalServices).map((service, i) => (
              <li key={service.id}>
                <ServiceCard
                  service={service}
                  showActions
                  onEdit={() => setEditingIndex(i)}
                  onToggleStatus={() => handleChangeStatus(i, !service.active)}
                  onDelete={() => handleRemoveService(i)}
                  simplified
                />
                {editingIndex === i && isVigil && (
                  <div className="mt-2 p-4 bg-gray-50 rounded">
                    {/* <Input
                      label="Prezzo (€)"
                      type="number"
                      role={RolesEnum.CONSUMER}
                      value={service.unit_price}
                      min={
                        ServicesService.getServiceCatalogById(
                          service.info?.catalog_id
                        )?.min_hourly_rate
                      }
                      max={
                        ServicesService.getServiceCatalogById(
                          service.info?.catalog_id
                        )?.max_hourly_rate
                      }
                      onChange={(value) => {
                        services[i].unit_price = Number(value);
                        setNewService({ ...service });
                      }}
                    /> */}
                    <div className="flex gap-2 mt-2 flex-wrap">
                      <Button
                        label="Salva"
                        type="button"
                        role={RolesEnum.CONSUMER}
                        action={() => handleSaveService(services[i])}
                      />
                      <Button
                        label="Annulla"
                        type="button"
                        role={RolesEnum.VIGIL}
                        action={() => setEditingIndex(null)}
                      />
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
          {isVigil && (
            <div className="mt-6">
              {newServiceMode ? (
                <div className="border rounded p-3 bg-gray-100">
                  <ServicesCatalog
                    role={user?.user_metadata?.role as RolesEnum}
                    selectedServices={services}
                    occupation={vigil?.occupation}
                    onServicesChange={(services) => {
                      if (services.length) {
                        setNewService((prev) => {
                          // aggiorna solo se è davvero diverso
                          if (prev?.id !== services[0].id) {
                            return services[0];
                          }
                          return prev;
                        });
                      }
                    }}
                  />
                  {/* <Input
                    label="Prezzo (€)"
                    type="number"
                    value={newService.unit_price || ""}
                    onChange={(value) => {
                      setNewService((ns) => ({
                        ...ns,
                        unit_price: Number(value),
                      }));
                    }}
                  /> */}
                  <div className="flex gap-2 items-center justify-center mt-2">
                    <Button
                      label="Aggiungi"
                      type="button"
                      small
                      customClass="!!px-2"
                      role={RolesEnum.CONSUMER}
                      action={() =>
                        newService.name &&
                        handleAddService(newService as ServiceI)
                      }
                    />
                    <Button
                      label="Annulla"
                      type="button"
                      small
                      customClass="!!px-2"
                      danger
                      action={() => setNewServiceMode(false)}
                    />
                  </div>
                </div>
              ) : (
                <div className="flex justify-center items-center">
                  <Button
                    label="Aggiungi nuovo servizio"
                    type="button"
                    action={() => setNewServiceMode(true)}
                  />
                </div>
              )}
            </div>
          )}
          {/* Modale warning cambio stato */}
          {showStatusModal && isVigil && (
            <div className="fixed inset-0 bg-white/10 backdrop-blur-sm bg-opacity-30 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
                <h3 className="text-lg font-bold mb-2">Attenzione</h3>
                <p className="mb-4">
                  Stai per {pendingStatusValue ? "attivare" : "disattivare"}{" "}
                  questo servizio. Sei sicuro di voler procedere?
                </p>
                <div className="flex gap-2 justify-end">
                  <Button
                    label="Annulla"
                    type="button"
                    action={cancelChangeStatus}
                  />
                  <Button
                    label="Conferma"
                    type="button"
                    action={confirmChangeStatus}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </>
    </div>
  );
};

export default ServiziTab;
