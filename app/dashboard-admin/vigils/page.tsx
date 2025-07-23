"use client";

import { useEffect, useState } from "react";

interface AdminVigil {
  id: string;
  name: string;
  surname: string;
  email: string;
  phone?: string;
  registration_date: string;
  status: "attivo" | "sospeso" | "in_attesa_verifica" | "bloccato";
  total_services: number;
  rating: number;
  location: string;
  verified: boolean;
  last_activity: string;
  earnings: number;
}

export default function AdminVigilsPage() {
  const [vigils, setVigils] = useState<AdminVigil[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchVigils = async () => {
      try {
        // Simulazione dati - da sostituire con API reale
        const mockVigils: AdminVigil[] = [
          {
            id: "vigil_1",
            name: "Luca",
            surname: "Bianchi",
            email: "luca.bianchi@email.com",
            phone: "+39 123 456 7890",
            registration_date: "2024-12-15",
            status: "attivo",
            total_services: 45,
            rating: 4.8,
            location: "Milano",
            verified: true,
            last_activity: "2025-07-15T18:30:00",
            earnings: 2340.00
          },
          {
            id: "vigil_2",
            name: "Marco",
            surname: "Neri",
            email: "marco.neri@email.com",
            phone: "+39 098 765 4321",
            registration_date: "2024-11-22",
            status: "attivo",
            total_services: 32,
            rating: 4.6,
            location: "Roma",
            verified: true,
            last_activity: "2025-07-14T22:15:00",
            earnings: 1890.00
          },
          {
            id: "vigil_3",
            name: "Andrea",
            surname: "Gialli",
            email: "andrea.gialli@email.com",
            phone: "+39 111 222 3333",
            registration_date: "2025-01-10",
            status: "in_attesa_verifica",
            total_services: 0,
            rating: 0,
            location: "Napoli",
            verified: false,
            last_activity: "2025-07-10T14:20:00",
            earnings: 0
          },
          {
            id: "vigil_4",
            name: "Stefano",
            surname: "Viola",
            email: "stefano.viola@email.com",
            phone: "+39 444 555 6666",
            registration_date: "2024-10-05",
            status: "sospeso",
            total_services: 18,
            rating: 3.2,
            location: "Torino",
            verified: true,
            last_activity: "2025-07-05T09:45:00",
            earnings: 890.00
          },
          {
            id: "vigil_5",
            name: "Roberto",
            surname: "Rossi",
            email: "roberto.rossi@email.com",
            phone: "+39 777 888 9999",
            registration_date: "2024-09-18",
            status: "attivo",
            total_services: 67,
            rating: 4.9,
            location: "Bologna",
            verified: true,
            last_activity: "2025-07-15T16:10:00",
            earnings: 3120.00
          }
        ];
        
        setVigils(mockVigils);
      } catch (error) {
        console.error("Error fetching vigils:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVigils();
  }, []);

  const updateVigilStatus = async (vigilId: string, newStatus: AdminVigil["status"]) => {
    try {
      // Implementare chiamata API
      setVigils(prev => 
        prev.map(vigil => 
          vigil.id === vigilId 
            ? { ...vigil, status: newStatus }
            : vigil
        )
      );
    } catch (error) {
      console.error("Error updating vigil status:", error);
    }
  };

  const verifyVigil = async (vigilId: string) => {
    try {
      // Implementare chiamata API
      setVigils(prev => 
        prev.map(vigil => 
          vigil.id === vigilId 
            ? { ...vigil, verified: true, status: "attivo" }
            : vigil
        )
      );
    } catch (error) {
      console.error("Error verifying vigil:", error);
    }
  };

  const filteredVigils = vigils.filter(vigil => {
    const matchesFilter = filter === "all" || vigil.status === filter;
    const matchesSearch = 
      vigil.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vigil.surname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vigil.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vigil.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const getStatusColor = (status: AdminVigil["status"]) => {
    switch (status) {
      case "attivo": return "bg-green-100 text-green-800";
      case "sospeso": return "bg-yellow-100 text-yellow-800";
      case "in_attesa_verifica": return "bg-blue-100 text-blue-800";
      case "bloccato": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getRatingStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    return (
      <div className="flex items-center">
        {"★".repeat(fullStars)}
        {hasHalfStar && "☆"}
        {"☆".repeat(emptyStars)}
        <span className="ml-1 text-sm text-gray-600">({rating.toFixed(1)})</span>
      </div>
    );
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
        <h1 className="text-2xl font-bold text-gray-900">Gestione Vigils</h1>
        <p className="text-gray-600">Visualizza e gestisci tutti i vigils della piattaforma</p>
      </div>

      {/* Statistiche */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Totale Vigils</p>
          <p className="text-2xl font-bold">{vigils.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Attivi</p>
          <p className="text-2xl font-bold text-green-600">
            {vigils.filter(v => v.status === "attivo").length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">In Verifica</p>
          <p className="text-2xl font-bold text-blue-600">
            {vigils.filter(v => v.status === "in_attesa_verifica").length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Sospesi</p>
          <p className="text-2xl font-bold text-yellow-600">
            {vigils.filter(v => v.status === "sospeso").length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Rating Medio</p>
          <p className="text-2xl font-bold text-purple-600">
            {(vigils.reduce((sum, v) => sum + v.rating, 0) / vigils.length).toFixed(1)}
          </p>
        </div>
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
              <option value="attivo">Attivi</option>
              <option value="in_attesa_verifica">In attesa verifica</option>
              <option value="sospeso">Sospesi</option>
              <option value="bloccato">Bloccati</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cerca
            </label>
            <input
              type="text"
              placeholder="Cerca per nome, email o città..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>
        </div>
      </div>

      {/* Tabella vigils */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vigil
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contatti
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Località
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Servizi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rating
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Guadagni
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
                      <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                        {vigil.name.charAt(0)}{vigil.surname.charAt(0)}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {vigil.name} {vigil.surname}
                        </div>
                        <div className="text-sm text-gray-500">
                          {vigil.verified ? "✅ Verificato" : "⏳ Non verificato"}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>{vigil.email}</div>
                    <div>{vigil.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {vigil.location}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {vigil.total_services}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {vigil.rating > 0 ? getRatingStars(vigil.rating) : "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    €{vigil.earnings.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(vigil.status)}`}>
                      {vigil.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex flex-col space-y-1">
                      {!vigil.verified && vigil.status === "in_attesa_verifica" && (
                        <button
                          onClick={() => verifyVigil(vigil.id)}
                          className="text-green-600 hover:text-green-900 text-xs"
                        >
                          Verifica
                        </button>
                      )}
                      {vigil.status === "attivo" && (
                        <button
                          onClick={() => updateVigilStatus(vigil.id, "sospeso")}
                          className="text-yellow-600 hover:text-yellow-900 text-xs"
                        >
                          Sospendi
                        </button>
                      )}
                      {vigil.status === "sospeso" && (
                        <button
                          onClick={() => updateVigilStatus(vigil.id, "attivo")}
                          className="text-green-600 hover:text-green-900 text-xs"
                        >
                          Riattiva
                        </button>
                      )}
                      <button className="text-blue-600 hover:text-blue-900 text-xs">
                        Dettagli
                      </button>
                      <button
                        onClick={() => updateVigilStatus(vigil.id, "bloccato")}
                        className="text-red-600 hover:text-red-900 text-xs"
                      >
                        Blocca
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredVigils.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Nessun vigile trovato con i filtri selezionati
          </div>
        )}
      </div>
    </div>
  );
}
