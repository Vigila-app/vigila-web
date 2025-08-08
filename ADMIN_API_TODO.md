# API Admin Mancanti - Vigila Platform

## Panoramica
Questo documento elenca tutte le API mancanti che devono essere implementate lato backend per completare il sistema amministrativo della piattaforma Vigila.

## Status delle API Esistenti

### ✅ API Admin già implementate (utilizzate dal frontend):
- `GET /api/v1/admin/analytics` - Statistiche dashboard e analytics
- `GET /api/v1/admin/bookings` - Lista prenotazioni
- `PUT /api/v1/admin/bookings/{id}` - Aggiorna stato prenotazione
- `GET /api/v1/admin/vigils` - Lista vigils
- `PUT /api/v1/admin/vigils/{id}` - Aggiorna stato vigil
- `GET /api/v1/admin/consumers` - Lista consumers
- `GET /api/v1/admin/services` - Lista servizi
- `PUT /api/v1/admin/services/{id}` - Aggiorna stato servizio
- `GET /api/v1/admin/payments` - Lista pagamenti
- `POST /api/v1/admin/users/{userId}/promote` - Promuovi utente ad admin

---

## 🚧 API Mancanti da Implementare

### 1. Analytics API - Funzionalità Avanzate

#### 1.1 Revenue Breakdown
```http
GET /api/v1/admin/analytics/revenue-breakdown
```
**Parametri Query:**
- `period` (string): "daily", "weekly", "monthly", "yearly"
- `start_date` (string, ISO): Data inizio
- `end_date` (string, ISO): Data fine

**Response:**
```json
{
  "data": {
    "total_revenue": 25420.50,
    "breakdown": [
      {
        "period": "2025-07-01",
        "gross_revenue": 1200.00,
        "platform_commission": 120.00,
        "net_revenue": 1080.00,
        "transactions_count": 8
      }
    ],
    "growth_rate": 15.3,
    "avg_transaction_value": 142.30
  }
}
```

#### 1.2 User Behavior Analytics
```http
GET /api/v1/admin/analytics/user-behavior
```
**Response:**
```json
{
  "data": {
    "session_analytics": {
      "avg_session_duration": 8.5,
      "bounce_rate": 24.5,
      "pages_per_session": 3.2
    },
    "conversion_funnel": {
      "visitors": 1000,
      "registrations": 150,
      "first_booking": 45,
      "repeat_bookings": 23
    },
    "user_retention": {
      "day_1": 85.2,
      "day_7": 42.1,
      "day_30": 18.7
    }
  }
}
```

#### 1.3 Geographic Statistics
```http
GET /api/v1/admin/analytics/geographic-stats
```
**Response:**
```json
{
  "data": {
    "top_cities": [
      {
        "city": "Milano",
        "bookings": 145,
        "revenue": 12500.00,
        "growth_rate": 23.5
      }
    ],
    "coverage_map": {
      "total_cities": 15,
      "active_cities": 12,
      "expansion_opportunities": ["Torino", "Napoli"]
    }
  }
}
```

#### 1.4 Export Analytics
```http
POST /api/v1/admin/analytics/export
```
**Body:**
```json
{
  "format": "excel|pdf|csv",
  "data_type": "revenue|users|bookings|comprehensive",
  "period": {
    "start_date": "2025-01-01",
    "end_date": "2025-07-31"
  },
  "email": "admin@vigila.com"
}
```

### 2. Bookings API - Gestione Avanzata

#### 2.1 Assign Vigil to Booking
```http
PUT /api/v1/admin/bookings/{bookingId}/assign-vigil
```
**Body:**
```json
{
  "vigil_id": "vigil_123",
  "override_preferences": false,
  "reason": "Manual assignment due to emergency"
}
```

#### 2.2 Bulk Update Bookings
```http
POST /api/v1/admin/bookings/bulk-update
```
**Body:**
```json
{
  "booking_ids": ["booking_1", "booking_2"],
  "action": "cancel|confirm|reassign",
  "data": {
    "reason": "System maintenance",
    "new_vigil_id": "vigil_456"
  }
}
```

#### 2.3 Detect Booking Conflicts
```http
GET /api/v1/admin/bookings/conflicts
```
**Response:**
```json
{
  "data": [
    {
      "conflict_type": "double_booking|time_overlap|unavailable_vigil",
      "bookings": ["booking_1", "booking_2"],
      "severity": "high|medium|low",
      "suggested_resolution": "reassign_vigil|reschedule"
    }
  ]
}
```

#### 2.4 Booking History & Audit
```http
GET /api/v1/admin/bookings/{bookingId}/history
```
**Response:**
```json
{
  "data": [
    {
      "timestamp": "2025-07-15T10:30:00Z",
      "action": "status_change",
      "from": "pending",
      "to": "confirmed",
      "performed_by": "admin_123",
      "reason": "Manual confirmation"
    }
  ]
}
```

### 3. Vigils API - Gestione Completa

#### 3.1 Verify Vigil Identity
```http
POST /api/v1/admin/vigils/{vigilId}/verify
```
**Body:**
```json
{
  "verification_type": "identity|background_check|skills_assessment",
  "status": "approved|rejected|requires_additional_docs",
  "notes": "All documents verified successfully",
  "verified_by": "admin_123"
}
```

#### 3.2 Suspend/Activate Vigil
```http
PUT /api/v1/admin/vigils/{vigilId}/suspend
```
**Body:**
```json
{
  "action": "suspend|activate|permanent_ban",
  "reason": "Violation of terms",
  "duration_days": 30,
  "notify_user": true
}
```

#### 3.3 Vigil Performance Report
```http
GET /api/v1/admin/vigils/{vigilId}/performance
```
**Response:**
```json
{
  "data": {
    "overall_rating": 4.8,
    "total_services": 45,
    "completion_rate": 98.5,
    "response_time_avg": 15,
    "customer_feedback": {
      "positive": 42,
      "neutral": 2,
      "negative": 1
    },
    "earnings": {
      "total": 2340.00,
      "current_month": 450.00
    },
    "reliability_score": 95.2
  }
}
```

#### 3.4 Bulk Vigil Actions
```http
POST /api/v1/admin/vigils/bulk-actions
```
**Body:**
```json
{
  "vigil_ids": ["vigil_1", "vigil_2"],
  "action": "verify|suspend|send_notification|update_status",
  "data": {
    "status": "verified",
    "message": "Welcome to the platform!"
  }
}
```

### 4. Consumers API - Gestione Clienti

#### 4.1 Get All Consumers
```http
GET /api/v1/admin/consumers
```
**Parametri Query:**
- `status` (string): "active|suspended|pending_verification"
- `sort` (string): "created_date|total_spent|last_booking"
- `page` (number): Numero pagina
- `limit` (number): Elementi per pagina

#### 4.2 Get Consumer Details
```http
GET /api/v1/admin/consumers/{consumerId}
```
**Response:**
```json
{
  "data": {
    "id": "consumer_123",
    "name": "Mario Rossi",
    "email": "mario@email.com",
    "phone": "+39 123 456 7890",
    "status": "active",
    "total_bookings": 15,
    "total_spent": 1800.00,
    "avg_rating_given": 4.6,
    "registration_date": "2024-12-15",
    "last_booking": "2025-07-15",
    "payment_methods": ["visa_1234", "paypal"],
    "preferences": {
      "preferred_vigil_type": "residential",
      "communication_channel": "email"
    }
  }
}
```

#### 4.3 Update Consumer Status
```http
PUT /api/v1/admin/consumers/{consumerId}/status
```
**Body:**
```json
{
  "status": "active|suspended|banned",
  "reason": "Inappropriate behavior",
  "duration_days": 7,
  "notify_user": true
}
```

#### 4.4 Consumer Activity Report
```http
GET /api/v1/admin/consumers/activity-report
```
**Response:**
```json
{
  "data": {
    "total_consumers": 523,
    "active_consumers": 456,
    "new_this_month": 23,
    "churned_this_month": 5,
    "top_spenders": [
      {
        "consumer_id": "consumer_123",
        "name": "Mario Rossi",
        "total_spent": 2400.00
      }
    ],
    "activity_trends": {
      "daily_active_users": 45,
      "weekly_active_users": 156,
      "monthly_active_users": 234
    }
  }
}
```

### 5. Services API - Gestione Completa

#### 5.1 Approve Service
```http
POST /api/v1/admin/services/{serviceId}/approve
```
**Body:**
```json
{
  "status": "approved|rejected|requires_modification",
  "feedback": "Service meets all quality standards",
  "approved_by": "admin_123"
}
```

#### 5.2 Feature Service
```http
PUT /api/v1/admin/services/{serviceId}/featured
```
**Body:**
```json
{
  "featured": true,
  "featured_until": "2025-12-31T23:59:59Z",
  "featured_position": 1,
  "reason": "High quality service with excellent reviews"
}
```

#### 5.3 Service Moderation Queue
```http
GET /api/v1/admin/services/moderation-queue
```
**Response:**
```json
{
  "data": [
    {
      "service_id": "service_123",
      "name": "Vigilanza Notturna Premium",
      "vigil_name": "Luca Bianchi",
      "submitted_date": "2025-07-15T10:00:00Z",
      "status": "pending_review",
      "flags": ["price_unusual", "description_vague"],
      "priority": "high"
    }
  ]
}
```

### 6. Payments API - Sistema Finanziario

#### 6.1 Process Refund
```http
POST /api/v1/admin/payments/{paymentId}/refund
```
**Body:**
```json
{
  "amount": 120.00,
  "reason": "Service cancelled by provider",
  "refund_type": "full|partial",
  "notify_customer": true
}
```

#### 6.2 Payment Reconciliation
```http
GET /api/v1/admin/payments/reconciliation
```
**Parametri Query:**
- `date` (string): Data per riconciliazione
- `provider` (string): "stripe|paypal|all"

**Response:**
```json
{
  "data": {
    "date": "2025-07-15",
    "total_transactions": 45,
    "total_amount": 5400.00,
    "platform_commission": 540.00,
    "vigil_earnings": 4860.00,
    "pending_payouts": 2300.00,
    "discrepancies": []
  }
}
```

#### 6.3 Commission Report
```http
GET /api/v1/admin/payments/commission-report
```
**Response:**
```json
{
  "data": {
    "period": "2025-07",
    "total_commission": 2542.05,
    "commission_rate": 10.0,
    "breakdown_by_service": [
      {
        "service_category": "residential",
        "transactions": 25,
        "commission_earned": 1200.00
      }
    ],
    "payout_schedule": {
      "next_payout_date": "2025-08-01",
      "pending_amount": 2542.05
    }
  }
}
```

#### 6.4 Export Payments
```http
POST /api/v1/admin/payments/export
```
**Body:**
```json
{
  "format": "excel|csv|pdf",
  "date_range": {
    "start": "2025-07-01",
    "end": "2025-07-31"
  },
  "include_refunds": true,
  "group_by": "date|vigil|service_type"
}
```

### 7. User Management API - Sistema Utenti

#### 7.1 Get All Users
```http
GET /api/v1/admin/users
```
**Parametri Query:**
- `role` (string): "consumer|vigil|admin"
- `status` (string): "active|suspended|banned"
- `search` (string): Cerca per nome/email

#### 7.2 Update User Role
```http
PUT /api/v1/admin/users/{userId}/role
```
**Body:**
```json
{
  "new_role": "admin|vigil|consumer",
  "reason": "Promotion to admin role",
  "effective_date": "2025-07-20T00:00:00Z"
}
```

#### 7.3 Suspend User
```http
POST /api/v1/admin/users/{userId}/suspend
```
**Body:**
```json
{
  "reason": "Terms violation",
  "duration_days": 30,
  "notify_user": true,
  "block_new_registrations": false
}
```

#### 7.4 User Audit Log
```http
GET /api/v1/admin/users/audit-log
```
**Response:**
```json
{
  "data": [
    {
      "timestamp": "2025-07-15T10:30:00Z",
      "user_id": "user_123",
      "action": "role_change",
      "performed_by": "admin_456",
      "details": {
        "from_role": "vigil",
        "to_role": "admin"
      },
      "ip_address": "192.168.1.1"
    }
  ]
}
```

### 8. System Administration API

#### 8.1 System Health Check
```http
GET /api/v1/admin/system/health
```
**Response:**
```json
{
  "data": {
    "status": "healthy",
    "services": {
      "database": "online",
      "payment_gateway": "online",
      "email_service": "degraded",
      "file_storage": "online"
    },
    "metrics": {
      "response_time_avg": 120,
      "error_rate": 0.02,
      "uptime": 99.9
    },
    "alerts": [
      {
        "level": "warning",
        "message": "Email service response time elevated"
      }
    ]
  }
}
```

#### 8.2 System Logs
```http
GET /api/v1/admin/system/logs
```
**Parametri Query:**
- `level` (string): "error|warning|info|debug"
- `service` (string): Nome del servizio
- `limit` (number): Numero di log da restituire

#### 8.3 Create System Backup
```http
POST /api/v1/admin/system/backup
```
**Body:**
```json
{
  "backup_type": "full|incremental|database_only",
  "include_files": true,
  "schedule_time": "2025-07-20T02:00:00Z"
}
```

#### 8.4 System Metrics
```http
GET /api/v1/admin/system/metrics
```
**Response:**
```json
{
  "data": {
    "server_metrics": {
      "cpu_usage": 45.2,
      "memory_usage": 67.8,
      "disk_usage": 34.1
    },
    "application_metrics": {
      "active_sessions": 156,
      "requests_per_minute": 234,
      "cache_hit_rate": 87.3
    },
    "business_metrics": {
      "active_bookings": 45,
      "online_vigils": 23,
      "pending_payments": 12
    }
  }
}
```

### 9. Notification & Communication API

#### 9.1 Send Bulk Notifications
```http
POST /api/v1/admin/notifications/send-bulk
```
**Body:**
```json
{
  "recipients": {
    "type": "all|vigils|consumers|specific_users",
    "user_ids": ["user_1", "user_2"],
    "filters": {
      "location": "Milano",
      "user_type": "vigil"
    }
  },
  "message": {
    "title": "Platform Update",
    "body": "We've improved our matching algorithm",
    "channels": ["email", "push", "in_app"]
  },
  "schedule_time": "2025-07-20T10:00:00Z"
}
```

#### 9.2 Email Templates Management
```http
GET /api/v1/admin/notifications/templates
POST /api/v1/admin/notifications/templates
PUT /api/v1/admin/notifications/templates/{templateId}
```

---

## 🏗️ Implementazione Suggerita

### Priorità di Sviluppo:

**Alta Priorità (P0):**
1. User Management API completo
2. Advanced Analytics (revenue breakdown, user behavior)
3. Booking conflict detection
4. Payment reconciliation

**Media Priorità (P1):**
5. Vigil verification system
6. Service moderation queue
7. System health monitoring
8. Bulk operations

**Bassa Priorità (P2):**
9. Advanced export features
10. Notification templates
11. Geographic analytics
12. System backup API

### Note Tecniche:

- Tutte le API devono supportare paginazione per liste grandi
- Implementare rate limiting per proteggere da abusi
- Aggiungere logging dettagliato per audit trail
- Considerare cache Redis per dati frequentemente acceduti
- Implementare webhook per notifiche real-time agli admin

### Sicurezza:

- Tutte le API admin richiedono autenticazione JWT
- Implementare RBAC (Role-Based Access Control)
- Log tutte le azioni amministrative
- Rate limiting aggressivo per API sensibili
- Validazione input rigorosa per prevenire injection attacks

---

## 📊 Impatto Stimato

L'implementazione completa di queste API permetterà:

- **Gestione completa** della piattaforma tramite dashboard admin
- **Monitoraggio real-time** delle performance e metriche business
- **Automazione** di processi amministrativi complessi
- **Scalabilità** per gestire migliaia di utenti e transazioni
- **Compliance** con requisiti di audit e reporting
