# Calendar & Availability System - Feature Documentation

## Overview

The Calendar & Availability System is a comprehensive feature that enables **Vigils** to manage their schedules and allows **Consumers** to see available time slots for booking services. The system ensures that bookings can only be made during available time slots, preventing double-booking and scheduling conflicts.

---

## Key Concepts

### 1. Availability Rules (Weekly Recurring)
- Vigils define their regular working hours on a weekly basis
- Example: "Every Monday from 9:00 to 17:00"
- Weekday values: 0=Sunday, 1=Monday, ..., 6=Saturday
- Hour range: start_time (0-23), end_time (1-24)
- Rules can have validity periods (valid_from, valid_to)

### 2. Unavailabilities (Specific Blocks)
- Vigils can block specific date/time ranges
- Used for: vacations, sick leave, personal appointments
- **Always override availability rules**
- Have precedence over weekly patterns

### 3. Bookings
- Confirmed or pending bookings automatically block time slots
- Prevent double-booking
- Integrated with existing booking system

### 4. Time Slot Granularity
- Minimum slot size: **1 hour**
- All slots are `[start, end)` intervals (start inclusive, end exclusive)
- Services can require multiple consecutive hours

---

## Architecture

### Database Layer
Two new tables manage calendar data:

1. **vigil_availability_rules**: Weekly recurring patterns
2. **vigil_unavailabilities**: Specific time blocks

Both tables have:
- Row Level Security (RLS) policies
- Indexes for performance
- Automatic updated_at triggers
- Foreign key constraints to vigils table

### Business Logic Layer
**Availability Engine** (`src/services/calendar.service.ts`):
- Algorithm to expand rules into concrete slots
- Filters conflicts (bookings + unavailabilities)
- Aggregates consecutive slots for multi-hour services
- Returns only bookable slots

Time Complexity: O(D * R + B + U) where:
- D = days in range
- R = availability rules
- B = bookings
- U = unavailabilities

### API Layer
RESTful endpoints for CRUD operations and slot calculation.

---

## API Endpoints

### Consumer APIs

#### GET /api/calendar/consumer
Returns consumer's calendar with all their bookings.

**Authentication**: Required (Consumer role)

**Response**:
```json
{
  "code": "CONSUMER_CALENDAR_SUCCESS",
  "data": {
    "bookings": [
      {
        "id": "uuid",
        "type": "booking",
        "title": "Service Name - Vigil Name",
        "start": "2024-01-15T09:00:00Z",
        "end": "2024-01-15T12:00:00Z",
        "status": "confirmed",
        "metadata": { ... }
      }
    ]
  },
  "success": true
}
```

---

### Vigil APIs - Calendar

#### GET /api/calendar/vigil/bookings
Returns vigil's calendar with bookings, unavailabilities, and availability rules.

**Authentication**: Required (Vigil role)

**Response**:
```json
{
  "code": "VIGIL_CALENDAR_SUCCESS",
  "data": {
    "bookings": [...],
    "unavailabilities": [...],
    "availability_rules": [...]
  },
  "success": true
}
```

---

### Vigil APIs - Availability Rules

#### GET /api/vigil/availability-rules
List all availability rules for the authenticated vigil.

**Authentication**: Required (Vigil role)

**Response**: Array of availability rules

#### POST /api/vigil/availability-rules
Create a new availability rule.

**Authentication**: Required (Vigil role)

**Request Body**:
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
- valid_to >= valid_from (if provided)

#### DELETE /api/vigil/availability-rules/:ruleId
Delete an availability rule.

**Authentication**: Required (Vigil role, must own the rule)

---

### Vigil APIs - Unavailabilities

#### GET /api/vigil/unavailabilities
List all unavailabilities for the authenticated vigil.

**Authentication**: Required (Vigil role)

**Response**: Array of unavailabilities

#### POST /api/vigil/unavailabilities
Create a new unavailability block.

**Authentication**: Required (Vigil role)

**Request Body**:
```json
{
  "start_at": "2024-01-15T09:00:00Z",
  "end_at": "2024-01-20T17:00:00Z",
  "reason": "Vacation"
}
```

**Validations**:
- start_at and end_at must be valid ISO datetime
- end_at > start_at

---

### Availability Engine API

#### GET /api/vigil/:vigilId/available-slots
Get available time slots for a vigil and service.

**Authentication**: Required (any authenticated user)

**Query Parameters**:
- `start_date`: ISO date (YYYY-MM-DD)
- `end_date`: ISO date (YYYY-MM-DD)
- `service_id`: UUID

**Constraints**:
- Date range max: 90 days
- end_date >= start_date

**Response**:
```json
{
  "code": "AVAILABLE_SLOTS_SUCCESS",
  "data": {
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
  },
  "success": true
}
```

---

## Availability Engine Algorithm

### Step 1: Expand Availability Rules
- Iterate through each day in the date range
- For each day, find applicable weekly rules (matching weekday + valid date range)
- Generate hourly slots for each rule

### Step 2: Build Conflict Map
- Collect all bookings with status "confirmed" or "pending"
- Collect all unavailabilities (no filtering - they always block)
- Create time range objects for each conflict

### Step 3: Filter Conflicting Slots
- For each potential slot, check if it overlaps with any conflict
- Remove slots that have any overlap

### Step 4: Aggregate Consecutive Slots
- For services requiring multiple times (e.g., 3-time service)
- Find sequences of N consecutive available slots
- Only include slots where the full duration is available

### Result
- List of bookable time slots
- Guaranteed to have no conflicts
- Guaranteed to have sufficient duration for the service

---

## Security (Row Level Security)

### Policies for `vigil_availability_rules`

**Vigils**:
- ✅ Can view their own rules
- ✅ Can create their own rules
- ✅ Can update their own rules
- ✅ Can delete their own rules

**Consumers**:
- ✅ Can view all rules (read-only, for slot calculation)
- ❌ Cannot modify any rules

### Policies for `vigil_unavailabilities`

**Vigils**:
- ✅ Can view their own unavailabilities
- ✅ Can create their own unavailabilities
- ✅ Can update their own unavailabilities
- ✅ Can delete their own unavailabilities

**Consumers**:
- ✅ Can view all unavailabilities (read-only, for slot calculation)
- ❌ Cannot modify any unavailabilities

---

## Performance Considerations

### Database Indexes
```sql
-- Efficient queries by vigil
CREATE INDEX idx_vigil_availability_rules_vigil_id 
  ON vigil_availability_rules(vigil_id);

-- Date range queries
CREATE INDEX idx_vigil_availability_rules_dates 
  ON vigil_availability_rules(vigil_id, valid_from, valid_to);

-- Weekday lookups
CREATE INDEX idx_vigil_availability_rules_weekday 
  ON vigil_availability_rules(vigil_id, weekday);

-- Time range queries with GiST for overlap detection
CREATE INDEX idx_vigil_unavailabilities_overlap 
  ON vigil_unavailabilities USING GIST (
    vigil_id,
    tstzrange(start_at, end_at)
  );
```

### Caching Recommendations
1. **Availability Rules**: Cache per vigil (rarely change)
2. **Available Slots**: Cache for 5-15 minutes (changes with new bookings)
3. **Bookings**: Real-time or short cache (1-2 minutes)

### Query Optimization
- Date range limited to 90 days max
- Use composite indexes for multi-column filters
- GiST index for efficient overlap detection

---

## Timezone Handling

**All times stored in UTC** in the database.

### Best Practices:
1. Frontend converts user's local time to UTC before sending to API
2. API stores/retrieves all times in UTC
3. Frontend converts UTC times back to user's local time for display

### Example:
```javascript
// Frontend: User selects "9:00 AM" in their local timezone (e.g., CET)
const localTime = new Date("2024-01-15T09:00:00+01:00");
const utcTime = localTime.toISOString(); // "2024-01-15T08:00:00Z"

// Send utcTime to API
// API stores in UTC: "2024-01-15T08:00:00Z"

// When displaying, convert back to user's timezone
const displayTime = new Date(utcTime).toLocaleString('it-IT', {
  timeZone: 'Europe/Rome'
}); // "15/01/2024, 09:00:00"
```

---

## Integration with Booking System

### Booking Validation
When creating a booking, the system should:

1. **Check Available Slots**
   ```javascript
   const slots = await CalendarService.getAvailableSlots({
     vigil_id,
     start_date,
     end_date,
     service_id
   });
   ```

2. **Verify Requested Time**
   - Check if requested start time matches an available slot
   - Ensure service duration fits within the slot

3. **Create Booking**
   - Only create if slot is available
   - Booking automatically blocks the slot for future requests

### Preventing Double-Booking
- Race conditions handled by database constraints
- RLS policies ensure data isolation
- Availability Engine always checks latest bookings

---

## Future Enhancements

### Potential Features:
1. **Buffer Times**: Add gaps between bookings (e.g., 15-min buffer)
2. **Calendar Sync**: Integration with Google Calendar, Outlook
3. **Dynamic Pricing**: Price variations based on time slots
4. **Recurring Bookings**: Support for repeating service patterns
5. **Slot Reservations**: Temporary holds before payment
6. **Notifications**: Alerts for new bookings, schedule changes
7. **Analytics**: Utilization rates, popular time slots

---

## Testing Scenarios

### Unit Tests
- ✅ Availability Engine algorithm
- ✅ Time range overlap detection
- ✅ Consecutive slot aggregation

### Integration Tests
- ✅ API endpoint authentication
- ✅ RLS policy enforcement
- ✅ CRUD operations

### E2E Tests
- ✅ Vigil creates availability rule → appears in available slots
- ✅ Vigil creates unavailability → slot disappears
- ✅ Consumer books slot → slot becomes unavailable
- ✅ Multi-hour service only shows slots with full duration available

---

## Definition of Done

The Calendar & Availability System is complete when:

- [x] Database schema created with proper constraints
- [x] RLS policies prevent unauthorized access
- [x] API endpoints implement full CRUD functionality
- [x] Availability Engine correctly calculates bookable slots
- [x] Consumers can view their booking calendar
- [x] Vigils can manage availability rules and unavailabilities
- [x] No booking can be created outside available slots
- [x] System is documented and ready for production
- [x] All security measures are in place

---

## Support & Maintenance

### Common Issues:
1. **Slot not showing**: Check availability rules, unavailabilities, existing bookings
2. **Timezone confusion**: Ensure all times are in UTC in database
3. **Performance**: Monitor query times, consider caching

### Monitoring:
- Track API response times (should be < 500ms)
- Monitor database query performance
- Alert on RLS policy violations

---

## References

- Database Schema: `.github/database/schema.database.md`
- Migration SQL: `.github/database/calendar-migration.sql`
- Type Definitions: `src/types/calendar.types.ts`
- Service Layer: `src/services/calendar.service.ts`
- API Routes: `app/api/calendar/*`, `app/api/vigil/*`
