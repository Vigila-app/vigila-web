# Notice Board - Feature Documentation

## Overview

The Notice Board (Bacheca Annunci) is a feature that bridges demand and supply in areas where no Vigil is yet registered. When a consumer searches for a service and no Vigil is active in their zone, they can leave a request on the notice board. Vigils whose covered postal codes include that zone can see these requests and propose themselves, triggering a booking flow that keeps all communication and payments inside the platform.

The feature has three main actors:
- **Consumer (unauthenticated)**: submits a service request from the landing page search section
- **VIGIL (authenticated)**: browses requests in their covered zones ("Bacheca") and proposes for them
- **Platform**: receives the proposal, creates a pending booking, and notifies the consumer by email

---

## Key Concepts

### 1. Notice (Annuncio)
A notice is a service request created by a consumer. It stores the consumer's contact details, the requested service type, the postal code, and an optional message. The notice lifecycle is:
- `active` — visible to VIGILs in the covered zone, awaiting a proposal
- `proposed` — a VIGIL has proposed; a pending booking has been created
- `closed` — the booking is confirmed or the request is no longer relevant

### 2. Zone Filtering
Each VIGIL has a `cap` array in their profile (postal codes of the zones they cover). The notice board GET API filters notices using `.in("postal_code", vigilCaps)`, so each VIGIL only sees requests from their covered zones. If a VIGIL has no postal codes configured, no notices are returned.

### 3. Anti-Disintermediation
VIGILs cannot see or contact the consumer directly. The `email` and `phone` fields are omitted entirely from the notice listing API response (set to `undefined`). All communication is handled through the platform's email notification and booking flow.

### 4. PENDING_NOTICE_PROPOSAL Booking
When a VIGIL proposes, the API creates a booking with status `PENDING_NOTICE_PROPOSAL` (a dedicated `BookingStatusEnum` value). This is distinct from a standard `PENDING` booking and is used to identify notice-board-originated bookings without relying on fragile `consumer_id === null` checks.

### 5. Consent
Before submitting a notice, the consumer must check a consent checkbox authorizing Vigila to use their contact details to connect them with an available Vigil.

---

## Architecture

### Database Layer

**`notice_board` table** (see `.github/database/schema.database.md`):

| Field | Type | Notes |
|---|---|---|
| `id` | uuid PK | Auto-generated |
| `created_at` | timestamptz | Auto-generated |
| `updated_at` | timestamptz | Auto-updated via trigger |
| `name` | text | **Required** |
| `email` | text | **Required** – used to notify on proposal |
| `phone` | text | Optional |
| `message` | text | Optional |
| `postal_code` | text | **Required** |
| `city` | text | Optional |
| `service_type` | text | **Required** – one of `ServiceCatalogTypeEnum` values |
| `status` | text | `active` / `proposed` / `closed` (default: `active`) |
| `vigil_id` | uuid FK → `vigils.id` | Set on proposal |
| `booking_id` | uuid FK → `bookings.id` | Set on proposal |

**`search_analytics` table**: Records every public homepage search (postal code, city, coordinates) for demand analysis. No auth required for inserts.

**`search_analytics` table**:

| Field | Type | Notes |
|---|---|---|
| `id` | uuid PK | Auto-generated |
| `created_at` | timestamptz | Auto-generated |
| `postal_code` | text | Searched postal code |
| `city` | text | Searched city name |
| `lat` | numeric | Latitude from geocoding |
| `lon` | numeric | Longitude from geocoding |

**Row Level Security**:
- Insert: public (protected by Altcha at API level)
- Select/Update: service role only (admin client)

### API Layer

All routes live under `app/api/v1/notice-board/`.

### Service Layer

`src/services/notice-board.service.ts` — `NoticeBoardService`

### UI Components

- `components/landing/LandingSearchSection.tsx` — public search + notice board creation form
- `components/notice-board/NoticeBoardVigil.tsx` — VIGIL dashboard notice list
- `app/vigil/user/bacheca/page.tsx` — VIGIL page that renders `NoticeBoardVigil`

### Email

- `components/email/NoticeBoardProposalEmailTemplate.tsx` — dedicated React email template
- `EmailService.sendNoticeBoardProposalEmail()` — service method

---

## API Endpoints

### Public — Create a Notice

#### `POST /api/v1/notice-board`

Creates a new service request. Protected by Altcha invisible captcha (resolved client-side before the request is sent).

**Authentication**: None (public)

**Request Body**:
```json
{
  "name": "Mario Rossi",
  "email": "mario@example.com",
  "phone": "+39 333 1234567",
  "message": "Cerco assistenza per 3 ore al mattino",
  "postal_code": "20100",
  "city": "Milano",
  "service_type": "light_assistance"
}
```

**Required fields**: `name`, `email`, `postal_code`, `service_type`
**Optional fields**: `phone`, `message`, `city`

**Validations**:
- `service_type` must be one of the values in `ServiceCatalogTypeEnum` (`companionship`, `light_assistance`, `medical_assistance`, `house_keeping`, `transportation`, `specialized_care`)

**Response `201`**:
```json
{
  "code": "NOTICE_BOARD_SUCCESS",
  "success": true,
  "data": { "id": "uuid", "status": "active", ... }
}
```

**Error responses**:
- `400` — missing required fields or invalid `service_type`
- `500` — database error

---

### VIGIL — List Notices in Covered Zones

#### `GET /api/v1/notice-board`

Returns a paginated list of `active` notices whose `postal_code` is in the authenticated VIGIL's `cap` array. Contact details (`email`, `phone`) are redacted.

**Authentication**: Required (VIGIL role)

**Query Parameters**:
| Param | Default | Description |
|---|---|---|
| `page` | `1` | Page number |
| `itemPerPage` | `10` | Items per page |

**Response `200`**:
```json
{
  "code": "NOTICE_BOARD_SUCCESS",
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Mario Rossi",
      "postal_code": "20100",
      "city": "Milano",
      "service_type": "light_assistance",
      "message": "...",
      "status": "active",
      "created_at": "2024-01-15T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "pages": 3,
    "itemPerPage": 10,
    "count": 27
  }
}
```

**Early exit**: If the VIGIL's `cap` array is empty, the API returns immediately with `data: [], count: 0` without executing further queries.

---

### VIGIL — Get Notice Details

#### `GET /api/v1/notice-board/[noticeId]`

Retrieves full notice details for a specific notice.

**Authentication**: Required (any authenticated user)

**Response `200`**:
```json
{
  "code": "NOTICE_BOARD_SUCCESS",
  "success": true,
  "data": { "id": "uuid", "name": "...", "email": "...", ... }
}
```

**Error responses**:
- `400` — missing `noticeId`
- `401` — unauthenticated
- `404` — notice not found

---

### VIGIL — Propose for a Notice

#### `POST /api/v1/notice-board/[noticeId]`

Called when a VIGIL clicks "Proponiti per questo servizio". Executes the full anti-disintermediation flow described below.

**Authentication**: Required (VIGIL role)

**Request Body**: Empty `{}`

**Response `200`**:
```json
{
  "code": "NOTICE_BOARD_SUCCESS",
  "success": true,
  "message": "Proposta inviata con successo"
}
```

**Error responses**:
- `400` — missing `noticeId`
- `401` — unauthenticated or not VIGIL
- `404` — notice not found or no longer `active`
- `500` — booking creation failed or service not found in catalog

---

## Consumer Flow (Landing Page)

```
1. Consumer visits the homepage (unauthenticated)
2. Types a city or postal code in the search bar
   - Altcha floating widget auto-solves in the background
   - Suggestions come from the Google Maps autocomplete
3. Selects an address → "Cerca" button activates
4. Click "Cerca" → POST /api/v1/matching (checks for Vigils in the zone)

   a) Vigils found → service cards displayed → standard booking flow
   b) No Vigils found → notice board form displayed

5. (b) Consumer fills the form:
   - Name (required)
   - Email (required)
   - Phone (optional)
   - Service type — dropdown from ServiceCatalog (required)
   - Message (optional)
   - Consent checkbox (required)
6. Submit → POST /api/v1/notice-board
7. Success screen shown: "Riceverai una email quando un Vigil si propone"
```

**State machine** (`LandingSearchSection`):
- `idle` — search input form
- `loading` — search in progress
- `found` — services available, show results
- `not_found` — no services, show notice board form
- `submitted` — notice created successfully
- `error` — something went wrong

---

## VIGIL Flow (Bacheca)

```
1. VIGIL logs in and navigates to "Bacheca" (/vigil/user/bacheca)
2. GET /api/v1/notice-board fetches active notices in VIGIL's CAP zones
3. VIGIL browses paginated list, sees: name, service type, zone, date
4. Click "Proponiti per questo servizio"
5. POST /api/v1/notice-board/[noticeId] executes the proposal flow:
   a) Notice is fetched (must be "active")
   b) VIGIL's matching service looked up via type + vigil_id
   c) Booking created with status PENDING_NOTICE_PROPOSAL
   d) Notice updated: status → "proposed", vigil_id set, booking_id set
   e) Email sent to notice.email (NoticeBoardProposalEmailTemplate)
6. Button replaced with "Proposta inviata! ✓" confirmation
```

---

## Booking Creation on Proposal

When a VIGIL proposes, the system creates a booking automatically:

| Field | Value |
|---|---|
| `vigil_id` | Proposing VIGIL's ID |
| `service_id` | VIGIL's active service matching `notice.service_type` |
| `consumer_id` | `null` (not yet known — consumer has not registered) |
| `status` | `PENDING_NOTICE_PROPOSAL` |
| `payment_status` | `PENDING` |
| `startDate` | 7 days from proposal date (placeholder) |
| `endDate` | `startDate + catalog.minimum_duration_hours` |
| `quantity` | `catalog.minimum_duration_hours` (default 1) |
| `price` | `(vigil_unit_price OR catalog.min_hourly_rate + catalog.fee) * quantity` |
| `fee` | `catalog.fee * quantity` |
| `note` | `"Annuncio: <noticeId>"` |
| `notice_id` | ID of the originating notice |

The `PENDING_NOTICE_PROPOSAL` status is a dedicated variant of `BookingStatusEnum` that:
- Is accessible by an unauthenticated consumer via `verifyBookingAccess`
- Shares the same allowed payment transitions as `PENDING` in the payment route
- Makes notice-board bookings unambiguously identifiable without checking `consumer_id === null`

---

## Email Notification (NoticeBoardProposalEmailTemplate)

Sent to the notice creator when a VIGIL proposes.

**Subject**: `[Aggiornamento] un Vigil è disponibile per la tua richiesta a {zone}!`

**Content**:
- Greeting and VIGIL availability announcement
- Service label and zone
- Step-by-step instructions to complete the booking
- Benefits: review details, choose dates, secure payment

**CTAs**:
- Primary: "Registrati e completa la prenotazione" → `{hostUrl}/auth/registration/consumer?redirectAuthTo=/bookings/{bookingId}`
- Secondary: "Hai già un account? Accedi direttamente" → `{hostUrl}/auth/login?redirectAuthTo=/bookings/{bookingId}`

Both links carry `redirectAuthTo` so the consumer lands directly on the pending booking after authenticating, enabling them to review, confirm, and pay.

---

## Type Definitions

```typescript
// src/types/notice-board.types.ts
type NoticeBoardI = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message?: string;
  postal_code: string;
  city?: string;
  service_type: string;
  status: "active" | "proposed" | "closed";
  vigil_id?: string;
  created_at: Date;
  updated_at?: Date;
};

type NoticeBoardFormI = {
  name: string;
  email: string;
  phone?: string;
  message?: string;
  postal_code: string;
  city?: string;
  service_type: ServiceCatalogTypeEnum;
};

// src/types/email.types.ts
type NoticeBoardProposalEmailDataI = {
  to: string;
  recipientName: string;
  vigilName: string;
  serviceLabel: string;
  zone: string;
  registrationUrl: string;
  loginUrl: string;
};
```

---

## Service Layer

```typescript
// src/services/notice-board.service.ts
NoticeBoardService.createNotice(notice: NoticeBoardFormI)         // POST - public
NoticeBoardService.getNotices(params?)                            // GET - VIGIL
NoticeBoardService.getNoticeDetails(noticeId: string)             // GET - authenticated
NoticeBoardService.proposeForNotice(noticeId: string)             // POST - VIGIL
```

---

## Response Codes

| Constant | Meaning |
|---|---|
| `NOTICE_BOARD_SUCCESS` | Operation succeeded |
| `NOTICE_BOARD_ERROR` | Unexpected server error |
| `NOTICE_BOARD_BAD_REQUEST` | Validation failure or resource not found |
| `NOTICE_BOARD_UNAUTHORIZED` | Missing or invalid authentication |
| `NOTICE_BOARD_METHOD_NOT_ALLOWED` | HTTP method not supported |

---

## Security

- **Altcha invisible captcha**: All public-facing endpoints (notice creation, public search) are protected by an invisible floating Altcha widget that auto-resolves in the background. The consumer never interacts with a challenge.
- **Anti-disintermediation**: The VIGIL listing API (`GET /api/v1/notice-board`) strips `email` and `phone` from every notice before returning the response. VIGILs can only interact with consumers through the platform booking flow.
- **Row Level Security**: Direct database access to `notice_board` is restricted to the service role; all reads and writes go through the API with the admin client.
- **Role enforcement**: The propose endpoint checks that the caller is authenticated and holds the `VIGIL` role.
