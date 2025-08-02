"use client";

import { useEffect, useState } from "react";
import { useAdminStore } from "@/src/store/admin/admin.store";
import { dateDisplay } from "@/src/utils/date.utils";
import { amountDisplay, capitalize } from "@/src/utils/common.utils";
import { CurrencyEnum } from "@/src/enums/common.enums";
import { BookingUtils } from "@/src/utils/booking.utils";
import { BookingStatusEnum } from "@/src/enums/booking.enums";
import { Badge } from "@/components";
import { useDebouncedSearch, createTextFilter } from "@/src/hooks/useDebouncedSearch";

export default function AdminBookingsPage() {
  const { bookings, bookingsLoading, getBookings, updateBookingStatus } =
    useAdminStore();

  const [filter, setFilter] = useState("all");
  const { searchTerm, debouncedSearchTerm, setSearchTerm } = useDebouncedSearch('', 300, 'adminBookings');

  useEffect(() => {
    const filters = filter !== "all" ? { status: filter } : undefined;
    getBookings(filters);
  }, [filter, getBookings]);

  // Crea il filtro di testo per la ricerca
  const textFilter = createTextFilter(debouncedSearchTerm);

  const filteredBookings = bookings.filter(booking =>
    textFilter(booking, [
      'consumers.displayName',
      'vigils.displayName', 
      'services.name'
    ])
  );

  const handleStatusUpdate = async (bookingId: string, newStatus: string) => {
    try {
      await updateBookingStatus(bookingId, newStatus);
    } catch (error) {
      console.error("Error updating booking status:", error);
    }
  };

  if (bookingsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Gestione Prenotazioni
        </h1>
        <p className="text-gray-600">
          Visualizza e gestisci tutte le prenotazioni della piattaforma
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
              <option value="pending">In attesa</option>
              <option value="confirmed">Confermata</option>
              <option value="in_progress">In corso</option>
              <option value="completed">Completata</option>
              <option value="cancelled">Cancellata</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cerca prenotazione
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cerca per cliente, vigil o servizio..."
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>
        </div>
      </div>

      {/* Statistiche rapide */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-600">
              {bookings.length}
            </p>
            <p className="text-sm text-gray-600">Totale</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-center">
            <p className="text-3xl font-bold text-yellow-600">
              {bookings.filter((b) => b.status === "pending").length}
            </p>
            <p className="text-sm text-gray-600">In attesa</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-600">
              {bookings.filter((b) => b.status === "confirmed").length}
            </p>
            <p className="text-sm text-gray-600">Confermate</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-center">
            <p className="text-3xl font-bold text-green-600">
              {bookings.filter((b) => b.status === "completed").length}
            </p>
            <p className="text-sm text-gray-600">Completate</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-center">
            <p className="text-3xl font-bold text-red-600">
              {bookings.filter((b) => b.status === "cancelled").length}
            </p>
            <p className="text-sm text-gray-600">Cancellate</p>
          </div>
        </div>
      </div>

      {/* Lista prenotazioni */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Prenotazioni ({filteredBookings.length})
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vigil
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Servizio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data/Ora
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Costo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Commissione
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
              {filteredBookings.map((booking) => (
                <tr key={booking.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{booking.id.substring(0, 8)}...
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {booking.consumers?.displayName}
                    </div>
                    <div className="text-sm text-gray-500">
                      ID: {booking.consumer_id.substring(0, 8)}...
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {booking.vigils?.displayName}
                    </div>
                    <div className="text-sm text-gray-500">
                      ID: {booking.vigil_id.substring(0, 8)}...
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {booking.services?.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      ID: {booking.service_id.substring(0, 8)}...
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {dateDisplay(booking.created_at, "date")}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {amountDisplay(
                        booking.price,
                        booking.services?.currency as CurrencyEnum
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {amountDisplay(
                        booking.price * 0.1, // Assuming 10% commission
                        booking.services?.currency as CurrencyEnum
                      )}
                    </div>
                    <div className="text-xs text-gray-500">10% commissione</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge
                      label={capitalize(booking.status as string)}
                      color={BookingUtils.getStatusColor(
                        booking.status as BookingStatusEnum
                      )}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        className="text-blue-600 hover:text-blue-900 text-xs bg-blue-50 px-2 py-1 rounded"
                        onClick={() => {
                          // TODO: Implementare visualizzazione dettagli prenotazione
                          console.log("View booking details:", booking.id);
                        }}
                      >
                        Dettagli
                      </button>

                      {booking.status === "pending" && (
                        <>
                          <button
                            className="text-green-600 hover:text-green-900 text-xs bg-green-50 px-2 py-1 rounded"
                            onClick={() =>
                              handleStatusUpdate(booking.id, "confirmed")
                            }
                          >
                            Conferma
                          </button>
                          <button
                            className="text-red-600 hover:text-red-900 text-xs bg-red-50 px-2 py-1 rounded"
                            onClick={() =>
                              handleStatusUpdate(booking.id, "cancelled")
                            }
                          >
                            Cancella
                          </button>
                        </>
                      )}

                      {booking.status === "confirmed" && (
                        <button
                          className="text-purple-600 hover:text-purple-900 text-xs bg-purple-50 px-2 py-1 rounded"
                          onClick={() =>
                            handleStatusUpdate(booking.id, "in_progress")
                          }
                        >
                          Avvia
                        </button>
                      )}

                      {booking.status === "in_progress" && (
                        <button
                          className="text-green-600 hover:text-green-900 text-xs bg-green-50 px-2 py-1 rounded"
                          onClick={() =>
                            handleStatusUpdate(booking.id, "completed")
                          }
                        >
                          Completa
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

      {/* Azioni rapide */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Azioni Rapide
        </h3>
        <div className="flex flex-wrap gap-4">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
            Export Prenotazioni
          </button>
          <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
            Report Mensile
          </button>
          <button className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700">
            Analisi Performance
          </button>
          <button className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700">
            Gestione Dispute
          </button>
        </div>
      </div>
    </div>
  );
}
