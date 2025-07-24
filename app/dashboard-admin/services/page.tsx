"use client";

import { useEffect, useState } from "react";
import { useAdminStore } from "@/src/store/admin/admin.store";

export default function AdminServicesPage() {
  const { services, servicesLoading, getServices, updateServiceStatus } =
    useAdminStore();

  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const filters = filter !== "all" ? { status: filter } : undefined;
    getServices(filters);
  }, [filter, getServices]);

  const filteredServices = services.filter(
    (service) =>
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      case "pending_review":
        return "bg-yellow-100 text-yellow-800";
      case "suspended":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleStatusUpdate = async (serviceId: string, newStatus: string) => {
    try {
      await updateServiceStatus(serviceId, newStatus);
    } catch (error) {
      console.error("Error updating service status:", error);
    }
  };

  if (servicesLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Gestione Servizi</h1>
        <p className="text-gray-600">
          Visualizza e gestisci tutti i servizi disponibili sulla piattaforma
        </p>
      </div>

      {/* Filtri e ricerca */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filtra per stato
            </label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="all">Tutti gli stati</option>
              <option value="active">Attivo</option>
              <option value="inactive">Inattivo</option>
              <option value="pending_review">In revisione</option>
              <option value="suspended">Sospeso</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cerca servizio
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cerca per nome, descrizione o categoria..."
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>
        </div>
      </div>

      {/* Statistiche rapide */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-600">
              {services.length}
            </p>
            <p className="text-sm text-gray-600">Totale Servizi</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-center">
            <p className="text-3xl font-bold text-green-600">
              {services.filter((s) => s.status === "active").length}
            </p>
            <p className="text-sm text-gray-600">Attivi</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-center">
            <p className="text-3xl font-bold text-yellow-600">
              {services.filter((s) => s.status === "pending_review").length}
            </p>
            <p className="text-sm text-gray-600">In Revisione</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-center">
            <p className="text-3xl font-bold text-purple-600">
              €
              {services.reduce((avg, s) => avg + s.price, 0) /
                services.length || 0}
            </p>
            <p className="text-sm text-gray-600">Prezzo Medio</p>
          </div>
        </div>
      </div>

      {/* Lista servizi */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Servizi ({filteredServices.length})
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Servizio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Categoria
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prezzo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prenotazioni Totali
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rating
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Creato
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stato
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Azioni
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredServices.map((service) => (
                <tr key={service.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                          <span className="text-sm font-medium text-blue-700">
                            {service.name.charAt(0)}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {service.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {service.description.length > 50
                            ? `${service.description.substring(0, 50)}...`
                            : service.description}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                      {service.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      €{service.price.toFixed(2)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {service.total_bookings}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="text-sm font-medium text-gray-900">
                        {service.average_rating}/5
                      </div>
                      <div className="ml-2 flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(service.average_rating)
                                ? "text-yellow-400"
                                : "text-gray-300"
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(service.created_at).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                        service.status
                      )}`}
                    >
                      {service.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        className="text-blue-600 hover:text-blue-900 text-xs bg-blue-50 px-2 py-1 rounded"
                        onClick={() => {
                          // TODO: Implementare visualizzazione dettagli servizio
                          console.log("View service details:", service.id);
                        }}
                      >
                        Dettagli
                      </button>

                      {service.status === "pending_review" && (
                        <>
                          <button
                            className="text-green-600 hover:text-green-900 text-xs bg-green-50 px-2 py-1 rounded"
                            onClick={() =>
                              handleStatusUpdate(service.id, "active")
                            }
                          >
                            Approva
                          </button>
                          <button
                            className="text-red-600 hover:text-red-900 text-xs bg-red-50 px-2 py-1 rounded"
                            onClick={() =>
                              handleStatusUpdate(service.id, "suspended")
                            }
                          >
                            Rifiuta
                          </button>
                        </>
                      )}

                      {service.status === "active" && (
                        <button
                          className="text-yellow-600 hover:text-yellow-900 text-xs bg-yellow-50 px-2 py-1 rounded"
                          onClick={() =>
                            handleStatusUpdate(service.id, "inactive")
                          }
                        >
                          Disattiva
                        </button>
                      )}

                      {service.status === "inactive" && (
                        <button
                          className="text-green-600 hover:text-green-900 text-xs bg-green-50 px-2 py-1 rounded"
                          onClick={() =>
                            handleStatusUpdate(service.id, "active")
                          }
                        >
                          Attiva
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Analisi servizi */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Servizi più Prenotati
          </h3>
          <div className="space-y-3">
            {services
              .sort((a, b) => b.total_bookings - a.total_bookings)
              .slice(0, 5)
              .map((service, index) => (
                <div
                  key={service.id}
                  className="flex justify-between items-center"
                >
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-500 mr-3">
                      #{index + 1}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {service.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        €{service.price} - {service.category}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm font-bold text-blue-600">
                    {service.total_bookings} prenotazioni
                  </p>
                </div>
              ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Servizi Meglio Valutati
          </h3>
          <div className="space-y-3">
            {services
              .filter((s) => s.average_rating > 0)
              .sort((a, b) => b.average_rating - a.average_rating)
              .slice(0, 5)
              .map((service, index) => (
                <div
                  key={service.id}
                  className="flex justify-between items-center"
                >
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-500 mr-3">
                      #{index + 1}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {service.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {service.total_bookings} prenotazioni
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <p className="text-sm font-bold text-yellow-600 mr-1">
                      {service.average_rating}/5
                    </p>
                    <svg
                      className="h-4 w-4 text-yellow-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Azioni rapide */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Azioni Rapide
        </h3>
        <div className="flex flex-wrap gap-4">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
            Aggiungi Nuovo Servizio
          </button>
          <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
            Export Servizi
          </button>
          <button className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700">
            Report Performance
          </button>
          <button className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700">
            Gestione Categorie
          </button>
        </div>
      </div>
    </div>
  );
}
