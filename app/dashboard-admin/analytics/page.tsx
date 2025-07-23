"use client";

import { useEffect, useState } from "react";

interface AnalyticsData {
  dailyStats: {
    date: string;
    bookings: number;
    revenue: number;
    newUsers: number;
  }[];
  monthlyGrowth: {
    bookings: number;
    revenue: number;
    users: number;
    vigils: number;
  };
  topPerformers: {
    vigils: { name: string; earnings: number; rating: number }[];
    services: { name: string; bookings: number; revenue: number }[];
    locations: { city: string; bookings: number; revenue: number }[];
  };
  userBehavior: {
    averageSessionDuration: number;
    bounceRate: number;
    conversionRate: number;
    repeatBookingRate: number;
  };
  financialMetrics: {
    totalRevenue: number;
    platformCommission: number;
    averageBookingValue: number;
    monthlyRecurringRevenue: number;
  };
}

export default function AdminAnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState("30");

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        // Simulazione dati - da sostituire con API reale
        const mockAnalytics: AnalyticsData = {
          dailyStats: [
            { date: "2025-07-01", bookings: 12, revenue: 1440, newUsers: 5 },
            { date: "2025-07-02", bookings: 15, revenue: 1800, newUsers: 8 },
            { date: "2025-07-03", bookings: 10, revenue: 1200, newUsers: 3 },
            { date: "2025-07-04", bookings: 18, revenue: 2160, newUsers: 7 },
            { date: "2025-07-05", bookings: 14, revenue: 1680, newUsers: 6 },
            { date: "2025-07-06", bookings: 16, revenue: 1920, newUsers: 4 },
            { date: "2025-07-07", bookings: 20, revenue: 2400, newUsers: 9 },
          ],
          monthlyGrowth: {
            bookings: 23,
            revenue: 31,
            users: 18,
            vigils: 12
          },
          topPerformers: {
            vigils: [
              { name: "Roberto Rossi", earnings: 3120, rating: 4.9 },
              { name: "Luca Bianchi", earnings: 2340, rating: 4.8 },
              { name: "Marco Neri", earnings: 1890, rating: 4.6 }
            ],
            services: [
              { name: "Vigilanza VIP", bookings: 42, revenue: 12600 },
              { name: "Vigilanza Notturna", bookings: 25, revenue: 3000 },
              { name: "Vigilanza Commerciale", bookings: 18, revenue: 1440 }
            ],
            locations: [
              { city: "Milano", bookings: 45, revenue: 5400 },
              { city: "Roma", bookings: 32, revenue: 3840 },
              { city: "Bologna", bookings: 28, revenue: 8400 }
            ]
          },
          userBehavior: {
            averageSessionDuration: 8.5,
            bounceRate: 24.5,
            conversionRate: 12.8,
            repeatBookingRate: 68.3
          },
          financialMetrics: {
            totalRevenue: 25420.50,
            platformCommission: 2542.05,
            averageBookingValue: 142.30,
            monthlyRecurringRevenue: 18250.00
          }
        };
        
        setAnalytics(mockAnalytics);
      } catch (error) {
        console.error("Error fetching analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [dateRange]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="text-center text-gray-500">
        Errore nel caricamento delle analytics
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics e Statistiche</h1>
          <p className="text-gray-600">Analisi dettagliate delle performance della piattaforma</p>
        </div>
        <div>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2"
          >
            <option value="7">Ultimi 7 giorni</option>
            <option value="30">Ultimi 30 giorni</option>
            <option value="90">Ultimi 90 giorni</option>
            <option value="365">Ultimo anno</option>
          </select>
        </div>
      </div>

      {/* Metriche finanziarie principali */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="text-3xl mr-4">💰</div>
            <div>
              <p className="text-sm font-medium text-gray-600">Ricavi Totali</p>
              <p className="text-2xl font-bold text-green-600">
                €{analytics.financialMetrics.totalRevenue.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="text-3xl mr-4">💳</div>
            <div>
              <p className="text-sm font-medium text-gray-600">Commissioni</p>
              <p className="text-2xl font-bold text-blue-600">
                €{analytics.financialMetrics.platformCommission.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="text-3xl mr-4">📊</div>
            <div>
              <p className="text-sm font-medium text-gray-600">Valore Medio Prenotazione</p>
              <p className="text-2xl font-bold text-purple-600">
                €{analytics.financialMetrics.averageBookingValue.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="text-3xl mr-4">🔄</div>
            <div>
              <p className="text-sm font-medium text-gray-600">MRR</p>
              <p className="text-2xl font-bold text-orange-600">
                €{analytics.financialMetrics.monthlyRecurringRevenue.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Crescita mensile */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Crescita Mensile</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-sm text-gray-600">Prenotazioni</p>
            <p className={`text-2xl font-bold ${analytics.monthlyGrowth.bookings >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {analytics.monthlyGrowth.bookings >= 0 ? '+' : ''}{analytics.monthlyGrowth.bookings}%
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Ricavi</p>
            <p className={`text-2xl font-bold ${analytics.monthlyGrowth.revenue >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {analytics.monthlyGrowth.revenue >= 0 ? '+' : ''}{analytics.monthlyGrowth.revenue}%
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Nuovi Utenti</p>
            <p className={`text-2xl font-bold ${analytics.monthlyGrowth.users >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {analytics.monthlyGrowth.users >= 0 ? '+' : ''}{analytics.monthlyGrowth.users}%
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Nuovi Vigils</p>
            <p className={`text-2xl font-bold ${analytics.monthlyGrowth.vigils >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {analytics.monthlyGrowth.vigils >= 0 ? '+' : ''}{analytics.monthlyGrowth.vigils}%
            </p>
          </div>
        </div>
      </div>

      {/* Grafici temporali */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Andamento Prenotazioni</h3>
          <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <p className="text-gray-500 mb-2">Grafico delle prenotazioni giornaliere</p>
              <div className="text-xs text-gray-400">
                {analytics.dailyStats.map((day, index) => (
                  <div key={index} className="flex justify-between py-1">
                    <span>{day.date}</span>
                    <span>{day.bookings} prenotazioni</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Andamento Ricavi</h3>
          <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <p className="text-gray-500 mb-2">Grafico dei ricavi giornalieri</p>
              <div className="text-xs text-gray-400">
                {analytics.dailyStats.map((day, index) => (
                  <div key={index} className="flex justify-between py-1">
                    <span>{day.date}</span>
                    <span>€{day.revenue}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Comportamento utenti */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Comportamento Utenti</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <p className="text-sm text-gray-600">Durata Sessione Media</p>
            <p className="text-xl font-bold text-blue-600">{analytics.userBehavior.averageSessionDuration} min</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Bounce Rate</p>
            <p className="text-xl font-bold text-yellow-600">{analytics.userBehavior.bounceRate}%</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Conversion Rate</p>
            <p className="text-xl font-bold text-green-600">{analytics.userBehavior.conversionRate}%</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Repeat Booking Rate</p>
            <p className="text-xl font-bold text-purple-600">{analytics.userBehavior.repeatBookingRate}%</p>
          </div>
        </div>
      </div>

      {/* Top performers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Top Vigils</h3>
          <div className="space-y-3">
            {analytics.topPerformers.vigils.map((vigil, index) => (
              <div key={index} className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-gray-900">{vigil.name}</p>
                  <p className="text-xs text-gray-500">Rating: {vigil.rating}⭐</p>
                </div>
                <p className="text-sm font-bold text-green-600">€{vigil.earnings}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Top Servizi</h3>
          <div className="space-y-3">
            {analytics.topPerformers.services.map((service, index) => (
              <div key={index} className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-gray-900">{service.name}</p>
                  <p className="text-xs text-gray-500">{service.bookings} prenotazioni</p>
                </div>
                <p className="text-sm font-bold text-blue-600">€{service.revenue}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Top Città</h3>
          <div className="space-y-3">
            {analytics.topPerformers.locations.map((location, index) => (
              <div key={index} className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-gray-900">{location.city}</p>
                  <p className="text-xs text-gray-500">{location.bookings} prenotazioni</p>
                </div>
                <p className="text-sm font-bold text-purple-600">€{location.revenue}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Export e report */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Export e Report</h3>
        <div className="flex flex-wrap gap-4">
          <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
            Export Excel
          </button>
          <button className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700">
            Export PDF
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
            Report Dettagliato
          </button>
          <button className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700">
            Schedule Report
          </button>
        </div>
      </div>
    </div>
  );
}
