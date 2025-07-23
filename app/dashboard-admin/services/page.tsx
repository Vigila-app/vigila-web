"use client";

import { useEffect, useState } from "react";

interface AdminService {
  id: string;
  title: string;
  description: string;
  vigil_id: string;
  vigil_name: string;
  price: number;
  category: string;
  location: string;
  status: "attivo" | "sospeso" | "bozza" | "scaduto";
  created_date: string;
  total_bookings: number;
  rating: number;
  availability: string[];
  duration_hours: number;
}

export default function AdminServicesPage() {
  const [services, setServices] = useState<AdminService[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchServices = async () => {
      try {
        // Simulazione dati - da sostituire con API reale
        const mockServices: AdminService[] = [
          {
            id: "service_1",
            title: "Vigilanza Notturna Residenziale",
            description: "Servizio di vigilanza notturna per abitazioni private",
            vigil_id: "vigil_1",
            vigil_name: "Luca Bianchi",
            price: 120.00,
            category: "Residenziale",
            location: "Milano",
            status: "attivo",
            created_date: "2024-12-01",
            total_bookings: 25,
            rating: 4.8,
            availability: ["Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì"],
            duration_hours: 8
          },
          {
            id: "service_2",
            title: "Vigilanza Diurna Commerciale",
            description: "Servizio di vigilanza per attività commerciali",
            vigil_id: "vigil_2",
            vigil_name: "Marco Neri",
            price: 80.00,
            category: "Commerciale",
            location: "Roma",
            status: "attivo",
            created_date: "2024-11-15",
            total_bookings: 18,
            rating: 4.6,
            availability: ["Tutti i giorni"],
            duration_hours: 4
          },
          {
            id: "service_3",
            title: "Vigilanza Evento Privato",
            description: "Servizio di vigilanza per eventi privati e cerimonie",
            vigil_id: "vigil_3",
            vigil_name: "Andrea Gialli",
            price: 200.00,
            category: "Eventi",
            location: "Napoli",
            status: "sospeso",
            created_date: "2025-01-10",
            total_bookings: 5,
            rating: 4.2,
            availability: ["Weekend"],
            duration_hours: 6
          },
          {
            id: "service_4",
            title: "Vigilanza Industriale",
            description: "Servizio di vigilanza per siti industriali",
            vigil_id: "vigil_4",
            vigil_name: "Stefano Viola",
            price: 150.00,
            category: "Industriale",
            location: "Torino",
            status: "bozza",
            created_date: "2025-07-01",
            total_bookings: 0,
            rating: 0,
            availability: ["Da definire"],
            duration_hours: 12
          },
          {
            id: "service_5",
            title: "Vigilanza VIP",
            description: "Servizio di vigilanza personalizzata per VIP",
            vigil_id: "vigil_5",
            vigil_name: "Roberto Rossi",
            price: 300.00,
            category: "Premium",
            location: "Bologna",
            status: "attivo",
            created_date: "2024-09-20",
            total_bookings: 42,
            rating: 4.9,
            availability: ["Su richiesta"],
            duration_hours: 24
          }
        ];
        
        setServices(mockServices);
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const updateServiceStatus = async (serviceId: string, newStatus: AdminService["status"]) => {
    try {
      // Implementare chiamata API
      setServices(prev => 
        prev.map(service => 
          service.id === serviceId 
            ? { ...service, status: newStatus }
            : service
        )
      );
    } catch (error) {
      console.error("Error updating service status:", error);
    }
  };

  const deleteService = async (serviceId: string) => {
    try {
      // Implementare chiamata API
      setServices(prev => prev.filter(service => service.id !== serviceId));
    } catch (error) {
      console.error("Error deleting service:", error);
    }
  };

  const filteredServices = services.filter(service => {
    const matchesFilter = filter === "all" || service.status === filter;
    const matchesCategoryFilter = categoryFilter === "all" || service.category === categoryFilter;
    const matchesSearch = 
      service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.vigil_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesCategoryFilter && matchesSearch;
  });

  const getStatusColor = (status: AdminService["status"]) => {
    switch (status) {
      case "attivo": return "bg-green-100 text-green-800";
      case "sospeso": return "bg-yellow-100 text-yellow-800";
      case "bozza": return "bg-blue-100 text-blue-800";
      case "scaduto": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getRatingStars = (rating: number) => {
    if (rating === 0) return "N/A";
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

  const categories = Array.from(new Set(services.map(s => s.category)));
  const totalRevenue = services.reduce((sum, service) => sum + (service.price * service.total_bookings), 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestione Servizi</h1>
          <p className="text-gray-600">Visualizza e gestisci tutti i servizi offerti sulla piattaforma</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
          Nuovo Servizio
        </button>
      </div>

      {/* Statistiche */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Totale Servizi</p>
          <p className="text-2xl font-bold">{services.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Attivi</p>
          <p className="text-2xl font-bold text-green-600">
            {services.filter(s => s.status === "attivo").length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Prenotazioni Totali</p>
          <p className="text-2xl font-bold text-blue-600">
            {services.reduce((sum, s) => sum + s.total_bookings, 0)}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Ricavi Servizi</p>
          <p className="text-2xl font-bold text-purple-600">
            €{totalRevenue.toFixed(2)}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Prezzo Medio</p>
          <p className="text-2xl font-bold text-orange-600">
            €{(services.reduce((sum, s) => sum + s.price, 0) / services.length).toFixed(2)}
          </p>
        </div>
      </div>

      {/* Filtri e ricerca */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              <option value="sospeso">Sospesi</option>
              <option value="bozza">Bozze</option>
              <option value="scaduto">Scaduti</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filtra per categoria
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="all">Tutte</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cerca
            </label>
            <input
              type="text"
              placeholder="Cerca per titolo, vigile o località..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>
        </div>
      </div>

      {/* Tabella servizi */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Servizio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vigile
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Categoria
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prezzo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prenotazioni
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rating
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
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900 truncate max-w-xs">
                        {service.title}
                      </div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">
                        {service.description}
                      </div>
                      <div className="text-xs text-gray-400">
                        {service.location} • {service.duration_hours}h
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {service.vigil_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {service.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    €{service.price.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {service.total_bookings}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {getRatingStars(service.rating)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(service.status)}`}>
                      {service.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex flex-col space-y-1">
                      {service.status === "bozza" && (
                        <button
                          onClick={() => updateServiceStatus(service.id, "attivo")}
                          className="text-green-600 hover:text-green-900 text-xs"
                        >
                          Pubblica
                        </button>
                      )}
                      {service.status === "attivo" && (
                        <button
                          onClick={() => updateServiceStatus(service.id, "sospeso")}
                          className="text-yellow-600 hover:text-yellow-900 text-xs"
                        >
                          Sospendi
                        </button>
                      )}
                      {service.status === "sospeso" && (
                        <button
                          onClick={() => updateServiceStatus(service.id, "attivo")}
                          className="text-green-600 hover:text-green-900 text-xs"
                        >
                          Riattiva
                        </button>
                      )}
                      <button className="text-blue-600 hover:text-blue-900 text-xs">
                        Modifica
                      </button>
                      <button className="text-purple-600 hover:text-purple-900 text-xs">
                        Analytics
                      </button>
                      <button
                        onClick={() => deleteService(service.id)}
                        className="text-red-600 hover:text-red-900 text-xs"
                      >
                        Elimina
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredServices.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Nessun servizio trovato con i filtri selezionati
          </div>
        )}
      </div>

      {/* Analisi per categoria */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Distribuzione per Categoria</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {categories.map(category => {
            const categoryServices = services.filter(s => s.category === category);
            const categoryBookings = categoryServices.reduce((sum, s) => sum + s.total_bookings, 0);
            const categoryRevenue = categoryServices.reduce((sum, s) => sum + (s.price * s.total_bookings), 0);
            
            return (
              <div key={category} className="border rounded-lg p-4">
                <h4 className="font-medium text-gray-900">{category}</h4>
                <div className="mt-2 space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Servizi:</span>
                    <span>{categoryServices.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Prenotazioni:</span>
                    <span>{categoryBookings}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Ricavi:</span>
                    <span className="font-medium">€{categoryRevenue.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
