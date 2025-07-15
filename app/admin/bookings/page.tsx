"use client";

import { useEffect, useState } from "react";
import { ApiService } from "@/src/services";

interface AdminBooking {
  id: string;
  consumer_name: string;
  vigil_name: string;
  service_name: string;
  date: string;
  time: string;
  status: string;
  amount: number;
  location: string;
  payment_status: string;
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        // Simulazione dati - da sostituire con API reale
        const mockBookings: AdminBooking[] = [
          {
            id: "1",
            consumer_name: "Mario Rossi",
            vigil_name: "Luca Bianchi",
            service_name: "Vigilanza notturna",
            date: "2025-07-20",
            time: "22:00",
            status: "confermata",
            amount: 120.00,
            location: "Via Roma 123, Milano",
            payment_status: "pagato"
          },
          {
            id: "2",
            consumer_name: "Laura Verdi",
            vigil_name: "Marco Neri",
            service_name: "Vigilanza diurna",
            date: "2025-07-21",
            time: "08:00",
            status: "in_corso",
            amount: 80.00,
            location: "Corso Buenos Aires 45, Milano",
            payment_status: "pagato"
          },
          {
            id: "3",
            consumer_name: "Giuseppe Blu",
            vigil_name: "Andrea Gialli",
            service_name: "Vigilanza evento",
            date: "2025-07-18",
            time: "19:00",
            status: "completata",
            amount: 200.00,
            location: "Piazza Duomo 1, Milano",
            payment_status: "pagato"
          },
          {
            id: "4",
            consumer_name: "Anna Rosa",
            vigil_name: "Stefano Viola",
            service_name: "Vigilanza residenziale",
            date: "2025-07-25",
            time: "20:00",
            status: "in_attesa",
            amount: 150.00,
            location: "Via Montenapoleone 8, Milano",
            payment_status: "in_attesa"
          }
        ];
        
        setBookings(mockBookings);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const updateBookingStatus = async (bookingId: string, newStatus: string) => {
    try {
      // Implementare chiamata API
      setBookings(prev => 
        prev.map(booking => 
          booking.id === bookingId 
            ? { ...booking, status: newStatus }
            : booking
        )
      );
    } catch (error) {
      console.error("Error updating booking status:", error);
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesFilter = filter === "all" || booking.status === filter;
    const matchesSearch = 
      booking.consumer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.vigil_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.service_name.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confermata": return "bg-green-100 text-green-800";
      case "in_corso": return "bg-blue-100 text-blue-800";
      case "completata": return "bg-gray-100 text-gray-800";
      case "in_attesa": return "bg-yellow-100 text-yellow-800";
      case "cancellata": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "pagato": return "bg-green-100 text-green-800";
      case "in_attesa": return "bg-yellow-100 text-yellow-800";
      case "fallito": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Gestione Prenotazioni</h1>
        <p className="text-gray-600">Visualizza e gestisci tutte le prenotazioni della piattaforma</p>
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
              <option value="all">Tutti</option>
              <option value="in_attesa">In attesa</option>
              <option value="confermata">Confermata</option>
              <option value="in_corso">In corso</option>
              <option value="completata">Completata</option>
              <option value="cancellata">Cancellata</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cerca
            </label>
            <input
              type="text"
              placeholder="Cerca per cliente, vigile o servizio..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>
        </div>
      </div>

      {/* Statistiche rapide */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Totale</p>
          <p className="text-2xl font-bold">{bookings.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">In attesa</p>
          <p className="text-2xl font-bold text-yellow-600">
            {bookings.filter(b => b.status === "in_attesa").length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">In corso</p>
          <p className="text-2xl font-bold text-blue-600">
            {bookings.filter(b => b.status === "in_corso").length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Completate</p>
          <p className="text-2xl font-bold text-green-600">
            {bookings.filter(b => b.status === "completata").length}
          </p>
        </div>
      </div>

      {/* Tabella prenotazioni */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
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
                  Vigile
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Servizio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data/Ora
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Importo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stato
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pagamento
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
                    #{booking.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {booking.consumer_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {booking.vigil_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {booking.service_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {booking.date} {booking.time}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    €{booking.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                      {booking.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPaymentStatusColor(booking.payment_status)}`}>
                      {booking.payment_status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex space-x-2">
                      {booking.status === "in_attesa" && (
                        <button
                          onClick={() => updateBookingStatus(booking.id, "confermata")}
                          className="text-green-600 hover:text-green-900"
                        >
                          Conferma
                        </button>
                      )}
                      {(booking.status === "confermata" || booking.status === "in_corso") && (
                        <button
                          onClick={() => updateBookingStatus(booking.id, "cancellata")}
                          className="text-red-600 hover:text-red-900"
                        >
                          Cancella
                        </button>
                      )}
                      <button className="text-blue-600 hover:text-blue-900">
                        Dettagli
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredBookings.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Nessuna prenotazione trovata con i filtri selezionati
          </div>
        )}
      </div>
    </div>
  );
}
