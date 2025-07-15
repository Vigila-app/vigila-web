"use client";

import { Routes } from "@/src/routes";
import { useUserStore } from "@/src/store/user/user.store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { RolesEnum } from "@/src/enums/roles.enums";
import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user === null) {
      // Still loading
      return;
    }
    
    if (!user?.id || user.user_metadata?.role !== RolesEnum.ADMIN) {
      router.replace(Routes.home.url);
      return;
    }
    
    setLoading(false);
  }, [user, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  const navigationItems = [
    { href: Routes.adminOverview.url, label: "Panoramica", icon: "📊" },
    { href: Routes.adminBookings.url, label: "Prenotazioni", icon: "📅" },
    { href: Routes.adminPayments.url, label: "Pagamenti", icon: "💳" },
    { href: Routes.adminVigils.url, label: "Vigili", icon: "👮" },
    { href: Routes.adminConsumers.url, label: "Utenti", icon: "👥" },
    { href: Routes.adminServices.url, label: "Servizi", icon: "🛠️" },
    { href: Routes.adminAnalytics.url, label: "Analytics", icon: "📈" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-gray-900">
                  Admin Dashboard
                </h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                Benvenuto, {user?.user_metadata?.name}
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
        <aside className="w-64 bg-white shadow-sm min-h-screen">
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

        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
