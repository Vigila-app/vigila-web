# Copilot Instructions Vigila App Database Schema (SQL Structure)

> **Purpose**: This document describes the logical structure of the database and is intended to be used as **context for AI agents**.
> It is **not** meant to be executed directly.

---

## Overview

The system models a **caregiving services marketplace** where:

- **Consumers** book services
- **Vigils** provide services
- **Bookings** track service usage
- **Reviews** are linked one-to-one with bookings
- **Wallets** and **wallet transactions** manage payments and balances
- **Calendar & Availability** system manages vigil schedules and slot availability

---

## Tables

### 1. `consumers`

Represents end users who book services.

**Primary Key**: `id`

**Fields**:

- `id` (uuid, PK)
- `created_at` (timestamptz)
- `updated_at` (timestamptz)
- `status` (text, default: `active`)
- `displayName` (text)
- `birthdate` (text)
- `city` (text)
- `cap` (text)
- `yourName` (text)
- `lovedOneName` (text)
- `lovedOneAge` (text)
- `relationship` (text)
- `lovedOneBirthday` (text)
- `lovedOnePhone` (text)
- `information` (text)
- `address` (jsonb)

**Relationships**:

- One consumer → many `bookings`
- One consumer → many `wallet_transactions`
- One consumer → one `wallet`
- One consumer → one `consumers-data`

---

### 2. `consumers-data`

Extension table for consumer onboarding information.

**Primary Key**: `id`

**Foreign Keys**:

- `consumer_id` → `consumers.id`

**Fields**:

- `id` (uuid, PK)
- `consumer_id` (uuid, FK)
- `created_at` (timestamptz)
- `updated_at` (timestamptz)
- `autonomy` (text)
- `needs` (text[], variable-length multidimensional array)
- `gender_preference` (text)
- `attitude` (text[], variable-length multidimensional array)
- `qualifications` (text)
- `transportation` (text)
- `experience` (text)

**Relationships**:

- One consumers-data → one `consumer`

---

### 3. `vigils`

Represents service providers.

**Primary Key**: `id`

**Fields**:

- `id` (uuid, PK)
- `created_at` (timestamptz)
- `updated_at` (timestamptz)
- `status` (text, default: `active`)
- `displayName` (text)
- `birthday` (text)
- `cap` (array)
- `occupation` (text)
- `transportation` (text)
- `addresses` (json)
- `phone` (text)
- `information` (text)
- `verified` (boolean, default: `false`)
- `wideAreaCoverage` (text)

**Relationships**:

- One vigil → many `services`
- One vigil → many `bookings`
- One vigil → many `reviews`

---

### 4. `services`

Defines services offered by vigils.

**Primary Key**: `id`

**Foreign Keys**:

- `vigil_id` → `vigils.id`

**Fields**:

- `id` (uuid, PK)
- `created_at` (timestamptz)
- `updated_at` (timestamp)
- `vigil_id` (uuid, FK)
- `name` (text)
- `description` (text)
- `unit_price` (numeric)
- `min_unit` (numeric, default: 1)
- `max_unit` (numeric, nullable)
- `unit_type` (text)
- `currency` (text, default: `EUR`)
- `type` (text)
- `active` (boolean, default: true)
- `info` (json)
- `postalCode` (array)

**Relationships**:

- One service → many `bookings`

---

### 5. `bookings`

Represents a service booking made by a consumer.

**Primary Key**: `id`

**Foreign Keys**:

- `consumer_id` → `consumers.id`
- `vigil_id` → `vigils.id`
- `service_id` → `services.id`

**Fields**:

- `id` (uuid, PK)
- `created_at` (timestamptz)
- `updated_at` (timestamptz)
- `consumer_id` (uuid)
- `vigil_id` (uuid)
- `service_id` (uuid)
- `startDate` (timestamptz)
- `endDate` (timestamptz)
- `quantity` (numeric)
- `price` (numeric)
- `fee` (numeric, default: 0)
- `status` (text, default: `pending`)
- `payment_status` (text, default: `pending`)
- `payment_method` (text)
- `payment_id` (text)
- `address` (text)
- `note` (text)
- `extras` (array)

**Relationships**:

- One booking → one `review`

---

### 6. `reviews`

Stores feedback left after a booking.

**Primary Key**: `id`

**Constraints**:

- One-to-one with `bookings` (unique `booking_id`)

**Foreign Keys**:

- `booking_id` → `bookings.id`
- `consumer_id` → `consumers.id`
- `vigil_id` → `vigils.id`

**Fields**:

- `id` (uuid, PK)
- `created_at` (timestamptz)
- `updated_at` (timestamptz)
- `booking_id` (uuid, unique)
- `consumer_id` (uuid)
- `vigil_id` (uuid)
- `rating` (smallint)
- `comment` (text)
- `visible` (boolean, default: true)

---

### 7. `wallets`

Tracks balances for consumers.

**Primary Key**: `id`

**Foreign Keys**:

- `user_id` → `consumers.id`

**Fields**:

- `id` (uuid, PK)
- `created_at` (timestamptz)
- `user_id` (uuid)
- `currency` (text)
- `balance_cents` (bigint, default: 0)
- `total_spent` (bigint, default: 0)
- `total_deposited` (bigint, default: 0)

**Relationships**:

- One wallet → many `wallet_transactions`

---

### 8. `wallet_transactions`

Represents money movements within wallets.

**Primary Key**: `id`

**Foreign Keys**:

- `wallet_id` → `wallets.id`
- `user_id` → `consumers.id`

**Fields**:

- `id` (uuid, PK)
- `wallet_id` (uuid)
- `user_id` (uuid)
- `stripe_payment_id` (text, unique)
- `amount` (bigint)
- `currency` (text)
- `status` (text, default: `pending`)
- `type` (text)
- `description` (text)
- `created_at` (timestamp)

---

### 8. `notice_board`

Collects service requests from users in areas not yet covered by existing services. Visible to VIGIL users (filtered to their covered postal codes).

**Primary Key**: `id`

**Fields**:

- `id` (uuid, PK)
- `created_at` (timestamptz)
- `updated_at` (timestamptz)
- `name` (text, required)
- `email` (text, **required** — used to notify the user when a VIGIL proposes)
- `phone` (text)
- `message` (text, optional)
- `postal_code` (text, required)
- `city` (text)
- `service_type` (text, **required** — must be one of `ServiceCatalogTypeEnum` values: `companionship`, `light_assistance`, `medical_assistance`, `house_keeping`, `transportation`, `specialized_care`)
- `status` (text, default: `active`) — can be `active`, `proposed`, or `closed`
- `vigil_id` (uuid) — set when a VIGIL proposes for this notice

**Access**:

- **Write (public)**: Anyone (protected by Altcha captcha)
- **Read (authenticated)**: VIGIL role only, filtered to notices whose `postal_code` is in the VIGIL's `cap` array

**Propose flow**: When a VIGIL proposes via `POST /api/v1/notice-board/[noticeId]`, the notice `status` is updated to `proposed`, `vigil_id` is set, and an email is sent to `notice.email` inviting the user to register and complete the booking on the platform.

---

### 9. `search_analytics`

Tracks public homepage search requests for statistical analysis of service demand by area.

**Primary Key**: `id`

**Fields**:

- `id` (uuid, PK)
- `created_at` (timestamptz)
- `postal_code` (text)
- `city` (text)
- `lat` (numeric)
- `lon` (numeric)

**Access**:

- **Write (public)**: Recorded automatically on each search (no auth required)
- **Read**: Admin only

---

### 10. `vigil_availability_rules`

Stores weekly recurring availability patterns for Vigils.

**Primary Key**: `id`

**Foreign Keys**:

- `vigil_id` → `vigils.id`

**Fields**:

- `id` (uuid, PK)
- `created_at` (timestamptz)
- `updated_at` (timestamptz)
- `vigil_id` (uuid, FK)
- `weekday` (smallint, 0-6, where 0=Sunday)
- `start_time` (smallint, 0-23)
- `end_time` (smallint, 1-24)
- `valid_from` (date)
- `valid_to` (date, nullable)

**Relationships**:

- One vigil → many `vigil_availability_rules`

**Constraints**:

- `weekday` must be between 0 and 6
- `start_time` must be between 0 and 23
- `end_time` must be between 1 and 24
- `end_time` must be greater than `start_time`
- If `valid_to` is set, it must be >= `valid_from`

---

### 11. `vigil_unavailabilities`

Stores specific date/time ranges when a Vigil is unavailable (overrides availability rules).

**Primary Key**: `id`

**Foreign Keys**:

- `vigil_id` → `vigils.id`

**Fields**:

- `id` (uuid, PK)
- `created_at` (timestamptz)
- `updated_at` (timestamptz)
- `vigil_id` (uuid, FK)
- `start_at` (timestamptz)
- `end_at` (timestamptz)
- `reason` (text, nullable)

**Relationships**:

- One vigil → many `vigil_unavailabilities`

**Constraints**:

- `end_at` must be greater than `start_at`

---

## Key Relationships Summary

- **Consumer → Booking**: one-to-many
- **Consumer → Consumers-Data**: one-to-one
- **Vigil → Service**: one-to-many
- **Vigil → Availability Rules**: one-to-many
- **Vigil → Unavailabilities**: one-to-many
- **Service → Booking**: one-to-many
- **Booking → Review**: one-to-one
- **Consumer → Wallet**: one-to-one
- **Wallet → Wallet Transactions**: one-to-many

---

### 8. `partner_waitlist`

Stores waitlist submissions from potential partners (CAF, clinics, etc.).

**Primary Key**: `id`

**Fields**:

- `id` (uuid, PK, default: `gen_random_uuid()`)
- `created_at` (timestamptz, default: `now()`)
- `type` (text) — partner category, e.g. `caf` or `cliniche`
- `data` (jsonb) — flexible JSON payload containing all form fields submitted by the partner

**Notes**: No foreign keys. The `data` column stores all variable form fields (name, email, phone, org details, services, etc.) as a single JSONB object, providing flexibility as form fields are added or removed without schema migrations.

---

## Notes for AI Agents

- UUIDs are used universally as identifiers
- Monetary values are stored as `numeric` or `bigint` (cents)
- Status fields are string-based enums (no DB-level enum enforcement)
- JSON / JSONB fields are used for flexible, semi-structured data
- Referential integrity is enforced via foreign keys
- **Calendar System**: All times are stored in UTC; slot granularity is 1 hour
- **Availability Priority**: Unavailabilities override availability rules; bookings always block slots
