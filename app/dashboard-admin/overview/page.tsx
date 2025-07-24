"use client";

import { useEffect } from "react";
import { useAdminStore } from "@/src/store/admin/admin.store";
import PromoteUserComponent from "@/components/admin/promoteUser.component";
import { amountDisplay, capitalize } from "@/src/utils/common.utils";
import { dateDisplay } from "@/src/utils/date.utils";
import { CurrencyEnum } from "@/src/enums/common.enums";
import { Badge } from "@/components";
import { BookingStatusEnum } from "@/src/enums/booking.enums";
import { BookingUtils } from "@/src/utils/booking.utils";

export default function AdminOverviewPage() {
  const { dashboardStats, dashboardLoading, getDashboardStats } =
    useAdminStore();

  useEffect(() => {
    getDashboardStats();
  }, [getDashboardStats]);

  if (dashboardLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!dashboardStats) {
    return (
      <div className="text-center text-gray-500">
        Errore nel caricamento dei dati
      </div>
    );
  }

  console.log("Dashboard Stats:", dashboardStats);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Panoramica Dashboard
        </h1>
        <p className="text-gray-600">
          Panoramica generale della piattaforma Vigila
        </p>
      </div>

      {/* Statistiche principali */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-gray-500 mb-2">
            Prenotazioni Totali
          </h3>
          <p className="text-3xl font-bold text-gray-900">
            {dashboardStats.overview?.totalBookings}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-gray-500 mb-2">
            Utenti Totali
          </h3>
          <p className="text-3xl font-bold text-gray-900">
            {dashboardStats.overview?.totalUsers}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-gray-500 mb-2">
            Vigils Totali
          </h3>
          <p className="text-3xl font-bold text-gray-900">
            {dashboardStats.overview?.totalVigils}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-gray-500 mb-2">
            Servizi Totali
          </h3>
          <p className="text-3xl font-bold text-gray-900">
            {dashboardStats.overview?.totalServices}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-gray-500 mb-2">
            Ricavi Totali
          </h3>
          <p className="text-3xl font-bold text-green-600">
            €{dashboardStats.overview?.totalRevenue}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-gray-500 mb-2">
            Commissioni Piattaforma
          </h3>
          <p className="text-3xl font-bold text-blue-600">
            €{dashboardStats.overview?.platformCommission}
          </p>
        </div>
      </div>

      {/* Grafici e statistiche aggiuntive */}
      {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Servizi Attivi
          </h3>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Servizi in corso</span>
            <span className="text-2xl font-bold text-green-600">
              {dashboardStats.activeServices}
            </span>
          </div>
          <div className="mt-4 bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-500 h-2 rounded-full"
              style={{ width: "75%" }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            75% della capacità totale
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Crescita Mensile
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Nuovi utenti</span>
              <span className="text-sm font-medium text-green-600">
                +{dashboardStats.monthlyGrowth?.users || 0}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Prenotazioni</span>
              <span className="text-sm font-medium text-green-600">
                +{dashboardStats.monthlyGrowth?.bookings || 0}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Ricavi</span>
              <span className="text-sm font-medium text-green-600">
                +{dashboardStats.monthlyGrowth?.revenue || 0}%
              </span>
            </div>
          </div>
        </div>
      </div> */}

      {/* Prenotazioni recenti */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Prenotazioni Recenti
          </h3>
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
                  Importo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stato
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {dashboardStats.recentBookings.map((booking) => (
                <tr key={booking.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {booking.consumer}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {booking.service}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {dateDisplay(booking.date, "date")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {amountDisplay(
                      booking.amount,
                      booking.currency as CurrencyEnum
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge
                      label={capitalize(booking.status as string)}
                      color={BookingUtils.getStatusColor(
                        booking.status as BookingStatusEnum
                      )}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sezione Promozione Admin */}
      <div className="mt-8">
        <PromoteUserComponent
          onSuccess={() => {
            console.log("Utente promosso con successo");
          }}
        />
      </div>
    </div>
  );
}
