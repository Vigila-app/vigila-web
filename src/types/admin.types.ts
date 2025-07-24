export interface AdminDashboardStatsI {
  overview: {
    totalBookings: number;
    totalUsers: number;
    totalVigils: number;
    totalServices: number;
    totalRevenue: number;
    platformCommission: number;
  };
  activeServices: number;
  monthlyGrowth: {
    bookings: number;
    revenue: number;
    users: number;
    vigils: number;
  };
  recentBookings: {
    id: string;
    consumer: string;
    vigil: string;
    service: string;
    date: string;
    status: string;
    amount: number;
    currency?: string;
  }[];
  topPerformers: {
    vigils: {
      name: string;
      earnings: number;
      rating: number;
    }[];
  };
}

export interface AdminAnalyticsI {
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

export interface AdminBookingI {
  id: string;
  consumer_id: string;
  vigil_id: string;
  service_id: string;
  date: string;
  time: string;
  status: string;
  price: number;
  location: string;
  payment_status: string;
  created_at: string;
  updated_at: string;
  consumers: {
    displayName: string;
  };
  vigils: {
    displayName: string;
  };
  services: {
    name: string;
    currency?: string;
  };
}

export interface AdminVigilI {
  id: string;
  displayName: string;
  email?: string;
  phone: string;
  status: string;
  rating: number;
  total_earnings: number;
  completed_services: number;
  active_services: number;
  joined_date: string;
  last_active: string;
  verification_status: string;
  location: string;
  created_at: string;
  updated_at?: string;
  addresses?: {
    display_name: string;
    address: string;
    city: string;
    state: string;
    country: string;
    zip_code: string;
  }[];
}

export interface AdminConsumerI {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  total_bookings: number;
  total_spent: number;
  joined_date: string;
  last_booking: string;
  verification_status: string;
  location: string;
}

export interface AdminServiceI {
  id: string;
  name: string;
  description: string;
  price: number;
  status: string;
  category: string;
  total_bookings: number;
  average_rating: number;
  created_at: string;
  updated_at: string;
  vigil_id: string;
  vigil_name: string;
}

export interface AdminPaymentI {
  id: string;
  booking_id: string;
  consumer_name: string;
  vigil_name: string;
  amount: number;
  status: string;
  payment_method: string;
  transaction_id: string;
  created_at: string;
  processed_at: string;
  commission: number;
  net_amount: number;
}

export interface AdminStoreType {
  // Dashboard
  dashboardStats: AdminDashboardStatsI | null;
  dashboardLoading: boolean;

  // Analytics
  analytics: AdminAnalyticsI | null;
  analyticsLoading: boolean;

  // Bookings
  bookings: AdminBookingI[];
  bookingsLoading: boolean;

  // Vigils
  vigils: AdminVigilI[];
  vigilsLoading: boolean;

  // Consumers
  consumers: AdminConsumerI[];
  consumersLoading: boolean;

  // Services
  services: AdminServiceI[];
  servicesLoading: boolean;

  // Payments
  payments: AdminPaymentI[];
  paymentsLoading: boolean;

  // Cache
  lastUpdate: {
    dashboardStats?: Date;
    analytics?: Date;
    bookings?: Date;
    vigils?: Date;
    consumers?: Date;
    services?: Date;
    payments?: Date;
  };

  // Actions
  getDashboardStats: (force?: boolean) => Promise<void>;
  getAnalytics: (dateRange?: string, force?: boolean) => Promise<void>;
  getBookings: (
    filters?: Record<string, string>,
    force?: boolean
  ) => Promise<void>;
  updateBookingStatus: (bookingId: string, status: string) => Promise<void>;
  getVigils: (
    filters?: Record<string, string>,
    force?: boolean
  ) => Promise<void>;
  updateVigilStatus: (vigilId: string, status: string) => Promise<void>;
  getConsumers: (
    filters?: Record<string, string>,
    force?: boolean
  ) => Promise<void>;
  getServices: (
    filters?: Record<string, string>,
    force?: boolean
  ) => Promise<void>;
  updateServiceStatus: (serviceId: string, status: string) => Promise<void>;
  getPayments: (
    filters?: Record<string, string>,
    force?: boolean
  ) => Promise<void>;
  promoteUser: (
    userId: string
  ) => Promise<{ success: boolean; message: string; data?: any }>;

  // Utility
  clearCache: (cacheKey?: keyof AdminStoreType["lastUpdate"]) => void;
  resetStore: () => void;
}
