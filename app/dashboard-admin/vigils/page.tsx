"use client";

import { useEffect, useState } from "react";
import { useAdminStore } from "@/src/store/admin/admin.store";
import { Avatar } from "@/components";

export default function AdminVigilsPage() {
  const { vigils, vigilsLoading, getVigils, updateVigilStatus } =
    useAdminStore();

  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const filters = filter !== "all" ? { status: filter } : undefined;
    getVigils(filters);
  }, [filter, getVigils]);

  const filteredVigils = vigils.filter(
    (vigil) =>
      vigil.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vigil.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vigil.addresses?.some((address) =>
        address.display_name.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      case "suspended":
        return "bg-red-100 text-red-800";
      case "pending_verification":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getVerificationColor = (status: string) => {
    switch (status) {
      case "verified":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleStatusUpdate = async (vigilId: string, newStatus: string) => {
    try {
      await updateVigilStatus(vigilId, newStatus);
    } catch (error) {
      console.error("Error updating vigil status:", error);
    }
  };

  if (vigilsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Gestione Vigils</h1>
        <p className="text-gray-600">
          Visualizza e gestisci tutti i vigils registrati sulla piattaforma
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
              <option value="suspended">Sospeso</option>
              <option value="pending_verification">In attesa verifica</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cerca vigil
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cerca per nome, email o località..."
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>
        </div>
      </div>

      {/* Statistiche rapide */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-600">{vigils.length}</p>
            <p className="text-sm text-gray-600">Totale Vigils</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-center">
            <p className="text-3xl font-bold text-green-600">
              {vigils.filter((v) => v.status === "active").length}
            </p>
            <p className="text-sm text-gray-600">Attivi</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-center">
            <p className="text-3xl font-bold text-yellow-600">
              {vigils.filter((v) => v.status === "pending_verification").length}
            </p>
            <p className="text-sm text-gray-600">In Verifica</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-center">
            <p className="text-3xl font-bold text-purple-600">
              {vigils.length > 0
                ? vigils.reduce((avg, v) => avg + v.rating, 0) / vigils.length
                : 0}
            </p>
            <p className="text-sm text-gray-600">Rating Medio</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-center">
            <p className="text-3xl font-bold text-orange-600">
              €
              {vigils.length > 0
                ? vigils.reduce((avg, v) => avg + v.total_earnings, 0) / vigils.length
                : 0}
            </p>
            <p className="text-sm text-gray-600">Guadagno Medio</p>
          </div>
        </div>
      </div>

      {/* Lista vigils */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Vigils ({filteredVigils.length})
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vigil
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contatto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Località
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Performance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Guadagni
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Registrazione
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ultima Attività
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Verifica
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
              {filteredVigils.map((vigil) => (
                <tr key={vigil.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <Avatar userId={vigil.id} value={vigil.displayName} />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {vigil.displayName}
                        </div>
                        <div className="text-sm text-gray-500">
                          ID: {vigil.id.substring(0, 8)}...
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{vigil.email}</div>
                    <div className="text-sm text-gray-500">{vigil.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {vigil.addresses?.[0]?.display_name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center mb-1">
                      <div className="text-sm font-medium text-gray-900 mr-2">
                        {vigil.rating}/5
                      </div>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(vigil.rating)
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
                    <div className="text-xs text-gray-500">
                      {vigil.completed_services} completati /{" "}
                      {vigil.active_services} attivi
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      €{vigil.total_earnings?.toFixed(2)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(vigil.created_at).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {vigil.last_active
                        ? new Date(vigil.last_active).toLocaleDateString()
                        : "Mai"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getVerificationColor(
                        vigil.verification_status
                      )}`}
                    >
                      {vigil.verification_status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                        vigil.status
                      )}`}
                    >
                      {vigil.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        className="text-blue-600 hover:text-blue-900 text-xs bg-blue-50 px-2 py-1 rounded"
                        onClick={() => {
                          // TODO: Implementare visualizzazione dettagli vigile
                          console.log("View vigil details:", vigil.id);
                        }}
                      >
                        Dettagli
                      </button>

                      {vigil.verification_status === "pending" && (
                        <>
                          <button
                            className="text-green-600 hover:text-green-900 text-xs bg-green-50 px-2 py-1 rounded"
                            onClick={() => {
                              // TODO: Implementare verifica vigile
                              console.log("Verify vigil:", vigil.id);
                            }}
                          >
                            Verifica
                          </button>
                          <button
                            className="text-red-600 hover:text-red-900 text-xs bg-red-50 px-2 py-1 rounded"
                            onClick={() => {
                              // TODO: Implementare rifiuto verifica
                              console.log("Reject vigil:", vigil.id);
                            }}
                          >
                            Rifiuta
                          </button>
                        </>
                      )}

                      {vigil.status === "active" ? (
                        <button
                          className="text-red-600 hover:text-red-900 text-xs bg-red-50 px-2 py-1 rounded"
                          onClick={() =>
                            handleStatusUpdate(vigil.id, "suspended")
                          }
                        >
                          Sospendi
                        </button>
                      ) : (
                        <button
                          className="text-green-600 hover:text-green-900 text-xs bg-green-50 px-2 py-1 rounded"
                          onClick={() => handleStatusUpdate(vigil.id, "active")}
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

      {/* Statistiche dettagliate */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Top Performers
          </h3>
          <div className="space-y-3">
            {vigils
              .sort((a, b) => b.total_earnings - a.total_earnings)
              .slice(0, 5)
              .map((vigil, index) => (
                <div
                  key={vigil.id}
                  className="flex justify-between items-center"
                >
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-500 mr-3">
                      #{index + 1}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {vigil.displayName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {vigil.completed_services} servizi completati
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-green-600">
                      €{vigil.total_earnings?.toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-500">{vigil.rating}/5 ⭐</p>
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Vigils più Attivi
          </h3>
          <div className="space-y-3">
            {vigils
              .sort((a, b) => b.completed_services - a.completed_services)
              .slice(0, 5)
              .map((vigil, index) => (
                <div
                  key={vigil.id}
                  className="flex justify-between items-center"
                >
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-500 mr-3">
                      #{index + 1}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {vigil.displayName}
                      </p>
                      <p className="text-xs text-gray-500">
                        €{vigil.total_earnings?.toFixed(2)} guadagnati
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-blue-600">
                      {vigil.completed_services} servizi
                    </p>
                    <p className="text-xs text-gray-500">{vigil.rating}/5 ⭐</p>
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
            Export Vigils
          </button>
          <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
            Invia Comunicazione
          </button>
          <button className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700">
            Report Performance
          </button>
          <button className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700">
            Gestione Verifiche
          </button>
        </div>
      </div>
    </div>
  );
}
