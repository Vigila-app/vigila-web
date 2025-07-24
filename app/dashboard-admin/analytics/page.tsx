"use client";

import { useEffect, useState } from "react";
import { useAdminStore } from "@/src/store/admin/admin.store";

export default function AdminAnalyticsPage() {
  const { analytics, analyticsLoading, getAnalytics } = useAdminStore();

  const [dateRange, setDateRange] = useState("30days");

  useEffect(() => {
    getAnalytics(dateRange);
  }, [dateRange, getAnalytics]);

  if (analyticsLoading) {
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
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600">
            Metriche dettagliate della piattaforma
          </p>
        </div>
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2"
        >
          <option value="7days">Ultimi 7 giorni</option>
          <option value="30days">Ultimi 30 giorni</option>
          <option value="90days">Ultimi 90 giorni</option>
          <option value="1year">Ultimo anno</option>
        </select>
      </div>

      {/* Metriche principali */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Crescita Utenti
              </p>
              <p className="text-2xl font-bold text-gray-900">
                +{analytics?.monthlyGrowth?.users || 0}%
              </p>
              <p className="text-sm text-gray-500">Crescita mensile</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Crescita Prenotazioni
              </p>
              <p className="text-2xl font-bold text-gray-900">
                +{analytics?.monthlyGrowth?.bookings || 0}%
              </p>
              <p className="text-sm text-gray-500">Crescita mensile</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100">
              <svg
                className="w-6 h-6 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Revenue Totale
              </p>
              <p className="text-2xl font-bold text-gray-900">
                €{analytics?.financialMetrics?.totalRevenue || 0}
              </p>
              <p className="text-sm text-green-600">
                +{analytics?.monthlyGrowth?.revenue || 0}% crescita
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100">
              <svg
                className="w-6 h-6 text-yellow-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Valore Medio Prenotazione
              </p>
              <p className="text-2xl font-bold text-gray-900">
                €{analytics?.financialMetrics?.averageBookingValue || 0}
              </p>
              <p className="text-sm text-gray-500">Per prenotazione</p>
            </div>
          </div>
        </div>
      </div>

      {/* Grafici delle performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Trend Prenotazioni
          </h3>
          <div className="h-64 flex items-center justify-center text-gray-500">
            {/* TODO: Implementare grafico con Chart.js o Recharts */}
            Grafico prenotazioni nel tempo
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Revenue per Mese
          </h3>
          <div className="h-64 flex items-center justify-center text-gray-500">
            {/* TODO: Implementare grafico revenue */}
            Grafico revenue mensile
          </div>
        </div>
      </div>

      {/* Dettagli per categoria */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Top Servizi
          </h3>
          <div className="space-y-3">
            {analytics?.topPerformers?.services?.map((service, index) => (
              <div key={index} className="flex justify-between items-center">
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-500 mr-3">
                    #{index + 1}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {service.name}
                    </p>
                    <p className="text-xs text-gray-500">€{service.revenue}</p>
                  </div>
                </div>
                <p className="text-sm font-bold text-blue-600">
                  {service.bookings} prenotazioni
                </p>
              </div>
            )) || (
              <p className="text-gray-500 text-sm">Nessun dato disponibile</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Vigili più Attivi
          </h3>
          <div className="space-y-3">
            {analytics?.topPerformers?.vigils?.map((vigil, index) => (
              <div key={index} className="flex justify-between items-center">
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-500 mr-3">
                    #{index + 1}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {vigil.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      Rating: {vigil.rating}/5
                    </p>
                  </div>
                </div>
                <p className="text-sm font-bold text-green-600">
                  €{vigil.earnings}
                </p>
              </div>
            )) || (
              <p className="text-gray-500 text-sm">Nessun dato disponibile</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Città più Attive
          </h3>
          <div className="space-y-3">
            {analytics?.topPerformers?.locations?.map((location, index) => (
              <div key={index} className="flex justify-between items-center">
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-500 mr-3">
                    #{index + 1}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {location.city}
                    </p>
                    <p className="text-xs text-gray-500">
                      €{location.revenue} revenue
                    </p>
                  </div>
                </div>
                <p className="text-sm font-bold text-purple-600">
                  {location.bookings} prenotazioni
                </p>
              </div>
            )) || (
              <p className="text-gray-500 text-sm">Nessun dato disponibile</p>
            )}
          </div>
        </div>
      </div>

      {/* Performance indicators */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Indicatori di Performance
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-600">
              {analytics?.userBehavior?.conversionRate || 0}%
            </p>
            <p className="text-sm text-gray-600">Tasso di Conversione</p>
            <p className="text-xs text-gray-500">Visite → Prenotazioni</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-green-600">
              {analytics?.userBehavior?.repeatBookingRate || 0}%
            </p>
            <p className="text-sm text-gray-600">Clienti Ricorrenti</p>
            <p className="text-xs text-gray-500">≥ 2 prenotazioni</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-purple-600">
              {analytics?.userBehavior?.bounceRate || 0}%
            </p>
            <p className="text-sm text-gray-600">Bounce Rate</p>
            <p className="text-xs text-gray-500">Uscite immediate</p>
          </div>
        </div>
      </div>
    </div>
  );
}
