"use client";

import { Routes } from "@/src/routes";
import { useUserStore } from "@/src/store/user/user.store";
import Link from "next/link";

type AdminHeaderProps = {
  children?: React.ReactNode;
};
export const AdminHeader = (props: AdminHeaderProps) => {
  const { children } = props;
  const user = useUserStore((state) => state.user);

  const navigationItems = [
    { href: Routes.adminOverview.url, label: "Panoramica", icon: "📊" },
    { href: Routes.adminBookings.url, label: "Prenotazioni", icon: "📅" },
    { href: Routes.adminPayments.url, label: "Pagamenti", icon: "💳" },
    { href: Routes.adminVigils.url, label: "Vigils", icon: "👮" },
    { href: Routes.adminVigilCandidati.url, label: "Candidati Vigil", icon: "📋" },
    { href: Routes.adminConsumers.url, label: "Utenti", icon: "👥" },
    { href: Routes.adminServices.url, label: "Servizi", icon: "🛠️" },
    { href: Routes.adminReviews.url, label: "Recensioni", icon: "📝" },
    { href: Routes.adminAnalytics.url, label: "Analytics", icon: "📈" },
  ];

  return (
    <>
      <nav className="bg-white shadow-sm border-b w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="inline-flex items-center">
                <h1 className="text-xl font-bold text-gray-900">
                  Admin Dashboard
                </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                Benvenuto, {user?.user_metadata?.name || "Admin"}
              </span>
              <Link
                href={Routes.home.url}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Torna al sito
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        <aside className="w-64 bg-white border-r border-gray-200 shadow min-h-screen">
          <nav className="mt-5 px-2">
            <div className="space-y-1">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                >
                  <span className="mr-3 text-lg">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>
        </aside>
        <div className="bg-gray-50 flex-1 p-6 max-h-[calc(100vh-4rem)] overflow-y-auto">{children}</div>
      </div>
    </>
  );
};
