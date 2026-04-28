# Matching - Feature Documentation

## Overview

The Matching feature helps consumers find compatible Vigils based on requested schedule, service types, address, and preferences. The API is consumer-only and returns public-safe match data, compatibility details, and an estimate for the trial price.

---

## Request Model

### `POST /api/v1/matching`

**Authentication**: Required (CONSUMER role)

**Request Body**:

```json
{
  "selectedDays": [1, 3, 5],
  "schedule": {
    "1": { "start": "09:00", "end": "13:00", "service": "light_assistance" },
    "3": { "start": "09:00", "end": "13:00", "service": "light_assistance" },
    "5": { "start": "09:00", "end": "13:00", "service": "light_assistance" }
  },
  "dates": {
    "startDate": "2026-04-29",
    "endDate": "2026-05-20"
  },
  "address": {
    "postcode": "20100"
  }
}
```

**Validation rules**:

- `selectedDays` must be a non-empty array of weekday numbers (0=Sunday ... 6=Saturday).
- Every selected day must have a `schedule` entry with valid `start`, `end`, and `service`.
- `start` must be earlier than `end`.
- `endDate` must be on or after `startDate`.
- Maximum date range is 90 days.
- `address.postcode` is required.

---

## Response Model

**Response `200`**:

```json
{
  "code": "MATCHING_SUCCESS",
  "success": true,
  "perfectMatch": false,
  "unmatchedSlots": [
    {
      "date": "2026-05-06",
      "startTime": "09:00",
      "endTime": "13:00",
      "service": "light_assistance"
    }
  ],
  "data": [
    {
      "id": "uuid",
      "displayName": "Maria B.",
      "gender": "female",
      "status": "active",
      "cap": ["20100"],
      "compatibleSlots": 6,
      "totalSlots": 7,
      "partialMatch": true,
      "totalPrice": 480,
      "averageRating": 4.8,
      "reviewCount": 12,
      "activeFrom": "2025-02-01T10:00:00Z",
      "compatibleSlotDetails": [
        {
          "date": "2026-05-01",
          "startTime": "09:00",
          "endTime": "13:00",
          "service": "light_assistance"
        }
      ]
    }
  ]
}
```

**Notes**:

- `perfectMatch=true` means the first (and only) vigil covers every requested slot.
- `unmatchedSlots` lists slot occurrences not covered by any vigil in the response.

---

## Matching Algorithm (Server)

**Phase 1 - Candidate filtering**

- Reads the consumer gender preference from `consumers_data["gender-preference"]`.
- Fetches up to 20 active vigils in the requested CAP.
- If fewer than 10 are found with gender preference, it fills the list with additional vigils without gender filtering.
- Filters candidates to those offering **all** required service types (active services only).

**Phase 2 - Availability matching**

- Expands each weekday into concrete dates within the requested range (UTC-based).
- A slot is compatible when a vigil rule covers the slot and no unavailability overlaps it.
- Counts compatible slots and records `compatibleSlotDetails`.
- Early exit on perfect match (compatibleSlots == totalSlots).

**Phase 3 - Quality ranking**

- If more than 5 candidates remain, results are sorted by:
  `compatibleSlots DESC` → `reviewCount DESC` → `averageRating DESC`.
- Returns the top 5.
- If 5 or fewer candidates remain, returns the list sorted by compatibility only.

---

## Price Estimation

The `totalPrice` is an estimate used for the matching trial UI. It is computed from the service catalog `min_hourly_rate` and the slot duration (minimum 8 hours) for each compatible slot occurrence.

---

## UI Flow (Consumer)

1. **Availability flow** stores answers in `sessionStorage` as `matching_answers`.
2. **/matching/loading** reads those answers, builds a `MatchingRequestI` via `buildMatchingRequestFromAnswers`, calls `POST /api/v1/matching`, and stores `matching_response`.
3. **/matching/success** shows the best vigil and lets the consumer confirm the trial:
   - Creates one booking per compatible slot.
   - Creates a **batch** Stripe payment intent with `bookingIds` and the total amount.
4. **/matching/no-match** shows the preference summary and prompts a new search.
5. **/matching/trial-confirmed** shows confirmation and reminds the user about uncovered slots.

---

## Key Files

| File                                               | Role                                      |
| -------------------------------------------------- | ----------------------------------------- |
| `app/api/v1/matching/route.ts`                     | Matching algorithm and response shaping   |
| `src/services/matching.service.ts`                 | Client API wrapper + request builder      |
| `src/types/matching.types.ts`                      | Matching request/response types           |
| `app/(consumer)/matching/loading/page.tsx`         | Calls matching API and routes to result   |
| `app/(consumer)/matching/success/page.tsx`         | Trial confirmation + batch payment intent |
| `app/(consumer)/matching/no-match/page.tsx`        | No-match UI with preference summary       |
| `app/(consumer)/matching/trial-confirmed/page.tsx` | Trial confirmation UI                     |
| `components/matching/MatchedVigil.tsx`             | Match card UI with slot coverage          |
