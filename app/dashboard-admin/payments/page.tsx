"use client";

import { useEffect, useState } from "react";
import { useAdminStore } from "@/src/store/admin/admin.store";

export default function AdminPaymentsPage() {
  const { payments, paymentsLoading, getPayments } = useAdminStore();

  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const filters = filter !== "all" ? { status: filter } : undefined;
    getPayments(filters);
  }, [filter, getPayments]);

  const filteredPayments = payments.filter(
    (payment) =>
      payment.consumer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.vigil_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.transaction_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      case "refunded":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (paymentsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Gestione Pagamenti</h1>
        <p className="text-gray-600">
          Monitora tutti i pagamenti e le transazioni della piattaforma
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
              <option value="completed">Completato</option>
              <option value="pending">In attesa</option>
              <option value="failed">Fallito</option>
              <option value="refunded">Rimborsato</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cerca pagamento
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cerca per cliente, vigile o ID transazione..."
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>
        </div>
      </div>

      {/* Statistiche finanziarie */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-center">
            <p className="text-3xl font-bold text-green-600">
              €
              {payments
                .filter((p) => p.status === "completed")
                .reduce((sum, p) => sum + p.amount, 0)
                .toFixed(2)}
            </p>
            <p className="text-sm text-gray-600">Revenue Totale</p>
            <p className="text-xs text-gray-500">
              {payments.filter((p) => p.status === "completed").length}{" "}
              transazioni
            </p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-600">
              €
              {payments
                .filter((p) => p.status === "completed")
                .reduce((sum, p) => sum + p.commission, 0)
                .toFixed(2)}
            </p>
            <p className="text-sm text-gray-600">Commissioni Platform</p>
            <p className="text-xs text-gray-500">Guadagno piattaforma</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-center">
            <p className="text-3xl font-bold text-yellow-600">
              €
              {payments
                .filter((p) => p.status === "pending")
                .reduce((sum, p) => sum + p.amount, 0)
                .toFixed(2)}
            </p>
            <p className="text-sm text-gray-600">In Attesa</p>
            <p className="text-xs text-gray-500">
              {payments.filter((p) => p.status === "pending").length}{" "}
              transazioni
            </p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-center">
            <p className="text-3xl font-bold text-red-600">
              €
              {payments
                .filter((p) => p.status === "refunded")
                .reduce((sum, p) => sum + p.amount, 0)
                .toFixed(2)}
            </p>
            <p className="text-sm text-gray-600">Rimborsi</p>
            <p className="text-xs text-gray-500">
              {payments.filter((p) => p.status === "refunded").length}{" "}
              transazioni
            </p>
          </div>
        </div>
      </div>

      {/* Lista pagamenti */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Pagamenti ({filteredPayments.length})
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID Transazione
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vigile
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Importo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Commissione
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Metodo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data
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
              {filteredPayments.map((payment) => (
                <tr key={payment.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {payment.transaction_id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {payment.consumer_name}
                    </div>
                    <div className="text-sm text-gray-500">
                      Booking: {payment.booking_id.substring(0, 8)}...
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {payment.vigil_name}
                    </div>
                    <div className="text-sm text-gray-500">
                      ID: {payment.id.substring(0, 8)}...
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      €{payment.amount.toFixed(2)}
                    </div>
                    <div className="text-xs text-gray-500">
                      Netto: €{payment.net_amount.toFixed(2)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      €{payment.commission.toFixed(2)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {((payment.commission / payment.amount) * 100).toFixed(1)}
                      %
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {payment.payment_method}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(payment.created_at).toLocaleDateString()}
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(payment.created_at).toLocaleTimeString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                        payment.status
                      )}`}
                    >
                      {payment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        className="text-blue-600 hover:text-blue-900 text-xs bg-blue-50 px-2 py-1 rounded"
                        onClick={() => {
                          // TODO: Implementare visualizzazione dettagli transazione
                          console.log("View payment details:", payment.id);
                        }}
                      >
                        Dettagli
                      </button>

                      {payment.status === "completed" && (
                        <button
                          className="text-red-600 hover:text-red-900 text-xs bg-red-50 px-2 py-1 rounded"
                          onClick={() => {
                            // TODO: Implementare processo di rimborso
                            console.log("Process refund:", payment.id);
                          }}
                        >
                          Rimborso
                        </button>
                      )}

                      {payment.status === "failed" && (
                        <button
                          className="text-green-600 hover:text-green-900 text-xs bg-green-50 px-2 py-1 rounded"
                          onClick={() => {
                            // TODO: Implementare retry pagamento
                            console.log("Retry payment:", payment.id);
                          }}
                        >
                          Riprova
                        </button>
                      )}

                      <button
                        className="text-purple-600 hover:text-purple-900 text-xs bg-purple-50 px-2 py-1 rounded"
                        onClick={() => {
                          // TODO: Implementare download ricevuta
                          console.log("Download receipt:", payment.id);
                        }}
                      >
                        Ricevuta
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Analisi finanziarie */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Metodi di Pagamento Più Usati
          </h3>
          <div className="space-y-3">
            {Array.from(new Set(payments.map((p) => p.payment_method)))
              .map((method) => ({
                method,
                count: payments.filter((p) => p.payment_method === method)
                  .length,
                total: payments
                  .filter((p) => p.payment_method === method)
                  .reduce((sum, p) => sum + p.amount, 0),
              }))
              .sort((a, b) => b.count - a.count)
              .slice(0, 5)
              .map((methodData, index) => (
                <div
                  key={methodData.method}
                  className="flex justify-between items-center"
                >
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-500 mr-3">
                      #{index + 1}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {methodData.method}
                      </p>
                      <p className="text-xs text-gray-500">
                        €{methodData.total.toFixed(2)} totale
                      </p>
                    </div>
                  </div>
                  <p className="text-sm font-bold text-blue-600">
                    {methodData.count} transazioni
                  </p>
                </div>
              ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Performance Mensile
          </h3>
          <div className="h-64 flex items-center justify-center text-gray-500">
            {/* TODO: Implementare grafico con Chart.js o Recharts */}
            Grafico performance pagamenti mensile
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
            Export Pagamenti
          </button>
          <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
            Report Finanziario
          </button>
          <button className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700">
            Gestione Rimborsi
          </button>
          <button className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700">
            Riconciliazione Banca
          </button>
        </div>
      </div>
    </div>
  );
}
