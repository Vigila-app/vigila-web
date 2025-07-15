"use client";

import { useEffect, useState } from "react";
import { ApiService } from "@/src/services";

interface DashboardStats {
  totalBookings: number;
  totalUsers: number;
  totalVigils: number;
  totalRevenue: number;
  recentBookings: any[];
  activeServices: number;
}

export default function AdminOverviewPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Simulo dati per ora - da implementare con API reali
        const mockStats: DashboardStats = {
          totalBookings: 1247,
          totalUsers: 523,
          totalVigils: 89,
          totalRevenue: 15420.50,
          recentBookings: [
            { id: 1, consumer: "Mario Rossi", service: "Vigilanza notturna", date: "2025-07-15", status: "Confermata" },
            { id: 2, consumer: "Laura Bianchi", service: "Vigilanza diurna", date: "2025-07-14", status: "In corso" },
            { id: 3, consumer: "Giuseppe Verdi", service: "Vigilanza evento", date: "2025-07-13", status: "Completata" },
          ],
          activeServices: 156,
        };
        
        setStats(mockStats);
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center text-gray-500">
        Errore nel caricamento dei dati
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Panoramica Dashboard</h1>
        <p className="text-gray-600">Panoramica generale della piattaforma Vigila</p>
      </div>

      {/* Statistiche principali */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="text-3xl mr-4">📅</div>
            <div>
              <p className="text-sm font-medium text-gray-600">Prenotazioni Totali</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalBookings}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="text-3xl mr-4">👥</div>
            <div>
              <p className="text-sm font-medium text-gray-600">Utenti Registrati</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="text-3xl mr-4">👮</div>
            <div>
              <p className="text-sm font-medium text-gray-600">Vigili Attivi</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalVigils}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="text-3xl mr-4">💰</div>
            <div>
              <p className="text-sm font-medium text-gray-600">Ricavi Totali</p>
              <p className="text-2xl font-bold text-gray-900">€{stats.totalRevenue.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Grafici e statistiche aggiuntive */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Servizi Attivi</h3>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Servizi in corso</span>
            <span className="text-2xl font-bold text-green-600">{stats.activeServices}</span>
          </div>
          <div className="mt-4 bg-gray-200 rounded-full h-2">
            <div className="bg-green-500 h-2 rounded-full" style={{ width: '75%' }}></div>
          </div>
          <p className="text-xs text-gray-500 mt-2">75% della capacità totale</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Crescita Mensile</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Nuovi utenti</span>
              <span className="text-sm font-medium text-green-600">+23%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Prenotazioni</span>
              <span className="text-sm font-medium text-green-600">+18%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Ricavi</span>
              <span className="text-sm font-medium text-green-600">+31%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Prenotazioni recenti */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Prenotazioni Recenti</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Servizio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stato
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stats.recentBookings.map((booking) => (
                <tr key={booking.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {booking.consumer}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {booking.service}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {booking.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      booking.status === 'Confermata' ? 'bg-green-100 text-green-800' :
                      booking.status === 'In corso' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {booking.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
