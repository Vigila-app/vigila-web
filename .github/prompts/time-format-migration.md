# Migration: SMALLINT to TIME Format for Availability Rules

## Summary
Changed database schema for `vigil_availability_rules` table from storing hours as `SMALLINT` (0-23) to `TIME` format (HH:MM:SS).

---

## Changes Made ✅

### 1. Type Definitions (`src/types/calendar.types.ts`)
- Updated `VigilAvailabilityRuleI.start_time`: `number` → `string` (TIME format)
- Updated `VigilAvailabilityRuleI.end_time`: `number` → `string` (TIME format)
- Updated `VigilAvailabilityRuleFormI.start_time`: `number` → `string` (TIME format)
- Updated `VigilAvailabilityRuleFormI.end_time`: `number` → `string` (TIME format)
- Updated comments to indicate `HH:MM:SS` format (e.g., "09:00:00", "17:00:00")

### 2. Demo Component (`components/calendar-demo/AvailabilityRulesDemo.tsx`)
- Added `convertHourToTimeFormat()` helper function to convert hours (0-23) to TIME strings
- Updated `handleCreate()` to convert form hours to TIME format when creating API payload
  - Before: `start_time: formData.start_time!` (9)
  - After: `start_time: convertHourToTimeFormat(formData.start_time!)` ("09:00:00")
- Cleaned up form state typing for better clarity
- Form UI still accepts hours (0-23) for better UX; conversion happens at API boundary

### 3. Utility Functions (`src/utils/calendar.utils.ts`)
- Updated `formatTimeRange()` to handle both formats:
  - **Numbers** (0-23): Converts to "HH:MM" format
  - **TIME strings** (HH:MM:SS): Extracts "HH:MM"
- Example: Both `formatTimeRange(9, 17)` and `formatTimeRange("09:00:00", "17:00:00")` output "09:00 - 17:00"

---

## Changes Still Needed ⚠️

### 1. Calendar Service (`src/services/calendar.service.ts`)
**Issue**: The service expects `start_time` and `end_time` as numbers for arithmetic operations.

**Lines to update**:
- Line 121: Loop uses `for (let time = rule.start_time; time < rule.end_time; time++)`
  - Need to parse TIME strings to numbers first
  - Solution: Extract hours from TIME string using `timeString.split(':')[0]`

**Example fix**:
```typescript
// Get hours from TIME format
const startHour = parseInt(rule.start_time.split(':')[0]);
const endHour = parseInt(rule.end_time.split(':')[0]);

for (let time = startHour; time < endHour; time++) {
  // ... rest of logic
}
```

### 2. API Route (`app/api/vigil/availability-rules/route.ts`)
**Issue**: Validation expects numbers (0-23 and 1-24 checks).

**Lines to update**:
- Lines 124-132: Numeric validation checks
  - Need to validate TIME format instead
  - Solution: Parse TIME string and validate hour values

**Example fix**:
```typescript
// Validate TIME format
const timeRegex = /^(\d{2}):(\d{2}):(\d{2})$/;
if (!timeRegex.test(body.start_time)) {
  // Invalid format error
}

const startHour = parseInt(body.start_time.split(':')[0]);
if (startHour < 0 || startHour > 23) {
  // Invalid hour error
}
```

### 3. Database Migration SQL
Update comment in `.github/database/calendar-migration.sql` if you have any hardcoded validation checks.

---

## Testing Checklist

- [ ] Form accepts hours 0-23 and stores as TIME in database
- [ ] Submitted form converts "9" to "09:00:00" in database
- [ ] Calendar service correctly parses TIME strings to generate slots
- [ ] Available slots endpoint works with TIME format
- [ ] Demo component displays times correctly as "HH:MM - HH:MM"
- [ ] Unavailabilities component works with TIME format
- [ ] API validation rejects invalid TIME formats
- [ ] No timezone issues (verify UTC handling)

---

## Architecture Decisions

**Why keep form state as numbers**:
- Better UX for hour selection (dropdown 0-23 is clearer than "00:00:00", "01:00:00", etc.)
- Easier validation at form level
- Cleaner form state typing

**Why convert only at API boundary**:
- Separation of concerns (UI ↔ API)
- Makes migration easier (UI code unchanged except conversion)
- Easier to test conversion logic in isolation

---

## Notes

- All TIME values stored in UTC
- TIME format is "HH:MM:SS" (24-hour format)
- Valid hours: 0-23 for start, 1-24 for end (representing hour boundaries)
- TimeSlot objects still use numeric hours (0-23) for internal calculations

---

## Related Files
- `.github/database/calendar-migration.sql` - Database schema
- `.github/features/calendar.feature.md` - Feature documentation
- `src/services/calendar.service.ts` - Needs updating
- `app/api/vigil/availability-rules/route.ts` - Needs updating
