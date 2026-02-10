# Calendar & Availability System - Implementation Summary

## Overview

This document provides a comprehensive summary of the Calendar & Availability System implementation for the Vigila platform. The system enables Vigils to manage their schedules and allows Consumers to view available time slots for booking services.

---

## 📁 Files Created/Modified

### Database
- `.github/database/calendar-migration.sql` - Complete SQL migration with tables, indexes, RLS policies
- `.github/database/schema.database.md` - Updated with new tables documentation

### TypeScript Types
- `src/types/calendar.types.ts` - Complete type definitions for calendar entities

### Services
- `src/services/calendar.service.ts` - Business logic and Availability Engine algorithm
- `src/services/index.ts` - Updated to export CalendarService

### API Routes
- `app/api/calendar/consumer/route.ts` - Consumer calendar view
- `app/api/calendar/vigil/bookings/route.ts` - Vigil calendar view
- `app/api/vigil/availability-rules/route.ts` - CRUD for availability rules
- `app/api/vigil/availability-rules/[ruleId]/route.ts` - Delete availability rule
- `app/api/vigil/unavailabilities/route.ts` - CRUD for unavailabilities
- `app/api/vigil/[vigilId]/available-slots/route.ts` - Availability Engine endpoint

### Documentation
- `.github/features/calendar.feature.md` - Complete feature documentation

---

## 🗄️ Database Schema

### `vigil_availability_rules`
Stores weekly recurring availability patterns (e.g., "Every Monday 9-17").

**Fields:**
- `id` (uuid, PK)
- `vigil_id` (uuid, FK → vigils)
- `weekday` (0-6, Sunday-Saturday)
- `start_time` (0-23)
- `end_time` (1-24)
- `valid_from` (date)
- `valid_to` (date, nullable)
- `created_at`, `updated_at`

**Indexes:**
- `idx_vigil_availability_rules_vigil_id` - Query by vigil
- `idx_vigil_availability_rules_dates` - Date range queries
- `idx_vigil_availability_rules_weekday` - Weekday lookups

### `vigil_unavailabilities`
Stores specific date/time blocks when Vigil is unavailable.

**Fields:**
- `id` (uuid, PK)
- `vigil_id` (uuid, FK → vigils)
- `start_at` (timestamptz)
- `end_at` (timestamptz)
- `reason` (text, nullable)
- `created_at`, `updated_at`

**Indexes:**
- `idx_vigil_unavailabilities_vigil_id` - Query by vigil
- `idx_vigil_unavailabilities_time_range` - Time range queries
- `idx_vigil_unavailabilities_overlap` (GiST) - Efficient overlap detection

---

## 🔐 Row Level Security (RLS)

### Policies Applied

**vigil_availability_rules:**
- ✅ Vigils: Full CRUD on own rules
- ✅ All authenticated users: Read access (for slot calculation)

**vigil_unavailabilities:**
- ✅ Vigils: Full CRUD on own unavailabilities
- ✅ All authenticated users: Read access (for slot calculation)

**Security Guarantees:**
- Vigils can only modify their own data
- Consumers can view rules for availability checking but cannot modify
- No cross-vigil data access
- Enforced at database level via Supabase RLS

---

## 🧠 Availability Engine Algorithm

### Core Logic Flow

```
1. EXPAND RULES
   - Iterate through each day in date range
   - Find applicable weekly rules (weekday match + valid dates)
   - Generate hourly slots for each rule

2. BUILD CONFLICT MAP
   - Collect confirmed/pending bookings
   - Collect all unavailabilities
   - Create time range objects

3. FILTER CONFLICTS
   - For each potential slot, check overlap with conflicts
   - Remove any slot that conflicts

4. AGGREGATE CONSECUTIVE SLOTS
   - For multi-hour services (e.g., 3-hour service)
   - Find sequences of N consecutive available slots
   - Return only slots with full service duration available
```

### Algorithm Complexity
- **Time Complexity**: O(D × R + B + U)
  - D = days in range
  - R = availability rules
  - B = bookings
  - U = unavailabilities
- **Space Complexity**: O(D × H)
  - H = hours per day (typically 24)

### Example

**Input:**
- Availability Rule: Monday 9-17 (8 hours)
- Booking: Monday 10-12 (2 hours)
- Unavailability: Monday 14-15 (1 hour)
- Service Duration: 2 hours

**Output Slots:**
- Monday 9-11 ✅ (2 hours available)
- Monday 15-17 ✅ (2 hours available)
- Monday 10-12 ❌ (conflicts with booking)
- Monday 12-14 ✅ (2 hours available)
- Monday 14-16 ❌ (conflicts with unavailability)

---

## 🌐 API Endpoints

### Consumer APIs

#### `GET /api/calendar/consumer`
Returns consumer's booking calendar.

**Auth**: Consumer role required

**Response**: List of booking events with details

---

### Vigil APIs

#### `GET /api/calendar/vigil/bookings`
Returns vigil's complete calendar (bookings + unavailabilities + rules).

**Auth**: Vigil role required

**Response**: 
- Bookings array
- Unavailabilities array
- Availability rules array

#### `GET /api/vigil/availability-rules`
List vigil's availability rules.

**Auth**: Vigil role required

#### `POST /api/vigil/availability-rules`
Create new availability rule.

**Auth**: Vigil role required

**Body**:
```json
{
  "weekday": 1,
  "start_time": 9,
  "end_time": 17,
  "valid_from": "2024-01-01",
  "valid_to": "2024-12-31"
}
```

**Validations**:
- weekday: 0-6
- start_time: 0-23
- end_time: 1-24
- end_time > start_time

#### `DELETE /api/vigil/availability-rules/:ruleId`
Delete availability rule.

**Auth**: Vigil role required (must own rule)

#### `GET /api/vigil/unavailabilities`
List vigil's unavailabilities.

**Auth**: Vigil role required

#### `POST /api/vigil/unavailabilities`
Create new unavailability block.

**Auth**: Vigil role required

**Body**:
```json
{
  "start_at": "2024-01-15T09:00:00Z",
  "end_at": "2024-01-20T17:00:00Z",
  "reason": "Vacation"
}
```

**Validations**:
- Valid ISO datetime formats
- end_at > start_at

---

### Availability Engine API

#### `GET /api/vigil/:vigilId/available-slots`
Calculate available time slots for booking.

**Auth**: Any authenticated user

**Query Params**:
- `start_date`: YYYY-MM-DD
- `end_date`: YYYY-MM-DD
- `service_id`: UUID

**Constraints**:
- Date range max: 90 days
- end_date >= start_date

**Response**:
```json
{
  "vigil_id": "uuid",
  "service_id": "uuid",
  "service_duration_hours": 2,
  "slots": [
    {
      "date": "2024-01-15",
      "start_time": 9,
      "end_time": 11,
      "available": true,
      "duration_hours": 2
    }
  ]
}
```

---

## ⚙️ Technical Specifications

### Time Handling
- **Storage**: All times in UTC in database
- **Granularity**: 1-hour minimum slots
- **Format**: ISO 8601 (e.g., "2024-01-15T09:00:00Z")
- **Slot Intervals**: `[start, end)` (start inclusive, end exclusive)

### Service Duration
- Calculated from service `unit_type` and `min_unit`
- `HOURS`: min_unit = hours
- `DAYS`: min_unit × 24 = hours
- Minimum: 1 hour (rounded up)

### Priority Rules
1. **Unavailabilities** override availability rules
2. **Confirmed bookings** always block slots
3. **Pending bookings** also block slots (to prevent race conditions)

---

## 📊 Performance Optimizations

### Database Indexes
- B-tree indexes for equality and range queries
- GiST index for efficient overlap detection
- Composite indexes for multi-column queries

### Recommended Caching
1. **Availability Rules**: Cache per vigil (rarely change) - TTL: 1 hour
2. **Available Slots**: Short cache - TTL: 5-15 minutes
3. **Bookings**: Real-time or very short cache - TTL: 1-2 minutes

### Query Limits
- Date range limited to 90 days (prevent excessive computation)
- Pagination support built-in for list endpoints

---

## 🧪 Testing Recommendations

### Unit Tests
- ✅ `AvailabilityEngine.expandAvailabilityRules()`
- ✅ `AvailabilityEngine.buildConflictMap()`
- ✅ `AvailabilityEngine.filterConflictingSlots()`
- ✅ `AvailabilityEngine.aggregateConsecutiveSlots()`
- ✅ Time range overlap detection

### Integration Tests
- ✅ API authentication and authorization
- ✅ RLS policy enforcement
- ✅ CRUD operations for rules and unavailabilities
- ✅ Availability Engine with various scenarios

### E2E Test Scenarios
1. **Happy Path**:
   - Vigil creates availability rule
   - Consumer views available slots
   - Consumer books a slot
   - Slot becomes unavailable

2. **Unavailability Override**:
   - Vigil has availability rule for Monday 9-17
   - Vigil creates unavailability for Monday 10-12
   - Available slots exclude 10-12 range

3. **Multi-Hour Service**:
   - Service requires 3 consecutive hours
   - Vigil has availability 9-17 with booking 12-13
   - Only slots 9-12 and 13-16 are returned (not 11-14)

4. **Boundary Cases**:
   - Service at end of day
   - Unavailability spanning multiple days
   - Overlapping bookings (should be prevented)

---

## 🚀 Deployment Checklist

### Database Migration
- [ ] Run `calendar-migration.sql` on production Supabase instance
- [ ] Verify tables created with correct structure
- [ ] Verify RLS policies are enabled and working
- [ ] Verify indexes are created

### Environment Variables
- [ ] Ensure `SUPABASE_API_SECRET_KEY` is set (already required)
- [ ] No new environment variables needed

### Application Deployment
- [ ] Deploy updated codebase to production
- [ ] Monitor API response times (<500ms target)
- [ ] Monitor error rates
- [ ] Set up alerts for RLS policy violations

### Post-Deployment Verification
- [ ] Test consumer calendar endpoint
- [ ] Test vigil calendar endpoint
- [ ] Test availability rules CRUD
- [ ] Test unavailabilities CRUD
- [ ] Test available slots calculation
- [ ] Verify no cross-user data leakage

---

## 🔮 Future Enhancements

### Planned Features
1. **Buffer Times**: Automatic gaps between bookings
2. **Calendar Sync**: Google Calendar, Outlook integration
3. **Dynamic Pricing**: Time-based pricing
4. **Recurring Bookings**: Support for repeating patterns
5. **Slot Reservations**: Temporary holds before payment
6. **Smart Notifications**: Booking reminders, schedule changes
7. **Analytics Dashboard**: Utilization rates, popular slots

### Scalability Considerations
- Implement Redis caching for high-traffic endpoints
- Consider read replicas for heavy query loads
- Implement rate limiting for availability engine API
- Monitor and optimize slow queries

---

## 📚 References

### Documentation
- Calendar Feature: `.github/features/calendar.feature.md`
- Database Schema: `.github/database/schema.database.md`
- Migration SQL: `.github/database/calendar-migration.sql`

### Code Files
- Types: `src/types/calendar.types.ts`
- Service: `src/services/calendar.service.ts`
- API Routes: `app/api/calendar/*`, `app/api/vigil/*`

### External Resources
- [Next.js App Router](https://nextjs.org/docs/app)
- [Supabase RLS](https://supabase.com/docs/guides/auth/row-level-security)
- [PostgreSQL GiST Indexes](https://www.postgresql.org/docs/current/gist-intro.html)

---

## ✅ Implementation Status

**Status**: ✅ **COMPLETE**

All core functionality has been implemented:
- ✅ Database schema with RLS policies
- ✅ TypeScript types and interfaces
- ✅ Availability Engine algorithm
- ✅ All API endpoints (Consumer + Vigil + Engine)
- ✅ Comprehensive documentation
- ✅ TypeScript compilation passing (no errors in calendar code)

**Ready for**:
- Testing phase (manual and automated)
- Database migration execution
- Production deployment

---

## 🤝 Support

For questions or issues with the calendar system:
1. Review the feature documentation (`.github/features/calendar.feature.md`)
2. Check the database schema (`.github/database/schema.database.md`)
3. Examine the migration SQL (`.github/database/calendar-migration.sql`)
4. Review API endpoint implementations in `app/api/`

---

**Last Updated**: 2026-01-17
**Version**: 1.0.0
**Author**: AI Agent (Copilot)
