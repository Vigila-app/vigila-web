# Copilot Instructions Vigila App Database Schema (SQL Structure)

> **Purpose**: This document describes the logical structure of the database and is intended to be used as **context for AI agents**.
> It is **not** meant to be executed directly.

---

## Overview

The system models a **caregiving services marketplace** where:

* **Consumers** book services
* **Vigils** provide services
* **Bookings** track service usage
* **Reviews** are linked one-to-one with bookings
* **Wallets** and **wallet transactions** manage payments and balances

---

## Tables

### 1. `consumers`

Represents end users who book services.

**Primary Key**: `id`

**Fields**:

* `id` (uuid, PK)
* `created_at` (timestamptz)
* `updated_at` (timestamptz)
* `status` (text, default: `active`)
* `displayName` (text)
* `birthdate` (text)
* `city` (text)
* `cap` (text)
* `yourName` (text)
* `lovedOneName` (text)
* `lovedOneAge` (text)
* `relationship` (text)
* `lovedOneBirthday` (text)
* `lovedOnePhone` (text)
* `information` (text)
* `address` (jsonb)

**Relationships**:

* One consumer → many `bookings`
* One consumer → many `wallet_transactions`
* One consumer → one `wallet`
* One consumer → one `consumers-data`

---

### 2. `consumers-data`

Extension table for consumer onboarding information.

**Primary Key**: `id`

**Foreign Keys**:

* `consumer_id` → `consumers.id`

**Fields**:

* `id` (uuid, PK)
* `consumer_id` (uuid, FK)
* `created_at` (timestamptz)
* `updated_at` (timestamptz)
* `autonomy` (text)
* `needs` (text[], variable-length multidimensional array)
* `gender-preference` (text)
* `attitude` (text[], variable-length multidimensional array)
* `qualifications` (text)
* `transportation` (text)
* `experience` (text)

**Relationships**:

* One consumers-data → one `consumer`

---

### 3. `vigils`

Represents service providers.

**Primary Key**: `id`

**Fields**:

* `id` (uuid, PK)
* `created_at` (timestamptz)
* `updated_at` (timestamptz)
* `status` (text, default: `active`)
* `displayName` (text)
* `birthday` (text)
* `cap` (array)
* `occupation` (text)
* `transportation` (text)
* `addresses` (json)
* `phone` (text)
* `information` (text)
* `verified` (boolean, default: `false`)
* `wideAreaCoverage` (text)

**Relationships**:

* One vigil → many `services`
* One vigil → many `bookings`
* One vigil → many `reviews`

---

### 4. `services`

Defines services offered by vigils.

**Primary Key**: `id`

**Foreign Keys**:

* `vigil_id` → `vigils.id`

**Fields**:

* `id` (uuid, PK)
* `created_at` (timestamptz)
* `updated_at` (timestamp)
* `vigil_id` (uuid, FK)
* `name` (text)
* `description` (text)
* `unit_price` (numeric)
* `min_unit` (numeric, default: 1)
* `max_unit` (numeric, nullable)
* `unit_type` (text)
* `currency` (text, default: `EUR`)
* `type` (text)
* `active` (boolean, default: true)
* `info` (json)
* `postalCode` (array)

**Relationships**:

* One service → many `bookings`

---

### 5. `bookings`

Represents a service booking made by a consumer.

**Primary Key**: `id`

**Foreign Keys**:

* `consumer_id` → `consumers.id`
* `vigil_id` → `vigils.id`
* `service_id` → `services.id`

**Fields**:

* `id` (uuid, PK)
* `created_at` (timestamptz)
* `updated_at` (timestamptz)
* `consumer_id` (uuid)
* `vigil_id` (uuid)
* `service_id` (uuid)
* `startDate` (timestamptz)
* `endDate` (timestamptz)
* `quantity` (numeric)
* `price` (numeric)
* `fee` (numeric, default: 0)
* `status` (text, default: `pending`)
* `payment_status` (text, default: `pending`)
* `payment_method` (text)
* `payment_id` (text)
* `address` (text)
* `note` (text)
* `extras` (array)

**Relationships**:

* One booking → one `review`

---

### 6. `reviews`

Stores feedback left after a booking.

**Primary Key**: `id`

**Constraints**:

* One-to-one with `bookings` (unique `booking_id`)

**Foreign Keys**:

* `booking_id` → `bookings.id`
* `consumer_id` → `consumers.id`
* `vigil_id` → `vigils.id`

**Fields**:

* `id` (uuid, PK)
* `created_at` (timestamptz)
* `updated_at` (timestamptz)
* `booking_id` (uuid, unique)
* `consumer_id` (uuid)
* `vigil_id` (uuid)
* `rating` (smallint)
* `comment` (text)
* `visible` (boolean, default: true)

---

### 7. `wallets`

Tracks balances for consumers.

**Primary Key**: `id`

**Foreign Keys**:

* `user_id` → `consumers.id`

**Fields**:

* `id` (uuid, PK)
* `created_at` (timestamptz)
* `user_id` (uuid)
* `currency` (text)
* `balance_cents` (bigint, default: 0)
* `total_spent` (bigint, default: 0)
* `total_deposited` (bigint, default: 0)

**Relationships**:

* One wallet → many `wallet_transactions`

---

### 8. `wallet_transactions`

Represents money movements within wallets.

**Primary Key**: `id`

**Foreign Keys**:

* `wallet_id` → `wallets.id`
* `user_id` → `consumers.id`

**Fields**:

* `id` (uuid, PK)
* `wallet_id` (uuid)
* `user_id` (uuid)
* `stripe_payment_id` (text, unique)
* `amount` (bigint)
* `currency` (text)
* `status` (text, default: `pending`)
* `type` (text)
* `description` (text)
* `created_at` (timestamp)

---

## Key Relationships Summary

* **Consumer → Booking**: one-to-many
* **Consumer → Consumers-Data**: one-to-one
* **Vigil → Service**: one-to-many
* **Service → Booking**: one-to-many
* **Booking → Review**: one-to-one
* **Consumer → Wallet**: one-to-one
* **Wallet → Wallet Transactions**: one-to-many

---

## Notes for AI Agents

* UUIDs are used universally as identifiers
* Monetary values are stored as `numeric` or `bigint` (cents)
* Status fields are string-based enums (no DB-level enum enforcement)
* JSON / JSONB fields are used for flexible, semi-structured data
* Referential integrity is enforced via foreign keys
