"use client";

import { useEffect, useState } from "react";
import { useAdminStore } from "@/src/store/admin/admin.store";
import { Avatar } from "@/components";
import { dateDisplay } from "@/src/utils/date.utils";

export default function AdminConsumersPage() {
  const { consumers, consumersLoading, getConsumers } = useAdminStore();

  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const filters = filter !== "all" ? { status: filter } : undefined;
    getConsumers(filters);
  }, [filter, getConsumers]);

  const filteredConsumers = consumers.filter(
    (consumer) =>
      consumer.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      consumer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      consumer.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      consumer.cap.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "suspended":
        return "bg-yellow-100 text-yellow-800";
      case "banned":
        return "bg-red-100 text-red-800";
      case "pending_verification":
        return "bg-blue-100 text-blue-800";
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

  if (consumersLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Gestione Consumers</h1>
        <p className="text-gray-600">
          Visualizza e gestisci tutti i clienti della piattaforma
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
              <option value="suspended">Sospeso</option>
              <option value="banned">Bannato</option>
              <option value="pending_verification">In attesa verifica</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cerca consumer
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cerca per nome, email o città..."
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
              {consumers.length}
            </p>
            <p className="text-sm text-gray-600">Totale Consumers</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-center">
            <p className="text-3xl font-bold text-green-600">
              {consumers.filter((c) => c.status === "active").length}
            </p>
            <p className="text-sm text-gray-600">Attivi</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-center">
            <p className="text-3xl font-bold text-purple-600">
              €
              {consumers.length > 0
                ? consumers.reduce((avg, c) => avg + c.total_spent, 0) / consumers.length
                : 0}
            </p>
            <p className="text-sm text-gray-600">Spesa Media</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-center">
            <p className="text-3xl font-bold text-orange-600">
              {consumers.reduce((avg, c) => avg + c.total_bookings, 0) /
                consumers.length || 0}
            </p>
            <p className="text-sm text-gray-600">Prenotazioni Medie</p>
          </div>
        </div>
      </div>

      {/* Lista consumers */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Consumers ({filteredConsumers.length})
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Consumer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contatto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Località
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prenotazioni
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Spesa Totale
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Registrazione
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ultima Prenotazione
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
              {filteredConsumers.map((consumer) => (
                <tr key={consumer.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <Avatar
                          userId={consumer.id}
                          value={consumer.displayName}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {consumer.displayName}
                        </div>
                        <div className="text-sm text-gray-500">
                          ID: {consumer.id.substring(0, 8)}...
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {consumer.email}
                    </div>
                    <div className="text-sm text-gray-500">
                      {consumer.phone}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {consumer.city}, {consumer.cap}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {consumer.total_bookings}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      €{consumer.total_spent?.toFixed(2)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {dateDisplay(consumer.created_at, "date")}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {consumer.last_booking
                        ? new Date(consumer.last_booking).toLocaleDateString()
                        : "Mai"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getVerificationColor(
                        consumer.verification_status
                      )}`}
                    >
                      {consumer.verification_status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                        consumer.status
                      )}`}
                    >
                      {consumer.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        className="text-blue-600 hover:text-blue-900 text-xs bg-blue-50 px-2 py-1 rounded"
                        onClick={() => {
                          // TODO: Implementare visualizzazione dettagli consumer
                          console.log("View consumer details:", consumer.id);
                        }}
                      >
                        Dettagli
                      </button>
                      <button
                        className="text-green-600 hover:text-green-900 text-xs bg-green-50 px-2 py-1 rounded"
                        onClick={() => {
                          // TODO: Implementare messaggistica diretta
                          console.log("Message consumer:", consumer.id);
                        }}
                      >
                        Messaggio
                      </button>
                      {consumer.status === "active" ? (
                        <button
                          className="text-red-600 hover:text-red-900 text-xs bg-red-50 px-2 py-1 rounded"
                          onClick={() => {
                            // TODO: Implementare sospensione consumer
                            console.log("Suspend consumer:", consumer.id);
                          }}
                        >
                          Sospendi
                        </button>
                      ) : (
                        <button
                          className="text-green-600 hover:text-green-900 text-xs bg-green-50 px-2 py-1 rounded"
                          onClick={() => {
                            // TODO: Implementare riattivazione consumer
                            console.log("Activate consumer:", consumer.id);
                          }}
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
            Top Spenders
          </h3>
          <div className="space-y-3">
            {consumers
              .sort((a, b) => b.total_spent - a.total_spent)
              .slice(0, 5)
              .map((consumer, index) => (
                <div
                  key={consumer.id}
                  className="flex justify-between items-center"
                >
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-500 mr-3">
                      #{index + 1}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {consumer.displayName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {consumer.total_bookings} prenotazioni
                      </p>
                    </div>
                  </div>
                  <p className="text-sm font-bold text-green-600">
                    €{consumer.total_spent?.toFixed(2)}
                  </p>
                </div>
              ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Customers più Fedeli
          </h3>
          <div className="space-y-3">
            {consumers
              .sort((a, b) => b.total_bookings - a.total_bookings)
              .slice(0, 5)
              .map((consumer, index) => (
                <div
                  key={consumer.id}
                  className="flex justify-between items-center"
                >
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-500 mr-3">
                      #{index + 1}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {consumer.displayName}
                      </p>
                      <p className="text-xs text-gray-500">
                        €{consumer.total_spent?.toFixed(2)} spesi
                      </p>
                    </div>
                  </div>
                  <p className="text-sm font-bold text-blue-600">
                    {consumer.total_bookings} prenotazioni
                  </p>
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
            Export Consumers
          </button>
          <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
            Invia Newsletter
          </button>
          <button className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700">
            Report Attività
          </button>
          <button className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700">
            Analisi Comportamento
          </button>
        </div>
      </div>
    </div>
  );
}
